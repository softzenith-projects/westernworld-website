import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Check, ChevronRight, Clock, ExternalLink, FileText, Headphones, Laptop,
  MonitorCheck, Phone, Plane, Stamp, type LucideIcon,
} from "lucide-react";
import CardGrid from "@/components/CardGrid";
import EnquiryForm from "@/components/EnquiryForm";
import { StudyScene } from "@/components/Illustrations";
import PhotoWall from "@/components/PhotoWall";
import type { Package, TestSection } from "@/content/copy";
import { TESTS, testAt, type Test } from "@/content/services";
import { BRANCHES, SITE, enquire, tel } from "@/lib/site";

/** Page title band with breadcrumb, used on every inner page. */
export function PageHero({ title, crumbs = [], subtitle, image = "/images/banner8.jpg", label }: {
  title: string;
  crumbs?: { label: string; href?: string }[];
  subtitle?: ReactNode;
  image?: string;
  /** Small mono line above the title, e.g. "Leg 02 · Prepare". */
  label?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-dark">
      <Image src={image} alt="" fill priority className="object-cover opacity-20 mix-blend-luminosity" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/95 to-brand-dark/50" />
      <div className="map-grid absolute inset-0 opacity-30 [filter:invert(1)]" aria-hidden />
      <HeroFlight />
      <div className="relative mx-auto max-w-7xl px-4 py-14 lg:py-20">
        <nav aria-label="Breadcrumb" className="tag mb-5 flex flex-wrap items-center gap-1 text-white/50">
          <Link href="/" className="hover:text-white">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1">
              <ChevronRight className="size-3" />
              {c.href ? <Link href={c.href} className="hover:text-white">{c.label}</Link> : <span className="text-white/80">{c.label}</span>}
            </span>
          ))}
        </nav>
        {label && <p className="hero-rise tag mb-3 text-sun">{label}</p>}
        <h1 className="hero-rise max-w-4xl text-4xl leading-[1.02] font-semibold text-white sm:text-6xl">{title}</h1>
        {subtitle && <p className="hero-rise-2 mt-5 max-w-2xl text-lg leading-relaxed text-white/70">{subtitle}</p>}
      </div>
    </section>
  );
}

/**
 * Decoration on the right of every page hero (large screens): a plane flies a dashed arc (CSS offset-path; browsers
 * without it just show the arc) past a slowly turning "WWVS" passport stamp. Off under reduced motion.
 */
function HeroFlight() {
  const arc = "M10 150 C 120 20, 300 10, 430 110";
  return (
    <div aria-hidden className="pointer-events-none absolute top-1/2 right-[4%] hidden h-44 w-[440px] -translate-y-1/2 lg:block">
      <svg viewBox="0 0 440 180" className="absolute inset-0 h-full w-full">
        <path d={arc} fill="none" stroke="white" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="5 9" />
        <circle cx="10" cy="150" r="5" fill="#a9d8ff" />
        <circle cx="430" cy="110" r="5" fill="none" stroke="#a9d8ff" strokeWidth="2" />
      </svg>
      <span className="fly-arc absolute top-0 left-0 text-sun" style={{ offsetPath: `path("${arc}")` }}>
        <Plane className="size-6" fill="currentColor" strokeWidth={1.25} />
      </span>
      <svg viewBox="0 0 120 120" className="turn-slow absolute -top-6 right-6 size-28 text-white/15">
        <defs><path id="hero-stamp-arc" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" /></defs>
        <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="60" cy="60" r="34" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text fontSize="11" letterSpacing="3" fill="currentColor" style={{ fontFamily: "var(--ff-mono)" }}>
          <textPath href="#hero-stamp-arc">WESTERN WORLD · ROHTAK · </textPath>
        </text>
        <text x="60" y="65" textAnchor="middle" fontSize="13" fontWeight="600" fill="currentColor" style={{ fontFamily: "var(--ff-mono)" }}>WWVS</text>
      </svg>
    </div>
  );
}

export function SectionTitle({ eyebrow, title, intro, center = false, light = false }: {
  eyebrow?: string; title: ReactNode; intro?: ReactNode; center?: boolean; light?: boolean;
}) {
  return (
    <div className={`reveal mb-10 lg:mb-14 ${center ? "mx-auto max-w-2xl text-center" : "max-w-3xl"}`}>
      {eyebrow && (
        <p className={`tag mb-3 flex items-center gap-2 ${center ? "justify-center" : ""} ${light ? "text-sun" : "text-accent"}`}>
          <span className="inline-block h-px w-6 bg-current" />{eyebrow}
        </p>
      )}
      <h2 className={`text-3xl leading-[1.05] font-semibold sm:text-5xl ${light ? "text-white" : ""}`}>{title}</h2>
      {intro && <p className={`mt-4 text-lg leading-relaxed ${light ? "text-white/70" : "text-slate-600"}`}>{intro}</p>}
    </div>
  );
}

export function Section({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`scroll-mt-28 py-16 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4">{children}</div>
    </section>
  );
}

/** Course packages styled as tickets; "Book Now" goes to the enquiry form, pre-filled with the package. */
export function Packages({ packages }: { packages: Package[] }) {
  return (
    <CardGrid className="grid gap-6 md:grid-cols-3">
      {packages.map((p, i) => (
        <li key={p.name} style={{ "--i": i } as CSSProperties}>
        <article data-spot
                 className={`group relative flex h-full flex-col overflow-hidden rounded-xl border bg-white transition duration-300 hover:-translate-y-1.5 hover:rotate-[-0.6deg] hover:shadow-2xl hover:shadow-brand-dark/10 ${i === 1 ? "border-ink" : "border-line hover:border-accent"}`}>
          <span aria-hidden className="spot-glow pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100" />
          {i === 1 && (
            <span className="tag absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-sun px-2.5 py-1 text-ink shadow">
              <span className="size-1.5 animate-ping rounded-full bg-accent" />Most chosen
            </span>
          )}
          {p.image && (
            <div className="relative h-40 overflow-hidden">
              <Image src={p.image} alt={p.name} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 768px) 33vw, 100vw" />
            </div>
          )}
          <div className="flex flex-1 flex-col p-6">
            <span className="tag text-accent">{p.weeksLabel}</span>
            <h3 className="mt-2 text-xl font-semibold">{p.name}</h3>
            {p.price && <p className="mt-2 font-display text-3xl font-semibold text-ink">{p.price}</p>}
            <p className="mt-2 flex-1 text-sm text-slate-600">{p.description}</p>
            <dl className="relative mt-5 grid grid-cols-2 border-y border-dashed border-line py-4 text-sm">
              {/* Ticket notches */}
              <span aria-hidden className="absolute top-1/2 -left-9 size-6 -translate-y-1/2 rounded-full border border-line bg-paper" />
              <span aria-hidden className="absolute top-1/2 -right-9 size-6 -translate-y-1/2 rounded-full border border-line bg-paper" />
              <div><dt className="tag flex items-center gap-1 text-slate-400"><CalendarDays className="size-3" />Duration</dt><dd className="mt-1 font-semibold text-ink">{p.duration}</dd></div>
              <div><dt className="tag flex items-center gap-1 text-slate-400"><Clock className="size-3" />Training</dt><dd className="mt-1 font-semibold text-ink">{p.training}</dd></div>
            </dl>
            <Link href={enquire(p.name)}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition group-hover:bg-accent">
              Book Now <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </article>
        </li>
      ))}
    </CardGrid>
  );
}

/** "What is the IELTS … test like?" — four sections and scoring. */
export function TestDetails({ test }: {
  test: { title: string; question: string; intro: string; sections: TestSection[]; scores: string };
}) {
  return (
    <div>
      <h3 className="text-3xl font-semibold">{test.title}</h3>
      <p className="mt-2 font-semibold text-brand">{test.question}</p>
      <p className="mt-2 text-slate-600">{test.intro}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {test.sections.map((s, n) => (
          <div key={s.name} style={{ "--i": n } as CSSProperties}
               className="reveal group rounded-xl border border-line bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl hover:shadow-brand-dark/5">
            <h4 className="flex items-center gap-2 text-lg font-semibold">
              <span className="flex size-7 items-center justify-center rounded-lg bg-paper font-mono text-xs text-accent transition group-hover:bg-accent group-hover:text-white">{n + 1}</span>
              {s.name}
            </h4>
            {s.summary && <p className="tag mt-1 text-accent">{s.summary}</p>}
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {s.points.map((p) => (
                <li key={p} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-slate-300 transition group-hover:text-accent" />{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-ink p-5 text-white">
        <h4 className="tag text-sun">Level and scores</h4>
        <p className="mt-2 text-sm text-white/80">{test.scores}</p>
      </div>
    </div>
  );
}

/** An icon per English test (sample test cards). */
const TEST_ICONS: Record<string, LucideIcon> = {
  "IELTS Academic": BookOpen, "IELTS General": FileText, "UKVI IELTS": Stamp, "PTE Academic": Laptop, "TOEFL iBT": Headphones,
  "Duolingo English Test": MonitorCheck,
};

/** The official free sample test for one English test (opens the test maker's site in a new tab). */
function SampleLink({ test }: { test: Test }) {
  return (
    <a href={test.practice.url} target="_blank" rel="noopener noreferrer"
       className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition hover:text-ink">
      Free sample test <ExternalLink className="size-3.5" />
      <span className="sr-only">: {test.practice.label}, on {test.practice.by} (opens in a new tab)</span>
    </a>
  );
}

/**
 * Every English test as a card: our course page, plus the official free sample test (owner, 5 Nov 2026: "sample
 * tests, IELTS / TOEFL links to cover courses"), and a free trial class with us (as offered in the home FAQ).
 */
export function SampleTests() {
  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TESTS.map((t, n) => {
          const Icon = TEST_ICONS[t.name] ?? BookOpen;
          return (
            <li key={t.name} style={{ "--i": n % 3 } as CSSProperties} className="reveal group relative flex flex-col rounded-xl border border-line bg-white p-5 transition hover:-translate-y-1 hover:border-accent hover:shadow-xl hover:shadow-brand-dark/10">
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-12 items-center justify-center rounded-xl bg-paper text-accent transition duration-300 group-hover:rotate-[-6deg] group-hover:bg-accent group-hover:text-white">
                  <Icon className="size-6" strokeWidth={1.75} />
                </span>
                <span className="tag rounded-full bg-paper px-2 py-1 text-slate-500">{t.practice.by}</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold">{t.name}</h3>
              <p className="text-sm text-slate-500">{t.note}</p>
              <div className="mt-5 flex flex-1 flex-wrap items-end justify-between gap-3 border-t border-dashed border-line pt-4">
                <Link href={t.href} className="inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-accent">
                  Our course <ArrowRight className="size-4" />
                </Link>
                <SampleLink test={t} />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600">
        Tried a sample? Bring your questions to a free trial class and see how our trainers teach.
        <Link href={enquire("Trial class")} className="inline-flex items-center gap-1 font-semibold text-accent hover:underline">
          Book a free trial class <ArrowRight className="size-4" />
        </Link>
      </p>
    </div>
  );
}

/** "Try a free sample test" band on a course page, for the tests whose pages are `tests` (hrefs in TESTS). */
export function PracticeBand({ tests, course }: { tests: string[]; course: string }) {
  const list = tests.map(testAt).filter((t): t is Test => !!t);
  if (list.length === 0) return null;
  return (
    <section className="px-4 py-10">
      <div className="relative mx-auto grid max-w-7xl gap-6 overflow-hidden rounded-2xl bg-ink p-8 text-white lg:grid-cols-[13rem_1fr_auto] lg:items-center lg:p-10">
        <div className="map-grid absolute inset-0 opacity-30 [filter:invert(1)]" aria-hidden />
        <StudyScene className="relative hidden lg:block" />
        <div className="relative">
          <p className="tag text-sun">Try before you train</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">See where you stand before you start.</h2>
          <p className="mt-2 max-w-xl text-white/70">
            Try the official free sample questions from the people who make the test. Then book a free trial class: a trainer
            looks at where you are and the score you need, and plans your course from there.
          </p>
        </div>
        <div className="relative flex flex-col gap-3 sm:flex-row lg:flex-col">
          {list.map((t) => (
            <a key={t.name} href={t.practice.url} target="_blank" rel="noopener noreferrer"
               className="group flex items-center justify-between gap-4 rounded-xl bg-white/10 px-5 py-3.5 ring-1 ring-white/15 transition hover:bg-white hover:text-ink">
              <span>
                <span className="block font-semibold">{t.practice.label}</span>
                <span className="tag text-white/50 group-hover:text-slate-500">Free · {t.practice.by}</span>
              </span>
              <ExternalLink className="size-4 shrink-0 text-sun group-hover:text-accent" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
          <Link href={enquire(`Trial class (${course})`)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-ink">
            Book a free trial class <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Student photo wall. */
export function Gallery({ images, title = "IELTS Students", intro }: { images: string[]; title?: string; intro?: string }) {
  if (images.length === 0) return null;
  // Visa handover photos fill their tile; scorecards and posters are shown whole so the text stays readable.
  const photos = images.some((s) => s.includes("/ieltsstu/ielts") || s.startsWith("/wins/"));
  return (
    <Section className="bg-paper-dark/60">
      <SectionTitle eyebrow="Our results" title={title} intro={intro} center />
      <PhotoWall images={images} alt="Western World Visa Services student" fit={photos ? "cover" : "contain"} limit={12} />
    </Section>
  );
}

/** Sticky side form used on content pages ("Request call back"). */
export function CallbackCard({ source, course, country, title = "Request call back" }: {
  source: string; course?: string; country?: string; title?: string;
}) {
  return (
    <aside className="overflow-hidden rounded-xl bg-ink shadow-2xl shadow-brand-dark/20 lg:sticky lg:top-32 lg:self-start">
      <div className="flex items-center justify-between bg-accent px-6 py-2.5">
        <span className="tag text-white">Free · No obligation</span>
        <span className="barcode h-4 w-16 text-white/60" aria-hidden />
      </div>
      <div className="p-6">
        <EnquiryForm dark title={title} subtitle="Leave your details and our counsellor will call you." source={source}
                     country={country} defaults={{ message: course ? `I am interested in ${course}.` : undefined }} />
        <div className="mt-5 border-t border-dashed border-white/15 pt-4 text-sm text-white/80">
          <p className="tag mb-2 text-white/50">Prefer to call?</p>
          {SITE.phones.map((p) => (
            <a key={p} href={tel(p)} className="flex items-center gap-2 py-0.5 hover:text-white"><Phone className="size-4" />{p}</a>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function CtaBand({ title = "Ready to start your journey abroad?", text = "Talk to our counsellors today. Someone from our team will get in touch with you.", course }: {
  title?: string; text?: string; course?: string;
}) {
  return (
    <section className="px-4 py-12">
      <div className="group reveal relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl bg-accent px-8 py-10 md:flex-row md:items-center lg:px-12">
        <svg aria-hidden viewBox="0 0 600 160" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
          <path d="M-10 140 C 160 40, 380 170, 610 30" fill="none" stroke="white" strokeOpacity="0.18" strokeWidth="2" strokeDasharray="6 10" />
        </svg>
        <span className="drift pointer-events-none absolute -right-4 -bottom-14 font-display text-[11rem] leading-none font-bold text-white/10 transition duration-700 select-none group-hover:-translate-y-6 group-hover:text-white/20" aria-hidden>✈</span>
        <div className="relative">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
          <p className="mt-2 text-white/85">{text}</p>
        </div>
        <div className="relative flex flex-wrap gap-3">
          <Link href={enquire(course)} className="inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-accent transition hover:bg-ink hover:text-white">
            Enquire now <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <a href={tel(SITE.phones[0])} className="rounded-full border-2 border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Call {SITE.phones[0]}</a>
        </div>
      </div>
    </section>
  );
}

export function Feature({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="reveal group h-full rounded-xl border border-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl hover:shadow-brand-dark/5">
      <div className="mb-5 flex size-11 items-center justify-center rounded-full bg-ink text-white transition duration-300 group-hover:rotate-[-10deg] group-hover:scale-110 group-hover:bg-accent [&_svg]:size-5">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-slate-600">{children}</div>
    </div>
  );
}

/** Offices with a street address in full; branches still waiting for theirs are listed by town. */
export function BranchList() {
  const listed = BRANCHES.filter((b) => b.address);
  const towns = BRANCHES.filter((b) => !b.address);
  return (
    <div>
      <ul className="space-y-4">
        {listed.map((b) => (
          <li key={b.name}>
            <p className="flex flex-wrap items-center gap-2 font-semibold text-ink">
              {b.name}, {b.area}
              {b.head && <span className="tag rounded bg-brand-light px-1.5 py-0.5 text-brand">Head office</span>}
            </p>
            <p className="mt-1 text-sm text-slate-600">{b.address}</p>
          </li>
        ))}
      </ul>
      {towns.length > 0 && (
        <div className="mt-4 border-t border-dashed border-line pt-4">
          <p className="tag text-slate-500">Branches</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {towns.map((b) => (
              <li key={b.name} className="rounded-full bg-paper px-3 py-1 text-sm font-medium text-ink ring-1 ring-line">{b.name}, {b.area}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            Call <a href={tel(SITE.phones[0])} className="font-medium text-ink hover:text-accent">{SITE.phones[0]}</a> for directions to a branch.
          </p>
        </div>
      )}
    </div>
  );
}
