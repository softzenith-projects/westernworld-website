/** Business details shown across the site. */
export const SITE = {
  name: "Western World Visa Services",
  shortName: "WWVS",
  legalName: "Western World Visa Services Pvt. Ltd.",
  url: "https://www.westernworldvisaservices.com",
  address: "1st Floor, POWER HOUSE CHOWK, above CANARA Bank, Model Town, Rohtak, Haryana 124001",
  phones: ["+91-7027022554", "+91-9812727721"],
  email: "info@westernworldvisaservices.com",
  whatsapp: "https://api.whatsapp.com/send?phone=917027022554",
  webmail: "https://webmail.westernworldvisaservices.com/",
  social: {
    facebook: "https://www.facebook.com/westernworldvisaservices/",
    instagram: "https://www.instagram.com/westernworldvisaservices/?hl=en",
    linkedin: "https://in.linkedin.com/in/western-world-visa-services-288826235?trk=public_profile_browsemap",
  },
  footerAbout:
    "Western World Visa Services is an overseas educational consultancy dedicated towards providing services to Indian students in making educational avenues in countries...",
};

export const tel = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`;

export type NavItem = { label: string; href: string; children?: NavItem[] };

/**
 * Study destinations, each with its nearest major airport and a typical flight time from Delhi (for the destination
 * cards and the boarding pass). The owner's list and order (20 Oct 2026); each needs a matching entry in
 * content/countries.json. France is not on the list: its page (/study-in/france) still exists but is no longer in the
 * menu, cards or forms.
 *
 * `photo`: public/images/destinations/<slug>.jpg, from Unsplash (Unsplash License: free to use, no credit required;
 * downloaded 6 Nov 2026, resized to 1200 px, metadata stripped). Photographers, for the record: UK Tom Athawes, Canada
 * mwangi gatheca, Germany Xander Gonera, Finland Xavier Coiffic, USA Patrick Tomasso, New Zealand Sulthan Auliya,
 * Ireland Alessandro Santoro, Malta Michail Tsapas, Singapore Arul Kumaran, Cyprus Hert Niks.
 */
export const DESTINATIONS = [
  { slug: "uk", name: "UK", code: "LHR", city: "London", flight: "9h 45m", photo: "/images/destinations/uk.jpg", scene: "Big Ben and the Palace of Westminster at sunset" },
  { slug: "canada", name: "Canada", code: "YYZ", city: "Toronto", flight: "14h 30m", photo: "/images/destinations/canada.jpg", scene: "Toronto and the CN Tower at golden hour" },
  { slug: "germany", name: "Germany", code: "FRA", city: "Frankfurt", flight: "8h 40m", photo: "/images/destinations/germany.jpg", scene: "The Brandenburg Gate in Berlin" },
  { slug: "finland", name: "Finland", code: "HEL", city: "Helsinki", flight: "9h 10m", photo: "/images/destinations/finland.jpg", scene: "Helsinki Cathedral" },
  { slug: "usa", name: "USA", code: "JFK", city: "New York", flight: "15h 30m", photo: "/images/destinations/usa.jpg", scene: "The Manhattan skyline over the East River" },
  { slug: "new-zealand", name: "New Zealand", code: "AKL", city: "Auckland", flight: "16h 30m", photo: "/images/destinations/new-zealand.jpg", scene: "Auckland and the Sky Tower across the harbour" },
  { slug: "ireland", name: "Ireland", code: "DUB", city: "Dublin", flight: "11h 50m", photo: "/images/destinations/ireland.jpg", scene: "The Ha'penny Bridge over the River Liffey in Dublin" },
  { slug: "malta", name: "Malta", code: "MLA", city: "Valletta", flight: "11h 30m", photo: "/images/destinations/malta.jpg", scene: "A Valletta street of wooden balconies above the Grand Harbour" },
  { slug: "singapore", name: "Singapore", code: "SIN", city: "Singapore", flight: "5h 50m", photo: "/images/destinations/singapore.jpg", scene: "Marina Bay, Singapore, at dusk" },
  { slug: "cyprus", name: "Cyprus", code: "LCA", city: "Larnaca", flight: "9h 40m", photo: "/images/destinations/cyprus.jpg", scene: "The palm-lined seafront in Larnaca" },
] as const;

/**
 * "Interested in" on the enquiry page (/enquiry), drawn from the services and numbers on this site; the owner reviews
 * the list. The form adds "Other" with a box to type in, like the destinations.
 */
export const INTERESTS = [
  "Study visa", "Tourist / visitor visa", "IELTS / PTE coaching", "TOEFL / Duolingo coaching", "Career counselling",
  "Education loan & scholarships",
] as const;

export type Branch ={ name: string; area: string; address?: string; head?: boolean };

/**
 * Offices (owner, 20 Oct 2026: Rohtak, B'garh, Rohini, Tohana, Dwarka). Only Rohtak's street address is known; add
 * `address` to the others when the owner sends them (they then show it instead of "call for directions").
 */
export const BRANCHES: Branch[] = [
  { name: "Rohtak", area: "Haryana", address: SITE.address, head: true },
  { name: "Bahadurgarh", area: "Haryana" },
  { name: "Rohini", area: "Delhi" },
  { name: "Tohana", area: "Haryana" },
  { name: "Dwarka", area: "Delhi" },
];

/**
 * Main menu. "Services" is a mega menu built from content/services.ts in the header.
 * Every page of the old menu stays reachable (menu, footer or the services pages).
 */
export const NAV: NavItem[] = [
  { label: "Services", href: "/services" },
  {
    label: "Destinations",
    href: "/study-in/canada",
    children: DESTINATIONS.map((d) => ({ label: `Study in ${d.name}`, href: `/study-in/${d.slug}` })),
  },
  {
    label: "Test prep",
    href: "/services/english-test-preparation",
    children: [
      { label: "IELTS Academic", href: "/ielts-academy" },
      { label: "IELTS General", href: "/ielts-general" },
      { label: "UKVI IELTS", href: "/ukvi-ielts" },
      { label: "PTE Academic", href: "/pte" },
      { label: "TOEFL", href: "/toefl" },
      { label: "Duolingo English Test", href: "/services/english-test-preparation#duolingo" },
      { label: "Classroom courses", href: "/classroom-courses" },
      { label: "Online courses", href: "/online-courses" },
    ],
  },
  { label: "Scholarships", href: "/services/scholarships" },
  { label: "Success stories", href: "/success-stories" },
  { label: "News", href: "/blog" },
  { label: "About", href: "/about-us" },
  { label: "Contact", href: "/contact-us" },
];

export const FOOTER_LINKS: NavItem[] = [
  { label: "About Us", href: "/about-us" },
  { label: "Success stories", href: "/success-stories" },
  { label: "News & blogs", href: "/blog" },
  { label: "IELTS Classes in India", href: "/ielts-classes-india" },
  { label: "PTE Classes in India", href: "/pte-classes-india" },
  { label: "Contact", href: "/contact-us" },
];

/** Link to the contact form with the course/interest filled in. */
export const enquire = (course?: string, country?: string) => {
  const q = new URLSearchParams();
  if (course) q.set("course", course);
  if (country) q.set("country", country);
  const s = q.toString();
  return `/contact-us${s ? `?${s}` : ""}#enquiry`;
};
