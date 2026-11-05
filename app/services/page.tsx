import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowDown, ArrowRight, Check } from "lucide-react";
import CardGrid from "@/components/CardGrid";
import { CtaBand, PageHero, Section } from "@/components/blocks";
import { LegIcon, ServiceIcon } from "@/components/serviceIcons";
import { LEGS, serviceHref } from "@/content/services";
import { enquire } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description: "Every study-abroad service in one place: counselling, test prep, applications, SOPs, scholarships, loans, visa, forex, flights, accommodation and part-time jobs.",
};

/** Stop number of each leg's first service (01, 04, 07, 11). */
const FIRST = LEGS.map((_, i) => LEGS.slice(0, i).reduce((n, l) => n + l.services.length, 0));

/**
 * All services, leg by leg (owner, 5 Nov 2026: "make them interactive"). An overview of the four legs jumps to each
 * section; each leg has its icon, a 1–4 progress bar and a "next leg" link; each card has its icon and stop number,
 * a glow that follows the pointer (CardGrid), rises on hover and brings its "What you get" list into focus (always
 * shown, so nothing jumps). Cards rise in one by one when scrolled into view.
 */
export default function ServicesPage() {
  const count = LEGS.reduce((n, l) => n + l.services.length, 0);
  return (
    <>
      <PageHero title="Everything between here and your campus" crumbs={[{ label: "Services" }]} label={`${count} services · ${LEGS.length} legs`}
                subtitle="Use one service or all of them. Either way, one team keeps your whole file together." />

      {/* The four legs at a glance */}
      <nav aria-label="Jump to a leg" className="mx-auto -mt-10 max-w-7xl px-4">
        <ol className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LEGS.map((leg) => {
            return (
              <li key={leg.id}>
                <Link href={`#${leg.id}`}
                      className="group flex h-full flex-col gap-3 rounded-2xl border border-line bg-white p-5 shadow-lg shadow-brand-dark/5 transition duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl">
                  <span className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-white transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
                      <LegIcon id={leg.id} className="size-5" />
                    </span>
                    <span className="tag text-slate-400">{leg.label}</span>
                  </span>
                  <span>
                    <span className="block font-display text-xl font-semibold text-ink group-hover:text-accent">{leg.title}</span>
                    <span className="text-sm text-slate-500">{leg.services.length} services</span>
                  </span>
                  <span className="mt-auto flex items-center gap-1.5" aria-hidden>
                    {leg.services.map((s, k) => {
                      return (
                        <span key={s.slug} style={{ transitionDelay: `${k * 50}ms` }}
                              className="flex size-7 items-center justify-center rounded-lg bg-paper text-accent transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-accent/10">
                          <ServiceIcon slug={s.slug} className="size-3.5" />
                        </span>
                      );
                    })}
                    <ArrowDown className="ml-auto size-4 text-slate-300 transition group-hover:translate-y-0.5 group-hover:text-accent" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>

      {LEGS.map((leg, i) => {
        const next = LEGS[i + 1];
        return (
          <Section key={leg.id} id={leg.id} className={i % 2 ? "bg-white" : ""}>
            <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <span className="flex size-16 items-center justify-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/25">
                  <LegIcon id={leg.id} className="size-8" strokeWidth={1.75} />
                </span>
                <p className="tag mt-6 text-accent">{leg.label} · {i + 1} of {LEGS.length}</p>
                <h2 className="mt-2 text-5xl font-semibold">{leg.title}</h2>
                <p className="mt-3 text-slate-600">{leg.blurb}</p>
                <div className="mt-6 flex gap-1.5" aria-hidden>
                  {LEGS.map((l, k) => <span key={l.id} className={`h-1.5 flex-1 rounded-full ${k <= i ? "bg-accent" : "bg-line"}`} />)}
                </div>
                {next ? (
                  <Link href={`#${next.id}`} className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-accent">
                    Next leg: {next.title} <ArrowDown className="size-4 transition group-hover:translate-y-0.5" />
                  </Link>
                ) : (
                  <Link href={enquire("Free counselling")} className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
                    Then: your campus abroad <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                  </Link>
                )}
              </div>

              <CardGrid className="grid gap-4 sm:grid-cols-2">
                {leg.services.map((s, k) => {
                  return (
                    <li key={s.slug} style={{ "--i": k } as CSSProperties}>
                      <div data-spot
                           className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-6 transition duration-300 focus-within:border-accent hover:-translate-y-1 hover:border-accent hover:shadow-2xl hover:shadow-brand-dark/10">
                        <span aria-hidden className="spot-glow pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100" />
                        <div className="flex items-start justify-between gap-4">
                          <span className="journey-stop flex size-12 items-center justify-center rounded-xl bg-paper text-accent transition duration-300 group-hover:rotate-[-6deg] group-hover:bg-accent group-hover:text-white group-hover:shadow-lg group-hover:shadow-accent/30">
                            <ServiceIcon slug={s.slug} className="sign-icon size-6" strokeWidth={1.75} />
                          </span>
                          <span className="font-mono text-xs text-slate-300 transition group-hover:text-accent">{String(FIRST[i] + k + 1).padStart(2, "0")}</span>
                        </div>
                        <h3 className="mt-5 text-2xl font-semibold">
                          <Link href={serviceHref(s)} className="transition group-hover:text-accent after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
                            {s.name}
                          </Link>
                        </h3>
                        <p className="mt-2 text-slate-600">{s.short}</p>

                        {/* What you get: always shown (no layout jump); comes into focus on hover / keyboard focus */}
                        <p className="tag mt-4 border-t border-dashed border-line pt-4 text-slate-400 transition group-hover:text-accent">What you get</p>
                        <ul className="mt-2 space-y-1.5 text-sm text-slate-500 transition group-focus-within:text-slate-700 group-hover:text-slate-700">
                          {s.includes.slice(0, 3).map((x, n) => (
                            <li key={x} className="flex gap-2 transition duration-300 group-hover:translate-x-1" style={{ transitionDelay: `${n * 60}ms` }}>
                              <Check className="mt-0.5 size-4 shrink-0 text-slate-300 transition group-hover:text-accent" />{x}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink transition group-hover:text-accent" aria-hidden>
                            Learn more <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                          </span>
                          <Link href={enquire(s.name)}
                                className="relative z-10 rounded-full border border-ink/15 px-3.5 py-1.5 text-xs font-semibold text-ink transition hover:border-ink hover:bg-ink hover:text-white">
                            Ask about this
                          </Link>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </CardGrid>
            </div>
          </Section>
        );
      })}
      <CtaBand title="Not sure where to start?" text="Book a free counselling session and we will tell you which services you actually need." course="Free counselling" />
    </>
  );
}
