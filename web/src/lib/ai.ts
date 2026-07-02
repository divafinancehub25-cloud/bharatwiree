/**
 * AI engine — rewrites raw news into an ORIGINAL article.
 * It auto-picks the best engine you have configured:
 *
 *  1. Gemini  (FREE cloud tier)  — set GEMINI_API_KEY      ← recommended now
 *  2. Claude  (paid, top quality)— set ANTHROPIC_API_KEY   ← future/production
 *  3. Ollama  (free, local)      — no key, needs laptop RAM ← fallback/offline
 */

const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://localhost:11434";
// Small model = fits in low RAM (8GB laptop). Change via OLLAMA_MODEL env.
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.2:1b";

// FREE cloud tier — no laptop RAM needed, good Hindi.
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

// FUTURE: cheap, high-quality model for production rewriting.
const CLAUDE_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001";

export type RewriteInput = {
  title: string;
  content: string;
  languageName: string; // e.g. "English", "हिन्दी (Hindi)"
};

export type RewriteOutput = {
  title: string;
  excerpt: string;
  body: string;
  model: string; // which model produced it (stored on the article)
};

/** Which engine is active (shown in the UI). */
export function aiProvider() {
  if (process.env.GEMINI_API_KEY) return { name: "Gemini (free)", model: GEMINI_MODEL };
  if (process.env.ANTHROPIC_API_KEY) return { name: "Claude", model: CLAUDE_MODEL };
  return { name: "Local (Ollama)", model: OLLAMA_MODEL };
}

/** Main entry — auto-picks the best configured engine. */
export async function rewriteArticle(input: RewriteInput): Promise<RewriteOutput> {
  if (process.env.GEMINI_API_KEY) return rewriteWithGemini(input);
  if (process.env.ANTHROPIC_API_KEY) return rewriteWithClaude(input);
  return rewriteWithOllama(input);
}

function buildPrompt(input: RewriteInput): string {
  return [
    `You are a news editor. Rewrite the news below in your OWN words as an original,`,
    `neutral article written in ${input.languageName}. Do not copy sentences.`,
    `Return ONLY valid JSON with exactly these keys: "title", "excerpt", "body".`,
    `- "title": a fresh headline`,
    `- "excerpt": one-sentence summary`,
    `- "body": 2-3 short paragraphs`,
    ``,
    `SOURCE TITLE: ${input.title}`,
    `SOURCE TEXT: ${input.content?.slice(0, 4000) ?? ""}`,
  ].join("\n");
}

// ---------------------------------------------------------------------------
//  NOW: free local AI (Ollama)
// ---------------------------------------------------------------------------
async function rewriteWithOllama(input: RewriteInput): Promise<RewriteOutput> {
  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: buildPrompt(input),
      stream: false,
      format: "json",
      keep_alive: "10m",
      options: { temperature: 0.7, num_ctx: 2048 }, // small ctx = less RAM
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama error ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as { response?: string };
  return shape(safeParse(data.response ?? ""), input, `ollama:${OLLAMA_MODEL}`);
}

// ---------------------------------------------------------------------------
//  RECOMMENDED NOW: Gemini free tier (cloud — no laptop RAM needed)
//  Activates automatically when GEMINI_API_KEY is set.
// ---------------------------------------------------------------------------
async function rewriteWithGemini(input: RewriteInput): Promise<RewriteOutput> {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent` +
    `?key=${process.env.GEMINI_API_KEY}`;

  // Free tier allows ~10 requests/min — on 429 (rate limit) or 503 (overloaded),
  // wait and retry a couple of times instead of failing the article.
  let lastErr = "";
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(input) }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
      }),
    });

    if (res.ok) {
      const data = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      return shape(safeParse(text), input, `gemini:${GEMINI_MODEL}`);
    }

    lastErr = `Gemini error ${res.status}: ${(await res.text()).slice(0, 200)}`;
    if ((res.status === 429 || res.status === 503) && attempt < 3) {
      await new Promise((r) => setTimeout(r, 15000 * attempt)); // 15s, then 30s
      continue;
    }
    break;
  }
  throw new Error(lastErr);
}

// ---------------------------------------------------------------------------
//  FUTURE: Claude API (activates automatically when ANTHROPIC_API_KEY is set)
// ---------------------------------------------------------------------------
async function rewriteWithClaude(input: RewriteInput): Promise<RewriteOutput> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1200,
      messages: [
        {
          role: "user",
          content: `${buildPrompt(input)}\n\nReturn ONLY the JSON object.`,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Claude error ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as { content?: { text?: string }[] };
  const text = data.content?.[0]?.text ?? "";
  return shape(safeParse(text), input, `claude:${CLAUDE_MODEL}`);
}

// ---------------------------------------------------------------------------
//  Helpers
// ---------------------------------------------------------------------------
function shape(
  parsed: Record<string, unknown>,
  input: RewriteInput,
  model: string,
): RewriteOutput {
  const title = (parsed.title || input.title).toString().trim();
  const body = (parsed.body || input.content || "").toString().trim();
  const excerpt = (parsed.excerpt || body.slice(0, 160)).toString().trim();
  return { title, excerpt, body, model };
}

function safeParse(s: string): Record<string, unknown> {
  try {
    return JSON.parse(s);
  } catch {
    const m = s.match(/\{[\s\S]*\}/); // grab first {...} block if wrapped in text
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch {
        /* ignore */
      }
    }
    return {};
  }
}
