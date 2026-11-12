"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import SocialIcons from "@/components/SocialIcons";
import { LEGS, serviceHref } from "@/content/services";
import { NAV, SITE, enquire, tel, type NavItem } from "@/lib/site";

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  // Dropdowns open on hover/focus (CSS). After a click the page changes without a reload, so the pointer and focus are
  // still on the menu: keep it closed until the pointer leaves.
  const [closed, setClosed] = useState<string | null>(null);
  // Close the mobile menu whenever the page changes, including Back/Forward (links close it themselves).
  const [shownPath, setShownPath] = useState(path);
  if (path !== shownPath) {
    setShownPath(path);
    setOpen(false);
    setExpanded(null);
  }
  const active = (item: NavItem) =>
    path === item.href || (item.href !== "/" && path.startsWith(item.href)) || !!item.children?.some((c) => path === c.href);

  // Lock the page behind the mobile menu while it is open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    // Sticky with the announcement bar: the wrapper in app/layout.tsx. Address, email and socials live in the footer
    // and on the contact page; the header keeps one call button (owner, 5 Oct 2026).
    <header className="relative">

      <div className="border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="shrink-0">
            <Image src="/images/logo.svg" alt={SITE.legalName} width={1866} height={1988} priority className="h-14 w-auto sm:h-16" />
          </Link>

          <nav aria-label="Main" className="hidden items-center xl:flex">
            {NAV.map((item) => (
              <div key={item.label} className={`group ${item.label === "Services" ? "" : "relative"}`}
                   data-closed={closed === item.label || undefined}
                   onMouseLeave={() => setClosed(null)}
                   onClick={(e) => {
                     if (!(e.target as HTMLElement).closest("a")) return;
                     (document.activeElement as HTMLElement | null)?.blur();
                     setClosed(item.label);
                   }}>
                <Link href={item.href}
                      className={`relative flex items-center gap-1 px-3 py-2 text-[15px] font-medium whitespace-nowrap transition hover:text-accent ${active(item) ? "text-accent" : "text-ink"}`}>
                  {item.label}
                  {(item.children || item.label === "Services") && <ChevronDown className="size-3.5 opacity-60 transition group-hover:rotate-180 group-data-closed:rotate-0" />}
                </Link>
                {item.label === "Services" ? <ServicesMenu /> : item.children && (
                  <div className="invisible absolute top-full left-0 z-50 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 group-data-closed:invisible! group-data-closed:opacity-0!">
                    <ul className="w-64 rounded-lg border border-line bg-white p-1.5 shadow-2xl shadow-brand-dark/10">
                      {item.children.map((c) => (
                        <li key={c.label}>
                          <Link href={c.href} className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-paper hover:text-brand">{c.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 whitespace-nowrap">
            <a href={tel(SITE.phones[0])} aria-label={`Call ${SITE.phones[0]}`}
               className="flex items-center gap-2 rounded-full border border-ink/15 p-2.5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent 2xl:px-4">
              <Phone className="size-4" /><span className="hidden 2xl:inline">{SITE.phones[0]}</span>
            </a>
            <Link href={enquire("Free counselling")}
                  className="hidden items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent sm:inline-flex">
              Free counselling <ArrowUpRight className="size-4" />
            </Link>
            <button className="rounded-md p-2 text-ink xl:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {open && (
          <nav aria-label="Mobile" onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)} className="h-[calc(100dvh-8rem)] overflow-y-auto border-t border-line bg-paper px-4 pb-24 xl:hidden">
            {NAV.map((item) => {
              const children = item.label === "Services"
                ? LEGS.flatMap((l) => l.services.map((s) => ({ label: s.name, href: serviceHref(s) })))
                : item.children;
              return (
                <div key={item.label} className="border-b border-line">
                  <div className="flex items-center justify-between">
                    <Link href={item.href} className="py-3.5 font-display text-lg font-semibold text-ink">{item.label}</Link>
                    {children && (
                      <button className="p-2" aria-label={`Show ${item.label}`} aria-expanded={expanded === item.label}
                              onClick={() => setExpanded(expanded === item.label ? null : item.label)}>
                        <ChevronDown className={`size-5 transition ${expanded === item.label ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>
                  {children && expanded === item.label && (
                    <ul className="mb-3 grid grid-cols-2 gap-1.5">
                      {children.map((c) => (
                        <li key={c.label}>
                          <Link href={c.href} className="block h-full rounded-md bg-white px-3 py-2.5 text-sm text-slate-700">{c.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
            <Link href={enquire("Free counselling")} className="mt-6 flex justify-center rounded-full bg-accent px-5 py-3.5 font-semibold text-white">
              Book free counselling
            </Link>
            <div className="mt-6 space-y-2 text-sm text-slate-600">
              <a href={tel(SITE.phones[0])} className="flex items-center gap-2"><Phone className="size-4 text-accent" />{SITE.phones[0]}</a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 break-all"><Mail className="size-4 text-accent" />{SITE.email}</a>
              <SocialIcons className="pt-2 [&_a]:bg-ink/5 [&_a]:text-ink [&_a:hover]:bg-ink [&_a:hover]:text-white" />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

/** Every service, grouped by journey leg. */
function ServicesMenu() {
  return (
    <div className="invisible absolute inset-x-0 top-full z-50 pt-1 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 group-data-closed:invisible! group-data-closed:opacity-0!">
      <div className="mx-auto max-w-7xl px-4">
        <div className="overflow-hidden rounded-xl border border-line bg-white shadow-2xl shadow-brand-dark/15">
          <div className="grid grid-cols-4 gap-px bg-line">
            {LEGS.map((leg) => (
              <div key={leg.id} className="bg-white p-5">
                <p className="tag text-accent">{leg.label}</p>
                <p className="mt-1 font-display text-xl font-semibold text-ink">{leg.title}</p>
                <ul className="mt-3 space-y-0.5">
                  {leg.services.map((s) => (
                    <li key={s.slug}>
                      <Link href={serviceHref(s)} className="group/item -mx-2 block rounded-md px-2 py-1.5 hover:bg-paper">
                        <span className="text-sm font-semibold text-ink group-hover/item:text-accent">{s.name}</span>
                        <span className="block text-xs leading-snug text-slate-500">{s.short}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-line bg-paper px-5 py-3">
            <p className="text-sm text-slate-600">Not sure what you need? Counselling is free.</p>
            <Link href="/services" className="tag inline-flex items-center gap-1 text-ink hover:text-accent">
              All services <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
