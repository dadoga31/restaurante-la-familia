"use client";

import { useEffect, useRef } from "react";

interface Props {
  imageUrl: string;
  overlayOpacity?: number;
  overlayColor?: string;
  speed?: number; // 0–1, how much it parallaxes (0.3 = subtle)
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
}

export default function ParallaxSection({
  imageUrl,
  overlayOpacity = 0.75,
  overlayColor = "8,8,8",
  speed = 0.25,
  children,
  className = "",
  minHeight = "auto",
}: Props) {
  const bgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = bgRef.current;
    const container = containerRef.current;
    if (!bg || !container) return;

    const update = () => {
      const rect = container.getBoundingClientRect();
      const viewH = window.innerHeight;
      // progress: -1 (above viewport) → 0 (centered) → 1 (below viewport)
      const progress = (rect.top + rect.height / 2 - viewH / 2) / (viewH / 2 + rect.height / 2);
      const offset = progress * speed * 80; // max ~80px shift
      bg.style.transform = `translateY(${offset}px) scale(1.12)`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight, isolation: "isolate" }}
    >
      {/* Parallax background image */}
      <div
        ref={bgRef}
        className="absolute inset-[-10%] bg-center bg-cover"
        style={{
          backgroundImage: `url(${imageUrl})`,
          transform: "translateY(0) scale(1.12)",
          transition: "transform 0.05s linear",
          willChange: "transform",
        }}
        aria-hidden
      />
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `rgba(${overlayColor},${overlayOpacity})`,
        }}
        aria-hidden
      />
      {/* Gold vignette at bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 40% at 50% 110%, rgba(212,168,71,0.06), transparent)",
        }}
        aria-hidden
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
