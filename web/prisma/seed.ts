/**
 * Seed = puts the starting data into the database the first time.
 * Run with:  npm run seed
 * Safe to run again (uses "upsert" = create-if-missing, won't duplicate).
 */
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  // --- Languages (regional-first) ---
  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी (Hindi)" },
    { code: "bho", name: "भोजपुरी (Bhojpuri)" },
  ];
  for (const l of languages) {
    await prisma.language.upsert({
      where: { code: l.code },
      update: { name: l.name },
      create: l,
    });
  }

  // --- Categories ---
  const categories = [
    "Politics",
    "Business",
    "Sports",
    "Technology",
    "Entertainment",
    "World",
    "Health",
    "Regional",
  ];
  for (const name of categories) {
    const slug = name.toLowerCase();
    await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
  }

  // --- Super Admin (you) ---
  await prisma.user.upsert({
    where: { email: "admin@bharatwire.in" },
    update: { role: "SUPER_ADMIN" },
    create: {
      email: "admin@bharatwire.in",
      name: "Super Admin",
      role: "SUPER_ADMIN",
    },
  });

  // --- Real, free RSS feeds for testing the pipeline ---
  const worldCat = await prisma.category.findUnique({ where: { slug: "world" } });
  const enLang = await prisma.language.findUnique({ where: { code: "en" } });
  const hiLang = await prisma.language.findUnique({ where: { code: "hi" } });

  const feeds = [
    {
      name: "BBC News (English)",
      feedUrl: "https://feeds.bbci.co.uk/news/rss.xml",
      defaultLanguageId: enLang?.id ?? null,
    },
    {
      name: "BBC News (Hindi)",
      feedUrl: "https://feeds.bbci.co.uk/hindi/rss.xml",
      defaultLanguageId: hiLang?.id ?? null,
    },
  ];
  for (const f of feeds) {
    await prisma.rssSource.upsert({
      where: { feedUrl: f.feedUrl },
      update: { name: f.name, isActive: true },
      create: {
        name: f.name,
        feedUrl: f.feedUrl,
        isActive: true,
        defaultCategoryId: worldCat?.id ?? null,
        defaultLanguageId: f.defaultLanguageId,
      },
    });
  }

  const counts = {
    languages: await prisma.language.count(),
    categories: await prisma.category.count(),
    users: await prisma.user.count(),
    rssSources: await prisma.rssSource.count(),
  };
  console.log("✅ Seed done:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
