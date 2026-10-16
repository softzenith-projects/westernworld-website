import { NextResponse, type NextRequest } from "next/server";

/**
 * Tells the CRM who the visitor is. The enquiry calls reach the CRM from this site's servers (next.config.ts rewrites),
 * so without this the CRM would count every visitor as one address for its per-address limits and the captcha check.
 * With CRM_PROXY_SECRET (the CRM's CRM_TRUSTED_PROXY_SECRET) the visitor's address goes along; the CRM ignores the
 * address without the secret. Copies of these headers sent by the browser are always removed.
 *
 * On Vercel, x-real-ip / x-forwarded-for are set by the platform. On a host without a proxy in front, a visitor could
 * set them; that only moves them into another rate-limit bucket, which they could do by changing network anyway.
 */
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.delete("x-crm-proxy-secret");
  headers.delete("x-crm-client-ip");

  const secret = process.env.CRM_PROXY_SECRET;
  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (secret && ip) {
    headers.set("x-crm-proxy-secret", secret);
    headers.set("x-crm-client-ip", ip);
  }
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/api/v1/public/tenants/:slug/enquiries", "/api/v1/public/tenants/:slug/enquiry-form"],
};
