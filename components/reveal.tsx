"use client";

import { useEffect, useRef, useState } from "react";

export function Reveal({ children, className = "", delay = 0, distance = 24 }: { children: React.ReactNode; className?: string; delay?: number; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const initiallyVisible = rect.top < window.innerHeight * .96 && rect.bottom > 0;
    if (initiallyVisible) setVisible(true);
    setReady(true);
    if (initiallyVisible) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} style={{ "--reveal-delay": `${delay}ms`, "--reveal-distance": `${distance}px` } as React.CSSProperties} className={`reveal ${ready ? "is-ready" : ""} ${visible ? "is-visible" : ""} ${className}`}>{children}</div>;
}
