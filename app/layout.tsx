import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Motion from "@/components/Motion";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import PromoPopup from "@/components/PromoPopup";
import { SITE } from "@/lib/site";
import "./globals.css";

// Self-hosted at build time by next/font: no request to Google from the visitor's browser.
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--ff-display", display: "swap" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--ff-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--ff-mono", display: "swap", weight: ["500"] });

export const viewport: Viewport = { themeColor: "#0e1645" };

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Visa Consultant in Rohtak | IELTS & PTE Coaching | Western World Visa Services",
    template: "%s | Western World Visa Services",
  },
  description:
    "Visa agent and visa consultant in Rohtak for UK visa, Canada visa and Europe visa, with IELTS coaching and PTE coaching in Rohtak. Counselling, applications, SOPs, scholarships, loans, forex, flights and accommodation under one roof.",
  keywords: [
    // The owner's search phrases (20 Oct 2026) first.
    "visa agent in Rohtak", "visa consultant in Rohtak", "IELTS coaching in Rohtak", "PTE coaching in Rohtak",
    "UK visa", "Canada visa", "Europe visa",
    "Study Abroad", "Study in Canada", "Study in U.K", "Study in U.S.A", "Study in Australia", "Career in Abroad",
    "Study Abroad Programs", "Overseas Education in UK", "Overseas Education in Canada", "Overseas Education in USA",
    "Study Abroad Consultant", "Overseas Education Consultant", "MBA From Abroad", "Overseas Consultant",
    "Study Abroad after 12th", "List of Courses in Abroad",
  ],
  openGraph: { type: "website", siteName: SITE.name, images: ["/images/w4.jpg"] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2">
          Skip to content
        </a>
        {/* Announcement + menu stay pinned together while scrolling (owner, 5 Oct 2026). */}
        <div className="sticky top-0 z-40">
          <AnnouncementBar />
          <Header />
          <Motion />
        </div>
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <FloatingContact />
        <PromoPopup />
      </body>
    </html>
  );
}
