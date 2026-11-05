import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ClipboardList, ExternalLink, Info, MessageCircle, Rocket } from "lucide-react";
import { LegIcon, ServiceIcon } from "@/components/serviceIcons";
import WithCallback from "@/components/WithCallback";
import { CtaBand, PageHero } from "@/components/blocks";
import { SERVICES, TESTS, service as findService, serviceHref } from "@/content/services";

/** Services with their own page (the others link to an existing page, e.g. Visa Support & Filing → /visa-assistance). */
const OWN_PAGE = SERVICES.filter((s) => !s.href);

export const dynamicParams = false;

/** "How it works", the same three steps for every service. */
const HOW = [
  { title: "Tell us about you", text: "Fill in the form or call us. A counsellor calls you back.", icon: MessageCircle },
  { title: "Get a plan", text: "We look at your profile and agree what we will do, and by when.", icon: ClipboardList },
  { title: "We do the work with you", text: "You always know the status and the next step.", icon: Rocket },
];

export function generateStaticParams() {
  return OWN_PAGE.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const s = findService((await params).slug);
  return s ? { title: s.name, description: s.short } : {};
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const s = findService((await params).slug);
  if (!s || s.href) notFound();
  const related = s.leg.services.filter((x) => x.slug !== s.slug);
  const at = SERVICES.findIndex((x) => x.slug === s.slug);
  const prev = SERVICES[at - 1];
  const next = SERVICES[at + 1];
  const isTests = s.slug === "english-test-preparation";

  return (
    <>
      <PageHero title={s.name} label={`${s.leg.label} · ${s.leg.title} · Stop ${String(at + 1).padStart(2, "0")} of ${SERVICES.length}`} subtitle={s.short}
                crumbs={[{ label: "Services", href: "/services" }, { label: s.name }]} />
      <nav aria-label="Where this service sits on the journey" className="border-b border-line bg-white">
        <ol className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-3">
          {SERVICES.map((x, i) => (
            <li key={x.slug} className="flex items-center">
              {i > 0 && <span aria-hidden className={`h-0.5 w-3 sm:w-5 ${i <= at ? "bg-accent" : "bg-line"}`} />}
              <Link href={serviceHref(x)} title={x.name} aria-current={i === at ? "step" : undefined}
                    className={`group/stop relative flex shrink-0 items-center justify-center rounded-lg transition duration-300 ${i === at ? "size-9 bg-accent text-white shadow-lg shadow-accent/30" : i < at ? "size-7 bg-accent/10 text-accent hover:bg-accent hover:text-white" : "size-7 bg-paper text-slate-400 hover:bg-accent hover:text-white"}`}>
                <ServiceIcon slug={x.slug} className={i === at ? "size-4" : "size-3.5"} />
                <span className="sr-only">{x.name}</span>
              </Link>
            </li>
          ))}
        </ol>
      </nav>
      <WithCallback source={`Service: ${s.name}`} course={s.name}>
        <div className="reveal flex items-start gap-4">
          <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/25 sm:flex">
            <ServiceIcon slug={s.slug} className="size-7" strokeWidth={1.75} />
          </span>
          <p className="text-xl leading-relaxed text-ink">{s.intro}</p>
        </div>

        <h2 className="mt-12 text-3xl font-semibold">What you get</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {s.includes.map((x, i) => (
            <li key={x} style={{ "--i": i } as CSSProperties}
                className="reveal group flex gap-3 rounded-xl border border-line bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-accent hover:shadow-lg hover:shadow-brand-dark/5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-ink text-white transition duration-300 group-hover:scale-110 group-hover:bg-accent"><Check className="size-3.5" /></span>
              <span className="text-slate-700">{x}</span>
            </li>
          ))}
        </ul>

        {isTests && (
          <>
            <h2 className="mt-12 text-3xl font-semibold">Pick your test</h2>
            <ul className="mt-5 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
              {TESTS.map((t) => (
                <li key={t.name} className="flex h-full flex-col justify-between gap-3 bg-white p-5">
                  <Link href={t.href} className="group flex items-start justify-between gap-4">
                    <span><span className="block font-semibold text-ink group-hover:text-accent">{t.name}</span><span className="text-sm text-slate-500">{t.note}</span></span>
                    <ArrowUpRight className="size-5 shrink-0 text-slate-300 group-hover:text-accent" />
                  </Link>
                  <a href={t.practice.url} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-accent hover:text-ink">
                    Free sample test <ExternalLink className="size-3.5" />
                    <span className="sr-only">: {t.practice.label}, on {t.practice.by} (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
            <div id="duolingo" className="mt-8 scroll-mt-32 rounded-xl bg-ink p-6 text-white">
              <p className="tag text-sun">Duolingo English Test</p>
              <p className="mt-2 text-white/80">
                The Duolingo English Test is taken online from home and takes about an hour, with results usually within a
                few days. A growing number of universities accept it, but not all, and visa rules differ by country: we
                check that it is accepted for your course and visa before you book, then coach you on its question types
                with timed practice tests.
              </p>
            </div>
          </>
        )}

        {s.goodToKnow && (
          <p className="mt-8 flex gap-3 rounded-xl border border-sun bg-sun/10 p-4 text-sm text-ink">
            <Info className="size-5 shrink-0 text-ink/60" />{s.goodToKnow}
          </p>
        )}

        <h2 className="mt-12 text-3xl font-semibold">How it works</h2>
        <ol className="relative mt-5 grid gap-4 sm:grid-cols-3">
          <span aria-hidden className="absolute top-11 right-[16%] left-[16%] hidden border-t-2 border-dashed border-accent/30 sm:block" />
          {HOW.map(({ title, text, icon: Icon }, n) => (
            <li key={title} style={{ "--i": n } as CSSProperties}
                className="reveal group relative rounded-xl border border-dashed border-ink/20 bg-paper/60 p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-solid hover:border-accent hover:bg-white hover:shadow-lg">
              <span className="relative mx-auto flex size-12 items-center justify-center rounded-2xl bg-white text-accent shadow-md ring-4 ring-paper transition duration-300 group-hover:rotate-[-8deg] group-hover:bg-accent group-hover:text-white">
                <Icon className="size-6" />
                <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-ink font-mono text-[10px] text-white">{n + 1}</span>
              </span>
              <h3 className="mt-3 text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </li>
          ))}
        </ol>

        {related.length > 0 && (
          <>
            <h2 className="mt-12 text-3xl font-semibold">Also in {s.leg.title.toLowerCase()}</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={serviceHref(r)} className="group flex h-full items-center gap-4 rounded-xl border border-line bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-accent hover:shadow-lg">
                    <span className="journey-stop flex size-10 shrink-0 items-center justify-center rounded-xl bg-paper text-accent transition group-hover:bg-accent group-hover:text-white">
                      <ServiceIcon slug={r.slug} className="sign-icon size-5" />
                    </span>
                    <span className="flex-1"><span className="block font-semibold text-ink group-hover:text-accent">{r.name}</span><span className="text-sm text-slate-500">{r.short}</span></span>
                    <ArrowUpRight className="size-5 shrink-0 text-slate-300 group-hover:text-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
        <nav aria-label="Previous and next service" className="mt-12 grid gap-3 border-t border-dashed border-line pt-8 sm:grid-cols-2">
          {prev ? (
            <Link href={serviceHref(prev)} className="group flex min-w-0 items-center gap-3 rounded-xl border border-line bg-white p-4 transition hover:border-accent hover:shadow-lg">
              <ArrowLeft className="size-5 shrink-0 text-slate-300 transition group-hover:-translate-x-1 group-hover:text-accent" />
              <span className="min-w-0"><span className="tag block text-slate-400">Previous stop</span><span className="block truncate font-semibold text-ink group-hover:text-accent">{prev.name}</span></span>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={serviceHref(next)} className="group flex min-w-0 items-center justify-end gap-3 rounded-xl border border-line bg-white p-4 text-right transition hover:border-accent hover:shadow-lg">
              <span className="min-w-0"><span className="tag block text-slate-400">Next stop · {next.leg.title}</span><span className="block truncate font-semibold text-ink group-hover:text-accent">{next.name}</span></span>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-paper text-accent transition group-hover:bg-accent group-hover:text-white">
                <LegIcon id={next.leg.id} className="size-4" />
              </span>
              <ArrowRight className="size-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-accent" />
            </Link>
          ) : <span />}
        </nav>
      </WithCallback>
      <CtaBand title={`Talk to us about ${s.name.toLowerCase()}`} course={s.name} />
    </>
  );
}
