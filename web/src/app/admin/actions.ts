"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { runPipeline } from "@/lib/pipeline";
import { newApiKey } from "@/lib/apikey";

export async function addSource(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const feedUrl = String(formData.get("feedUrl") || "").trim();
  const defaultCategoryId = String(formData.get("categoryId") || "") || null;
  const defaultLanguageId = String(formData.get("languageId") || "") || null;
  if (!name || !feedUrl) return;

  await prisma.rssSource.upsert({
    where: { feedUrl },
    update: { name, isActive: true, defaultCategoryId, defaultLanguageId },
    create: { name, feedUrl, isActive: true, defaultCategoryId, defaultLanguageId },
  });
  revalidatePath("/admin/sources");
}

export async function toggleSource(formData: FormData) {
  const id = String(formData.get("id") || "");
  const src = await prisma.rssSource.findUnique({ where: { id } });
  if (!src) return;
  await prisma.rssSource.update({
    where: { id },
    data: { isActive: !src.isActive },
  });
  revalidatePath("/admin/sources");
}

export async function runPipelineAction() {
  await runPipeline();
  revalidatePath("/admin/review");
  revalidatePath("/admin/sources");
  revalidatePath("/admin");
}

export async function approveArticle(formData: FormData) {
  const id = String(formData.get("id") || "");
  await prisma.article.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
  revalidatePath("/admin/review");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function rejectArticle(formData: FormData) {
  const id = String(formData.get("id") || "");
  await prisma.article.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });
  revalidatePath("/admin/review");
  revalidatePath("/admin");
}

// --- Agency (B2B buyer) management ---
export async function addAgency(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const contactEmail = String(formData.get("contactEmail") || "").trim() || null;
  if (!name) return;
  await prisma.buyer.create({
    data: { name, contactEmail, type: "AGENCY", status: "APPROVED" },
  });
  revalidatePath("/admin/agencies");
}

// --- Publisher Partner management ---
export async function addPartner(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const outletName = String(formData.get("outletName") || "").trim() || null;
  const sharePct = Number(formData.get("sharePct") || 50);
  if (!name || !email) return;

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, role: "PUBLISHER_PARTNER" },
    create: { name, email, role: "PUBLISHER_PARTNER" },
  });
  await prisma.publisherPartner.upsert({
    where: { userId: user.id },
    update: { outletName, revenueShare: sharePct / 100, status: "APPROVED" },
    create: {
      userId: user.id,
      outletName,
      revenueShare: sharePct / 100,
      status: "APPROVED",
    },
  });
  revalidatePath("/admin/partners");
}

export async function addAiBuyer(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const contactEmail = String(formData.get("contactEmail") || "").trim() || null;
  if (!name) return;
  await prisma.buyer.create({
    data: { name, contactEmail, type: "AI", status: "APPROVED" },
  });
  revalidatePath("/admin/ai-buyers");
}

// Used with useActionState — returns the raw key ONCE so the UI can show it.
export async function createApiKeyAction(
  _prev: { raw?: string; error?: string },
  formData: FormData,
): Promise<{ raw?: string; error?: string }> {
  const buyerId = String(formData.get("buyerId") || "");
  const buyer = await prisma.buyer.findUnique({ where: { id: buyerId } });
  if (!buyer) return { error: "Agency not found" };

  const { raw, hash } = newApiKey();
  await prisma.apiKey.create({
    data: { buyerId, hashedKey: hash, label: "Primary key", scopes: ["articles:read"] },
  });
  revalidatePath("/admin/agencies");
  revalidatePath("/admin/ai-buyers");
  return { raw };
}

// --- Article rights toggle (Sellable vs Display-only) ---
export async function toggleSellable(formData: FormData) {
  const id = String(formData.get("id") || "");
  const a = await prisma.article.findUnique({ where: { id } });
  if (!a) return;
  await prisma.article.update({
    where: { id },
    data: { rights: a.rights === "DISPLAY_ONLY" ? "OWN_SELLABLE" : "DISPLAY_ONLY" },
  });
  revalidatePath("/admin/articles");
}
