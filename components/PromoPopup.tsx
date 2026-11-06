"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";
import { DestinationChips } from "@/components/Flags";

const DAY = 86_400_000;
/** When the visitor last closed the popup (or sent it); it stays away for a week after that. */
const STORAGE_KEY = "ww-promo-closed";
const QUIET_DAYS = 7;
/** A moment to see the page first. */
const DELAY_MS = 2500;
/** No popup where it would get in the way of an enquiry already made. */
const SKIP = ["/thank-you"];

const closedRecently = () => {
  try {
    return Date.now() - Number(localStorage.getItem(STORAGE_KEY) ?? 0) < QUIET_DAYS * DAY;
  } catch {
    return false; // storage blocked: show it, closing still works for this page
  }
};

/**
 * The owner's promo (6 Nov 2026): their artwork on the left, the real enquiry form on the right, shown once shortly
 * after a visitor lands. × / Esc / a click outside closes it. A native <dialog> keeps focus inside while open.
 */
export default function PromoPopup() {
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    // Sent from the popup: the form went to the thank-you page, so put the popup away (and remember it).
    if (SKIP.some((p) => pathname.startsWith(p))) {
      if (d.open) d.close();
      return;
    }
    if (d.open || closedRecently()) return;
    const timer = setTimeout(() => {
      if (!document.querySelector("dialog[open]")) d.showModal();
    }, DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  const remember = () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // storage blocked: nothing to remember
    }
  };

  return (
    <dialog ref={dialog} onClose={remember} aria-label="Free consultation"
            onClick={(e) => e.target === dialog.current && dialog.current?.close()}
            className="m-auto max-h-[calc(100dvh-1.5rem)] w-[min(1120px,calc(100%-1.5rem))] max-w-none overflow-y-auto rounded-3xl bg-white p-0 shadow-2xl backdrop:bg-brand-dark/70 backdrop:backdrop-blur-sm">
      {/* Zero-height sticky row: the × stays in the corner while the popup scrolls on a phone. */}
      <div className="sticky top-0 z-20 flex h-0 justify-end">
        <button type="button" onClick={() => dialog.current?.close()} aria-label="Close"
                className="mt-3 mr-3 grid size-10 place-items-center rounded-full bg-white text-ink shadow-lg ring-1 ring-line transition hover:bg-paper hover:text-flame">
          <X className="size-5" aria-hidden />
        </button>
      </div>
      <div className="grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* The artwork sits at the bottom; the sky above it holds the destinations (below the artwork on phones). */}
        <div className="flex flex-col justify-between bg-gradient-to-r from-white via-[#ddeefe] to-[#68bbfd] md:gap-4">
          <Image src="/images/promo/promo-popup.jpg" width={964} height={795} sizes="(min-width: 768px) 580px, 100vw"
                 className="h-auto w-full"
                 alt="Western World Visa Services, your study abroad partner. Tell us how we can help: share a few details and our team will get in touch, it takes under a minute. Trusted counsellors, 5000+ students guided, high visa success rate." />
          <DestinationChips className="order-first mx-3 mt-3 max-md:order-last max-md:mb-1 md:mx-6 md:mt-6" />
        </div>
        <div className="bg-gradient-to-b from-[#e4f1fe] to-paper p-3 sm:p-5 md:pt-16">
          <ConsultationForm source="Promo popup" compact />
        </div>
      </div>
    </dialog>
  );
}
