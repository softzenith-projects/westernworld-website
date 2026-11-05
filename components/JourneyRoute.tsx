"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type FocusEvent } from "react";
import { ArrowRight, Check, ChevronLeft, ChevronRight, GraduationCap, Pause, Plane, Play } from "lucide-react";
import { LegIcon, ServiceIcon } from "@/components/serviceIcons";
import { LEGS, serviceHref } from "@/content/services";
import { enquire } from "@/lib/site";

/** Every service in order, with its leg and the leg's position. */
const STOPS = LEGS.flatMap((leg, l) => leg.services.map((s) => ({ s, leg, l })));
type Stop = (typeof STOPS)[number];

/** How long the tour stays on each stop. */
const STEP_MS = 4500;

/** Whether the visitor asked for reduced motion (false on the server). */
const REDUCED = "(prefers-reduced-motion: reduce)";
const onMotionChange = (cb: () => void) => {
  const mq = matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useReducedMotion = () => useSyncExternalStore(onMotionChange, () => matchMedia(REDUCED).matches, () => false);

/** Centre of leg `l` on the plane's track, as a % of the width (four equal columns). */
const legX = (l: number) => (l + 0.5) * (100 / LEGS.length);

/**
 * The route through all services, grouped by phase (owner, 5 Nov 2026: "aggregate all same phase things in 1 box, a bit
 * more interactive"). One box per leg (Plan / Prepare / Apply / Fly & settle) listing its stops; a plane on the track
 * above flies to the active leg; the chosen stop opens a detail panel (what it includes, links).
 *
 * Large screens: once the route scrolls into view it plays through the stops by itself (a bar shows the time left);
 * pointer or keyboard focus on it pauses, choosing a stop stops the tour, the play button restarts it. Phones and
 * tablets: no autoplay (it would move the page under the reader's thumb); the detail opens inside the tapped box.
 * Reduced motion: no autoplay, no animations. Without JavaScript the boxes and the first stop's detail are shown.
 */
export default function JourneyRoute() {
  const [cur, setCur] = useState(0);
  // null = the default: play, unless the visitor asked for reduced motion; the play / pause button sets it.
  const [choice, setChoice] = useState<boolean | null>(null);
  const reduced = useReducedMotion();
  const auto = choice ?? !reduced;
  const [inView, setInView] = useState(false);
  const [hold, setHold] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const stop = STOPS[cur];
  const running = auto && inView && !hold;

  // Large screens only: phones never count as "in view", so the tour never plays there.
  useEffect(() => {
    const el = root.current;
    if (!el || !("IntersectionObserver" in window) || !matchMedia("(min-width: 1024px)").matches) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "-35% 0px -35% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setCur((c) => (c + 1) % STOPS.length), STEP_MS);
    return () => clearTimeout(t);
  }, [running, cur]);

  /** The reader picked a stop: show it and stop the tour. */
  const pick = (i: number) => {
    setCur((i + STOPS.length) % STOPS.length);
    setChoice(false);
  };
  const leaveFocus = (e: FocusEvent) => {
    if (!root.current?.contains(e.relatedTarget as Node | null)) setHold(false);
  };

  return (
    <div ref={root} onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}
         onFocus={() => setHold(true)} onBlur={leaveFocus}>
      {/* Where we are + controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p aria-live="polite" className="tag text-slate-500">
          Stop <span className="text-accent">{String(cur + 1).padStart(2, "0")}</span> of {STOPS.length} · {stop.leg.title}
        </p>
        <div className="flex items-center gap-2">
          <button onClick={() => pick(cur - 1)} aria-label="Previous stop"
                  className="flex size-10 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-ink">
            <ChevronLeft className="size-5" />
          </button>
          <button onClick={() => setChoice(!auto)} aria-pressed={auto}
                  className="hidden items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent lg:inline-flex">
            {auto ? <><Pause className="size-4" /> Pause tour</> : <><Play className="size-4" /> Play the journey</>}
          </button>
          <button onClick={() => pick(cur + 1)} aria-label="Next stop"
                  className="flex size-10 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-ink">
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {/* The track: a plane flies to the active leg (large screens). */}
      <div className="relative mb-5 hidden h-10 lg:block" aria-hidden>
        <div className="absolute top-1/2 border-t-2 border-dashed border-ink/20" style={{ left: `${legX(0)}%`, right: `${legX(0)}%` }} />
        <div className="absolute top-1/2 h-0.5 -translate-y-px bg-accent transition-[width] duration-700 ease-out"
             style={{ left: `${legX(0)}%`, width: `${legX(stop.l) - legX(0)}%` }} />
        {LEGS.map((leg, l) => (
          <span key={leg.id} style={{ left: `${legX(l)}%` }}
                className={`absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent transition ${l <= stop.l ? "bg-accent" : "bg-paper"}`} />
        ))}
        <span style={{ left: `${legX(stop.l)}%` }}
              className="absolute top-1/2 z-10 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-sun shadow-lg ring-4 ring-paper transition-[left] duration-700 ease-out">
          <Plane className="size-5 rotate-45" />
        </span>
      </div>

      {/* One box per leg */}
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {LEGS.map((leg, l) => {
          const on = stop.l === l;
          const first = STOPS.findIndex((x) => x.leg.id === leg.id);
          return (
            <li key={leg.id}
                className={`flex flex-col rounded-2xl border p-4 transition duration-300 ${on ? "border-accent bg-white shadow-xl shadow-brand-dark/10 lg:-translate-y-1" : "border-line bg-white/70 hover:border-accent/50 hover:bg-white"}`}>
              <button onClick={() => pick(first)} className="group flex w-full items-center gap-3 rounded-xl p-1 text-left">
                <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl transition duration-300 group-hover:rotate-[-8deg] ${on ? "bg-accent text-white shadow-lg shadow-accent/30" : "bg-paper text-accent"}`}>
                  <LegIcon id={leg.id} className="size-6" strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="tag block text-accent">{leg.label}</span>
                  <span className="block font-display text-xl leading-tight font-semibold text-ink">{leg.title}</span>
                </span>
                <span className="font-mono text-xs text-slate-400">{leg.services.length} stops</span>
              </button>
              <p className="mt-2 px-1 text-sm text-slate-500">{leg.blurb}</p>

              <ul className="mt-4 space-y-1.5">
                {leg.services.map((s, k) => {
                  const i = first + k;
                  const sel = i === cur;
                  return (
                    <li key={s.slug}>
                      <button onClick={() => pick(i)} aria-pressed={sel}
                              className={`journey-stop group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-2.5 py-2 text-left text-sm font-semibold transition ${sel ? "bg-ink text-white" : "text-ink hover:bg-paper"}`}>
                        <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition ${sel ? "bg-accent text-white" : "bg-paper text-accent group-hover:bg-accent group-hover:text-white"}`}>
                          <ServiceIcon slug={s.slug} className="sign-icon size-4" strokeWidth={2} />
                        </span>
                        <span className="min-w-0 flex-1 leading-snug">{s.name}</span>
                        <span className={`font-mono text-[10px] ${sel ? "text-sun" : "text-slate-400"}`}>{String(i + 1).padStart(2, "0")}</span>
                        {sel && running && (
                          <span key={cur} aria-hidden className="journey-timer absolute bottom-0 left-0 h-0.5 w-full origin-left bg-sun"
                                style={{ animationDuration: `${STEP_MS}ms` }} />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {on && <div className="mt-4 lg:hidden"><Detail stop={stop} compact /></div>}
            </li>
          );
        })}
      </ol>

      <div className="mt-5 hidden lg:block"><Detail stop={stop} /></div>

      {/* Arrival */}
      <Link href={enquire("Free counselling")}
            className="group mt-5 flex flex-wrap items-center gap-4 rounded-2xl bg-ink p-5 text-white transition hover:bg-brand sm:flex-nowrap">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-sun text-ink transition duration-300 group-hover:-rotate-12">
          <GraduationCap className="size-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="tag block text-sun">Arrival</span>
          <span className="block font-display text-xl font-semibold">Your campus abroad</span>
          <span className="block text-sm text-white/60">{STOPS.length} stops, {LEGS.length} legs, one team from your first doubt to your first day abroad.</span>
        </span>
        <span className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition group-hover:bg-sun sm:w-auto">
          Free counselling <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </span>
      </Link>
    </div>
  );
}

/** The chosen stop: what it is, what it includes, where to go next. Re-animates when the stop changes. */
function Detail({ stop, compact = false }: { stop: Stop; compact?: boolean }) {
  const n = STOPS.indexOf(stop) + 1;
  return (
    <div key={stop.s.slug}
         className={`journey-detail grid gap-5 rounded-2xl border border-accent/30 bg-paper ${compact ? "p-5" : "min-h-44 grid-cols-[auto_1.1fr_1fr_auto] items-center p-6"}`}>
      <span className={`flex items-center justify-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/30 ${compact ? "size-12" : "size-16"}`}>
        <ServiceIcon slug={stop.s.slug} className={compact ? "size-6" : "size-8"} strokeWidth={1.75} />
      </span>
      <div>
        <p className="tag text-accent">Stop {String(n).padStart(2, "0")} · {stop.leg.title}</p>
        <h3 className="mt-1 text-2xl font-semibold">{stop.s.name}</h3>
        <p className="mt-1 text-slate-600">{stop.s.short}</p>
      </div>
      <ul className="space-y-1.5 text-sm text-slate-700">
        {stop.s.includes.slice(0, 3).map((x) => (
          <li key={x} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-accent" />{x}</li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 lg:flex-col">
        <Link href={serviceHref(stop.s)}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent">
          Learn more <ArrowRight className="size-4" />
        </Link>
        <Link href={enquire(stop.s.name)}
              className="inline-flex items-center justify-center rounded-full border border-ink/20 px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-ink">
          Ask about this
        </Link>
      </div>
    </div>
  );
}
