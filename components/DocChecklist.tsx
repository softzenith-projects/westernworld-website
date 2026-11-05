"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, FileText, PartyPopper } from "lucide-react";
import { enquire } from "@/lib/site";

/**
 * A university's document list the visitor can tick off ("I have this"), with a progress bar and a nudge to book a
 * file check once everything is ready. Nothing is saved or sent; it is a playful self-check. Without JavaScript the
 * buttons do nothing and it reads as a plain list.
 */
export default function DocChecklist({ items, course, country }: { items: string[]; course: string; country?: string }) {
  const [have, setHave] = useState<Set<number>>(new Set());
  const done = have.size;
  const all = done === items.length && items.length > 0;
  const toggle = (i: number) => setHave((h) => {
    const next = new Set(h);
    if (next.has(i)) next.delete(i); else next.add(i);
    return next;
  });

  return (
    <div className="mt-8 rounded-xl bg-paper-dark/50 p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold"><FileText className="size-5 text-accent" />Requirements</h3>
          <p className="mt-1 text-sm text-slate-500">Tick what you already have, to see how ready your file is.</p>
        </div>
        <p aria-live="polite" className="tag text-accent">{done} of {items.length} ready</p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white" aria-hidden>
        <div className="h-full rounded-full bg-gradient-to-r from-accent to-sky transition-[width] duration-500 ease-out"
             style={{ width: `${items.length ? (done / items.length) * 100 : 0}%` }} />
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((r, i) => {
          const on = have.has(i);
          return (
            <li key={r}>
              <button type="button" onClick={() => toggle(i)} aria-pressed={on}
                      className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium shadow-sm transition duration-300 active:scale-[0.98] ${on ? "bg-accent text-white shadow-accent/20" : "bg-white text-slate-700 hover:-translate-y-0.5 hover:shadow-md"}`}>
                <span className={`flex size-6 shrink-0 items-center justify-center rounded-md border-2 transition duration-300 ${on ? "scale-110 border-white bg-white text-accent" : "border-line text-transparent group-hover:border-accent"}`}>
                  <Check className="size-4" strokeWidth={3} />
                </span>
                <span>{r}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {all ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-ink p-4 text-white" style={{ animation: "rise .4s ease-out" }}>
          <p className="flex items-center gap-2 font-semibold"><PartyPopper className="size-5 text-sun" />Your file looks ready. Let us check it.</p>
          <Link href={enquire(`File check: ${course}`, country)} className="inline-flex items-center gap-1.5 rounded-full bg-sun px-4 py-2 text-sm font-semibold text-ink transition hover:bg-white">
            Book a file check <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : done > 0 ? (
        <p className="mt-4 text-sm text-slate-600">
          {items.length - done} to go. Missing something? <Link href={enquire(course, country)} className="font-semibold text-accent hover:underline">Ask us what to do</Link>.
        </p>
      ) : null}
    </div>
  );
}
