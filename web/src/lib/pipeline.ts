/**
 * The automated content pipeline:
 *   For each active RSS source → fetch items → AI rewrites into an original
 *   article → save as IN_REVIEW (so a human approves before it goes live).
 *
 * Free-mode note: while we use the local AI, output is marked DISPLAY_ONLY
 * (not for sale) until quality is upgraded to Claude.
 */
import Parser from "rss-parser";
import { prisma } from "@/lib/prisma";
import { rewriteArticle } from "@/lib/ai";

const parser = new Parser();
const MAX_PER_SOURCE = 2; // keep each run quick on a local model (raise later)

export type PipelineResult = {
  totalCreated: number;
  sources: { name: string; created: number; skipped: number; error?: string }[];
};

export async function runPipeline(): Promise<PipelineResult> {
  const sources = await prisma.rssSource.findMany({ where: { isActive: true } });

  // Fallbacks if a source has no default category/language set.
  const [firstCategory, firstLanguage] = await Promise.all([
    prisma.category.findFirst({ orderBy: { name: "asc" } }),
    prisma.language.findFirst({ where: { isActive: true } }),
  ]);

  const result: PipelineResult = { totalCreated: 0, sources: [] };

  for (const source of sources) {
    let created = 0;
    let skipped = 0;
    try {
      const feed = await parser.parseURL(source.feedUrl);
      const items = (feed.items ?? []).slice(0, MAX_PER_SOURCE);

      const categoryId = source.defaultCategoryId ?? firstCategory?.id;
      const languageId = source.defaultLanguageId ?? firstLanguage?.id;
      if (!categoryId || !languageId) {
        throw new Error("No category/language available — seed them first.");
      }

      const language = await prisma.language.findUnique({ where: { id: languageId } });

      for (const item of items) {
        const sourceUrl = item.link ?? "";
        // Skip if we already imported this story.
        if (sourceUrl) {
          const exists = await prisma.article.findFirst({ where: { sourceUrl } });
          if (exists) {
            skipped++;
            continue;
          }
        }

        const raw = item.contentSnippet || item.content || item.title || "";
        // small gap between AI calls — keeps us under Gemini free-tier 10 req/min
        await new Promise((r) => setTimeout(r, 4000));
        const ai = await rewriteArticle({
          title: item.title ?? "Untitled",
          content: raw,
          languageName: language?.name ?? "English",
        });

        await prisma.article.create({
          data: {
            title: ai.title,
            slug: slugify(ai.title),
            excerpt: ai.excerpt,
            body: ai.body,
            coverImage: placeholderImage(ai.title),
            imageIsAi: false, // placeholder for now
            sourceUrl,
            status: "IN_REVIEW",
            rights: "DISPLAY_ONLY", // local AI → not for sale yet
            contentSource: "RSS_AI",
            aiRewritten: true,
            aiModel: ai.model,
            categoryId,
            languageId,
            rssSourceId: source.id,
          },
        });
        created++;
      }

      await prisma.rssSource.update({
        where: { id: source.id },
        data: { lastFetchedAt: new Date() },
      });
    } catch (e) {
      result.sources.push({
        name: source.name,
        created,
        skipped,
        error: e instanceof Error ? e.message : String(e),
      });
      continue;
    }

    result.sources.push({ name: source.name, created, skipped });
    result.totalCreated += created;
  }

  return result;
}

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9ऀ-ॿ]+/g, "-") // keep Devanagari for Hindi
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base || "news"}-${suffix}`;
}

function placeholderImage(title: string): string {
  const text = encodeURIComponent(title.slice(0, 40));
  return `https://placehold.co/800x450/ea580c/ffffff?text=${text}`;
}
