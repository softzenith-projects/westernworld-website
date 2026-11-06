import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight, Plane } from "lucide-react";
import { country, universitiesOf } from "@/lib/content";
import { DESTINATIONS } from "@/lib/site";

/**
 * Card size by destination, so the ten cards fill the grid with no gaps:
 * large screens (4 columns): UK 2 × 2, Canada tall, Singapore and Cyprus wide (four full rows);
 * phones / tablets (2 columns): UK 2 × 2 and Cyprus full width (seven full rows).
 */
const SPAN: Record<string, string> = {
  uk: "col-span-2 row-span-2",
  canada: "lg:row-span-2",
  singapore: "lg:col-span-2",
  cyprus: "col-span-2",
};

/**
 * How wide each photo is drawn (not the card: photos cover their card, so a wide photo in a tall card is drawn wider).
 * Too small a value makes the browser pick a small file and stretch it (soft photos).
 */
const SIZES: Record<string, string> = {
  uk: "(min-width: 1024px) 46vw, 100vw",
  canada: "(min-width: 1024px) 30vw, 50vw",
  singapore: "(min-width: 1024px) 46vw, 90vw",
  cyprus: "(min-width: 1024px) 46vw, 100vw",
};
const SIZES_DEFAULT = "(min-width: 1024px) 27vw, 76vw";

/** Study destinations as editorial photo cards; each opens its /study-in page. */
export default function Destinations() {
  return (
    <ul className="grid grid-flow-dense auto-rows-[11.5rem] grid-cols-2 gap-2.5 sm:auto-rows-[15rem] sm:gap-3 lg:auto-rows-[15.5rem] lg:grid-cols-4 lg:gap-4">
      {DESTINATIONS.map((d, i) => {
        const c = country(d.slug);
        const unis = c ? universitiesOf(c).length : 0;
        const big = d.slug === "uk";
        return (
          <li key={d.slug} style={{ "--i": i % 4 } as CSSProperties} className={`reveal ${SPAN[d.slug] ?? ""}`}>
            <Link href={`/study-in/${d.slug}`}
                  className="group relative isolate flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-brand-dark p-3.5 text-white sm:p-5">
              <Image src={d.photo} alt={d.scene} fill quality={85} sizes={SIZES[d.slug] ?? SIZES_DEFAULT}
                     className="-z-10 object-cover transition duration-[1.2s] ease-out group-hover:scale-[1.06]" />
              {/* Brand tint + a darker foot so the white text always reads. */}
              <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-dark/90 via-brand-dark/25 to-brand-dark/10 transition duration-500 group-hover:from-brand-dark/95 group-hover:via-brand/35" />

              <span className="flex items-start justify-between gap-2">
                <span className="tag inline-flex items-center gap-1.5 rounded-full bg-brand-dark/55 px-2.5 py-1 text-white ring-1 ring-white/15 backdrop-blur-md">
                  {d.code}<span className="hidden text-white/75 sm:inline">· {d.city}</span>
                </span>
                <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-brand opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 max-lg:hidden">
                  <ArrowUpRight className="size-4" />
                </span>
              </span>

              <span>
                <span className={`block font-display leading-tight font-semibold tracking-tight ${big ? "text-3xl sm:text-5xl" : "text-xl sm:text-[1.7rem]"}`}>
                  <span className="sr-only">Study in </span>{d.name}
                </span>
                <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-white/75 sm:text-sm">
                  <span className="inline-flex items-center gap-1"><Plane className="size-3.5 rotate-45" aria-hidden />{d.flight}<span className="max-sm:hidden"> from Delhi</span></span>
                  {unis > 0 && <span className="max-sm:hidden">· {unis} universit{unis === 1 ? "y" : "ies"}</span>}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
