"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Turns its children's `revealOnView` on, once, when the block scrolls into view. */
export default function ScrollReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const block = ref.current;
    if (!block) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(block);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-visible={visible} className={`group ${className}`}>
      {children}
    </div>
  );
}
