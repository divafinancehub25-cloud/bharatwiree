import Link from "next/link";

type CardArticle = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  category: { name: string; slug: string };
  language: { name: string };
};

export function ArticleCard({ article: a }: { article: CardArticle }) {
  return (
    <Link
      href={`/news/${a.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-md"
    >
      {a.coverImage && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={a.coverImage}
          alt={a.title}
          className="h-40 w-full object-cover"
        />
      )}
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-2 self-start rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
          {a.category.name}
        </span>
        <h3 className="font-semibold leading-snug text-zinc-900 group-hover:text-orange-700">
          {a.title}
        </h3>
        {a.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm text-zinc-600">{a.excerpt}</p>
        )}
        <span className="mt-3 text-xs text-zinc-400">{a.language.name}</span>
      </div>
    </Link>
  );
}
