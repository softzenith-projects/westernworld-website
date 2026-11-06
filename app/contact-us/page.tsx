import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { CallScene } from "@/components/Illustrations";
import SocialIcons from "@/components/SocialIcons";
import { BranchList, CallbackCard, PageHero, Section } from "@/components/blocks";
import { SITE, tel } from "@/lib/site";

export const metadata: Metadata = { title: "Contact Us" };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ContactPage({ searchParams }: PageProps<"/contact-us">) {
  const q = await searchParams;
  const course = first(q.course);
  const country = first(q.country);

  return (
    <>
      <PageHero title="Contact Us" crumbs={[{ label: "Contact Us" }]}
                subtitle="Call, WhatsApp, visit our office, or ask for a call back. Someone from our team will get in touch with you." />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div className="space-y-5">
            <div className="overflow-hidden rounded-xl bg-brand-light/60 ring-1 ring-line">
              <CallScene className="mx-auto max-w-sm" />
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-white px-5 py-4">
                <p className="font-display text-lg font-semibold text-ink">Talk to a counsellor today</p>
                <div className="flex gap-2">
                  <a href={tel(SITE.phones[0])} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent">
                    <Phone className="size-4" /> Call
                  </a>
                  <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                    <MessageCircle className="size-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-line p-6 shadow-sm">
              <MapPin className="size-7 text-accent" />
              <h2 className="mt-3 mb-3 text-lg font-bold">Our Offices</h2>
              <BranchList />
            </div>
            <div className="rounded-xl border border-line p-6 shadow-sm">
              <Phone className="size-7 text-accent" />
              <h2 className="mt-3 text-lg font-bold">Call Now</h2>
              {SITE.phones.map((p) => <a key={p} href={tel(p)} className="block text-slate-600 hover:text-brand">{p}</a>)}
            </div>
            <div className="rounded-xl border border-line p-6 shadow-sm">
              <Mail className="size-7 text-accent" />
              <h2 className="mt-3 text-lg font-bold">Email</h2>
              <a href={`mailto:${SITE.email}`} className="text-slate-600 hover:text-brand">{SITE.email}</a>
              <div className="mt-4 text-brand [&_a]:bg-brand-light"><SocialIcons /></div>
            </div>
            <iframe title="Map to Western World Visa Services, Rohtak" loading="lazy" className="h-64 w-full rounded-xl border-0"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.address)}&output=embed`} />
          </div>
          {/* The site's call-back card (as on About), with the contact page's fields. `#enquiry` is where every
              "Book now / Ask about this" link lands, pre-filled; on phones the form comes first. */}
          <CallbackCard
            key={`${course}-${first(q.email)}`}
            id="enquiry"
            className="scroll-mt-32 max-lg:order-first"
            title="Request a call back"
            subtitle="Tell us what you are interested in and our counsellor will call you."
            source={course ? `Call back (${course})` : "Call back (contact page)"}
            fields={["name", "email", "mobile", "course"]}
            courseLabel="Interested in"
            defaults={{ course, email: first(q.email) }}
            country={country}
            submitLabel="Request a call back"
          />
        </div>
      </Section>
    </>
  );
}
