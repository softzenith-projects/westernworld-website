/**
 * Form checks shown to students before anything is sent. The CRM validates again on intake (it stays the authority);
 * these rules match it so a lead the browser accepts is not rejected later:
 * name = the CRM's NewLead.NAME_PATTERN, phone = a number libphonenumber accepts (Indian mobiles, or +country code).
 * Each check returns a message, or "" when the value is fine. Copy is light, never rude, and says how to fix it.
 */

const NAME = /^[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INDIAN_MOBILE = /^[6-9]\d{9}$/;
const INTERNATIONAL = /^\+[1-9]\d{7,14}$/;

/** Common slips in email domains, so "gmial.com" gets a helpful nudge instead of a bounced reply. */
const DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com", "gamil.com": "gmail.com", "gmal.com": "gmail.com", "gmai.com": "gmail.com",
  "gmail.co": "gmail.com", "gmail.con": "gmail.com", "gmail.cm": "gmail.com", "gmail.in": "gmail.com",
  "yahoo.con": "yahoo.com", "yaho.com": "yahoo.com", "yahoo.co": "yahoo.com",
  "hotmail.con": "hotmail.com", "hotmial.com": "hotmail.com", "outlook.con": "outlook.com", "outlok.com": "outlook.com",
  "rediffmail.con": "rediffmail.com", "icloud.con": "icloud.com",
};

/** Trims and collapses inner whitespace ("  Riya   Sharma " → "Riya Sharma"). */
export const tidy = (v: string) => v.trim().replace(/\s+/g, " ");

export function checkName(raw: string) {
  const v = tidy(raw);
  if (!v) return "We’d love to know who we’re talking to. Please add your name.";
  if (/\d/.test(v)) return "Names don’t usually come with numbers. Letters only, please.";
  if (!NAME.test(v)) return "Just letters, spaces and . ' - please. Save the emojis for WhatsApp 😉";
  if (v.replace(/[^\p{L}]/gu, "").length < 2) return "That’s a little short for a name. Your full name, please.";
  return "";
}

/**
 * Accepts 98765 43210, 098765 43210, +91 98765 43210, 0091 98765 43210, 91-9876543210 (spaces . - / _ ignored) and foreign numbers with a + code.
 * Returns the number to send (E.164 for Indian mobiles), or null when it is not a usable mobile.
 */
export function normalisePhone(raw: string): string | null {
  const v = raw.trim().replace(/[\s()./_-]/g, "").replace(/^00(?=[1-9])/, "+"); // 0091… = +91…
  if (v.startsWith("+91")) return INDIAN_MOBILE.test(v.slice(3)) ? v : null;
  if (v.startsWith("+")) return INTERNATIONAL.test(v) ? v : null;
  if (!/^\d+$/.test(v)) return null;
  const local = v.length === 12 && v.startsWith("91") ? v.slice(2) : v.length === 11 && v.startsWith("0") ? v.slice(1) : v;
  return INDIAN_MOBILE.test(local) ? `+91${local}` : null;
}

export function checkPhone(raw: string) {
  const v = raw.trim();
  if (!v) return "We need a number to call you back. Carrier pigeons are a bit slow these days 🕊️";
  if (normalisePhone(v)) return "";
  if (/[a-z]/i.test(v)) return "Phone numbers are digits only. Try something like 98765 43210.";
  if (!v.startsWith("+")) {
    // Without a country code: a 10-digit Indian mobile, optionally written with 0 or 91 in front.
    const local = v.replace(/\D/g, "").replace(/^(?:91(?=\d{10}$)|0(?=\d{10}$))/, "");
    if (local.length !== 10) return `Almost there! A mobile number has 10 digits; this one has ${local.length}.`;
    return "Indian mobile numbers start with 6, 7, 8 or 9. Please check the first digit.";
  }
  return "That number won’t connect. Use a 10-digit mobile, or the full number with its country code (e.g. +44…).";
}

export function checkEmail(raw: string, required: boolean) {
  const v = raw.trim().toLowerCase();
  if (!v) return required ? "Add your email so the course details can find their way to you." : "";
  if (!EMAIL.test(v)) return "That email looks a little lost. It should look like name@example.com.";
  const [user, domain] = v.split("@");
  const fix = DOMAIN_TYPOS[domain];
  if (fix) return `Did you mean ${user}@${fix}? A small typo and our reply ends up nowhere.`;
  return "";
}

export function checkMessage(raw: string) {
  const v = tidy(raw);
  if (!v) return "Tell us a little about what you need. One line is plenty.";
  if (v.length < 3) return "A few more words, please, so the right counsellor calls you.";
  return "";
}

export function checkCourse(raw: string) {
  return tidy(raw) ? "" : "Which course or country interests you? A rough idea is perfectly fine.";
}

/** An "Other" choice: the visitor types what they mean (e.g. a country that is not in the list). */
export const checkOther = (what: string, example: string) => (raw: string) =>
  tidy(raw) ? "" : `Which ${what}? Type its name, e.g. ${example}.`;

/** Valid scores per English test (official scales). Tests not listed here ("Other") are only checked for digits. */
const SCORE_SCALES: Record<string, { min: number; max: number; step: number; hint: string }> = {
  IELTS: { min: 0, max: 9, step: 0.5, hint: "0 to 9, in steps of 0.5 (e.g. 6.5)" },
  PTE: { min: 10, max: 90, step: 1, hint: "10 to 90 (e.g. 65)" },
  Duolingo: { min: 10, max: 160, step: 5, hint: "10 to 160, in steps of 5 (e.g. 115)" },
};

/** One optional score box ("Listening", "Overall"…) for the given test. */
export function checkScore(raw: string, test: string, part: string) {
  const v = raw.trim().replace(",", ".");
  if (!v) return "";
  if (!/^\d+(\.\d+)?$/.test(v)) return `${part}: numbers only, please (e.g. 6.5).`;
  const s = SCORE_SCALES[test];
  const n = Number(v);
  if (s && (n < s.min || n > s.max || (n - s.min) % s.step !== 0)) return `${part}: ${test} scores run from ${s.hint}.`;
  return "";
}

export type FormField = "name" | "email" | "mobile";

const SERVER_FIELDS: [RegExp, FormField, string][] = [
  [/^fullName: /, "name", "Our system couldn’t read this name. Letters, spaces and . ' - only, please."],
  [/^(phone: |Invalid phone number|Phone number is required)/, "mobile",
    "Our system couldn’t use this number. Please double-check it (10 digits, like 98765 43210)."],
  [/^email: /, "email", "Our system didn’t like this email. Please check it for typos."],
];

/**
 * The CRM has the last word. Its validation errors read "field: reason; field: reason" (and a bad phone
 * "Invalid phone number: …"); those become friendly messages on the matching fields. Anything else, e.g. "Too many
 * enquiries for this phone number; please try again later", is not about what was typed and comes back in `rest`,
 * to show as sent. Only the start of each part is matched, so a reason that merely mentions "phone" stays in `rest`.
 */
export function serverFieldErrors(detail: string): { fields: { field: FormField; message: string }[]; rest: string } {
  const fields: { field: FormField; message: string }[] = [];
  const rest: string[] = [];
  for (const part of detail.split("; ")) {
    const hit = SERVER_FIELDS.find(([re]) => re.test(part));
    if (hit && !fields.some((f) => f.field === hit[1])) fields.push({ field: hit[1], message: hit[2] });
    else if (!hit) rest.push(part);
  }
  return fields.length ? { fields, rest: rest.join("; ") } : { fields, rest: detail };
}
