"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

/** Public trial-request form → creates a PENDING agency lead for admin review. */
export async function requestTrial(formData: FormData) {
  const outlet = String(formData.get("outlet") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const website = String(formData.get("website") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  if (!outlet || !email) redirect("/pricing?error=1");

  // Avoid duplicate leads for the same email.
  const existing = await prisma.buyer.findFirst({
    where: { contactEmail: email, type: "AGENCY" },
  });
  if (!existing) {
    const buyer = await prisma.buyer.create({
      data: { name: outlet, contactEmail: email, type: "AGENCY", status: "PENDING" },
    });
    await prisma.auditLog.create({
      data: {
        action: "TRIAL_REQUESTED",
        entityType: "Buyer",
        entityId: buyer.id,
        metadata: { outlet, email, website, phone },
      },
    });
  }
  redirect("/pricing?ok=1");
}
