"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { FieldError, invalid, useFormChecks } from "@/components/FormChecks";
import { submitEnquiry, thankYouQuery } from "@/lib/enquiry";
import { checkCourse, checkEmail, checkMessage, checkName, checkPhone, normalisePhone, serverFieldErrors, tidy } from "@/lib/validation";
import { Turnstile } from "@/components/Turnstile";

type Field = "name" | "email" | "mobile" | "message" | "course";

const CHECKS: Record<Field, (v: string) => string> = {
  name: checkName, email: (v) => checkEmail(v, true), mobile: checkPhone, course: checkCourse, message: checkMessage,
};

/**
 * Every form on the site (Keep in touch, Call back, Request call back, Book now, Enroll now) is this one form with
 * different fields. It creates a lead in the CRM, then shows the thank-you page. (The CRM does not acknowledge the
 * enquirer by email or WhatsApp yet, so the form promises a call back only.)
 */
export default function EnquiryForm({
  title, subtitle, source, fields = ["name", "email", "mobile", "message"], courseLabel = "Course",
  defaults = {}, country, submitLabel = "Submit", dark = false,
}: {
  title?: string;
  subtitle?: string;
  source: string;
  fields?: Field[];
  courseLabel?: string;
  defaults?: Partial<Record<Field, string>>;
  country?: string;
  submitLabel?: string;
  dark?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const has = (x: Field) => fields.includes(x);
  const checks = useFormChecks(Object.fromEntries(fields.map((x) => [x, CHECKS[x]])));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!checks.validate(e.currentTarget)) return;
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    try {
      await submitEnquiry({
        fullName: tidy(f.name ?? ""),
        phone: normalisePhone(f.mobile ?? "") ?? f.mobile,
        email: f.email?.trim().toLowerCase() || undefined,
        serviceInterest: tidy(f.course ?? "") || undefined,
        preferredCountry: country,
        message: f.message?.trim() || undefined,
        sourceDetail: `westernworldvisaservices.com: ${source}`,
        website: f.website || undefined,
        captchaToken: f["cf-turnstile-response"] || undefined,
      });
      router.push(`/thank-you?${thankYouQuery(tidy(f.name), f.email)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const { fields: bad, rest } = serverFieldErrors(message);
      const shown = bad.filter((b) => has(b.field));
      shown.forEach((b) => checks.setError(b.field, b.message));
      if (rest || shown.length < bad.length) setError(rest || message);
      setAttempt((n) => n + 1); // captcha tokens are single-use
      setBusy(false);
    }
  };

  const input = `w-full rounded-md border px-3.5 py-3 text-sm outline-none transition focus:ring-4 ${
    dark
      ? "border-white/15 bg-white/10 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/10"
      : "border-line bg-white text-ink placeholder:text-slate-400 focus:border-ink focus:ring-ink/5"
  }`;
  const label = `tag mb-1.5 block ${dark ? "text-white/60" : "text-slate-500"}`;
  const props = (x: Field) => ({ ...checks.field(x), className: `${input} ${invalid(!!checks.errors[x], dark)}` });

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      {title && (
        <div className="sm:col-span-2">
          <h3 className={`text-2xl font-semibold ${dark ? "text-white" : "text-ink"}`}>{title}</h3>
          {subtitle && <p className={`mt-1 text-sm ${dark ? "text-white/70" : "text-slate-500"}`}>{subtitle}</p>}
        </div>
      )}
      {has("name") && (
        <label className="sm:col-span-2"><span className={label}>Name *</span>
          <input {...props("name")} required maxLength={200} autoComplete="name" defaultValue={defaults.name} />
          <FieldError {...checks.error("name")} dark={dark} />
        </label>
      )}
      {has("email") && (
        <label><span className={label}>E-Mail *</span>
          <input {...props("email")} type="email" required maxLength={200} autoComplete="email" defaultValue={defaults.email} />
          <FieldError {...checks.error("email")} dark={dark} />
        </label>
      )}
      {has("mobile") && (
        <label><span className={label}>Mobile *</span>
          <input {...props("mobile")} type="tel" inputMode="tel" required maxLength={20} autoComplete="tel" placeholder="98765 43210" />
          <FieldError {...checks.error("mobile")} dark={dark} />
        </label>
      )}
      {has("course") && (
        <label className="sm:col-span-2"><span className={label}>{courseLabel} *</span>
          <input {...props("course")} required maxLength={200} defaultValue={defaults.course}
                 placeholder="e.g. IELTS Academic, Study in Canada" />
          <FieldError {...checks.error("course")} dark={dark} />
        </label>
      )}
      {has("message") && (
        <label className="sm:col-span-2"><span className={label}>Message *</span>
          <textarea {...props("message")} required rows={3} maxLength={2000} defaultValue={defaults.message} />
          <FieldError {...checks.error("message")} dark={dark} />
        </label>
      )}
      {/* Honeypot: hidden from people, bots fill it in. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[10000px] h-0 w-0" />
      <Turnstile key={attempt} className="sm:col-span-2" />
      {error && <p className="text-sm font-medium text-red-500 sm:col-span-2" role="alert">{error}</p>}
      <button type="submit" disabled={busy}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60 sm:col-span-2">
        <Send className="size-4" /> {busy ? "Sending…" : submitLabel}
      </button>
      <p className={`text-xs sm:col-span-2 ${dark ? "text-white/60" : "text-slate-400"}`}>
        Someone from our team will call you shortly.
      </p>
    </form>
  );
}
