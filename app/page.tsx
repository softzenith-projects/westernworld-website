import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ArrowRight, ArrowUpRight, BadgeCheck, CalendarDays, ClipboardCheck, MapPin, PhoneCall, Plane, Plus, Route,
  ShieldCheck, Stethoscope, Target, Timer, UserRound, UsersRound, Zap,
} from "lucide-react";
import BoardingPass from "@/components/BoardingPass";
import Destinations from "@/components/Destinations";
import { DestinationChips } from "@/components/Flags";
import { NumbersStrip } from "@/components/NumbersBand";
import JourneyRoute from "@/components/JourneyRoute";
import NewsletterBox from "@/components/NewsletterBox";
import VideoStories from "@/components/VideoStories";
import { BranchList, Packages, SampleTests, Section, SectionTitle } from "@/components/blocks";
import { NewsSection } from "@/components/news";
import { HOME_PACKAGES } from "@/content/copy";
import { LEGS } from "@/content/services";
import { FEATURED_WINS, VISA_WINS, winAlt, type Country } from "@/content/testimonials";
import { BRANCHES, DESTINATIONS, SITE, enquire, tel } from "@/lib/site";

const FAQ = [
  ["What type of learning experience should I expect?",
    "The content will be a mix of interactive video lectures, reading material, practice quizzes and mock tests along with daily private sessions with your trainer."],
  ["Can I get a trial class to understand your teaching style?",
    "Yes, if you want a taste of what our online class experience is and how intense can it be. You can request for a free session with us."],
  ["How is this course different from other courses?", [
    "This course starts with a thorough diagnosis of your current English Language skills and IELTS Exam readiness assessment.",
    "This assessment is conducted/analysed by a senior trainer who defines a roadmap for you to get your desired band in 1 attempt.",
    "Based on the analysis of your strengths and weaknesses done by the senior trainer you are allotted multiple trainers who will work with on your areas for improvement.",
    "Your Senior Trainer evaluates your performance every week. Based on your progress, your Senior trainer, along with the other trainers, will customize your study plan for sustained improvement.",
    "After sufficient language improvement, you are directed to IELTS specific training",
    "In the end you are put on a rigorous mock test routine",
    "Once you start scoring your desired bands in our internal IELTS Mock Tests you are ready to pick an exam date",
  ]],
  ["How long are the personal training sessions?", "Each personal training session is of a total duration of 1 hour."],
] as const;

const COACHING = [
  ["Pre-training assessment", "This course starts with a thorough diagnosis of your current English Language skills and IELTS Exam readiness assessment."],
  ["Customized study plan", "Based on the assessment, the Senior Trainer creates a tailored study plan, specifically for you. From there on, multiple trainers regularly guide, evaluate and monitor your progress."],
  ["Mock tests & exam conditioning", "Throughout the program, you will give over 30 mock tests, and discuss and improve upon each one of them with your trainer so you are 100% exam ready on the day of the test."],
  ["3:1 faculty to student ratio", "You will always have multiple trainers collectively working on you to achieve your desired band, with daily private classes to learn key concepts and get your doubts answered."],
];

/** An icon per coaching stage (same order as COACHING). */
const COACHING_ICONS = [Stethoscope, Route, Timer, UsersRound];


/** The owner's search phrases (20 Oct 2026), each linked to the page that answers it. */
const LOCAL = [
  ["UK visa", "Student and visitor visas for the UK: documents, funds and the online form, checked before you apply.", "/visa-assistance#uk-visa"],
  ["Canada visa", "Study permits and visitor visas for Canada, with a file that tells one consistent story.", "/visa-assistance#canada-visa"],
  ["Europe visa", "Student and visitor visas for Germany, Finland, Ireland, Malta, Cyprus and more.", "/visa-assistance#europe-visa"],
  ["IELTS coaching in Rohtak", "IELTS Academic, General and UKVI, in class or online, with regular mock tests.", "/ielts-academy"],
  ["PTE coaching in Rohtak", "PTE Academic practice on the computer, the way the real test works.", "/pte"],
] as const;

/** "Welcome" text from the live site (westernworldvisaservices.com), lightly corrected. */
const WELCOME = [
  "WWVS helps clients with visa applications, requirements and processing. The requirement for a visa depends on the country the client wants to study in. Equipped with the latest information about student migration, our team helps clients through their student visa.",
  "We provide IELTS training too. Our main motive is to bridge the gap for all queries related to IELTS and overseas education.",
  "We provide educational avenues in international countries like the UK, Canada, USA, Germany, Europe, Australia and Singapore, along with coaching for IELTS General and Academic courses.",
  "We provide quality coaching to help students in the IELTS exam in all four sections. Students can enrol in both online and offline IELTS course preparation. We are a team of talented faculty and teachers, committed to quality IELTS training focused on the student’s dream of clearing the exam. Our facilities make learning effective and exciting for our students.",
];

/** The three service boxes from the live site's banner. */
const HIGHLIGHTS = [
  ["Career Counselling", "Western World Visa Services offers career counselling for the world’s most influential universities.", "/services/career-counselling"],
  ["Visa Support & Filing", "Western World Visa Services helps with the visa support and filing process for renowned universities.", "/visa-assistance"],
  ["IELTS | PTE Training", "Western World Visa Services started its journey with a clear vision to be a pioneer in the field of immigration and IELTS / PTE / CELPIP training.", "/services/english-test-preparation"],
] as const;

/** The hero, in the words of the owner's promo artwork (6 Nov 2026). */
const HERO_STEPS = [
  { Icon: Zap, text: "We confirm your enquiry straight away" },
  { Icon: UsersRound, text: "Someone from our team calls you back" },
  { Icon: ShieldCheck, text: "Your details are only used to answer your enquiry" },
];

/**
 * Student photos are shown in this one place on the home page (owner, 6 Nov 2026: "photos at only 1 place", like the
 * Figma reference): three students from FEATURED_WINS (content/testimonials.ts; reorder there to change who is shown).
 * Every photo, poster and scorecard is on /success-stories.
 */
const PROOF = FEATURED_WINS.slice(0, 3);
const COUNTRY_NAME: Record<Country, string> = { UK: "United Kingdom", Canada: "Canada", Germany: "Germany", Cyprus: "Cyprus" };

/** "Bahadurgarh, Rohini, Tohana or Dwarka" */
const OTHER_BRANCHES = BRANCHES.filter((b) => !b.head).map((b) => b.name).join(", ").replace(/, ([^,]*)$/, " or $1");

const serviceCount = LEGS.reduce((n, l) => n + l.services.length, 0);

/** "+91-7027022554" → "702 702 2554", as the promo prints it. */
const HERO_PHONE = SITE.phones[0].replace(/\D/g, "").slice(-10).replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");

export default function Home() {
  return (
    <>
      {/* ── Hero: the owner's promo (6 Nov 2026) as a page, sky background, no photos ── */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-white via-[#e4f1fe] to-[#8fcbfd]">
        <div className="absolute -top-24 left-1/3 -z-10 h-72 w-[36rem] rounded-full bg-white/70 blur-3xl" aria-hidden />
        <div className="absolute right-0 bottom-0 -z-10 h-80 w-[40rem] rounded-full bg-[#5fb4fb]/40 blur-3xl" aria-hidden />
        <div className="absolute top-10 left-[41%] hidden items-center lg:flex" aria-hidden>
          <span className="h-0.5 w-40 rounded-full bg-gradient-to-r from-transparent to-white" />
          <Plane className="size-12 rotate-[-8deg] fill-white text-brand" strokeWidth={1.25} />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-10 pb-8 lg:grid-cols-[1.15fr_1fr] lg:pt-14">
          <div>
            {/* Says what we do first (owner, 6 Nov: "Tell us how we can help" alone did not); the promo's line leads into the steps. */}
            <p className="inline-block rounded-full bg-white/80 px-3.5 py-1.5 text-[13px] font-semibold text-brand ring-1 ring-white sm:text-sm">
              <span className="mr-2 inline-block size-1.5 rounded-full bg-accent align-middle" aria-hidden />
              Study visa consultant · IELTS &amp; PTE coaching · Rohtak
            </p>
            <h1 className="mt-5 font-display text-[2.3rem] leading-[1.04] font-bold tracking-tight text-brand-dark sm:text-5xl lg:text-[2.9rem] xl:text-[3.6rem]">
              Study in the UK, Canada or Europe.{" "}
              <span className="relative text-accent sm:inline-block sm:whitespace-nowrap">
                We guide every step.
                <svg viewBox="0 0 300 14" className="absolute -bottom-3 left-[18%] hidden w-[80%] text-accent sm:block" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 11 C 90 1, 210 1, 298 6" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-snug text-slate-700 sm:text-xl">
              Career counselling, IELTS &amp; PTE coaching, university applications and your student visa, all from one
              team.
            </p>
            <p className="mt-6 font-display text-lg font-semibold text-brand-dark">
              Tell us how we can help. <span className="font-normal text-slate-600">It takes under a minute.</span>
            </p>
            <ul className="mt-4 grid max-w-md gap-3">
              {HERO_STEPS.map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-4 rounded-full bg-white/90 py-2 pr-6 pl-2 text-[15px] leading-snug font-medium text-brand-dark shadow-[0_10px_30px_-14px_rgb(14_22_69/0.45)] ring-1 ring-white sm:text-base">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-white"><Icon className="size-5" aria-hidden /></span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div id="counselling" className="relative scroll-mt-28 lg:pl-4">
            <DestinationChips className="mb-4 ml-auto w-full max-w-md sm:w-fit sm:gap-3" />
            {/* The site's map grid stays, behind the form only. */}
            <div className="relative isolate rounded-[2rem] bg-white/60 p-3 shadow-xl shadow-brand-dark/10 ring-1 ring-white sm:p-5">
              <div className="map-grid absolute inset-0 -z-10 rounded-[2rem]" aria-hidden />
              <BoardingPass />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-10">
          {/* The owner's numbers, once on this page (owner, 6 Nov 2026): the hero's foot, right under the form. */}
          <h2 className="sr-only">Our track record</h2>
          <NumbersStrip className="mb-5 shadow-xl shadow-brand-dark/20" />
          <div className="flex flex-col items-center gap-4 rounded-[2rem] bg-white/90 p-3 shadow-lg shadow-brand-dark/10 ring-1 ring-white sm:flex-row sm:justify-between sm:pl-8">
            <p className="flex items-center gap-3 text-center font-display text-xl font-semibold text-brand-dark italic sm:text-2xl">
              <CalendarDays className="size-8 shrink-0 text-brand" aria-hidden />
              <span>Plan your study abroad journey <span className="text-accent">today!</span></span>
            </p>
            <a href={tel(SITE.phones[0])} aria-label={`Call ${SITE.phones[0]}`}
               className="inline-flex items-center gap-3 rounded-full bg-brand-dark px-7 py-3 font-display text-2xl font-bold text-white transition hover:bg-brand sm:text-3xl">
              <PhoneCall className="size-6 sm:size-7" aria-hidden /> {HERO_PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* ── Real students, real visas: the one place on the home page with student photos ── */}
      <section id="wins" className="relative scroll-mt-24 border-t border-line bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle center eyebrow="Success stories" title={<>Real students.<br />Real visas.</>}
                        intro="Every face below is a Western World student who collected their visa at our office." />
          {/* Phones: a swipeable row (three tall cards stacked would fill three screens); tablets and up: three across. */}
          <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pt-4 pb-2 sm:mx-auto sm:grid sm:max-w-6xl sm:grid-cols-3 sm:items-start sm:gap-5 sm:overflow-visible sm:px-0 lg:gap-8">
            {PROOF.map((w, i) => (
              <li key={w.src} style={{ "--i": i } as CSSProperties} className={`reveal w-[78%] shrink-0 snap-center sm:w-auto ${i === 1 ? "sm:-mt-4" : ""}`}>
                <figure className="group relative overflow-hidden rounded-xl bg-paper shadow-lg shadow-brand-dark/10">
                  <div className="relative aspect-[4/5]">
                    <Image src={w.src} alt={winAlt(w)} fill quality={85} sizes="(min-width: 1280px) 540px, (min-width: 640px) 46vw, 115vw"
                           className="object-cover object-[50%_30%] transition duration-700 group-hover:scale-[1.03]" />
                  </div>
                  <figcaption className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-lg bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
                    <span className="min-w-0">
                      <span className="block font-semibold text-ink">{w.name}</span>
                      {w.country && <span className="block text-xs text-slate-500">{COUNTRY_NAME[w.country]}</span>}
                    </span>
                    <span className="tag inline-flex shrink-0 items-center gap-1 text-accent"><BadgeCheck className="size-4" aria-hidden />Visa approved</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center">
            <Link href="/success-stories" className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent">
              See all {VISA_WINS.length} students, posters and scorecards <ArrowRight className="size-4" aria-hidden />
            </Link>
          </p>
        </div>
      </section>

      {/* ── Video stories ───────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-dark py-16 lg:py-20">
        <div className="map-grid absolute inset-0 opacity-30 [filter:invert(1)]" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="tag text-sun">In their words</p>
              <h3 className="mt-2 text-3xl font-semibold text-white">Student video stories</h3>
            </div>
            <p className="max-w-sm text-sm text-white/60">Students talk about their journey, from the first counselling session to landing abroad.</p>
          </div>
          <VideoStories />
        </div>
      </section>

      {/* ── Welcome (the live site's own words) ─────────────── */}
      <Section id="welcome">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionTitle eyebrow="About us" title="Welcome to Western World Visa Services" />
            <div className="-mt-4 space-y-4 text-slate-600">
              {WELCOME.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
            </div>
          </div>
          <ul className="grid content-start gap-4">
            {HIGHLIGHTS.map(([title, text, href], n) => (
              <li key={title} className="reveal" style={{ "--i": n } as CSSProperties}>
                <Link href={href} className="group flex gap-5 rounded-xl border border-line bg-white p-6 transition duration-300 hover:translate-x-1 hover:border-accent hover:shadow-lg hover:shadow-brand-dark/5">
                  <span className="font-mono text-sm text-accent">0{n + 1}</span>
                  <span>
                    <span className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
                      {title}<ArrowUpRight className="size-4 text-slate-300 transition group-hover:text-accent" />
                    </span>
                    <span className="mt-1 block text-slate-600">{text}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── Services ticker ─────────────────────────────────── */}
      <div className="overflow-hidden border-y border-ink bg-ink py-3 text-white" aria-hidden>
        <div className="marquee flex w-max gap-8 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-8">
              {LEGS.flatMap((l) => l.services).map((s) => (
                <span key={s.slug} className="flex items-center gap-8 font-display text-lg font-medium">
                  {s.name}<span className="text-accent">✈</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── The route (all services) ────────────────────────── */}
      <Section id="route">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionTitle eyebrow="The route" title={<>Four legs. {serviceCount} stops.<br className="hidden sm:block" /> One counsellor who knows your file.</>} />
          <p className="max-w-sm text-slate-600 lg:mb-14">
            Most students juggle a coaching centre, an agent, a bank and a travel agent. With us it is one team that
            already knows your story, so nothing gets lost between steps.
          </p>
        </div>
        <JourneyRoute />
      </Section>

      {/* ── Destinations: city photo cards (kept from the Nov 2026 refresh, owner liked them) ── */}
      <Section id="destinations" className="bg-white">
        <div className="flex flex-col justify-between gap-x-10 md:flex-row md:items-end">
          <SectionTitle eyebrow="Global education" title="Where will you study next?"
                        intro={`Universities and colleges in ${DESTINATIONS.length} countries: courses, admissions, scholarships and the visa, handled by one team. Pick a destination to see its universities.`} />
          <Link href={enquire("Free counselling")}
                className="group mb-10 inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand transition hover:text-accent lg:mb-14">
            Not sure yet? Ask a counsellor <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
        <Destinations />
      </Section>

      {/* ── Test prep ───────────────────────────────────────── */}
      <Section id="test-prep" className="bg-white">
        <SectionTitle eyebrow="Test prep" title="Get the score. Then get the seat."
                      intro="Coaching for every major English test, online or in our classrooms. Try the official free sample test first, then a free trial class with us." />
        <SampleTests />

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h3 className="text-3xl font-semibold">How we are different</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                [<UserRound key="u" />, "One-to-one session", "Get trained by expert professionals at a personal level, in a safe and interactive environment to learn and grow. These personalised sessions can be planned flexibly and taken anywhere."],
                [<Target key="t" />, "Customized study plan for every student", "Students are trained on their strengths and weaknesses through a tailor-made study plan."],
                [<ClipboardCheck key="c" />, "Comprehensive mock test series", "Comprehensive mock tests after completion of every module."],
              ].map(([icon, title, text]) => (
                <div key={String(title)} className="reveal group flex gap-4 rounded-xl border border-line p-4 transition duration-300 hover:border-accent hover:shadow-lg hover:shadow-brand-dark/5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-paper text-ink transition duration-300 group-hover:rotate-[-10deg] group-hover:bg-accent group-hover:text-white [&_svg]:size-5">{icon}</span>
                  <span><span className="block font-semibold text-ink">{title}</span><span className="text-sm text-slate-600">{text}</span></span>
                </div>
              ))}
            </div>
          </div>
          <ol className="relative ml-2 space-y-0 border-l-2 border-dashed border-line pl-10">
            {COACHING.map(([title, text], n) => {
              const Icon = COACHING_ICONS[n];
              return (
                <li key={title} className="group relative pb-8 last:pb-0">
                  <span className="absolute top-0 -left-[3.85rem] flex size-11 items-center justify-center rounded-xl bg-accent text-white shadow-md ring-4 ring-white transition duration-300 group-hover:scale-110 group-hover:rotate-[-8deg] group-hover:bg-ink">
                    <Icon className="size-5" />
                    <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-sun font-mono text-[10px] text-ink">{n + 1}</span>
                  </span>
                  <h4 className="text-xl font-semibold transition group-hover:text-accent">{title}</h4>
                  <p className="mt-1 text-slate-600">{text}</p>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h3 className="text-3xl font-semibold">IELTS General packages</h3>
            <Link href="/online-courses" className="tag inline-flex items-center gap-1 text-accent hover:underline">Online course fees <ArrowUpRight className="size-3.5" /></Link>
          </div>
          <Packages packages={HOME_PACKAGES} />
        </div>
      </Section>

      {/* ── Why us (no photo here: student photos are shown once, above) ── */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <SectionTitle eyebrow="Why us?" title="We study every case before we take it on." />
          <div>
            <div className="space-y-4 text-slate-600">
              <p>
                With extreme hard work and transparency, Western World Visa Services has succeeded in developing its
                position as one of the leading education consultancies. We, at WWVS, have a team of passionate and
                experienced members who are dedicatedly working to realise the dreams of aspiring candidates.
              </p>
              <p>
                At WWVS, we consider it our professional concern to study and examine every case before actually
                representing the client, taking care of individuality and client preference. Being experienced experts,
                our team is always up to date with recent developments and updates. Our organisation takes immense pride
                in working closely with clients and meeting their every need, and we always keep our clients informed of
                the latest status of their cases.
              </p>
              <p>
                Providing the right study abroad solutions to students over the years, we have set the highest
                benchmarks in tune with global competencies.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Rohtak: the owner's search phrases, in words a student would use ── */}
      <Section id="rohtak" className="border-t border-line bg-white">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionTitle eyebrow="Rohtak · Delhi NCR" title="Your visa consultant in Rohtak" />
            <div className="-mt-4 space-y-4 text-slate-600">
              <p>
                Looking for a visa agent in Rohtak you can meet in person? Western World Visa Services is a visa
                consultant in Rohtak for UK visa, Canada visa and Europe visa applications, with IELTS coaching in
                Rohtak and PTE coaching in Rohtak under the same roof.
              </p>
              <p>
                One team handles your English test, your university applications and your visa file, so nothing gets
                lost between steps. Visit our head office in Rohtak or a branch in {OTHER_BRANCHES}.
              </p>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {LOCAL.map(([title, text, href], n) => (
              <li key={title} className="reveal" style={{ "--i": n % 2 } as CSSProperties}>
                <Link href={href} className="group flex h-full flex-col rounded-xl border border-line bg-paper p-5 transition duration-300 hover:-translate-y-1 hover:border-accent hover:bg-white hover:shadow-lg hover:shadow-brand-dark/5">
                  <span className="flex items-center justify-between gap-2 font-display text-lg font-semibold text-ink">
                    {title}<ArrowUpRight className="size-4 shrink-0 text-slate-300 transition group-hover:text-accent" />
                  </span>
                  <span className="mt-1 text-sm text-slate-600">{text}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href="#counselling" className="group flex h-full flex-col justify-between gap-3 rounded-xl bg-ink p-5 text-white transition hover:bg-accent">
                <span className="font-display text-lg font-semibold">Not sure which visa you need?</span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-sun group-hover:text-white">
                  Free counselling <ArrowRight className="size-4" />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </Section>

      {/* ── News & blogs ────────────────────────────────────── */}
      <Section id="news" className="border-t border-line">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionTitle eyebrow="News & blogs" title="Intakes, visa updates and guides" />
          <Link href="/blog" className="tag mb-10 inline-flex items-center gap-1 text-ink hover:text-accent lg:mb-14">
            All news & blogs <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        <NewsSection />
      </Section>

      {/* ── FAQ + office ────────────────────────────────────── */}
      <Section className="bg-white">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div>
            <SectionTitle eyebrow="FAQ" title="Questions students ask us" />
            <div className="divide-y divide-line border-y border-line">
              {FAQ.map(([q, a]) => (
                <details key={q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold text-ink">
                    {q}
                    <Plus className="size-5 shrink-0 text-accent transition group-open:rotate-45" />
                  </summary>
                  {typeof a === "string" ? <p className="mt-3 leading-relaxed text-slate-600">{a}</p> : (
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-slate-600">{a.map((x) => <li key={x}>{x}</li>)}</ul>
                  )}
                  {q.startsWith("Can I get a trial") && (
                    <Link href={enquire("Trial class")} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                      Click here to schedule a trial class <ArrowRight className="size-4" />
                    </Link>
                  )}
                </details>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <NewsletterBox />
            <div className="overflow-hidden rounded-xl border border-line">
              <div className="flex items-center justify-between bg-paper px-5 py-3">
                <span className="tag text-ink">Visit us</span>
                <MapPin className="size-4 text-accent" />
              </div>
              <div className="p-5">
                <BranchList />
                <Link href="/contact-us" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
                  Directions & contact <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
