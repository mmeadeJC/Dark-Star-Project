"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/** Starts much larger than viewport; eases to `SCALE_MIN` over a wide scroll band. */
const SCALE_MAX = 1.46;
const SCALE_MIN = 1;

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

/**
 * Scales children down from `SCALE_MAX` toward `SCALE_MIN` as the block nears the
 * viewport center while scrolling — wide band + gentle ease so it takes more scroll
 * to settle (no extra deps).
 */
export function FeaturedCarouselScrollScale({
  children,
}: {
  children: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(SCALE_MAX);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setScale(SCALE_MIN);
      return;
    }

    let frame = 0;

    const update = () => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;

      if (r.top > vh) {
        setScale(SCALE_MAX);
        return;
      }
      if (r.bottom < 0) {
        setScale(SCALE_MIN);
        return;
      }

      const blockCenter = r.top + r.height / 2;
      /** Viewport Y where we consider the block “centered” (slightly above geometric center). */
      const targetY = vh * 0.48;
      /**
       * Wider band = more scroll distance before scale settles (longer, more readable “scale in”).
       * Slightly lower ease power spreads change across the scroll range vs. bunching at the end.
       */
      const halfBand = vh * 1.58;
      const raw = 1 - Math.abs(blockCenter - targetY) / halfBand;
      const t = clamp(raw, 0, 1);
      const eased = 1 - (1 - t) ** 2.05;
      setScale(SCALE_MAX - eased * (SCALE_MAX - SCALE_MIN));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="origin-[50%_38%] overflow-visible pb-[min(12rem,26svh)] will-change-transform"
      style={{ transform: `scale(${scale})` }}
    >
      {children}
    </div>
  );
}
