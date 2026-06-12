"use client";

import { useEffect, useRef, useState } from "react";

type Animation = "fade-up" | "fade-down" | "fade-left" | "fade-right" | "fade-in" | "scale-up" | "blur-in";

interface Props {
  children: React.ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

const transforms: Record<Animation, string> = {
  "fade-up":    "translateY(40px)",
  "fade-down":  "translateY(-40px)",
  "fade-left":  "translateX(40px)",
  "fade-right": "translateX(-40px)",
  "fade-in":    "none",
  "scale-up":   "scale(0.92)",
  "blur-in":    "none",
};

export default function AnimateOnScroll({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 700,
  className = "",
  threshold = 0.12,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const isBlur = animation === "blur-in";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : transforms[animation],
        filter: isBlur ? (visible ? "blur(0px)" : "blur(8px)") : undefined,
        transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms${isBlur ? `, filter ${duration}ms ease ${delay}ms` : ""}`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
