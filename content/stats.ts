import { GraduationCap, HeartHandshake, TreePalm, Trophy } from "lucide-react";

/**
 * The owner's numbers: 5k+ students with a study visa (6 Nov 2026, was 4k+, to match the promo artwork) and 5k+ tourist
 * visas (5 Nov 2026, replacing 500+ / 1000+ of
 * 20 Oct); 2000+ IELTS / PTE results and "countless happy families" (20 Oct 2026). `line` is our headline copy.
 * `n: 0` shows "Countless". Used by the numbers band (home, about) and the home "Why us" grid.
 */
export const STATS = [
  { n: 5000, label: "Students with a study visa", line: "Satisfied students, now studying abroad", icon: GraduationCap },
  { n: 5000, label: "Tourist visas", line: "Holidays, family visits and graduations", icon: TreePalm },
  { n: 2000, label: "IELTS / PTE results", line: "Scores that opened the door", icon: Trophy },
  { n: 0, label: "Happy families", line: "Proud parents at every airport goodbye", icon: HeartHandshake },
];
