/**
 * Proof: students collecting their visas at our office, the office's "Congratulations" posters, and IELTS scorecards.
 *
 * Visa photos live in public/wins/ (owner's Google Drive folder, 5 Nov 2026, plus six older photos from the old site in
 * public/ieltsstu/). Each entry is [file, first name?, country?]: the name and country come from the owner's file
 * names ("Aman UK", "Ankit Saharan CND") or from that student's poster; photos without them show "Visa in hand".
 * Add a photo: put a JPG (longest side ≤ 1600 px) in public/wins/ and add a line below.
 *
 * Video stories: add a YouTube video id to a slot (the part after "v=" or after "youtu.be/") and it goes live;
 * slots without an id show a "coming soon" frame so the layout is ready.
 */

export type Country = "UK" | "Canada" | "Germany" | "Cyprus";

export type Win = {
  src: string;
  /** First name only. */
  name?: string;
  country?: Country;
};

type Row = [file: string, name?: string, country?: Country];

const win = ([file, name, country]: Row): Win => ({
  src: file.includes("/") ? file : `/wins/${file}.jpg`,
  name,
  country,
});

/** Short label on a photo (the badge already says "visa"): "Aman · UK", "Abhishek" or "Visa in hand". */
export const winLabel = (w: { name?: string; country?: Country }) =>
  [w.name, w.country].filter(Boolean).join(" · ") || "Visa in hand";

/** Alt text for a photo. */
export const winAlt = (w: { name?: string; country?: Country }) =>
  `${w.name ?? "A Western World student"} receiving ${w.country ? `a ${w.country} visa` : "a visa"} at our office`;

/**
 * The sharpest photos, shown first and largest on the home page; the first one is the big photo. Reorder to change
 * which students lead the wall.
 */
const FEATURED: Row[] = [
  ["uk-aman-017", "Aman", "UK"],
  ["canada-nikita-063", "Nikita", "Canada"],
  ["germany-armann-026", "Armann", "Germany"],
  ["canada-dakshta-035", "Dakshta", "Canada"],
  ["uk-priyanka-065", "Priyanka", "UK"],
  ["canada-hardik-006", "Hardik", "Canada"],
  ["uk-ganish-071", "Ganish", "UK"],
  ["canada-khushi-121", "Khushi", "Canada"],
  ["uk-deevanshu-039", "Deevanshu", "UK"],
  ["uk-dhariya-042", "Dhariya", "UK"],
  ["uk-jaya-073", "Jaya", "UK"],
  ["canada-seema-007", "Seema", "Canada"],
];

const MORE: Row[] = [
  ["canada-arun-003", "Arun", "Canada"],
  ["uk-jatin-005", "Jatin", "UK"],
  ["visa-abhishek-015", "Abhishek"],
  ["uk-ajay-016", "Ajay", "UK"],
  ["uk-anil-019", "Anil", "UK"],
  ["canada-ankit-020", "Ankit", "Canada"],
  ["uk-anuj-023", "Anuj", "UK"],
  ["uk-anushi-064", "Anushi", "UK"],
  ["canada-arun-027", "Arun", "Canada"],
  ["canada-aryan-029", "Aryan", "Canada"],
  ["canada-aryan-030", "Aryan", "Canada"],
  ["uk-ashish-031", "Ashish", "UK"],
  ["uk-chetna-033", "Chetna", "UK"],
  ["visa-daman-036", "Daman"],
  ["uk-deepak-037", "Deepak", "UK"],
  ["uk-deepak-038", "Deepak", "UK"],
  ["canada-dev-098", "Dev", "Canada"],
  ["uk-dhiraj-112", "Dhiraj", "UK"],
  ["visa-dinesh-083", "Dinesh"],
  ["uk-dipesh-046", "Dipesh", "UK"],
  ["uk-dravesh-090", "Dravesh", "UK"],
  ["canada-gourav-051", "Gourav", "Canada"],
  ["canada-gourav-052", "Gourav", "Canada"],
  ["canada-happy-053", "Happy", "Canada"],
  ["uk-harsh-055", "Harsh", "UK"],
  ["canada-himanshu-056", "Himanshu", "Canada"],
  ["canada-himanshu-101", "Himanshu", "Canada"],
  ["visa-himanshu-058", "Himanshu"],
  ["uk-sunny-060", "Sunny", "UK"],
  ["uk-situ-062", "Situ", "UK"],
  ["uk-raman-072", "Raman", "UK"],
  ["uk-yogesh-076", "Yogesh", "UK"],
  ["visa-tamanna-078", "Tamanna"],
  ["uk-manisha-082", "Manisha", "UK"],
  ["uk-yuvraj-085", "Yuvraj", "UK"],
  ["canada-sanket-093", "Sanket", "Canada"],
  ["canada-nikunj-094", "Nikunj", "Canada"],
  ["canada-manjeet-096", "Manjeet", "Canada"],
  ["canada-lakshay-102", "Lakshay", "Canada"],
  ["uk-manoj-105", "Manoj", "UK"],
  ["uk-nikhil-108", "Nikhil", "UK"],
  ["uk-narender-109", "Narender", "UK"],
  ["uk-khushboo-111", "Khushboo", "UK"],
  ["uk-kajal-116", "Kajal", "UK"],
  ["uk-kavita-117", "Kavita", "UK"],
  ["uk-kirti-122", "Kirti", "UK"],
  ["canada-komal-123", "Komal", "Canada"],
  ["visa-komal-124", "Komal"],
  ["canada-krishna-125", "Krishna", "Canada"],
  ["uk-lokesh-127", "Lokesh", "UK"],
  ["uk-mohit-132", "Mohit", "UK"],
  ["uk-naveen-135", "Naveen", "UK"],
  ["uk-navjot-136", "Navjot", "UK"],
  ["canada-navneet-137", "Navneet", "Canada"],
  ["canada-nikhil-139", "Nikhil", "Canada"],
  ["uk-nikhil-140", "Nikhil", "UK"],
  ["canada-nishant-146", "Nishant", "Canada"],
  ["canada-nitesh-147", "Nitesh", "Canada"],
  ["canada-pramod-148", "Pramod", "Canada"],
  ["canada-rahul-152", "Rahul", "Canada"],
  ["canada-rohit-155", "Rohit", "Canada"],
  ["canada-sachin-156", "Sachin", "Canada"],
  ["visa-sahil-157", "Sahil"],
  ["uk-sarthak-160", "Sarthak", "UK"],
  ["uk-saurav-161", "Saurav", "UK"],
  ["uk-shallu-165", "Shallu", "UK"],
  ["uk-shivani-166", "Shivani", "UK"],
  ["uk-suvidha-171", "Suvidha", "UK"],
  ["visa-virender-173", "Virender"],
  ["visa-vishal-048", "Vishal"],
  // Photos without a name in the file name.
  ...["004", "059", "061", "068", "069", "070", "075", "080", "081", "087", "089", "091", "092", "095", "097", "099", "100",
    "103", "104", "110"].map((n): Row => [`visa-${n}`]),
  // From the old site, not in the Drive folder.
  ...[5, 8, 9, 25, 26, 27].map((n): Row => [`/ieltsstu/ielts${n}.jpeg`]),
];

/** Visa handovers (student holding the passport with the visa), featured photos first. */
export const VISA_WINS: Win[] = [...FEATURED, ...MORE].map(win);
export const FEATURED_WINS = VISA_WINS.slice(0, FEATURED.length);

/**
 * The office's "Congratulations … on getting UK visa" posters (owner's Drive folder). Shown whole (they carry text).
 * Old red template and new navy template alternate so the reel does not look repetitive.
 */
export const VISA_POSTERS: Win[] = ([
  ["aman-001", "Aman", "UK"], ["ankur-021", "Ankur", "UK"], ["khushboo-002", "Khushboo", "UK"], ["anuj-022", "Anuj", "UK"],
  ["chetna-008", "Chetna", "UK"], ["ashish-032", "Ashish", "UK"], ["anushi-009", "Anushi", "UK"],
  ["deevanshu-040", "Deevanshu", "UK"], ["nikita-010", "Nikita", "Canada"], ["vishal-175", "Vishal", "Cyprus"],
  ["situ-011", "Situ", "UK"], ["dhiraj-044", "Dhiraj", "UK"], ["sunny-012", "Sunny", "UK"], ["ganish-050", "Ganish", "UK"],
  ["saurav-013", "Saurav", "UK"], ["jaya-115", "Jaya", "UK"], ["dhiraj-014", "Dhiraj", "UK"], ["kavita-118", "Kavita", "UK"],
  ["priyanka-151", "Priyanka", "UK"], ["monika-133", "Monika", "UK"], ["vishal-174", "Vishal", "UK"], ["neha-138", "Neha", "UK"],
  ["nikita-144", "Nikita", "Canada"], ["preeti-149", "Preeti", "UK"], ["raman-154", "Raman", "UK"],
  ["sarthak-159", "Sarthak", "UK"], ["saurav-162", "Saurav", "UK"], ["situ-168", "Situ", "UK"], ["sunny-170", "Sunny", "UK"],
  ["yogesh-178", "Yogesh", "UK"],
] as Row[]).map(([file, name, country]) => ({ src: `/wins/posters/${file}.jpg`, name, country }));

/** IELTS scorecards. */
export const SCORECARDS = [
  "1.png", "2.png", "3.jpg", "4.png", "5.jpeg", "6.jpeg", "7.jpeg", "8.png", "9.jpg", "10.jpg",
  "12.png", "13.jpg", "14.png", "15.png", "16.png", "17.jpeg", "18.png", "19.jpg", "20.jpg",
].map((f) => `/ieltsstu/${f}`);

export type VideoStory = {
  /** YouTube video id; leave empty until the video is published. */
  youtubeId?: string;
  name?: string;
  /** e.g. "MSc, University of Leeds · UK" */
  detail?: string;
};

export const VIDEO_STORIES: VideoStory[] = [{}, {}, {}];
