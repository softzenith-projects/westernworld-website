"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A grid of cards that (1) rise in one after another when the grid scrolls into view and (2) light up under the
 * pointer: the card under the cursor gets `--x` / `--y` (cursor position inside it) for a `.spot-glow` layer.
 * Children are the grid items; give each `style={{ "--i": n }}` for the stagger. Without JavaScript, or with reduced
 * motion, the cards are simply shown; cards already on screen at load are not hidden.
 */
export default function CardGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  const el = useRef<HTMLUListElement>(null);
  const [phase, setPhase] = useState<"static" | "waiting" | "shown">("static");

  useEffect(() => {
    const node = el.current;
    if (!node || !("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (node.getBoundingClientRect().top < innerHeight * 0.9) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setPhase("shown"); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(node);
    // Hide only after the observer is set up (the callback above runs later, so this is not a cascading render).
    const t = requestAnimationFrame(() => setPhase((p) => (p === "static" ? "waiting" : p)));
    return () => { io.disconnect(); cancelAnimationFrame(t); };
  }, []);

  return (
    <ul ref={el} data-reveal={phase} className={className}
        onPointerMove={(e) => {
          const card = (e.target as HTMLElement).closest<HTMLElement>("[data-spot]");
          if (!card) return;
          const r = card.getBoundingClientRect();
          card.style.setProperty("--x", `${e.clientX - r.left}px`);
          card.style.setProperty("--y", `${e.clientY - r.top}px`);
        }}>
      {children}
    </ul>
  );
}
