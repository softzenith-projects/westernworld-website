import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Newspaper } from "lucide-react";
import { formatDate, posts, readMinutes, type Post } from "@/content/posts";

/** Post image, or a typographic cover (navy ticket with the tag) when the post has none. */
export function PostCover({ p, className = "", sizes, compact = false }: { p: Post; className?: string; sizes: string; compact?: boolean }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {p.image ? (
        <Image src={p.image} alt="" fill sizes={sizes} className="object-cover transition duration-500 group-hover:scale-105" />
      ) : (
        <div className={`absolute inset-0 flex flex-col justify-between ${compact ? "p-3" : "p-5"} ${p.kind === "News" ? "bg-ink" : "bg-brand"}`}>
          <div className="map-grid absolute inset-0 opacity-25 [filter:invert(1)]" aria-hidden />
          <span className={`tag relative text-white/50 ${compact ? "" : "self-end"}`}>{compact ? (p.kind === "News" ? "News" : "Guide") : `${p.kind === "News" ? "Bulletin" : "Guide"}${p.date ? ` · ${p.date.slice(0, 4)}` : ""}`}</span>
          <span className={`relative font-display leading-none font-semibold break-words text-white ${compact ? "text-lg" : "text-4xl sm:text-5xl"}`}>{p.tag}</span>
          <span className="pointer-events-none absolute -right-4 -bottom-8 font-display text-[9rem] leading-none text-white/[0.06] transition duration-700 select-none group-hover:-translate-y-4 group-hover:translate-x-2 group-hover:text-white/[0.12]" aria-hidden>✈</span>
        </div>
      )}
      {!compact && <span className={`tag absolute top-3 left-3 rounded-full px-2.5 py-1 ${p.kind === "News" ? "bg-sun text-ink" : "bg-white text-ink"}`}>{p.kind}</span>}
    </div>
  );
}

export function PostMeta({ p, light = false }: { p: Post; light?: boolean }) {
  return (
    <p className={`tag flex flex-wrap gap-x-2 ${light ? "text-white/50" : "text-slate-400"}`}>
      <span className="text-accent">{p.tag}</span>
      {p.date && <><span>·</span><time dateTime={p.date}>{formatDate(p.date)}</time></>}
      <span>·</span><span>{readMinutes(p)} min read</span>
    </p>
  );
}

export function PostCard({ p, featured = false }: { p: Post; featured?: boolean }) {
  return (
    <Link href={`/blog/${p.slug}`}
          className={`reveal group flex h-full overflow-hidden rounded-xl border border-line bg-white transition duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl hover:shadow-brand-dark/10 ${featured ? "flex-col md:flex-row" : "flex-col"}`}>
      <PostCover p={p} className={featured ? "aspect-[16/10] md:aspect-auto md:w-1/2" : "aspect-[16/10]"}
                 sizes={featured ? "(min-width: 768px) 40vw, 100vw" : "(min-width: 1024px) 25vw, 100vw"} />
      <div className={`flex flex-1 flex-col ${featured ? "p-6 md:p-8" : "p-5"}`}>
        <PostMeta p={p} />
        <h3 className={`mt-2 font-semibold group-hover:text-accent ${featured ? "text-3xl leading-tight" : "text-xl leading-snug"}`}>{p.title}</h3>
        <p className={`mt-2 flex-1 text-slate-600 ${featured ? "" : "line-clamp-3 text-sm"}`}>{p.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink group-hover:text-accent">
          Read more <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

/** Empty slot shown until there are enough posts. */
function ComingSoon() {
  return (
    <div className="flex h-full min-h-64 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line p-6 text-center text-slate-400">
      <Newspaper className="size-7" />
      <span className="tag">More news & guides coming soon</span>
    </div>
  );
}

/** Home page: the latest post large, the next two beside it; empty slots keep the layout until more posts exist. */
export function NewsSection() {
  const [first, ...rest] = posts;
  const side = rest.slice(0, 2);
  return (
    <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
      {first ? <PostCard p={first} featured /> : <ComingSoon />}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
        {side.map((p) => <CompactPost key={p.slug} p={p} />)}
        {Array.from({ length: 2 - side.length }, (_, i) => <ComingSoon key={i} />)}
      </div>
    </div>
  );
}

function CompactPost({ p }: { p: Post }) {
  return (
    <Link href={`/blog/${p.slug}`} className="group flex gap-4 overflow-hidden rounded-xl border border-line bg-white p-3 transition hover:border-ink">
      <PostCover p={p} compact className="aspect-square w-28 shrink-0 rounded-lg" sizes="112px" />
      <div className="flex min-w-0 flex-col justify-center py-1 pr-2">
        <PostMeta p={p} />
        <h3 className="mt-1.5 line-clamp-2 text-lg leading-snug font-semibold group-hover:text-accent">{p.title}</h3>
        <span className="tag mt-2 text-slate-400">{p.kind}</span>
      </div>
    </Link>
  );
}
