"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, ChevronDown, Globe, GraduationCap, Lock, MessageCircleMore } from "lucide-react";
import { FieldError, invalid, useFormChecks } from "@/components/FormChecks";
import { Turnstile } from "@/components/Turnstile";
import { submitEnquiry, thankYouQuery } from "@/lib/enquiry";
import { DESTINATIONS, INTERESTS } from "@/lib/site";
import { checkEmail, checkName, checkOther, checkPhone, normalisePhone, serverFieldErrors, tidy } from "@/lib/validation";

/** Value of the "Other" choice in both lists; picking it shows a box for the visitor to type what they mean. */
const OTHER = "Other";

/**
 * The "Get free consultation" card on /enquiry (owner's mock-up, 6 Nov 2026). Same intake as every form on the site.
 * Choosing "Other" in a list asks what they mean, and the CRM receives the typed answer in place of "Other".
 */
/** `compact`: tighter spacing, for the promo popup where it sits beside the artwork. */
export default function ConsultationForm({ source = "Enquiry page", compact = false }: { source?: string; compact?: boolean }) {
  const router = useRouter();
  const [interest, setInterest] = useState("");
  const [country, setCountry] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  // Fields not on screen (the "Other" boxes until Other is picked) are skipped by the checks.
  const checks = useFormChecks({
    name: checkName,
    mobile: checkPhone,
    email: (v: string) => checkEmail(v, false),
    otherInterest: checkOther("service", "Spouse visa"),
    otherCountry: checkOther("country", "Australia"),
  });

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
        serviceInterest: (interest === OTHER ? tidy(f.otherInterest) : interest) || undefined,
        preferredCountry: (country === OTHER ? tidy(f.otherCountry) : country) || undefined,
        message: f.message.trim() || undefined,
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
      setAttempt((n) => n + 1); // captcha tokens are single-use
      setBusy(false);
    }
  };

  const input = `w-full rounded-lg border border-line bg-white px-3.5 ${compact ? "py-2.5" : "py-3"} text-[15px] text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10`;
  const label = "mb-1.5 block text-sm font-semibold text-ink";
  const req = <span className="text-flame" aria-hidden> *</span>;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-20px_rgb(14_22_69/0.35)] ring-1 ring-line">
      <div className="p-3 pb-0 sm:p-4 sm:pb-0">
        <div className={`flex items-center justify-center gap-3 rounded-xl bg-brand-dark px-4 text-white shadow-lg shadow-brand-dark/30 ${compact ? "py-3" : "py-4"}`}>
          <MessageCircleMore className="size-8 shrink-0 sm:size-9" aria-hidden />
          <h2 className="font-display text-2xl font-bold text-white sm:text-[1.7rem]">
            Get <span className="text-gold">Free</span> Consultation
          </h2>
        </div>
        <p className={`text-center text-[15px] text-ink italic ${compact ? "mt-3" : "mt-4"}`}>Fill in your details and we’ll call you back shortly.</p>
        <span className="mx-auto mt-1.5 block h-0.5 w-28 rounded-full bg-gold" aria-hidden />
      </div>

      <form onSubmit={submit} noValidate className={`grid sm:grid-cols-2 ${compact ? "gap-3 p-4 sm:p-5 sm:pt-4" : "gap-4 p-5 sm:p-7 sm:pt-5"}`}>
        <label className="sm:col-span-2"><span className={label}>Full Name{req}</span>
          <input {...checks.field("name")} required maxLength={200} autoComplete="name" placeholder="Enter your full name"
                 className={`${input} ${invalid(!!checks.errors.name)}`} />
          <FieldError {...checks.error("name")} />
        </label>
        <label><span className={label}>Mobile Number{req}</span>
          <input {...checks.field("mobile")} type="tel" inputMode="tel" required maxLength={20} autoComplete="tel" placeholder="+91 98765 43210"
                 className={`${input} ${invalid(!!checks.errors.mobile)}`} />
          <FieldError {...checks.error("mobile")} />
        </label>
        <label><span className={label}>Email</span>
          <input {...checks.field("email")} type="email" maxLength={200} autoComplete="email" placeholder="you@domain.com"
                 className={`${input} ${invalid(!!checks.errors.email)}`} />
          <FieldError {...checks.error("email")} />
        </label>

        <Choice label="Interested In" labelClass={label} icon={<GraduationCap className="size-5" />} value={interest} onChange={setInterest}
                options={INTERESTS} inputClass={input} />
        <Choice label="Preferred Country" labelClass={label} icon={<Globe className="size-5" />} value={country} onChange={setCountry}
                options={DESTINATIONS.map((d) => d.name)} inputClass={input} />

        {interest === OTHER && (
          <label className="sm:col-span-2"><span className={label}>Which service?{req}</span>
            <input {...checks.field("otherInterest")} maxLength={100} autoComplete="off" autoFocus placeholder="Type the service, e.g. Spouse visa"
                   className={`${input} ${invalid(!!checks.errors.otherInterest)}`} />
            <FieldError {...checks.error("otherInterest")} />
          </label>
        )}
        {country === OTHER && (
          <label className="sm:col-span-2"><span className={label}>Which country?{req}</span>
            <input {...checks.field("otherCountry")} maxLength={60} autoComplete="off" autoFocus={interest !== OTHER} placeholder="Type the country, e.g. Australia"
                   className={`${input} ${invalid(!!checks.errors.otherCountry)}`} />
            <FieldError {...checks.error("otherCountry")} />
          </label>
        )}

        <label className="sm:col-span-2"><span className={label}>Message</span>
          <textarea name="message" rows={compact ? 2 : 3} maxLength={2000} placeholder="Tell us about your study abroad plans…" className={input} />
        </label>

        {/* Honeypot: hidden from people, bots fill it in. */}
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[10000px] h-0 w-0" />
        <Turnstile key={attempt} className="sm:col-span-2" />
        {error && <p className="text-sm font-medium text-red-600 sm:col-span-2" role="alert">{error}</p>}

        <button type="submit" disabled={busy}
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-gold px-6 py-3.5 font-display text-lg font-bold text-brand-dark shadow-lg shadow-gold/30 transition hover:bg-gold-dark disabled:opacity-60 sm:col-span-2">
          {busy ? "Sending…" : "Submit Enquiry"}
          <span className="grid size-7 place-items-center rounded-full bg-brand-dark text-gold transition group-hover:translate-x-1">
            <ArrowRight className="size-4" aria-hidden />
          </span>
        </button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-slate-600 sm:col-span-2">
          <Lock className="size-3.5" aria-hidden /> Your information is safe with us
        </p>
      </form>
    </div>
  );
}

/** A list with an icon in front and "Other" at the end. */
function Choice({ label, labelClass, icon, value, onChange, options, inputClass }: {
  label: string; labelClass: string; icon: ReactNode; value: string; onChange: (v: string) => void;
  options: readonly string[]; inputClass: string;
}) {
  return (
    <label><span className={labelClass}>{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-brand" aria-hidden>{icon}</span>
        <select value={value} onChange={(e) => onChange(e.target.value)}
                className={`${inputClass} cursor-pointer appearance-none pr-10 pl-10 ${value ? "" : "text-slate-500"}`}>
          <option value="">Select…</option>
          {options.map((o) => <option key={o} value={o} className="text-ink">{o}</option>)}
          <option value={OTHER} className="text-ink">Other (type it in)</option>
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate-500" aria-hidden />
      </span>
    </label>
  );
}
