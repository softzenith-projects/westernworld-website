import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2, Globe2, GraduationCap, Stamp } from "lucide-react";
import { StampScene } from "@/components/Illustrations";
import WithCallback from "@/components/WithCallback";
import { Feature, PageHero } from "@/components/blocks";
import { countries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Visa Consultant in Rohtak: UK Visa, Canada Visa & Europe Visa",
  description:
    "Visa agent and visa consultant in Rohtak for UK visa, Canada visa and Europe visa applications: student and visitor visas, with the file checked before you apply.",
};

/** The owner's search phrases (20 Oct 2026); the home page links to these anchors. */
const VISAS = [
  ["uk-visa", "UK visa", "Student and visitor visas for the UK. We check your documents, funds and the online application before you submit, and keep you updated until a decision."],
  ["canada-visa", "Canada visa", "Study permits and visitor visas for Canada. Your SOP, financial documents and online file are prepared to tell one consistent story."],
  ["europe-visa", "Europe visa", "Student and visitor visas for Germany, Finland, Ireland, Malta, Cyprus and other European countries, with the document list for each embassy."],
];

/**
 * The old page was titled "UKVI-IELTS" with only a call-back form (a copy-paste slip on the old site). Kept as the
 * Visa Assistance page with that form, plus the visa-support wording from the old home page.
 */
export default function VisaAssistancePage() {
  return (
    <>
      <PageHero title="Visa Assistance" crumbs={[{ label: "Immigration Services" }, { label: "Visa Assistance" }]}
                subtitle="WWVS could help clients with visa applications, requirements and processing." />
      <WithCallback source="Request call back (visa assistance)" course="Visa Assistance">
        <div className="grid items-center gap-6 sm:grid-cols-[1fr_15rem]">
          <div className="prose-copy text-slate-600">
            <p>The requirement for a visa will depend on the country the clients wants to study in. Equipped with the latest information about student migration, migration agents will be able to help clients achieve their student visas.</p>
          </div>
          <StampScene className="mx-auto max-w-60" />
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Feature icon={<FileCheck2 />} title="Visa Support & Filing">Western World Visa Services help in providing visa support and filling process from renowned universities</Feature>
          <Feature icon={<GraduationCap />} title="Career Counselling">Western World Visa Services offer Career Counselling all over the world most influential universities</Feature>
        </div>
        <h2 className="mt-10 mb-4 text-xl font-bold">UK visa, Canada visa and Europe visa</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {VISAS.map(([id, title, text]) => (
            <div key={id} id={id} className="scroll-mt-32">
              <Feature icon={<Stamp />} title={title}>{text}</Feature>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Visa decisions are made by the embassy or immigration authority. Our job is a complete, consistent file.
        </p>
        <h2 className="mt-10 mb-4 text-xl font-bold">Student visa destinations</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {countries.map((c) => (
            <Link key={c.slug} href={`/study-in/${c.slug}`}
                  className="group flex items-center gap-2 rounded-2xl border border-line bg-white p-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-md">
              <Globe2 className="size-4 text-accent transition duration-700 group-hover:rotate-[360deg]" /> {c.name}
            </Link>
          ))}
        </div>
      </WithCallback>
    </>
  );
}
