import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, Mail, MapPin, Phone, Plane } from "lucide-react";
import SocialIcons from "@/components/SocialIcons";
import { LEGS, serviceHref } from "@/content/services";
import { BRANCHES, DESTINATIONS, FOOTER_LINKS, NAV, SITE, enquire, tel } from "@/lib/site";

export default function Footer() {
  const tests = NAV.find((n) => n.label === "Test prep")?.children ?? [];
  const col = "mb-4 tag text-white/45";
  const link = "text-sm text-white/75 transition hover:text-white";
  return (
    <footer className="relative overflow-hidden bg-brand-dark text-white/75">
      <div className="map-grid absolute inset-0 opacity-40 [filter:invert(1)]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 py-14 md:flex-row md:items-end">
          <p className="max-w-3xl font-display text-4xl leading-[1.05] font-semibold text-white sm:text-6xl">
            Your seat abroad is waiting. <span className="text-sky">Let&rsquo;s book it.</span>
          </p>
          <Link href={enquire("Free counselling")}
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-white transition hover:bg-white hover:text-accent">
            Book free counselling <ArrowUpRight className="size-5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="space-y-5">
            <div className="inline-block rounded-md bg-white px-3 py-2">
              <Image src="/images/logo.svg" alt={SITE.legalName} width={1866} height={1988} className="h-24 w-auto" />
            </div>
            <p className="max-w-xs text-sm leading-relaxed">{SITE.footerAbout}</p>
            <ul className="space-y-2.5 text-sm">
              <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-accent" />{SITE.address}</li>
              <li className="flex gap-3">
                <Building2 className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>Branches: {BRANCHES.filter((b) => !b.head).map((b) => b.name).join(" · ")}</span>
              </li>
              {SITE.phones.map((p) => (
                <li key={p}><a href={tel(p)} className="flex gap-3 hover:text-white"><Phone className="size-4 shrink-0 text-accent" />{p}</a></li>
              ))}
              <li><a href={`mailto:${SITE.email}`} className="flex gap-3 break-all hover:text-white"><Mail className="size-4 shrink-0 text-accent" />{SITE.email}</a></li>
            </ul>
            <SocialIcons />
          </div>

          <div>
            <h4 className={col}>Services</h4>
            <ul className="space-y-2">
              {LEGS.flatMap((l) => l.services).map((s) => <li key={s.slug}><Link href={serviceHref(s)} className={link}>{s.name}</Link></li>)}
            </ul>
          </div>

          <div>
            <h4 className={col}>Destinations</h4>
            <ul className="space-y-2">
              {DESTINATIONS.map((d) => (
                <li key={d.slug}>
                  <Link href={`/study-in/${d.slug}`} className={`${link} group flex items-baseline gap-2`}>
                    <span className="font-mono text-[11px] text-sky transition group-hover:text-white">{d.code}</span>
                    <span className="transition group-hover:translate-x-1">Study in {d.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className={`${col} mt-8`}>Test prep</h4>
            <ul className="space-y-2">
              {tests.map((t) => <li key={t.label}><Link href={t.href} className={link}>{t.label}</Link></li>)}
            </ul>
          </div>

          <div>
            <h4 className={col}>Company</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((l) => <li key={l.label}><Link href={l.href} className={link}>{l.label}</Link></li>)}
              <li><Link href="/visa-assistance" className={link}>Visa Assistance</Link></li>
              <li><a href={SITE.webmail} target="_blank" rel="noopener noreferrer" className={link}>Webmail Login</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 px-4 py-5 text-xs text-white/45">
          <p>© 2021 {SITE.legalName} All Rights Reserved.</p>
          <p className="tag">DEL · ROH → {DESTINATIONS.map((d) => d.code).join(" · ")}</p>
          <a href="#main" className="group tag inline-flex items-center gap-2 text-white/60 transition hover:text-white">
            Fly back to top
            <span className="flex size-7 items-center justify-center rounded-full bg-white/10 transition duration-500 group-hover:-translate-y-1 group-hover:bg-accent">
              <Plane className="size-3.5 -rotate-45 transition duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
