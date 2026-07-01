import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

/** Make a new API key. Returns the RAW key (show once) + its hash (stored). */
export function newApiKey(): { raw: string; hash: string } {
  const raw = "bw_live_" + randomBytes(24).toString("hex");
  return { raw, hash: hashKey(raw) };
}

export function hashKey(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/**
 * Verify an incoming API key. Returns the owning Buyer (agency/AI) or null.
 * Also updates lastUsedAt so you can see activity.
 */
export async function verifyApiKey(raw: string | null) {
  if (!raw) return null;
  const hash = hashKey(raw.trim());
  const key = await prisma.apiKey.findUnique({
    where: { hashedKey: hash },
    include: { buyer: true },
  });
  if (!key || key.revokedAt) return null;
  if (key.buyer.status !== "APPROVED") return null;

  // usage update (pay-per-fetch meter) — awaited so it reliably records
  await prisma.apiKey.update({
    where: { id: key.id },
    data: { lastUsedAt: new Date(), requestCount: { increment: 1 } },
  });

  return { buyer: key.buyer, apiKeyId: key.id, scopes: key.scopes };
}
