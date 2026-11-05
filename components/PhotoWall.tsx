"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { BadgeCheck, ChevronLeft, ChevronRight, X } from "lucide-react";

/**
 * Uniform photo grid with a lightbox (native <dialog>: focus trap, Esc to close, no library).
 * `fit="contain"` for scorecards and posters (text must stay readable), `cover` for photos.
 */
export default function PhotoWall({ images, alt, alts, fit = "cover", limit, dark = false, feature = false, badge, labels }: {
  images: string[];
  alt: string;
  /** Per-photo alt text (falls back to `alt`). */
  alts?: string[];
  fit?: "cover" | "contain";
  /** Show this many until "Show all" is pressed. */
  limit?: number;
  dark?: boolean;
  /** Mosaic: the first photo is shown large (2×2). */
  feature?: boolean;
  /** Small label on every photo, e.g. "Visa in hand". */
  badge?: string;
  /** Per-photo label, e.g. "Aman · UK visa" (wins over `badge`); also shown in the lightbox. */
  labels?: string[];
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState(0);
  const [all, setAll] = useState(!limit);
  const shown = all ? images : images.slice(0, limit);
  const label = (n: number) => labels?.[n] ?? badge;
  const altOf = (n: number) => alts?.[n] ?? alt;

  const open = (n: number) => {
    setCurrent(n);
    dialog.current?.showModal();
  };
  const step = (d: number) => setCurrent((c) => (c + d + images.length) % images.length);

  return (
    <>
      <ul className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 ${fit === "contain" ? "" : "xl:grid-cols-5"} ${feature ? "auto-rows-[12rem] sm:auto-rows-[14rem] xl:auto-rows-[15rem]" : ""}`}>
        {shown.map((src, n) => {
          const big = feature && n === 0;
          // Mosaic on two columns: drop a last photo that would sit alone in its row.
          const orphan = feature && !all && shown.length % 2 === 0 && n === shown.length - 1;
          const text = label(n);
          return (
            <li key={src} className={big ? "col-span-2 row-span-2" : orphan ? "max-sm:hidden" : ""}>
              <button onClick={() => open(n)} aria-label={`Open photo ${n + 1}${text ? `: ${text}` : ""}`}
                      className={`group relative block w-full overflow-hidden rounded-lg ${feature ? "h-full" : fit === "contain" ? "aspect-square" : "aspect-[4/5]"} ${fit === "contain" ? "bg-white" : "bg-brand-dark/20"} ${big ? "rounded-xl shadow-xl shadow-brand-dark/15" : ""}`}>
                <Image src={src} alt={altOf(n)} fill
                       sizes={big ? "(min-width: 1280px) 40vw, (min-width: 640px) 66vw, 100vw" : "(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"}
                       className={`transition duration-500 group-hover:scale-[1.04] ${fit === "contain" ? "object-contain" : "object-cover object-[50%_30%]"}`} />
                {text && fit === "cover" && (
                  <span className={`tag absolute bottom-2 left-2 inline-flex max-w-[calc(100%-1rem)] items-center gap-1 truncate rounded-full bg-white/95 text-brand shadow ${big ? "px-3 py-1.5" : "px-2 py-1 text-[9px] tracking-[0.12em]"}`}>
                    <BadgeCheck className={`shrink-0 ${big ? "size-4 text-accent" : "size-3 text-accent"}`} /><span className="truncate">{text}</span>
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      {!all && limit && images.length > limit && (
        <div className="mt-8 text-center">
          <button onClick={() => setAll(true)}
                  className={`rounded-full border px-6 py-2.5 text-sm font-semibold transition ${dark ? "border-white/25 text-white hover:bg-white hover:text-ink" : "border-ink/20 text-ink hover:bg-ink hover:text-white"}`}>
            Show all {images.length}
          </button>
        </div>
      )}

      <dialog ref={dialog} onClick={(e) => e.target === dialog.current && dialog.current?.close()}
              onKeyDown={(e) => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); }}
              className="m-auto max-h-[92dvh] max-w-[92vw] overflow-visible bg-transparent p-0 backdrop:bg-ink/85 backdrop:backdrop-blur-sm">
        {images.length > 0 && (
          <div className="relative">
            <Image src={images[current]} alt={altOf(current)} width={1200} height={1200} sizes="92vw"
                   className="h-auto max-h-[84dvh] w-auto max-w-[92vw] rounded-lg object-contain" />
            <p className="tag mt-2 text-center text-white/70">
              {label(current) && <span className="text-white">{label(current)} · </span>}{current + 1} / {images.length}
            </p>
            <button onClick={() => dialog.current?.close()} aria-label="Close" autoFocus
                    className="absolute -top-3 -right-3 rounded-full bg-white p-2 text-ink shadow-lg"><X className="size-5" /></button>
            <button onClick={() => step(-1)} aria-label="Previous photo"
                    className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-ink shadow-lg"><ChevronLeft className="size-5" /></button>
            <button onClick={() => step(1)} aria-label="Next photo"
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-ink shadow-lg"><ChevronRight className="size-5" /></button>
          </div>
        )}
      </dialog>
    </>
  );
}
