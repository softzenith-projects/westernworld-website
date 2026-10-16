"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Plane } from "lucide-react";
import { FieldError, invalid, useFormChecks } from "@/components/FormChecks";
import { Turnstile } from "@/components/Turnstile";
import { submitEnquiry, thankYouQuery } from "@/lib/enquiry";
import { checkEmail, checkName, checkPhone, normalisePhone, serverFieldErrors, tidy } from "@/lib/validation";
import { DESTINATIONS } from "@/lib/site";

const WHEN = ["Within 6 months", "In 6–12 months", "In more than a year", "Not sure yet"];
const TEST = ["Not taken yet", "Preparing now", "Have my score", "Need coaching"];

const CHECKS = {
  name: (v: string) => (tidy(v) ? checkName(v) : "Every boarding pass needs a passenger name. Yours, please ✈️"),
  mobile: checkPhone,
  email: (v: string) => checkEmail(v, false),
};

/**
 * The home-page counselling form, styled as a boarding pass. It asks the three things a counsellor needs first
 * (where, when, English test) so the lead arrives in the CRM already qualified.
 */
export default function BoardingPass({ source = "Boarding pass (home)" }: { source?: string }) {
  const router = useRouter();
  const [to, setTo] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const dest = DESTINATIONS.find((d) => d.slug === to);
  const checks = useFormChecks(CHECKS);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!checks.validate(e.currentTarget)) return;
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    try {
      await submitEnquiry({
        fullName: tidy(f.name),
        phone: normalisePhone(f.mobile) ?? f.mobile,
        email: f.email.trim().toLowerCase() || undefined,
        serviceInterest: "Free counselling",
        preferredCountry: dest?.name,
        message: [`Destination: ${dest?.name ?? "Not decided"}`, `Planning to go: ${f.when}`, `English test: ${f.test}`].join("\n"),
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
            <span className={`block font-mono text-4xl font-medium tracking-tight sm:text-5xl ${dest ? "text-accent" : "text-slate-300"}`}>{dest?.code ?? "???"}</span>
            <span className="block text-xs text-slate-500 underline decoration-dotted underline-offset-2">{dest ? dest.name : "Choose country ▾"}</span>
            <select name="to" value={to} onChange={(e) => setTo(e.target.value)} aria-label="Where do you want to study?"
                    className="absolute inset-0 cursor-pointer opacity-0">
              <option value="">Not decided yet</option>
              {DESTINATIONS.map((d) => <option key={d.slug} value={d.slug}>{d.name} ({d.code})</option>)}
            </select>
          </label>
        </div>

        <div className="mt-6 grid gap-x-5 gap-y-4 sm:grid-cols-2">
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
            <select name="test" className={field} defaultValue={TEST[0]}>{TEST.map((t) => <option key={t}>{t}</option>)}</select>
          </label>
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
