"use client";

import { useState } from "react";
import PhotoWall from "@/components/PhotoWall";
import { SCORECARDS, VISA_POSTERS, VISA_WINS, winAlt, winLabel, type Win } from "@/content/testimonials";

const wins = (list: Win[]) => ({ images: list.map((w) => w.src), labels: list.map(winLabel), alts: list.map(winAlt) });

const TABS = [
  { id: "visas", label: "Visas in hand", count: VISA_WINS.length },
  { id: "posters", label: "Congratulations posters", count: VISA_POSTERS.length },
  { id: "scores", label: "IELTS scorecards", count: SCORECARDS.length },
] as const;

/** Countries we have visa photos for, most photos first ("All" comes before them). */
const COUNTRIES = [...new Set(VISA_WINS.map((w) => w.country).filter(Boolean))]
  .map((country) => ({ country: country!, count: VISA_WINS.filter((w) => w.country === country).length }))
  .sort((a, b) => b.count - a.count);

/**
 * Testimonials: visa handover photos (filter by country), the office's congratulations posters and IELTS scorecards.
 * `feature` = home-page mosaic (first visa photo large); `light` = on a white section.
 */
export default function WallOfWins({ limit, feature = false, light = false }: { limit?: number; feature?: boolean; light?: boolean }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("visas");
  const [country, setCountry] = useState<string>();
  const visas = country ? VISA_WINS.filter((w) => w.country === country) : VISA_WINS;

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${active
      ? (light ? "border-accent bg-accent text-white" : "border-white bg-white text-ink")
      : (light ? "border-line bg-white text-slate-600 hover:border-accent hover:text-accent" : "border-white/20 text-white/70 hover:border-white hover:text-white")}`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="Success stories" className={`inline-flex max-w-full overflow-x-auto rounded-full p-1 ${light ? "bg-brand-light" : "bg-white/10"}`}>
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition sm:px-5 ${tab === t.id ? (light ? "bg-brand text-white" : "bg-white text-ink") : light ? "text-brand/70 hover:text-brand" : "text-white/70 hover:text-white"}`}>
              {t.label}
              <span className={`font-mono text-[11px] ${tab === t.id ? (light ? "text-sun" : "text-accent") : light ? "text-brand/40" : "text-white/40"}`}>{t.count}</span>
            </button>
          ))}
        </div>
        {tab === "visas" && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by country">
            <button className={chip(!country)} aria-pressed={!country} onClick={() => setCountry(undefined)}>All</button>
            {COUNTRIES.map((c) => (
              <button key={c.country} className={chip(country === c.country)} aria-pressed={country === c.country} onClick={() => setCountry(c.country)}>
                {c.country} <span className="font-mono opacity-60">{c.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div role="tabpanel">
        {tab === "visas" && (
          <PhotoWall key={`visas-${country ?? "all"}`} {...wins(visas)} alt="Western World student receiving their visa"
                     limit={limit} dark={!light} feature={feature && !country} />
        )}
        {tab === "posters" && (
          <PhotoWall key="posters" images={VISA_POSTERS.map((p) => p.src)} labels={VISA_POSTERS.map(winLabel)}
                     alts={VISA_POSTERS.map((p) => `Congratulations poster: ${p.name}, ${p.country} visa`)}
                     alt="Western World congratulations poster" fit="contain" limit={limit} dark={!light} />
        )}
        {tab === "scores" && (
          <PhotoWall key="scores" images={SCORECARDS} alt="Western World student's IELTS scorecard" fit="contain" limit={limit} dark={!light} />
        )}
      </div>
    </div>
  );
}
