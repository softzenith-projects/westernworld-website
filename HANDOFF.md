# Handoff — 2026-10-16 (W6: no email/WhatsApp promise; earlier TRUST1)

Read `README.md` first (CRM connection, where content lives, git flow). CRM-side rules and history:
[softzenith-projects/softzenith-crm](https://github.com/softzenith-projects/softzenith-crm) (`CLAUDE.md`, `HANDOFF.md`).

## Task status

| # | Task | Status |
|---|---|---|
| W1 | Rebuild of the old PHP site: all content + old URLs, every form → CRM public intake (tenant `westernworld`) | done (on `main`) |
| W2 | Redesign: design system, boarding-pass form, 14 services, success stories + video slots, departures board, announcement bar, News & blogs | done (on `main`) |
| MOVE1 | Moved out of softzenith-crm (`sites/westernworld`) into this repo, history kept | done |
| W3 | Blue & white theme; student photos / testimonials moved up and highlighted on the home page | done (on `main`, c1f260e) |
| W5 | Form validation in the browser (all forms), friendly error copy | done (on `main`) |
| R1 | Whole-site code review: 5 fixes (CRM error mapping, thank-you email promise, mobile menu on Back, phone separators, dead code) | done (on `main`) |
| W4 | New SVG logo; owner's service names; live-site wording on home (welcome, why us, achievements, coaching); footer © 2021 | done (on `main`, c1f260e) |
| TRUST1 | `proxy.ts`: send the visitor's address + shared secret with enquiry calls (CRM `TrustedProxyFilter`); default tenant `westernworldvisaservices` | done (branch `feat/trust1-proxy`, PR #1 into `develop`) |
| W6 | Thank-you page and form notes no longer promise an email/WhatsApp confirmation (the CRM does not send them yet); thank-you shows call back, WhatsApp chat link, phone | done (branch `fix/thank-you-wording`, stacked on `feat/trust1-proxy`) |
| next | Owner copy review → merge `develop` → `main`; hosting (Vercel Pro) + domain + env (`CRM_API_URL`, `NEXT_PUBLIC_CRM_TENANT`, `CRM_PROXY_SECRET`, Turnstile key) | todo |
| later | Announcement / posts from the CRM (tenant settings) so staff update them without a deploy | idea |

## Session (latest): W6 — no confirmation promise for now (owner, 16 Oct)

### What I did
- The CRM staging server keeps student emails in a test inbox and WhatsApp is not connected, so the site stopped
  promising them: `app/thank-you/page.tsx` (cards: keep your phone handy / message us on WhatsApp via `SITE.whatsapp` /
  call), the note under `EnquiryForm` and the boarding pass footnote. `lib/enquiry.ts` still adds `email=no`; unused
  until confirmations come back.
- Site on Vercel (testing): https://westernworld-website.vercel.app, deployed from `main` of
  `softzenith-projects/westernworld-website`. Needs `CRM_API_URL=https://crm-staging-api.softzenithlabs.com` and
  `NEXT_PUBLIC_CRM_TENANT=westernworldvisaservices` (owner sets them in Vercel).

### Verification
- `tsc`, `lint`, production build.

## Session: TRUST1 — visitor address to the CRM behind Vercel (owner, 8 Oct)

### What I did
- `proxy.ts` (Next 16 proxy, matcher = the two public CRM endpoints): removes any `x-crm-proxy-secret` /
  `x-crm-client-ip` the browser sent, then adds `CRM_PROXY_SECRET` and the visitor address (`x-real-ip`, else the
  first `x-forwarded-for`). Without it, on Vercel the CRM would count every visitor as Vercel's address for its
  per-address enquiry limit (5/min, 30/h) and captcha check. The CRM trusts the address only with the matching secret
  (`CRM_TRUSTED_PROXY_SECRET`).
- Default `NEXT_PUBLIC_CRM_TENANT` → `westernworldvisaservices` (owner, 8 Oct: production slug). README, `.env.example`.

### Verification
- `tsc`, `lint`, production build ok. A production build against a local header echo server: forged headers are
  replaced; secret + visitor address arrive. Not yet checked on Vercel itself (do on the first preview deployment).

### Open for the owner
- Locally the onboarded tenant is still `western-world-visa-services` (`.env.local` sets it); production uses
  `westernworldvisaservices`.

## Session: R1 — whole-site code review and fixes (owner request, 5 Oct)

### Fixed
- `serverFieldErrors` (lib/validation.ts) replaces the substring match: only the CRM's "field: reason" parts
  (`fullName` / `phone` / `email`, plus "Invalid phone number…") go to fields; anything else (e.g. the rate limit
  "Too many enquiries for this phone number; please try again later", checked in the CRM's `EnquiryRateLimiter`)
  is shown as sent. Several field errors at once are all shown.
- Thank-you page: forms add `email=no` when no email was given (`thankYouQuery` in lib/enquiry.ts); the page then shows
  "Keep your phone handy" instead of promising an emailed confirmation.
- Header: the mobile menu closes on any route change, so Back/Forward no longer leave it open with the page scroll-locked
  (reproduced and re-checked in Playwright).
- Phone check ignores `/` and `_` separators too. Removed a no-op `.replace` (universities page) and the unused
  `data-source` / `source` prop on `Packages`.

### Reviewed, no change
Lead `sourceDetail` lengths (max 83 of 200), CSP, external links, old-URL redirects, announcement hydration.

### Follow-up (same day)
- Australia S1 2027 news post has a cover photo: `public/images/latest/australia-sydney-harbour.jpg` (Sydney Harbour,
  Unsplash photo-1506973035872, Unsplash licence: free use, no credit needed), cropped so the Opera House stays in
  the home-page card.

### Open for the owner
- Thank-you page says "A confirmation is on its way on WhatsApp": the CRM only logs WhatsApp in its demo setup.
  Confirm WhatsApp sending is configured in production, or soften the line.

## Session: W5 — form validation in the browser (owner request, 5 Oct)

### What I did
- `lib/validation.ts`: one set of rules for every form, matching the CRM so it does not reject what the browser
  accepted: name = CRM `NewLead.NAME_PATTERN` (letters in any script, spaces, . ' -, min 2 letters, no digits);
  phone = Indian mobile (10 digits, 6–9 first; `0`, `91`, `+91`, `0091` prefixes, spaces/dashes ok) or a `+country`
  number; email format + common domain typos ("gmial.com" → "Did you mean …gmail.com?"); message ≥ 3 chars; course
  required. Values are tidied before sending (trimmed names, lower-case email, phone as E.164 e.g. `+919876543210`).
  `serverFieldError` maps a CRM rejection (phone / email / name) to a friendly message on that field.
- `components/FormChecks.tsx`: `useFormChecks` (check on blur, then live while fixing; all on submit, focus the first
  problem) and `FieldError` (`role="alert"`, linked by `aria-describedby`, `aria-invalid` on the field). Forms are
  `noValidate`, so the browser's own bubbles are gone.
- Wired into `EnquiryForm` (every Call back / Book now / Enroll / Keep in touch form), `BoardingPass` (themed name
  message) and `NewsletterBox` (also gained an `aria-label`).
- `lib/enquiry.ts`: a network failure now shows a friendly message instead of "Failed to fetch"; the generic server
  fallback is friendlier too.
- Error copy is light-hearted and always says how to fix it (owner asked for "witty and easy to understand").

### Verification
- lint, `tsc`, build: pass. Rules run against ~30 sample inputs (Indian/foreign numbers, Hindi names, typos).
- Playwright on the dev server: empty submit shows every message and focuses the first field, nothing is sent;
  bad email/phone show inline; a valid form posts `+919876543210`; with no backend the friendly error shows.
  Contact page, home boarding pass and newsletter box checked.
- Not verified: a live submit against the CRM (backend not running).

## Session: docs — how to test forms against the CRM (5 Oct)
- README: "Testing a form end to end" (start CRM, tenant must exist locally: onboard `westernworld` at `/platform` or
  use `NEXT_PUBLIC_CRM_TENANT=demo`, where to see the lead and emails); content table now lists `FEATURED_WINS`, the
  logo and theme tokens. CLAUDE.md / AGENTS.md unchanged (rules still accurate; AGENTS.md is generated by `next dev`).
- Local only (not in any repo): the CRM's ignored `.dev-sites.json` pointed at `../westernworld-website`; fixed to
  `../Tenant Website/westernworld-website` so `.\dev` starts this site.
- Not verified this session: a live submit (CRM backend not running).

## Session: W4 — logo, service names, live-site wording (owner request, 5 Oct)

### What I did
- **Logo**: `public/images/logo.svg` (owner's file, checked: plain paths, no scripts or external refs; Next serves .svg
  unoptimized). Header and footer use it; `public/images/logo.png` is now unused (kept in case).
- **Footer**: `© 2021` fixed, as on the live site (was the current year).
- **Service names** (`content/services.ts`), owner's list, kept as written: Career Counselling, Profile Assessment,
  Profile Building, Apply to University, Interview Preparation, IELTS, PTE, TOEFL & Duolingo Preparation, FOREX Transfer,
  Education Loan, SOP Writing, Flight Booking, Accommodation in Every Country, Part-Time Job Assistance, Scholarships.
  Visa filing kept, renamed "Visa Support & Filing" (live site's box). Slugs and URLs unchanged.
- **Home (`app/page.tsx`), live-site wording**: new "Welcome to Western World Visa Services" section (after the wall of
  wins) with the live welcome text and its 3 boxes (Career Counselling, Visa Support & Filing, IELTS | PTE Training);
  "Why us?" now the live text in full; "How we are different" items use the live text; achievements back to the live
  four (2000+ students, 600+ reviews, 40+ courses, 375+ publications).

- **Header (follow-up)**: the top contact strip ("Rohtak ✈ the world…", phone, email, socials) is gone; address, email
  and socials stay in the footer and on the contact page. The main bar has a call button (icon; number shown from 1536 px)
  and the mobile menu lists phone, email and socials at the bottom. The announcement bar and the menu are now pinned
  together (`sticky` wrapper in `app/layout.tsx`); before, only the menu was sticky, so the bar scrolled away.

### Choices to confirm with the owner
- Live text lightly corrected, not copied blindly: typos ("Filling", "Wester world", "A extensive"), and the live
  welcome paragraph names **"TIPS Abroad Study"** (another business), so that name was removed. "Will be able to help
  clients achieve their student visas" softened (no visa guarantees).
- Not copied: the live IELTS General packages intro (it is the IELTS Academic description, factually wrong for
  General) and the "60% of PR eligibility" line in "Our courses". CELPIP / OET / GRE / GMAT not re-added to the menu
  (live links all point at the IELTS page; not in the owner's service list).

### Verification
- `npm run lint`, `npx tsc --noEmit`, `npm run build` (252 pages): pass. Playwright screenshots: header (1280 / 1536 px, scrolled; 400 px menu),
  welcome section, footer.

## Session: W3 — blue & white theme, photos up front (owner request, 5 Oct)

### What I did
- **Theme** (`app/globals.css` tokens only, no class renames): accent red → bright blue `#1f6feb`, `sun` yellow → pale
  sky `#a9d8ff` (name kept, see comment), `paper`/`line` warm beige → white / pale blue. Logo navy unchanged. Error text
  stays red (`EnquiryForm`, `BoardingPass`).
- **Photos first** (`app/page.tsx`): "Wall of wins" now comes straight after the hero (before the services ticker and
  the route), on white, with a proof strip (visas on camera / scorecards / 2000+ students) and a mosaic: first photo
  large, "Visa in hand" badge on every visa photo, 12 shown then "Show all". Video stories moved to their own navy band
  below it. Hero proof chip is bigger (5 faces in a white card).
- `content/testimonials.ts`: `FEATURED_WINS` (12 sharpest photos, first = the big one; reorder to change);
  `VISA_WINS` now lists them first. Home destination / why-us images are now explicit paths (indices moved).
- `PhotoWall`: `feature` (mosaic) and `badge` props; `WallOfWins`: `feature`, `light` props. `/success-stories`
  unchanged (dark, plain grid).

### Verification
- `npm run lint`, `npx tsc --noEmit`, `npm run build`: pass. Playwright screenshots at 1440 px and 400 px (hero, wall, test prep).

### Assumptions
- No written testimonials were added: the old site has none and quotes must not be invented. Real quotes (with the
  student's consent) or YouTube ids in `VIDEO_STORIES` would be the next credibility step.
- Featured photos chosen for sharpness and resolution only; owner may prefer other students first.

## Session: MOVE1 — website moved into its own repo

### What I did
- History: `git subtree split --prefix=sites/westernworld` in softzenith-crm, merged into this repo's initial commit
  (`main`). The W2 redesign (never committed in the CRM) is one commit on `develop`.
- README: CRM connection contract, content-update guide, git flow. This file, and `CLAUDE.md` for agents.
- Repo-local git config pins the `codewithnmn` GitHub account (same as softzenith-crm).

### Verification status
- Fresh clone: `npm ci` failed at first: `package-lock.json` (as carried over from the CRM repo) was out of sync with
  `package.json` (`@emnapi/*` optional deps). Regenerated with `npm install` (+26/-3 lines); `npm ci` now passes, which
  hosting platforms need.
- Then `npm run lint`, `npm run build` (252 static pages), `npx tsc --noEmit`: pass.
- `npm audit` reports advisories in dependencies; not auto-fixed (`--force` would upgrade majors). Review before go-live.

## Open questions for the owner
- Copy review (service pages, hero line, "No fees for counselling").
- Real Australia Semester 1 2027 deadline (placeholder 15 Nov 2026 in `content/announcement.ts`).
- Office address: Power House Chowk (site) vs SCO-76 & 168, Agro Mall (scorecards).
- YouTube ids for video testimonials.

## Session: W2 — Western World website redesign (owner request, 5 Oct)

### What I built 
- **Design system** (`app/globals.css`, `app/layout.tsx`): "travel documents" language. Logo navy + red on warm paper,
  Bricolage Grotesque (display) / Instrument Sans (body) / JetBrains Mono (ticket labels, `.tag`), self-hosted by next/font.
  Motion is CSS only and off under `prefers-reduced-motion`.
- **Content model**: `content/services.ts` (14 services in 4 legs: Plan / Prepare / Apply / Fly & settle; `TESTS`);
  `content/testimonials.ts` (`VISA_WINS` = the old site's visa-handover photos, `SCORECARDS` = IELTS cards, `VIDEO_STORIES` slots).
- **Home** (`app/page.tsx`): boarding-pass counselling form (`components/BoardingPass.tsx`: destination, timing, English-test
  status → CRM intake `message`, email optional), services ticker, "The route" (`components/journey.tsx` `JourneyRoute`),
  "Wall of wins" (`WallOfWins` + `PhotoWall`, native `<dialog>` lightbox), video stories (`VideoStories`: YouTube
  thumbnail facade, iframe only on click via youtube-nocookie), departures board for destinations (`DeparturesBoard`,
  `DESTINATIONS` in `lib/site.ts`), test prep + coaching method + IELTS packages, why us, FAQ. The hero slider is gone
  (7 images of 300–700 KB).
- **New pages**: `/services`, `/services/[slug]` (13 static pages; Visa filing → `/visa-assistance`, plus a redirect), `/success-stories`.
- **Header** mega menu (services by leg), Destinations / Test prep dropdowns; **footer** rebuilt. `blocks.tsx`,
  `EnquiryForm`, `NewsletterBox` restyled; other pages restyled by class swap only (content untouched).
- Desktop dropdowns (owner feedback): clicking a menu link closes the menu (`data-closed` on the hovered group, cleared when
  the pointer leaves); before, client-side navigation left it open under the cursor. Playwright-checked for all three menus.
- **Announcement bar** (owner request; restyled to the owner's slim navy reference: pulsing dot · message | "N days remaining" · Apply now): `components/AnnouncementBar.tsx`, content in `content/announcement.ts` (edit + redeploy;
  new `id` per announcement, optional `deadline` → live "closes in N days" computed in the browser, auto-hides after the
  deadline, closable per announcement via localStorage). **The Australia S1 2027 deadline (15 Nov 2026) is a placeholder: confirm it.**
  Later it could move to the CRM (tenant settings) so staff update it without a deploy.
- **News & blogs** (owner request): posts in `content/posts.ts` (kind News/Blog, tag, optional date/image, body blocks,
  CTA); `/blog` index with All/News/Blog tabs, `/blog/[slug]` article pages (static), home "News & blogs" section (latest
  large + two compact, "coming soon" slots until there are 3 posts); "News" in the nav. Seeded with the old site's IELTS post
  (its date is unknown, so undated) and an "Australia S1 2027 intake open" news post (no deadline stated in it).
- Contact strip under the banner is now light (white) so the navy announcement bar stands out (owner: "keep the contrast").
- Desktop nav now switches to the hamburger menu below 1280 px (8 items overflowed at 1024 px).
- `next.config.ts`: AVIF/WebP images, `i.ytimg.com` remote pattern, `frame-src` youtube-nocookie.

### Assumptions I made
- "Keep testimonials" = the old site's student photo walls (they had no written testimonials); all photos kept.
- The menu drops the old CELPIP / OET / GRE / GMAT entries: they pointed at the IELTS Academy page and are not in the
  owner's service list. Duolingo has no page; it is a section on `/services/english-test-preparation#duolingo`.
- Stats kept from the old site except "375 Publications" (meaningless for a consultancy); added "8 study destinations".
- Flight times on the departures board are typical DEL times, labelled as such.
- Service copy is a first draft, written to avoid guarantees (scholarships, jobs, visas) and named partners.

### What I could NOT verify / needs the owner
- **Copy review** of every service page, the hero line and "No fees for counselling" (boarding pass footnote).
- Real video testimonials: add YouTube ids in `content/testimonials.ts` (`VIDEO_STORIES`); empty slots show "coming soon".
- A live submit to the CRM backend (backend not running this session; the form uses the same `submitEnquiry` as before).
- Office address: scorecards show "SCO-76 & 168, Agro Mall, Rohtak" while `SITE.address` is Power House Chowk — confirm.

### Verification status
- `npm run lint`, `npx tsc --noEmit`, `npm run build`: pass (250 static pages).
- Playwright (from the CRM repo's frontend install) against `next start`: home, services, a service page, success stories, country page at
  1440 px and 390 px; no console errors, no horizontal overflow (also contact, city, university pages); mega menu,
  destination select, lightbox open/Esc verified. Home LCP ≈ 0.2 s locally; mobile above-the-fold images 6 KB.
- Old URLs still redirect (`/index.php`, `/study-in-canada.php` → 308).

### Git status
- Committed on `develop` in this repo when it moved out of softzenith-crm (see MOVE1).
