# Handoff — 2026-11-06 (W10: student photos in one place + destination photo cards; earlier W9, W8, W7)

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
| W7 | Owner's notes (20 Oct): destinations list + "Other", boarding pass timing / test scores, winding route with picture signs, new numbers, branches, Rohtak SEO phrases | done (branch `feat/client-notes-20oct`, PR into `develop`); logo waits for the owner's file |
| W8 | Owner's notes (5 Nov): Drive testimonial photos + posters, 4k+ / 5k+ headlines, interactive route icons, free sample test links | done (same branch and PR as W7) |
| W9 | Owner's promo (6 Nov): popup on landing (their artwork + the real form with "Other" → type it; × / Esc / outside click; quiet 7 days after closing or sending), same artwork replaces the home hero headline; stricter "Other" check site-wide | done; on `develop` (a30e430, pushed directly, owner's request 6 Nov) |
| W10 | Premium refresh tried and reverted (owner: back to the W9 design), keeping only the destination photo cards; home shows student photos in one place (3 cards) | done; on `develop` (a30e430) |
| next | Owner copy review → merge `develop` → `main`; hosting (Vercel Pro) + domain + env (`CRM_API_URL`, `NEXT_PUBLIC_CRM_TENANT`, `CRM_PROXY_SECRET`, Turnstile key) | todo |
| later | Announcement / posts from the CRM (tenant settings) so staff update them without a deploy | idea |

## Session (latest): W10 — student photos in one place, destination photo cards (owner, 6 Nov)

### What happened
- A full premium redesign (new heading font, timeline, services overview, new header / footer / phone bar…) was built,
  then **reverted at the owner's request**: the site is back to the W9 design. A copy of that redesign is outside the
  repo (session scratchpad), not needed unless the owner asks for parts of it again.
- **Kept from it, owner's choice: the destination photo cards** (`components/Destinations.tsx`, "Where will you study
  next?"), replacing the departures board (`components/journey.tsx` deleted, its `.flap` CSS removed). Photos:
  `public/images/destinations/<slug>.jpg`, 10 Unsplash photos (Unsplash License: free use, no credit required;
  ≤ 1200 px, metadata stripped); `photo` / `scene` (alt text) per destination in `DESTINATIONS` (`lib/site.ts`), with
  the photographers listed there.
- **Student photos in one place on the home page** (owner, with a Figma reference: "photos at only 1 place"): the wall
  of wins is now three cards (first three of `FEATURED` in `content/testimonials.ts`: photo, first name, country,
  "Visa approved") and a link to `/success-stories` for all photos, posters and scorecards. Removed from home: the
  poster reel, the photo beside "Where to?" and the photo + 5,000+ badge beside "Why us?". On phones the three cards
  are a swipeable row. `/success-stories` is unchanged (full wall).
- Hero: "we can help.", its underline swoosh and "today!" are now theme blue (`accent`) instead of the logo red
  (owner, 6 Nov). Red (`flame`) remains only on the popup form's required-field asterisks and its close button hover.
- Hero headline now says what we do (owner: "Tell us how we can help" alone did not): pill "Study visa consultant ·
  IELTS & PTE coaching · Rohtak", h1 "Study in the UK, Canada or Europe. We guide every step.", a line listing the
  services; "Tell us how we can help. It takes under a minute." now leads into the promo's three steps. Copy is ours:
  owner to review. Promo popup unchanged (still opens 2.5 s after landing; quiet 7 days after closing or sending).
- **Numbers once** (owner, 6 Nov): the four numbers (`STATS`) are now a navy strip at the foot of the hero, under the
  form (`NumbersStrip` in `components/NumbersBand.tsx`; numbers stacked under their icons so "Countless" fits at
  360 / 1024 px). Removed from home: the promo's 3-item trust band (Trusted counsellors / 5,000+ students guided / High
  visa success rate, with the yellow sweep), the separate navy numbers band, the "Why us?" stats grid, and the number
  in the photos heading (now "Success stories · Real students. Real visas."). About page still uses the full band.
- **Soft photos fixed** (owner: "low quality pics on home page"). The files were never changed (`public/wins/` is as
  committed); the `sizes` hints were too small, so browsers fetched small versions and stretched them: student photos
  are landscape but cropped into 4:5 cards (drawn ~1.45x wider than the card), and the two-column Singapore / Cyprus
  cards were sized as one column. New per-card `sizes` (`SIZES` in `components/Destinations.tsx`, student cards in
  `app/page.tsx`), quality 85 for those photos (`images.qualities: [75, 85]` in `next.config.ts`, needed in Next 16),
  and the large UK card's photo re-saved at 1280 x 1600 (it was 960 wide). Measured: every one of the 13 home photos
  gets at least the pixels it is drawn at, at 1x / 1.25x / 1.5x / 2x desktop and 3x phone.
- **Contact page form** (owner: "the weakest of all"): now the same dark call-back card as About (`CallbackCard`,
  extended with `fields` / `defaults` / `courseLabel` / `submitLabel` / `id`), keeping the contact page's fields
  (name, email, mobile, "Interested in" = course), the `?course=&country=&email=` pre-fill and the `#enquiry` anchor
  every enquiry link lands on; first on phones. Checked: pre-fill, anchor, validation, submit (CRM mocked) → lead with
  `serviceInterest`, `preferredCountry`, source "Call back (Trial class)" → /thank-you. On `develop`.
- Note: `next dev` (port 3100) had left `.next/dev/types/routes.d.ts` and `validator.ts` half-written, which broke
  `tsc` and `next build`; deleted those two generated files and they were regenerated.

### Assumptions to confirm with the owner
- Which three students lead (now Aman · UK, Nikita · Canada, Armann · Germany): reorder `FEATURED` to change.
- Ireland's photo licence was read from the Unsplash search listing (no Unsplash+ marker), not its own page.

### Verification
- `npm run lint`, `npx tsc --noEmit`, `npm run build` (255 pages): pass.
- Playwright on `next start`: home at 360 / 375 / 393 / 768 / 1024 / 1440 / 1920 px, no horizontal overflow, clipped
  text or console errors; screenshots checked at 1440 and 375. Boarding pass: empty submit shows errors and sends
  nothing; valid submit (CRM reply mocked) lands on `/thank-you` with `+919876543210`, `preferredCountry: Canada`,
  scores and source "Boarding pass (home)". 27 routes (incl. old `.php` redirects, a 404) answer as expected.

## Session: W9 — promo popup and promo artwork on the home page (owner, 6 Nov)

### What I did
- Owner's promo image (1600×900, sent in chat) cut into `public/images/promo/promo-popup.jpg` (left part, logo to
  trust band). Metadata stripped.
- `components/PromoPopup.tsx` (in `app/layout.tsx`, every page): opens 2.5 s after landing; native `<dialog>` (focus
  kept inside, Esc / × / click outside close it). Closing or sending stores `ww-promo-closed` in localStorage: no popup
  for 7 days. Never on `/thank-you`; sending from it lands there and closes it. Artwork left (flags above it), form right.
- `components/ConsultationForm.tsx`: Full Name *, Mobile *, Email, Interested In, Preferred Country, Message (the
  mock-up's fields). "Other" in either list shows a box; the typed value goes to the CRM in place of "Other". Source
  `Promo popup`. `compact` for the popup.
- Home hero laid out like the owner's promo, words only, no photos (owner: the artwork "looks out of place", and they
  "dont like this boxy pattern behind"): sky-blue gradient (map grid kept only behind the boarding pass), "Your study
  abroad partner", h1 "Tell us how we can help." (red, with swoosh), intro, three promise pills (`HERO_STEPS`), navy
  trust band with the yellow sweep (`HERO_PROOF`), destination chips above the form, and a "Plan your study abroad
  journey today!" strip with the phone number. Stamps and the See the route / Call buttons removed (the strip calls).
- `components/Flags.tsx` (SVG: emoji flags are letters on Windows; `DestinationChips` shared by popup and hero). `lib/site.ts` `INTERESTS`.
  `globals.css`: `flame` (logo red), `gold` (button yellow).
- `lib/validation.ts` `checkOther`: also refuses filler ("na", "other", "aaaa"), mostly digits and odd symbols. The
  boarding pass's "Other" country / test boxes get it too.
- A first try, a separate `/enquiry` page with visa photos, was dropped (owner: not what they meant).

### Assumptions I made
- The artwork's own text stays as the owner made it, including "We confirm your enquiry straight away", "5000+
  Students Guided" and "High Visa Success Rate". The CRM sends no confirmation yet (W6): owner to confirm or send a
  revised image.
- **Study visas 4,000+ → 5,000+ everywhere** (owner, 6 Nov, to match the artwork): `content/stats.ts`, numbers band,
  home wall title and "Why us" badge, success stories, about. Tourist visas stay 5,000+. Baked-in text is repeated in the alt text.
- `INTERESTS` is our draft list: owner to review. `FEATURED_WINS` (content/testimonials.ts) is no longer used on the
  home page; kept as data.

### Verification status
- `npm run lint`, `npm run build`, `npx tsc --noEmit` pass. Browser (1440 px, 390 px): popup opens, × closes it,
  stays closed after reload; sending from the popup (CRM reply mocked) went to /thank-you with the popup closed and
  `preferredCountry: "Australia"` from the "Other" box.

## Session: W8 — Drive photos, headline numbers, interactive stages, sample tests (owner, 5 Nov)

### What I did
- **Testimonial photos** from the owner's public Drive folder (179 files, ~60 iPhone HEIC). Converted to JPG, longest
  side 1600 px (posters 1200), EXIF stripped (phone photos can carry GPS), perceptual-hash de-duplicated (HEIC original vs
  renamed copy, repeated posters). Result: **102 handover photos** in `public/wins/` and **30 "Congratulations" posters**
  in `public/wins/posters/` (34 MB). 27 of the 33 old `public/ieltsstu/ielts*.jpeg` were lower-resolution copies of
  these: deleted, and `content/media.json` galleries now point at the new files; ielts5/8/9/25/26/27 stay (not in Drive).
- `content/testimonials.ts`: `VISA_WINS` / `FEATURED_WINS` are now `{ src, name?, country? }`; first name and country
  come from the owner's file names ("Ankit Saharan CND" → Ankit · Canada) or that student's poster ("Ashish Pc" + poster
  "UK visa"). `VISA_POSTERS`, `winLabel`, `winAlt`. Photos without a name show "Visa in hand".
- **Wall of wins** (`WallOfWins`, `PhotoWall`): tabs Visas in hand (108) / Congratulations posters (30) / IELTS
  scorecards (19); country filter chips (All · UK 42 · Canada 30 · Germany 1); each photo has a "Name · Country" badge,
  shown in the lightbox too; per-photo alt text.
- **Headlines / numbers** (owner: "4k+ satisfied students with student visa, over 5k tourist visa"): `STATS` in
  `app/page.tsx` now 4000+ students with a study visa, 5000+ tourist visas, 2000+ IELTS / PTE results, countless happy
  families. New navy band right after the hero, "4,000+ students got their study visa with us. Yours could be next.",
  with icons and numbers that count up when scrolled into view (`components/CountUp.tsx`; server renders the final
  number, so no-JS / SEO / reduced motion see it). Hero chip, wall title ("4,000+ happy students. One visa at a time."),
  why-us badge and `/success-stories` heading use the new numbers.
- **Poster reel** on home ("Congratulations, you are flying!"): the posters scroll sideways, pause under the pointer.
- **Interactive stages** (owner: "interactive icons for stages rather than photos"; follow-up the same day: "aggregate
  all same phase things in 1 box, a bit more interactive"): `components/JourneyRoute.tsx` (client) replaced the winding
  road. One box per leg (Plan / Prepare / Apply / Fly & settle: icon, blurb, its stops as icon rows); a plane on a track
  above flies to the active leg; the chosen stop opens a detail panel (what it includes, "Learn more", "Ask about this");
  prev / next buttons; an "Arrival · Your campus abroad" bar links to free counselling. Large screens: the tour plays by
  itself (4.5 s a stop, a bar under the stop fills) once the route crosses the middle of the screen, pauses under the
  pointer or keyboard focus, stops when a stop is chosen, "Play the journey" restarts it. Phones / tablets: no autoplay;
  the detail opens inside the tapped box. Reduced motion: no autoplay, no animation. Coaching stages (test prep) have
  icons instead of plain numbers.
- **Animated illustrations** (owner: "interactive gifs or animations for contact us, like a figure with phone in hand,
  similarly wherever applicable"): `components/Illustrations.tsx`, inline SVG drawn for this site (no GIFs, no stock
  art, no new dependency, CSP unchanged), animated by `.ill-*` CSS in `app/globals.css` (livelier on hover; still
  pictures under reduced motion). Restyled the same day after the owner's flat-illustration reference ("the hands are very weird"): a person in three-quarter view at a desk (chair, long hair, tube sleeves with mitten hands, laptop seen from behind, steaming mug, floating square / circle / twinkles). Scenes: `CallScene` (counsellor at the desk, phone at the ear, typing with the other hand, speech
  bubbles; contact page, top of the left column with Call / WhatsApp buttons), `CallbackScene` (ringing phone + confetti;
  thank-you page), `LostScene` (standing, both hands holding a map, question marks; 404), `StudyScene` (headphones, typing, typing-dots bubble, stopwatch; the
  "Try before you train" band on large screens), and `StampScene` (stamp lands "APPROVED" on a passport; visa assistance).
- **Services page** (`app/services/page.tsx`, owner: "make them interactive"): an overview of the four legs under the
  hero (icon, count, the services' icons; jumps to the leg); each leg's sticky column has its icon, "Leg 02 · 2 of 4", a
  4-step progress bar and "Next leg" link; each card has its service icon and stop number, a glow that follows the
  pointer and a lift on hover (`components/CardGrid.tsx`, client), its "What you get" list (first 3 `includes`, always
  shown so nothing jumps; comes into focus on hover) and "Ask about this" (form, pre-filled). The whole card links to the
  service page. Cards rise in one by one when scrolled into view. Service / leg icons now live in
  `components/serviceIcons.ts` (`ServiceIcon`, `LegIcon`), shared with the route.
- **Site-wide playfulness** (owner: "find similar opportunities across other pages, as interactive and playful as you
  can"):
  - `components/Motion.tsx` (client, in the sticky header, `app/layout.tsx`): a scroll-progress line under the header
    with a small plane at its tip; scroll reveal for any `.reveal` element below the fold (`--i` staggers; on-screen
    elements, no-JS and reduced motion are simply shown; re-run on each navigation and safe on a re-run).
  - `components/blocks.tsx`: `PageHero` (every inner page) has a plane flying a dashed arc (CSS `offset-path`) past a
    slowly turning "WWVS" stamp, title / subtitle rise in; `SectionTitle`, `Feature`, `TestDetails` cards and
    `SampleTests` cards rise in and react on hover; `Packages` are tickets (notches, cursor glow via `CardGrid`, lift,
    pulsing "Most chosen"); `CtaBand` has a dashed flight path and a drifting plane.
  - Service pages: a strip of all 14 stops under the hero (this one lit, earlier ones blue, each links to its service),
    "Stop 05 of 14" in the hero label, the service icon beside the intro, "How it works" with icons and a dashed
    connector, related services with icons, previous / next stop.
  - Country pages: a "DEL → LHR" boarding strip under the hero (plane crossing a dashed line, flight time,
    universities, "Board here: free counselling"); university cards rise in, lift, zoom the photo.
  - University pages: `components/DocChecklist.tsx`, the requirements as a tick list with a progress bar ("3 of 5
    ready") and "Book a file check" when all are ticked (nothing is saved or sent).
  - About: the numbers band (now `components/NumbersBand.tsx`, numbers in `content/stats.ts`, shared with home) and
    badges that rise in. Footer: "Fly back to top", destination links nudge. Blog cards lift; the plane on text covers
    takes off on hover. FAQ answers slide open. City pages, visa destinations (globe spins), "We also coach for" chips.
  - Checked: 12 page types at 1440 / 390 px, no console errors (except the existing missing
    `/university/lancaster-university.jpg`, 400), no horizontal overflow, no element left hidden after scrolling,
    progress reaches 1, checklist reaches "5 of 5" and shows the banner.
- **Sample tests** (owner: "sample tests / IELTS / TOEFL link to cover courses"): `PRACTICE` + `testAt` in
  `content/services.ts` (official free material, URLs checked 5 Nov: IELTS.org Academic / General Training sample
  questions, Pearson PTE "Prepare for free" section, ETS TOEFL iBT free sample test page, Duolingo practice test).
  Home test prep is now `SampleTests` (each test: our course + free sample test); `PracticeBand` ("Try before you
  train" + book a free trial class) on IELTS Academy / General / UKVI, PTE, TOEFL, online / classroom courses, IELTS /
  PTE classes and every city page; the English-test service page's "Pick your test" rows have a sample test link.
  External links open in a new tab (no CSP change needed).

### Assumptions to confirm with the owner
- **Student first names** are shown on photos (from the owner's file names; the posters already show full names).
  Remove `name` from the rows in `content/testimonials.ts` if they should not appear.
- Countries guessed from the poster of the same name for "Pc" / "Pic" / "R" files; unknown ones say "Visa in hand".
- 4000+ / 5000+ replace 500+ / 1000+ from 20 Oct. Headline lines ("Yours could be next", "Holidays, family visits and
  graduations", "Proud parents at every airport goodbye") are mine. No "free mock test" promised; links offer the free
  trial class the FAQ already offers.
- "More reference images to make the website interactive": no images came with the note; waiting for them.

### Verification
- `npm run lint`, `npx tsc --noEmit`, `npm run build` (255 pages): pass.
- Playwright on `next start` at 1440 / 1024 / 390 px over home, success stories, IELTS Academy, TOEFL, PTE, English test
  service page, IELTS classes: no console errors, no horizontal overflow. Count-up ends at 4,000+ / 5,000+ / 2,000+;
  Canada filter shows 30 photos with labels; lightbox caption; posters tab; route reveal ("shown"), Apply leg highlight
  + hover note; practice links resolve to the official pages. Phase boxes (follow-up): tour advances at 1440 / 1024 px, not at 390 px; picking Scholarships opens its detail and stops the tour; next button; no overflow. Screenshots checked (numbers band fixed on phones).

## Session: W7 — owner's handwritten notes (20 Oct)

### What I did
- **Destinations** (`DESTINATIONS`, `lib/site.ts`): the owner's list and order: UK, Canada, Germany, Finland, USA, New
  Zealand, Ireland, Malta, Singapore, Cyprus. Finland, Malta and Cyprus are new in `content/countries.json` (no
  universities yet, so their pages show an enquiry form; `legacyPath: null`). France is off the menu, board, footer and
  form (not on the owner's list); `/study-in/france` and its old URL still work. Footer code strip is built from the list.
- **Boarding pass** (`components/BoardingPass.tsx`): "To" has "Other country", which shows a required "Which country?"
  box (the big code shows its first 3 letters). "Planning to fly": As early as possible / Within 3 months / In 3–6
  months / Not sure yet. "English test: Have my score" opens a panel: IELTS / PTE / Duolingo / Other (+ required test
  name) and optional L / R / W / S / Overall boxes, checked against each test's scale (`checkScore`, `checkOther` in
  `lib/validation.ts`). The CRM gets it in `message`, e.g. `English test: Have my score (PTE)` +
  `Scores: Listening 79 · Reading 72 · …`; `preferredCountry` is the typed country for "Other".
- **The route** (`JourneyRoute`, `components/journey.tsx`): the owner's sketch, a road winding left→right, U-turn,
  right→left… through the 14 services (rows of 5) to "Your campus abroad", each stop a blue road sign with a picture
  (lucide icon per service in `SIGNS`). Phones/tablets: one road down the page. Old `plane` keyframes / `.fly` removed.
- **Numbers** (home `STATS`): 500+ study visas, 2000+ IELTS / PTE results, 1000+ tourist visas, countless happy
  families (2 × 2 grid). "500+ study visas" also replaces "2000+ enrolled students" in the wall-of-wins strip and the
  why-us badge.
- **Branches** (`BRANCHES`, `lib/site.ts`): Rohtak (head office, address known), Bahadurgarh, Rohini, Tohana, Dwarka.
  `BranchList` (`components/blocks.tsx`) on the contact page and the home "Visit us" card; footer line "Branches: …".
  Branches without an address show as town chips with "call for directions"; adding `address` shows it in full.
- **SEO phrases** (visa agent / visa consultant / IELTS coaching / PTE coaching in Rohtak, UK / Canada / Europe visa):
  default title + description + keywords (`app/layout.tsx`); hero tag; new home section "Your visa consultant in
  Rohtak" (`#rohtak`, cards link to the pages below); `/visa-assistance` title, description and UK / Canada / Europe
  visa cards (`#uk-visa`, `#canada-visa`, `#europe-visa`); `/ielts-academy` and `/pte` titles, descriptions, subtitles.
- Copy is mine and needs the owner's review (no guarantees; "visitor visas" because the owner counts tourist visas).

### Assumptions to confirm with the owner
- "B'G" = Bahadurgarh. "1000+" tourist visas (the first digit is overwritten in the note). Dropping France.
- Flight times for Helsinki (9h 10m), Malta (11h 30m, 1 stop) and Larnaca (9h 40m, 1 stop) are estimates.
- Australia is not on the owner's destination list, although the announcement bar and news post are about Australia.

### Not done (needs the owner)
- **Logo change** (owner, 12 Nov 2026): done. New square badge (globe, graduation cap, "WESTERN WORLD", plane) traced
  from the owner's JPEG (`WhatsApp Image 2026-11-09 at 7.49.37 PM.jpeg`) into `public/images/logo.svg`: two flat
  colours (#0a289b blue, #f24910 orange), plain paths only, no scripts or external refs; the "IELTS • PTE • STUDY VISA"
  line under it was left out (unreadable at header size). Header `h-14 sm:h-16`, footer `h-24`.
- **More visa / result photos, office photos**: done in W8 for visa photos (Drive folder); office photos have no slot yet.
- **Branch street addresses** for Bahadurgarh, Rohini, Tohana, Dwarka (`BRANCHES[].address`).

### Verification
- `npm run lint`, `npx tsc --noEmit`, `npm run build` (255 pages): pass.
- Playwright on `next start` at 1440 / 1024 / 390 px: no horizontal overflow, no console errors; "Other" country +
  PTE scores submitted (CRM call intercepted): payload above, lands on `/thank-you`; out-of-range score, empty "Other"
  country and empty test name show their messages. Screenshots checked: route (all widths), form, Rohtak section,
  contact offices card, footer.
- Not verified: a live submit to the CRM (backend not running).

## Session: W6 — no confirmation promise for now (owner, 16 Oct)

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
