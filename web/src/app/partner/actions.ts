"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9ऀ-ॿ]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "news"}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function submitPartnerArticle(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const categoryId = String(formData.get("categoryId") || "");
  const languageId = String(formData.get("languageId") || "");

  if (!email || !title || !body || !categoryId || !languageId) {
    redirect("/partner/submit?error=missing");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { partnerProfile: true },
  });
  if (!user?.partnerProfile || user.partnerProfile.status !== "APPROVED") {
    redirect("/partner/submit?error=notpartner");
  }

  await prisma.article.create({
    data: {
      title,
      slug: slugify(title),
      body,
      excerpt: body.slice(0, 160),
      status: "IN_REVIEW", // admin approves before publishing
      rights: "OWN_SELLABLE", // partner owns it → sellable, they earn a share
      contentSource: "MANUAL",
      partnerId: user!.partnerProfile!.id,
      categoryId,
      languageId,
    },
  });

  redirect("/partner/submit?ok=1");
}
