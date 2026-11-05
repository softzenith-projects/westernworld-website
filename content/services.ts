/**
 * Every service Western World offers, grouped into the four "legs" of a student's journey.
 * Each service gets a page at /services/<slug> unless `href` points at an existing page.
 * Names are the owner's own (5 Oct 2026); keep them as written. Descriptions are a draft for the owner to review
 * (no guarantees, no partner names, no fixed fees).
 */

export type Service = {
  slug: string;
  name: string;
  /** One line for cards and menus. */
  short: string;
  intro: string;
  includes: string[];
  goodToKnow?: string;
  /** An existing page that covers this service in depth (the card links there instead). */
  href?: string;
};

export type Leg = { id: string; label: string; title: string; blurb: string; services: Service[] };

export const LEGS: Leg[] = [
  {
    id: "plan",
    label: "Leg 01",
    title: "Plan",
    blurb: "Work out where you fit before you spend a rupee on applications.",
    services: [
      {
        slug: "career-counselling",
        name: "Career Counselling",
        short: "Pick the course and country that lead to the career you want.",
        intro:
          "A one-to-one session with a counsellor who looks at your marks, interests, budget and long-term plans, then maps out courses, countries and the jobs they lead to. You leave with a shortlist and a clear next step, not a sales pitch.",
        includes: [
          "One-to-one session, at our office or online",
          "Course and country options matched to your goals and budget",
          "Honest view of costs, intakes and work rights after study",
          "A written shortlist and timeline you can take home",
        ],
      },
      {
        slug: "profile-assessment",
        name: "Profile Assessment",
        short: "Find out where you stand: academics, gaps, tests and finances.",
        intro:
          "We review your academic record, study gaps, work experience, English test status and financial documents the way an admissions officer or visa officer would, and tell you plainly what is strong, what is weak and what to fix first.",
        includes: [
          "Review of marksheets, gaps and work experience",
          "English test readiness check (IELTS, PTE, TOEFL, Duolingo)",
          "Financial and sponsor document review",
          "List of universities you can realistically target",
        ],
      },
      {
        slug: "profile-building",
        name: "Profile Building",
        short: "Strengthen your application with the right projects, work and activities.",
        intro:
          "If your profile needs work, we plan what to add and when: certifications, internships, projects, volunteering or work experience that genuinely supports the course you are applying for.",
        includes: [
          "A month-by-month plan up to your application deadline",
          "Suggestions for certifications, internships and projects",
          "Guidance on explaining study gaps",
          "Review of your CV / résumé",
        ],
      },
    ],
  },
  {
    id: "prepare",
    label: "Leg 02",
    title: "Prepare",
    blurb: "Get the scores, the documents and the confidence in place.",
    services: [
      {
        slug: "english-test-preparation",
        name: "IELTS, PTE, TOEFL & Duolingo Preparation",
        short: "Coaching for every major English test, online or in class.",
        intro:
          "Our test-prep team coaches IELTS (Academic, General, UKVI), PTE Academic, TOEFL and the Duolingo English Test. Every student starts with a diagnostic, gets a personal study plan and sits regular mock tests until they are scoring their target band.",
        includes: [
          "Diagnostic test and personal study plan",
          "Small batches plus one-to-one sessions",
          "Regular full-length mock tests with feedback",
          "Online and classroom batches",
          "Free trial class before you enrol",
        ],
      },
      {
        slug: "sop-writing",
        name: "SOP Writing",
        short: "A statement of purpose that sounds like you and answers what officers ask.",
        intro:
          "Your statement of purpose is read by both the university and the visa officer. We interview you, help you structure your story and edit with you until it is clear, specific and honest. We also help with LORs, essays and gap explanations.",
        includes: [
          "Interview to understand your background and goals",
          "Structure and drafting guidance",
          "Rounds of editing until you are happy",
          "Help with LORs, essays and study-gap letters",
        ],
        goodToKnow: "We never sell copied or templated SOPs: universities run plagiarism checks, and so do visa officers.",
      },
      {
        slug: "interview-preparation",
        name: "Interview Preparation",
        short: "Mock university and visa interviews until you answer with confidence.",
        intro:
          "Some universities and some visas include an interview. We run mock interviews with the questions you are likely to face, give feedback on your answers and body language, and repeat until you are comfortable.",
        includes: [
          "University admission interview practice",
          "Visa / credibility interview practice",
          "Feedback on answers, clarity and confidence",
          "Document checklist for interview day",
        ],
      },
    ],
  },
  {
    id: "apply",
    label: "Leg 03",
    title: "Apply",
    blurb: "Applications, offers, funding and the visa file, tracked for you.",
    services: [
      {
        slug: "university-applications",
        name: "Apply to University",
        short: "Shortlist, apply and track every offer in one place.",
        intro:
          "We prepare and submit your applications to the universities and colleges on your shortlist, follow up with admissions teams and help you compare offers, conditions and deposits before you accept.",
        includes: [
          "Final shortlist and intake planning",
          "Application forms and document checks",
          "Follow-up with universities until a decision",
          "Offer comparison and acceptance guidance",
        ],
      },
      {
        slug: "scholarships",
        name: "Scholarships",
        short: "Find the scholarships and fee waivers you are eligible for.",
        intro:
          "Many universities offer merit scholarships, early-bird discounts and fee waivers that students never apply for. We look for the ones you qualify for, tell you the deadlines and help you with the applications and essays.",
        includes: [
          "Search for university and external scholarships",
          "Eligibility check against your profile",
          "Deadline tracking",
          "Help with scholarship essays and documents",
        ],
        goodToKnow: "Scholarships are decided by the university or funding body; we help you apply well, but nobody can promise an award.",
      },
      {
        slug: "education-loan",
        name: "Education Loan",
        short: "Compare loan options and get the paperwork right first time.",
        intro:
          "We explain secured and unsecured education loan options from banks and NBFCs, help you work out how much you need and prepare the documents, so the sanction letter is ready in time for your visa file.",
        includes: [
          "Guidance on loan amount, collateral and co-applicants",
          "Comparison of options available to you",
          "Document preparation and submission support",
          "Sanction letter timing aligned with your visa",
        ],
      },
      {
        slug: "visa-filing",
        name: "Visa Support & Filing",
        short: "A complete, consistent visa file, submitted and tracked.",
        intro: "Visa requirements differ by country. We prepare and check your file and keep you updated until a decision.",
        includes: [],
        href: "/visa-assistance",
      },
    ],
  },
  {
    id: "fly",
    label: "Leg 04",
    title: "Fly & settle",
    blurb: "Money, tickets, a place to live and your first job, sorted before you land.",
    services: [
      {
        slug: "forex",
        name: "FOREX Transfer",
        short: "Pay tuition and carry currency through authorised channels.",
        intro:
          "We help you pay tuition fees and deposits abroad and arrange forex cards and currency for travel through authorised dealers, with the paperwork your bank asks for.",
        includes: [
          "Tuition fee and deposit remittance",
          "Forex card and travel currency",
          "Help with the documents the bank needs",
        ],
      },
      {
        slug: "flight-booking",
        name: "Flight Booking",
        short: "Student fares and extra baggage, timed with your visa and course start.",
        intro:
          "Once your visa is approved we help you book flights that fit your course start date, with student fares and extra baggage where airlines offer them.",
        includes: [
          "Flights timed to your arrival date",
          "Student fares and baggage allowances where available",
          "Pre-departure checklist",
        ],
      },
      {
        slug: "accommodation",
        name: "Accommodation in Every Country",
        short: "University halls, student housing or homestay in every country we serve.",
        intro:
          "We help you find somewhere to live before you fly: university halls, private student housing, shared flats or homestays, depending on your city and budget.",
        includes: [
          "Options near your campus, within your budget",
          "Help with booking and deposits",
          "Advice on contracts and what to check before paying",
        ],
      },
      {
        slug: "part-time-jobs",
        name: "Part-Time Job Assistance",
        short: "CV, job search and the work rules for your visa.",
        intro:
          "Most student visas allow part-time work, within limits that differ by country and change from time to time. We brief you on the current rules for your visa and help you get job-ready with a local-style CV and where to look.",
        includes: [
          "Briefing on current work-hour rules for your visa",
          "Local-format CV and cover letter",
          "Where and how students find part-time work",
        ],
        goodToKnow: "Jobs are offered by employers; we help you prepare and search, but cannot guarantee a job.",
      },
    ],
  },
];

export const SERVICES: (Service & { leg: Leg })[] = LEGS.flatMap((leg) => leg.services.map((s) => ({ ...s, leg })));

export const service = (slug: string) => SERVICES.find((s) => s.slug === slug);

export const serviceHref = (s: Service) => s.href ?? `/services/${s.slug}`;

/** Free official practice material, linked from the test-prep section and each test's page (checked 5 Nov 2026). */
export type Practice = { label: string; by: string; url: string };

const PRACTICE = {
  ieltsAcademic: { label: "IELTS Academic sample test questions", by: "IELTS.org", url: "https://ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test" },
  ieltsGeneral: { label: "IELTS General Training sample test questions", by: "IELTS.org", url: "https://ielts.org/take-a-test/preparation-resources/sample-test-questions/general-training-test" },
  pte: { label: "Free PTE practice with Smart Prep", by: "Pearson PTE", url: "https://www.pearsonpte.com/pte-academic/preparation#free" },
  toefl: { label: "TOEFL iBT free sample test", by: "ETS", url: "https://www.ets.org/toefl/test-takers/ibt/prepare.html" },
  duolingo: { label: "Duolingo English Test free practice test", by: "Duolingo", url: "https://englishtest.duolingo.com/practice" },
} satisfies Record<string, Practice>;

export type Test = { name: string; note: string; href: string; practice: Practice };

/** English tests covered by "IELTS, PTE, TOEFL & Duolingo Preparation" (Duolingo has no page of its own yet). */
export const TESTS: Test[] = [
  { name: "IELTS Academic", note: "Universities and colleges", href: "/ielts-academy", practice: PRACTICE.ieltsAcademic },
  { name: "IELTS General", note: "Work and migration", href: "/ielts-general", practice: PRACTICE.ieltsGeneral },
  { name: "UKVI IELTS", note: "UK visa applications", href: "/ukvi-ielts", practice: PRACTICE.ieltsAcademic },
  { name: "PTE Academic", note: "Computer-based, fast results", href: "/pte", practice: PRACTICE.pte },
  { name: "TOEFL iBT", note: "Popular with US universities", href: "/toefl", practice: PRACTICE.toefl },
  { name: "Duolingo English Test", note: "Online, at home, about an hour", href: "/services/english-test-preparation#duolingo", practice: PRACTICE.duolingo },
];

/** The test whose page is `href` (for the "Try a free sample test" card on test pages). */
export const testAt = (href: string) => TESTS.find((t) => t.href === href);
