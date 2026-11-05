"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Plane } from "lucide-react";

/**
 * Site-wide motion, mounted once under the header (app/layout.tsx):
 * - a scroll-progress line along the bottom of the header, with a small plane at its tip;
 * - scroll reveal: any element with the `reveal` class that is below the fold rises in when it scrolls into view
 *   (`--i` on it staggers siblings). Elements already on screen, and everything without JavaScript or under reduced
 *   motion, are simply shown. Re-run on every client-side navigation.
 */
export default function Motion() {
  const bar = useRef<HTMLDivElement>(null);
  const path = usePathname();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.current?.style.setProperty("--p", String(max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [path]);

  useEffect(() => {
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }, { rootMargin: "0px 0px -6% 0px" });
    for (const el of document.querySelectorAll<HTMLElement>(".reveal:not(.in)")) {
      // On screen already (and never hidden): leave it as it is. Anything hidden earlier is watched again, so a
      // re-run of this effect (development double-run, navigation) never leaves an element hidden.
      if (!el.classList.contains("pending") && el.getBoundingClientRect().top < innerHeight) continue;
      el.classList.add("pending");
      io.observe(el);
    }
    return () => io.disconnect();
  }, [path]);

  return (
    <div ref={bar} aria-hidden className="scroll-progress pointer-events-none absolute inset-x-0 bottom-0 h-[3px]">
      <div className="h-full origin-left bg-gradient-to-r from-accent to-sky" style={{ transform: "scaleX(var(--p, 0))" }} />
      <span className="absolute -top-[7px] flex size-4 -translate-x-1/2 items-center justify-center rounded-full bg-white text-accent shadow ring-1 ring-line transition-opacity"
            style={{ left: "calc(var(--p, 0) * (100% - 1rem) + 0.5rem)", opacity: "min(1, calc(var(--p, 0) * 40))" }}>
        <Plane className="size-2.5 rotate-45" />
      </span>
    </div>
  );
}
