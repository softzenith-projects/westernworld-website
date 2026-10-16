# Western World Visa Services website

Public marketing site for westernworldvisaservices.com, rebuilt in Next.js 16 + Tailwind v4. Every enquiry form posts
to the CRM's public intake, so each submission becomes a lead (or is added to the person's open lead). Email and
WhatsApp acknowledgements to the student are not switched on in the CRM yet, so the site only promises a call back.

This is a **tenant website**: it belongs to one client (Western World, CRM tenant `westernworld`) and changes whenever
they ask. The CRM itself lives in [softzenith-projects/softzenith-crm](https://github.com/softzenith-projects/softzenith-crm) and is
shared by all tenants. The two are connected only by the CRM's public enquiry API (below); no code is shared.

```bash
npm install
npm run dev -- -p 3001      # needs the CRM backend on :8081 for the forms
npm run build && npx next start -p 3001
```

| Setting | Default | Meaning |
|---|---|---|
| `CRM_API_URL` | `http://localhost:8081` | CRM backend; `/api/*` is proxied to it (no CORS needed) |
| `NEXT_PUBLIC_CRM_TENANT` | `westernworldvisaservices` | CRM tenant slug that receives the enquiries (owner, 8 Oct 2026: the production slug; onboard it before forms work). Must equal the CRM's `tenants.slug` |
| `CRM_PROXY_SECRET` | empty | Same value as the CRM's `CRM_TRUSTED_PROXY_SECRET` (32+ characters). Lets the CRM see each visitor's own address behind this site (`proxy.ts`); required in production, or the CRM's per-address enquiry limit counts all visitors together |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | empty | Cloudflare Turnstile captcha; leave empty locally (no captcha) |

Copy `.env.example` to `.env.local` to change them. Production sets them on the hosting platform.

## Connection to the CRM

The browser never calls the CRM. `next.config.ts` proxies exactly two public endpoints to `CRM_API_URL`:

| Endpoint | Used by |
|---|---|
| `POST /api/v1/public/tenants/{slug}/enquiries` | every form (`lib/enquiry.ts` → `submitEnquiry`): `fullName`, `phone`, optional `email`, `serviceInterest`, `preferredCountry`, `message`, `sourceDetail`, UTM fields, honeypot `website`, `captchaToken` |
| `GET /api/v1/public/tenants/{slug}/enquiry-form` | reserved (form options per tenant) |

Errors come back as RFC 9457 problem details (`detail` is shown to the visitor). The API is versioned (`v1`); a
breaking change in the CRM ships as `v2` and this site moves over deliberately. Everything else in the CRM (staff API,
dev login) is unreachable from this site's domain.

**Local development with the CRM:** clone both repos side by side and start the CRM (`.\dev` in softzenith-crm starts
this site on :3001 too when it finds `../westernworld-website`), or run the backend alone and `npm run dev -- -p 3001` here.
Without a backend the pages work; only form submits fail.

**Testing a form end to end (lead lands in the CRM):**
1. Start the CRM (`.\dev` in the CRM repo). Its `.dev-sites.json` `Dir` must point at this folder, relative to the CRM
   repo (e.g. `../Tenant Website/westernworld-website`), or start this site yourself with `npm run dev -- -p 3001`.
2. The tenant must exist in the local CRM. The dev data only seeds `demo`, so either onboard `westernworld` at
   http://localhost:3000/platform, or for a quick test put `NEXT_PUBLIC_CRM_TENANT=demo` in `.env.local` (restart
   `npm run dev`; remove it afterwards).
3. Submit a form on http://localhost:3001 (home boarding pass, contact page, a course "Book now"). You should land on
   `/thank-you`.
4. Check: the lead in the staff UI (http://localhost:3000, dev login with phone `9000000001` = Admin, or `9000000004` =
   Front Desk), with `sourceDetail` naming the form; the welcome and staff-alert emails in Mailpit (http://localhost:8025).
   A form error shows the CRM's message under the form (e.g. unknown tenant, invalid phone).

## Updating content (client requests)

| What | Where |
|---|---|
| Announcement bar (intakes, deadlines) | `content/announcement.ts`: new `id` per announcement, optional `deadline` for the live countdown, `enabled: false` hides it |
| News & blog posts | `content/posts.ts`: add an object; it appears on the home page, `/blog` and `/blog/<slug>` |
| Video testimonials | `content/testimonials.ts` → `VIDEO_STORIES`: add the YouTube id |
| Visa / IELTS result photos | `public/ieltsstu/` + the lists in `content/testimonials.ts` |
| Which photos lead the home "Wall of wins" | `content/testimonials.ts` → `FEATURED_WINS` (first = the large photo) |
| Logo | `public/images/logo.svg` (header and footer) |
| Theme colours (blue & white) | `app/globals.css` → `@theme` tokens (`brand`, `accent`, `sun`, `paper`, `line`) |
| Services | `content/services.ts` (each gets `/services/<slug>`) |
| Destinations board | `DESTINATIONS` in `lib/site.ts` (needs a matching entry in `content/countries.json`) |
| Phone, email, address, social links | `SITE` in `lib/site.ts` |

Then `npm run lint && npx tsc --noEmit && npm run build`, and deploy.

## Git

`main` = what is live, `develop` = next release. Branch `feat/<slug>` / `fix/<slug>` from `develop`, conventional
commits, PR into `develop`; `develop` → `main` to release.

## Content

- `content/*.json` were generated from the old site on 26 Sep 2026 (visible content only, HTML comments ignored):
  8 countries, 50 universities, 79 IELTS + 79 PTE city pages, student galleries and sliders. Images are in `public/`
  under their old paths (`download (1).jpg` became `download-1.jpg`).
- `content/copy.ts` holds text that several pages share (packages, IELTS test details, city-page copy).
- Page-specific text lives in each `app/**/page.tsx`.

## Old URLs

All old `.php` URLs, `/universities-detail.php?uid=N`, `/delhi/ielts-classes-*` and `/pte/pte-classes-*` redirect (308)
to the new pages (`next.config.ts`, `app/universities-detail.php/route.ts`).

## Known gaps inherited from the old site

- Study in Ireland (HTTP 500), the German-language page (404) and the only blog post (404) had no content. Ireland
  and USA show an enquiry form instead of a university list; the blog card leads to enrolment.
- 7 images were missing on the old server; those universities show a placeholder tile.
- Some university entries look like data-entry mistakes (uid 102 "Study in Canada", 107 "ST Michelle College11",
  empty descriptions). Kept as they were, for the client to clean up.
- Lorem-ipsum section subtitles ("Fusce sem dolor…") were not carried over.
- The old site's tawk.to live chat was removed (owner, 26 Sep 2026): chats went to an outside account and never became
  leads. Contact is by the enquiry forms (→ CRM leads) and the WhatsApp button. A chat can come back later as a CRM
  lead source (tawk.to webhook → intake).
