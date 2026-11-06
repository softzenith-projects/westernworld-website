import CountUp from "@/components/CountUp";
import { STATS } from "@/content/stats";

/**
 * The owner's four numbers (content/stats.ts) as a navy strip; numbers count up when scrolled into view.
 * Home: at the bottom of the hero, the only place the numbers appear on that page (owner, 6 Nov 2026).
 */
export function NumbersStrip({ className = "" }: { className?: string }) {
  return (
    <dl className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 lg:grid-cols-4 ${className}`}>
      {STATS.map(({ n, label, line, icon: Icon }) => (
        <div key={label} className="group flex min-w-0 flex-col bg-brand-dark p-4 transition hover:bg-brand sm:p-6">
          <dt className="order-2">
            <span className="tag block text-sun">{label}</span>
            <span className="mt-1 block text-sm text-white/60">{line}</span>
          </dt>
          <dd className="order-1 mb-3 flex flex-col items-start gap-3 text-white">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sun transition duration-300 group-hover:scale-110 group-hover:rotate-[-8deg] group-hover:bg-accent group-hover:text-white">
              <Icon className="size-5" />
            </span>
            <span className="font-display text-[1.65rem] leading-none font-semibold min-[400px]:text-[2rem] sm:text-5xl lg:text-[2.6rem] xl:text-5xl">{n ? <CountUp to={n} suffix="+" /> : "Countless"}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** "5,000+ students got their study visa with us": the numbers as a full navy band with a heading (about page). */
export default function NumbersBand({ title = <>5,000+ students got their study visa with us. <span className="text-sun">Yours could be next.</span></> }: { title?: React.ReactNode }) {
  return (
    <section aria-labelledby="numbers-title" className="relative overflow-hidden bg-brand-dark py-14 text-white lg:py-16">
      <div className="map-grid absolute inset-0 opacity-30 [filter:invert(1)]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4">
        <h2 id="numbers-title" className="reveal max-w-3xl text-3xl leading-tight font-semibold text-white sm:text-4xl">{title}</h2>
        <NumbersStrip className="mt-10" />
      </div>
    </section>
  );
}
