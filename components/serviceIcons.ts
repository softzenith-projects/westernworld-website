import { createElement } from "react";
import {
  Award, Banknote, BedDouble, BookOpenCheck, Briefcase, ClipboardCheck, Compass, FileCheck2, Landmark, Languages,
  Lightbulb, MessagesSquare, PenLine, Plane, PlaneLanding, PlaneTakeoff, School, Stamp, TrendingUp, type LucideIcon,
} from "lucide-react";

/** The icon for each service (by slug); the route, the services page and anything else showing services use these. */
const SERVICE_ICONS: Record<string, LucideIcon> = {
  "career-counselling": Compass,
  "profile-assessment": ClipboardCheck,
  "profile-building": TrendingUp,
  "english-test-preparation": Languages,
  "sop-writing": PenLine,
  "interview-preparation": MessagesSquare,
  "university-applications": School,
  scholarships: Award,
  "education-loan": Landmark,
  "visa-filing": Stamp,
  forex: Banknote,
  "flight-booking": PlaneTakeoff,
  accommodation: BedDouble,
  "part-time-jobs": Briefcase,
};

/** One icon per leg (phase). */
const LEG_ICONS: Record<string, LucideIcon> = { plan: Lightbulb, prepare: BookOpenCheck, apply: FileCheck2, fly: PlaneLanding };

type IconProps = { className?: string; strokeWidth?: number };

/** The icon of a service (a plane if it has none). */
export function ServiceIcon({ slug, ...props }: IconProps & { slug: string }) {
  const Icon = SERVICE_ICONS[slug] ?? Plane;
  return createElement(Icon, props);
}

/** The icon of a leg (phase). */
export function LegIcon({ id, ...props }: IconProps & { id: string }) {
  const Icon = LEG_ICONS[id] ?? Plane;
  return createElement(Icon, props);
}
