import { createHash, createHmac } from "crypto";

/**
 * Provenance — BharatWire's "verified news" stamp (C2PA-style, simplified).
 *
 * On publish, we create:
 *  - contentHash: a SHA-256 fingerprint of the article content. If even one
 *    letter changes later, the hash won't match → proves tampering.
 *  - manifest: a signed record of who/what/when (stored on the article,
 *    served to buyers as proof of authenticity & rights).
 *
 * The signature uses PROVENANCE_SECRET (HMAC). Later this can be upgraded to
 * full C2PA certificates without changing the data model.
 */

const SECRET = () => process.env.PROVENANCE_SECRET || "bharatwire-dev-secret";

export type ProvenanceManifest = {
  version: 1;
  publisher: string;
  articleTitle: string;
  contentHash: string;
  rights: string;
  contentSource: string;
  aiModel: string | null;
  signedAt: string; // ISO timestamp
  signature: string; // HMAC over the fields above
};

export function hashContent(title: string, body: string | null): string {
  return createHash("sha256")
    .update(title + "\n" + (body ?? ""))
    .digest("hex");
}

export function signArticle(input: {
  title: string;
  body: string | null;
  rights: string;
  contentSource: string;
  aiModel: string | null;
}): { contentHash: string; manifest: ProvenanceManifest; signedAt: Date } {
  const signedAt = new Date();
  const contentHash = hashContent(input.title, input.body);

  const payload = [
    "1",
    "BharatWire",
    input.title,
    contentHash,
    input.rights,
    input.contentSource,
    input.aiModel ?? "",
    signedAt.toISOString(),
  ].join("|");

  const signature = createHmac("sha256", SECRET()).update(payload).digest("hex");

  return {
    contentHash,
    signedAt,
    manifest: {
      version: 1,
      publisher: "BharatWire",
      articleTitle: input.title,
      contentHash,
      rights: input.rights,
      contentSource: input.contentSource,
      aiModel: input.aiModel,
      signedAt: signedAt.toISOString(),
      signature,
    },
  };
}

/** Re-verify an article against its manifest (true = untampered). */
export function verifyArticle(
  title: string,
  body: string | null,
  manifest: ProvenanceManifest,
): boolean {
  return hashContent(title, body) === manifest.contentHash;
}
