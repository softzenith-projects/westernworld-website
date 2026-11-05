import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { ArrowRight, Clock, GraduationCap, MapPin, Plane } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";
import UniImage from "@/components/UniImage";
import { CtaBand, PageHero, Section } from "@/components/blocks";
import { countries, country as findCountry, universitiesOf } from "@/lib/content";
import { DESTINATIONS, enquire } from "@/lib/site";

export function generateStaticParams() {
  return countries.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/study-in/[country]">): Promise<Metadata> {
  const c = findCountry((await params).country);
  return { title: c ? `Study in ${c.name}` : "Study abroad" };
}

export default async function CountryPage({ params }: PageProps<"/study-in/[country]">) {
  const c = findCountry((await params).country);
  if (!c) notFound();
  const unis = universitiesOf(c);
  const dest = DESTINATIONS.find((d) => d.slug === c.slug);

  return (
    <>
      <PageHero title={`Study in ${c.name}`} crumbs={[{ label: "Global Education" }, { label: `Study in ${c.name}` }]}
                subtitle={unis.length > 0
                  ? `${unis.length} partner universit${unis.length === 1 ? "y" : "ies"} and colleges. Our counsellors help you choose, apply and get your visa.`
                  : `Planning to study in ${c.name}? Our counsellors will guide you on universities, admissions and the visa.`} />

      {/* Boarding strip: Delhi → the destination, a plane crossing the dashed line */}
      {dest && (
        <div className="mx-auto -mt-8 max-w-7xl px-4">
          <div className="relative flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl border border-line bg-white p-5 shadow-xl shadow-brand-dark/10 sm:p-6">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div>
                <p className="font-mono text-3xl font-semibold text-ink">DEL</p>
                <p className="tag text-slate-400">New Delhi</p>
              </div>
              <div className="relative h-8 min-w-24 flex-1" aria-hidden>
                <span className="absolute top-1/2 right-0 left-0 border-t-2 border-dashed border-accent/30" />
                <span className="fly-line absolute top-1/2 -translate-y-1/2 text-accent"><Plane className="size-6 rotate-45" fill="currentColor" strokeWidth={1.25} /></span>
              </div>
              <div className="text-right">
                <p className="font-mono text-3xl font-semibold text-accent">{dest.code}</p>
                <p className="tag text-slate-400">{dest.city}</p>
              </div>
            </div>
            <dl className="flex gap-6 text-sm">
              <div><dt className="tag flex items-center gap-1 text-slate-400"><Clock className="size-3" />Flight</dt><dd className="mt-1 font-semibold text-ink">~{dest.flight}</dd></div>
              <div><dt className="tag flex items-center gap-1 text-slate-400"><GraduationCap className="size-3" />Universities</dt><dd className="mt-1 font-semibold text-ink">{unis.length || "On request"}</dd></div>
            </dl>
            <Link href={enquire("Free counselling", c.name)}
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent">
              Board here: free counselling <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      )}

      {unis.length > 0 ? (
        <Section>
          <div className="grid gap-6 md:grid-cols-2">
            {unis.map((u, i) => (
              <article key={u.uid} style={{ "--i": i % 2 } as CSSProperties}
                       className="reveal group flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl sm:flex-row">
                <UniImage src={u.cardImage ?? u.image} alt={u.name} className="h-48 shrink-0 sm:h-auto sm:w-56" sizes="(min-width: 640px) 224px, 100vw" />
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-lg font-bold"><Link href={`/universities/${u.uid}`} className="hover:text-brand">{u.cardTitle ?? u.name}</Link></h2>
                  <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-accent"><MapPin className="size-3.5" />{u.location || `University in ${c.name}`}</p>
                  {u.blurb && <p className="mt-3 line-clamp-3 flex-1 text-sm text-slate-500">{u.blurb}</p>}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link href={`/universities/${u.uid}`} className="inline-flex items-center gap-1 rounded-xl bg-brand-light px-4 py-2 text-sm font-bold text-brand hover:bg-brand hover:text-white">
                      Read More <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                    </Link>
                    <Link href={enquire(u.cardTitle ?? u.name, c.name)} className="rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white hover:bg-accent-dark">Enroll Now</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Section>
      ) : (
        <Section>
          <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
            <EnquiryForm title={`Talk to us about studying in ${c.name}`} source={`Study in ${c.name}`} country={c.name}
                         fields={["name", "email", "mobile", "message"]} defaults={{ message: `I would like to study in ${c.name}.` }} />
          </div>
        </Section>
      )}
      <CtaBand title={`Ready to study in ${c.name}?`} course={`Study in ${c.name}`} />
    </>
  );
}
