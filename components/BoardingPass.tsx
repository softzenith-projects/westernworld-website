"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Plane } from "lucide-react";
import { FieldError, invalid, useFormChecks } from "@/components/FormChecks";
import { Turnstile } from "@/components/Turnstile";
import { submitEnquiry, thankYouQuery } from "@/lib/enquiry";
import { checkEmail, checkName, checkOther, checkPhone, checkScore, normalisePhone, serverFieldErrors, tidy } from "@/lib/validation";
import { DESTINATIONS } from "@/lib/site";

// Options as the owner wrote them (20 Oct 2026).
const WHEN = ["As early as possible", "Within 3 months", "In 3–6 months", "Not sure yet"];
const TEST = ["Not taken yet", "Preparing now", "Have my score", "Need coaching"];
const HAVE_SCORE = "Have my score";
const SCORE_TESTS = ["IELTS", "PTE", "Duolingo", "Other"];
/** Score boxes: field name, full name, the owner's short label. */
const BANDS = [
  ["listening", "Listening", "L"], ["reading", "Reading", "R"], ["writing", "Writing", "W"], ["speaking", "Speaking", "S"],
  ["overall", "Overall", "Overall"],
] as const;
/** "To" value for a country that is not in the list; the student types it. */
const OTHER = "other";

/**
 * The home-page counselling form, styled as a boarding pass. It asks the three things a counsellor needs first
 * (where, when, English test, with the scores if they have them) so the lead arrives in the CRM already qualified.
 */
export default function BoardingPass({ source = "Boarding pass (home)" }: { source?: string }) {
  const router = useRouter();
  const [to, setTo] = useState("");
  const [otherCountry, setOtherCountry] = useState("");
  const [test, setTest] = useState(TEST[0]);
  const [scoreTest, setScoreTest] = useState(SCORE_TESTS[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const dest = DESTINATIONS.find((d) => d.slug === to);
  // Fields that are not on screen (e.g. the scores before "Have my score") are skipped by the checks.
  const checks = useFormChecks({
    name: (v: string) => (tidy(v) ? checkName(v) : "Every boarding pass needs a passenger name. Yours, please ✈️"),
    mobile: checkPhone,
    email: (v: string) => checkEmail(v, false),
    otherCountry: checkOther("country", "Australia"),
    otherTest: checkOther("test", "TOEFL"),
    ...Object.fromEntries(BANDS.map(([name, full]) => [name, (v: string) => checkScore(v, scoreTest, full)])),
  });
  const otherField = checks.field("otherCountry");

  // The big "To" code: the airport code, or the first letters of the country typed under "Other".
  const code = to === OTHER ? otherCountry.replace(/[^\p{L}]/gu, "").slice(0, 3).toUpperCase() : dest?.code;
  const place = to === OTHER ? tidy(otherCountry) || "Other country" : dest?.name;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!checks.validate(e.currentTarget)) return;
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const country = to === OTHER ? tidy(f.otherCountry) : dest?.name;
    const testName = f.scoreTest === "Other" ? tidy(f.otherTest) : f.scoreTest;
    const scores = BANDS.filter(([name]) => f[name]?.trim()).map(([name, full]) => `${full} ${f[name].trim()}`);
    setBusy(true);
    try {
      await submitEnquiry({
        fullName: tidy(f.name),
        phone: normalisePhone(f.mobile) ?? f.mobile,
        email: f.email.trim().toLowerCase() || undefined,
        serviceInterest: "Free counselling",
        preferredCountry: country,
        message: [
          `Destination: ${country ?? "Not decided"}`,
          `Planning to go: ${f.when}`,
          `English test: ${f.test}${f.test === HAVE_SCORE ? ` (${testName})` : ""}`,
          ...(f.test === HAVE_SCORE && scores.length ? [`Scores: ${scores.join(" · ")}`] : []),
        ].join("\n"),
        sourceDetail: `westernworldvisaservices.com: ${source}`,
        website: f.website || undefined,
        captchaToken: f["cf-turnstile-response"] || undefined,
      });
      router.push(`/thank-you?${thankYouQuery(tidy(f.name), f.email)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const { fields: bad, rest } = serverFieldErrors(message);
      bad.forEach((b) => checks.setError(b.field, b.message));
      if (rest) setError(rest);
      setAttempt((n) => n + 1);
      setBusy(false);
    }
  };

  const field = "w-full border-0 border-b border-line bg-transparent px-0 py-2 text-[15px] text-ink outline-none transition placeholder:text-slate-400 focus:border-ink";
  const label = "tag block text-slate-400";

  return (
    <form onSubmit={submit} noValidate className="relative overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-20px_rgb(14_22_69/0.35)] ring-1 ring-line">
      <div className="flex items-center justify-between bg-ink px-5 py-3 text-white">
        <p className="tag">Boarding pass · Free counselling</p>
        <Plane className="size-4 rotate-45 text-sun" />
      </div>

      <div className="px-5 pt-5 sm:px-7">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className={label}>From</p>
            <p className="font-mono text-4xl font-medium tracking-tight text-ink sm:text-5xl">DEL</p>
            <p className="text-xs text-slate-500">Rohtak · Delhi NCR</p>
          </div>
          <div className="mb-6 flex flex-1 items-center gap-1 text-slate-300" aria-hidden>
            <span className="h-px flex-1 border-t border-dashed border-slate-300" />
            <Plane className="size-4 rotate-45 text-accent" />
            <span className="h-px flex-1 border-t border-dashed border-slate-300" />
          </div>
          <label className="relative block text-right">
            <span className={label}>To</span>
            <span className={`block font-mono text-4xl font-medium tracking-tight sm:text-5xl ${code ? "text-accent" : "text-slate-300"}`}>{code || "???"}</span>
            <span className="block max-w-36 truncate text-xs text-slate-500 underline decoration-dotted underline-offset-2">{place ?? "Choose country ▾"}</span>
            <select name="to" value={to} onChange={(e) => setTo(e.target.value)} aria-label="Where do you want to study?"
                    className="absolute inset-0 cursor-pointer opacity-0">
              <option value="">Not decided yet</option>
              {DESTINATIONS.map((d) => <option key={d.slug} value={d.slug}>{d.name} ({d.code})</option>)}
              <option value={OTHER}>Other country (type the name)</option>
            </select>
          </label>
        </div>

        <div className="mt-6 grid gap-x-5 gap-y-4 sm:grid-cols-2">
          {to === OTHER && (
            <label className="sm:col-span-2"><span className={label}>Which country? *</span>
              <input {...otherField} value={otherCountry} maxLength={60} autoComplete="off" placeholder="Type the country, e.g. Australia"
                     onChange={(e) => { setOtherCountry(e.target.value); otherField.onChange(e); }}
                     className={`${field} ${invalid(!!checks.errors.otherCountry)}`} />
              <FieldError {...checks.error("otherCountry")} />
            </label>
          )}
          <label className="sm:col-span-2"><span className={label}>Passenger name *</span>
            <input {...checks.field("name")} required maxLength={200} autoComplete="name" placeholder="Your full name"
                   className={`${field} ${invalid(!!checks.errors.name)}`} />
            <FieldError {...checks.error("name")} />
          </label>
          <label><span className={label}>Mobile *</span>
            <input {...checks.field("mobile")} type="tel" inputMode="tel" required maxLength={20} autoComplete="tel" placeholder="98765 43210"
                   className={`${field} ${invalid(!!checks.errors.mobile)}`} />
            <FieldError {...checks.error("mobile")} />
          </label>
          <label><span className={label}>Email</span>
            <input {...checks.field("email")} type="email" maxLength={200} autoComplete="email" placeholder="Optional"
                   className={`${field} ${invalid(!!checks.errors.email)}`} />
            <FieldError {...checks.error("email")} />
          </label>
          <label><span className={label}>Planning to fly</span>
            <select name="when" className={field} defaultValue={WHEN[0]}>{WHEN.map((w) => <option key={w}>{w}</option>)}</select>
          </label>
          <label><span className={label}>English test</span>
            <select name="test" className={field} value={test} onChange={(e) => setTest(e.target.value)}>
              {TEST.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>

          {test === HAVE_SCORE && (
            <div className="rounded-xl border border-dashed border-line bg-paper/60 p-3 sm:col-span-2 sm:p-4">
              <fieldset>
                <legend className={label}>Which test?</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SCORE_TESTS.map((t) => (
                    <label key={t}>
                      <input type="radio" name="scoreTest" value={t} checked={scoreTest === t} onChange={() => setScoreTest(t)} className="peer sr-only" />
                      <span className="block cursor-pointer rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-slate-600 transition peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                        {t}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {scoreTest === "Other" && (
                <label className="mt-3 block"><span className={label}>Test name *</span>
                  <input {...checks.field("otherTest")} maxLength={40} autoComplete="off" placeholder="e.g. TOEFL"
                         className={`${field} ${invalid(!!checks.errors.otherTest)}`} />
                  <FieldError {...checks.error("otherTest")} />
                </label>
              )}
              <fieldset className="mt-4">
                <legend className={label}>Scores <span className="normal-case tracking-normal">(optional)</span></legend>
                <div className="mt-1 grid grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.5fr)] gap-2 sm:gap-3">
                  {BANDS.map(([name, full, short]) => (
                    <label key={name} className="text-center">
                      <span className="tag block text-slate-400"><abbr title={full} className="no-underline" aria-hidden>{short}</abbr><span className="sr-only">{full}</span></span>
                      <input {...checks.field(name)} inputMode="decimal" maxLength={5} autoComplete="off" placeholder="–"
                             className={`${field} text-center font-mono ${invalid(!!checks.errors[name])}`} />
                    </label>
                  ))}
                </div>
                {BANDS.map(([name]) => <FieldError key={name} {...checks.error(name)} />)}
              </fieldset>
            </div>
          )}
        </div>
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[10000px] h-0 w-0" />
        <Turnstile key={attempt} className="mt-4" />
        {error && <p className="mt-3 text-sm font-medium text-red-600" role="alert">{error}</p>}
      </div>

      {/* Tear line with the two ticket notches. */}
      <div className="relative mx-5 mt-6 border-t-2 border-dashed border-line" aria-hidden>
        <span className="absolute -top-3 -left-8 size-6 rounded-full bg-paper ring-1 ring-line" />
        <span className="absolute -top-3 -right-8 size-6 rounded-full bg-paper ring-1 ring-line" />
      </div>

      <div className="flex flex-wrap items-center gap-4 px-5 pt-3 pb-5 sm:px-7">
        <button type="submit" disabled={busy}
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60">
          {busy ? "Checking you in…" : "Get my free counselling"} <ArrowRight className="size-4 transition group-hover:translate-x-1" />
        </button>
        <span className="barcode hidden h-10 w-24 text-ink sm:block" aria-hidden />
      </div>
      <p className="px-5 pb-5 text-xs text-slate-500 sm:px-7">A counsellor calls you back. No fees for counselling.</p>
    </form>
  );
}
