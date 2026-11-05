"use client";

import { useEffect, useRef, useState } from "react";

const fmt = (n: number) => n.toLocaleString("en-IN");

/**
 * A number that counts up from 0 when it scrolls into view ("4,000+"). The server renders the final number, so it reads
 * correctly without JavaScript, to search engines and with reduced motion; a number already on screen when the page
 * loads does not count (no flash).
 */
export default function CountUp({ to, suffix = "", ms = 1600 }: { to: number; suffix?: string; ms?: number }) {
  const el = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(to);

  useEffect(() => {
    const node = el.current;
    if (!node || !("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (node.getBoundingClientRect().top < innerHeight) return;
    let frame = 0;
    setN(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / ms);
        setN(Math.round(to * (1 - Math.pow(1 - t, 3)))); // ease-out
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(node);
    return () => { io.disconnect(); cancelAnimationFrame(frame); };
  }, [to, ms]);

  return (
    <span ref={el} className="tabular-nums">
      <span className="sr-only">{fmt(to)}{suffix}</span>
      <span aria-hidden>{fmt(n)}{suffix}</span>
    </span>
  );
}
