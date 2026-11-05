import CountUp from "@/components/CountUp";
import { STATS } from "@/content/stats";

/** "4,000+ students got their study visa with us": the owner's numbers, counting up when scrolled into view. */
export default function NumbersBand({ title = <>4,000+ students got their study visa with us. <span className="text-sun">Yours could be next.</span></> }: { title?: React.ReactNode }) {
  return (
    <section aria-labelledby="numbers-title" className="relative overflow-hidden bg-brand-dark py-14 text-white lg:py-16">
      <div className="map-grid absolute inset-0 opacity-30 [filter:invert(1)]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4">
        <h2 id="numbers-title" className="reveal max-w-3xl text-3xl leading-tight font-semibold text-white sm:text-4xl">{title}</h2>
        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 lg:grid-cols-4">
          {STATS.map(({ n, label, line, icon: Icon }) => (
            <div key={label} className="group flex flex-col bg-brand-dark p-5 transition hover:bg-brand sm:p-6">
              <dt className="order-2">
                <span className="tag block text-sun">{label}</span>
                <span className="mt-1 block text-sm text-white/60">{line}</span>
              </dt>
              <dd className="order-1 mb-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sun transition duration-300 group-hover:scale-110 group-hover:rotate-[-8deg] group-hover:bg-accent group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <span className="font-display text-[2rem] leading-none font-semibold sm:text-5xl">{n ? <CountUp to={n} suffix="+" /> : "Countless"}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
