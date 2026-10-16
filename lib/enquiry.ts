/** Sends website enquiries to the CRM's public intake (the tenant is configured, never hard-coded). */
export const CRM_TENANT = process.env.NEXT_PUBLIC_CRM_TENANT ?? "westernworldvisaservices";

export type Enquiry = {
  fullName: string;
  phone: string;
  email?: string;
  serviceInterest?: string;
  preferredCountry?: string;
  message?: string;
  /** Which form on which page, so staff know where the lead came from. */
  sourceDetail: string;
  website?: string; // honeypot
  captchaToken?: string; // Cloudflare Turnstile, when the site has a key
};

/** Thank-you page address: first name for the greeting, and `email=no` when none was given (no "check your inbox"). */
export const thankYouQuery = (fullName: string, email?: string) =>
  new URLSearchParams({ name: fullName.split(" ")[0], ...(email?.trim() ? {} : { email: "no" }) }).toString();

export async function submitEnquiry(e: Enquiry): Promise<{ message: string }> {
  const utm = new URLSearchParams(window.location.search);
  const offline = "Looks like the internet took a coffee break. Check your connection and try again, or just call us.";
  const res = await fetch(`/api/v1/public/tenants/${CRM_TENANT}/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...e,
      utmSource: utm.get("utm_source") ?? undefined,
      utmMedium: utm.get("utm_medium") ?? undefined,
      utmCampaign: utm.get("utm_campaign") ?? undefined,
    }),
  }).catch(() => {
    throw new Error(offline);
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.detail ?? "Our line is a little busy right now. Please try again in a minute, or give us a call.");
  }
  return body;
}
