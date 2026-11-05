import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import DocChecklist from "@/components/DocChecklist";
import UniImage from "@/components/UniImage";
import WithCallback from "@/components/WithCallback";
import { PageHero } from "@/components/blocks";
import { country as findCountry, universities, university } from "@/lib/content";

export function generateStaticParams() {
  return universities.map((u) => ({ uid: String(u.uid) }));
}

export async function generateMetadata({ params }: PageProps<"/universities/[uid]">): Promise<Metadata> {
  const u = university(Number((await params).uid));
  return { title: u ? `Study Abroad | ${u.name}` : "University" };
}

/** The old site's shared checklist had typos ("Graducation", "Addhar"); shown corrected. */
const tidy = (s: string) => s.replace("Graducation", "Graduation").replace("Addhar", "Aadhaar");

export default async function UniversityPage({ params }: PageProps<"/universities/[uid]">) {
  const u = university(Number((await params).uid));
  if (!u) notFound();
  const c = u.country ? findCountry(u.country) : undefined;
  // The old pages repeated the name as the first paragraph when there was no description.
  const paragraphs = u.paragraphs.filter((p, i) => !(i === 0 && p === u.name));

  return (
    <>
      <PageHero title={u.name}
                crumbs={[...(c ? [{ label: `Study in ${c.name}`, href: `/study-in/${c.slug}` }] : []), { label: u.name }]} />
      <WithCallback source={`Enroll now (${u.name})`} course={u.name} country={c?.name}>
        <div className="group"><UniImage src={u.image} alt={u.name} className="mb-8 h-72 w-full rounded-xl" sizes="(min-width: 1024px) 800px, 100vw" /></div>
        <h2 className="text-2xl font-bold">{u.name}</h2>
        <div className="prose-copy mt-4 text-slate-600">
          {paragraphs.length > 0
            ? paragraphs.map((p, i) => <p key={i}>{p}</p>)
            : <p>Ask our counsellors for courses, fees and intakes at {u.name}.</p>}
        </div>
        {u.requirements.length > 0 && <DocChecklist items={u.requirements.map(tidy)} course={u.name} country={c?.name} />}
        {c && (
          <Link href={`/study-in/${c.slug}`} className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-accent">
            <ArrowLeft className="size-4" /> All universities in {c.name}
          </Link>
        )}
      </WithCallback>
    </>
  );
}
