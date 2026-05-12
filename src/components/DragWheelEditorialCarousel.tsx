"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type EditorialCarouselSlide = {
  src: string;
  alt: string;
  /** Short headline (Webflow “city name” slot). */
  title?: string;
};

type DragWheelEditorialCarouselProps = {
  slides: readonly EditorialCarouselSlide[];
  ariaLabel: string;
  className?: string;
};

const WHEEL_SNAP_DEBOUNCE_MS = 240;

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function headlineForSlide(s: EditorialCarouselSlide) {
  if (s.title?.trim()) return s.title.trim();
  const rest = s.alt.split(" — ").slice(1).join(" — ").trim();
  const chunk = rest || s.alt;
  if (chunk.length <= 36) return chunk;
  return `${chunk.slice(0, 34)}…`;
}

/**
 * Horizontal drag + wheel carousel in the spirit of
 * [Carousel with drag & wheel (Webflow)](https://carousel-with-drag-wheel-codepen.webflow.io/):
 * full-width panels, big type, index number, and photo — not a card stack.
 */
export function DragWheelEditorialCarousel({
  slides,
  ariaLabel,
  className = "",
}: DragWheelEditorialCarouselProps) {
  const n = slides.length;
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollPxRef = useRef(0);
  const wRef = useRef(0);
  const [viewportW, setViewportW] = useState(0);
  const [scrollPx, setScrollPx] = useState(0);
  scrollPxRef.current = scrollPx;

  const draggingRef = useRef(false);
  const pointerId = useRef<number | null>(null);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  const reducedMotion = useRef(false);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    reducedMotion.current = prefersReducedMotion();
  }, []);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const apply = () => {
      const nw = Math.max(0, el.clientWidth);
      const prev = wRef.current;
      if (nw <= 0) return;

      if (prev > 0 && n > 0) {
        const idx = Math.round(scrollPxRef.current / prev);
        const ci = clamp(idx, 0, n - 1);
        const next = ci * nw;
        scrollPxRef.current = next;
        setScrollPx(next);
      }

      wRef.current = nw;
      setViewportW(nw);
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [n]);

  const snapNearest = useCallback(() => {
    const w = wRef.current;
    if (w <= 0 || n <= 1) return;
    const idx = Math.round(scrollPxRef.current / w);
    const ci = clamp(idx, 0, n - 1);
    const target = ci * w;
    scrollPxRef.current = target;
    setScrollPx(target);
  }, [n]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || n <= 1) return;

    const onWheel = (e: WheelEvent) => {
      if (reducedMotion.current) return;
      e.preventDefault();
      const delta = e.deltaX + e.deltaY;
      setScrollPx((s) => {
        const w = wRef.current;
        const max = Math.max(0, (n - 1) * w);
        const next = clamp(s + delta, 0, max);
        scrollPxRef.current = next;
        return next;
      });
      if (wheelTimer.current) clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => {
        wheelTimer.current = null;
        snapNearest();
      }, WHEEL_SNAP_DEBOUNCE_MS);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (wheelTimer.current) {
        clearTimeout(wheelTimer.current);
        wheelTimer.current = null;
      }
    };
  }, [n, snapNearest]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0 || n <= 1 || reducedMotion.current) return;
      pointerId.current = e.pointerId;
      draggingRef.current = true;
      dragStartX.current = e.clientX;
      dragStartScroll.current = scrollPxRef.current;
      if (wheelTimer.current) {
        clearTimeout(wheelTimer.current);
        wheelTimer.current = null;
      }
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [n],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (pointerId.current !== e.pointerId || !draggingRef.current) return;
      const dx = e.clientX - dragStartX.current;
      const w = wRef.current;
      const max = Math.max(0, (n - 1) * w);
      const next = clamp(dragStartScroll.current - dx, 0, max);
      scrollPxRef.current = next;
      setScrollPx(next);
    },
    [n],
  );

  const endPointer = useCallback(
    (e: React.PointerEvent) => {
      if (pointerId.current !== e.pointerId) return;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      pointerId.current = null;
      draggingRef.current = false;
      snapNearest();
    },
    [snapNearest],
  );

  const goIndex = useCallback(
    (targetIndex: number) => {
      const w = wRef.current;
      if (w <= 0 || n <= 0) return;
      const ci = clamp(targetIndex, 0, n - 1);
      const target = ci * w;
      scrollPxRef.current = target;
      setScrollPx(target);
    },
    [n],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (n <= 1) return;
      const w = wRef.current;
      if (w <= 0) return;
      const idx = Math.round(scrollPxRef.current / w);
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goIndex(idx - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goIndex(idx + 1);
      }
    },
    [n, goIndex],
  );

  if (n === 0) return null;

  const multi = n > 1;
  const w = viewportW;
  const activeIdx =
    w > 0 ? clamp(Math.round(scrollPx / w), 0, n - 1) : 0;

  return (
    <div
      className={`relative w-full ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      {multi ? (
        <p className="sr-only">
          Drag horizontally or scroll the wheel to move through slides. Use arrow
          keys when this area is focused, or the previous and next controls.
        </p>
      ) : null}

      <div
        ref={viewportRef}
        tabIndex={multi ? 0 : undefined}
        onKeyDown={multi ? onKeyDown : undefined}
        onPointerDown={multi ? onPointerDown : undefined}
        onPointerMove={multi ? onPointerMove : undefined}
        onPointerUp={multi ? endPointer : undefined}
        onPointerCancel={multi ? endPointer : undefined}
        className={[
          "relative w-full overflow-hidden rounded-none outline-none sm:rounded-2xl",
          multi
            ? "cursor-grab touch-none selection:bg-transparent active:cursor-grabbing"
            : "",
        ].join(" ")}
      >
        <div
          className="flex will-change-transform"
          style={{
            width: w > 0 ? n * w : `${n * 100}%`,
            transform: `translate3d(${-scrollPx}px, 0, 0)`,
            transition: "none",
          }}
        >
          {slides.map((s, i) => (
            <article
              key={`${s.src}-${i}`}
              className="flex shrink-0 flex-col gap-6 px-1 sm:flex-row sm:items-stretch sm:gap-8 sm:px-2 md:gap-12"
              style={
                w > 0
                  ? { width: w }
                  : { width: `${100 / n}%`, minWidth: "100%" }
              }
              aria-hidden={i !== activeIdx}
            >
              <div className="flex flex-[1] flex-col justify-between gap-4 sm:max-w-[42%] sm:py-2 md:py-4">
                <h2 className="[font-family:var(--font-geist-sans)] text-balance text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                  {headlineForSlide(s)}
                </h2>
                <p
                  className="font-mono text-sm tabular-nums tracking-wide text-white/40 sm:text-base"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
              </div>

              <div className="relative min-h-[13rem] flex-[1.35] sm:min-h-[min(52vh,28rem)]">
                <div className="relative h-full min-h-[13rem] w-full overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-inset ring-white/[0.12] sm:min-h-[min(52vh,28rem)] sm:rounded-2xl">
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1200px) 60vw, 720px"
                    draggable={false}
                    priority={i === 0}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {multi ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:mt-7">
          <button
            type="button"
            onClick={() => goIndex(activeIdx - 1)}
            onPointerDown={(e) => e.stopPropagation()}
            disabled={activeIdx <= 0}
            className="grid size-10 place-items-center rounded-full bg-white/[0.08] text-white ring-1 ring-white/15 transition hover:bg-white/[0.14] disabled:pointer-events-none disabled:opacity-35 sm:size-11"
            aria-label="Previous slide"
          >
            <Chevron dir="left" />
          </button>

          <div className="flex items-center gap-1.5 px-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goIndex(i)}
                onPointerDown={(e) => e.stopPropagation()}
                className={`h-1.5 rounded-full transition-[width,background] duration-300 ${
                  i === activeIdx
                    ? "w-8 bg-white"
                    : "w-1.5 bg-white/25 hover:bg-white/45"
                }`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === activeIdx ? "true" : undefined}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goIndex(activeIdx + 1)}
            onPointerDown={(e) => e.stopPropagation()}
            disabled={activeIdx >= n - 1}
            className="grid size-10 place-items-center rounded-full bg-white/[0.08] text-white ring-1 ring-white/15 transition hover:bg-white/[0.14] disabled:pointer-events-none disabled:opacity-35 sm:size-11"
            aria-label="Next slide"
          >
            <Chevron dir="right" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {dir === "left" ? (
        <path d="M15 6l-6 6 6 6" />
      ) : (
        <path d="M9 6l6 6-6 6" />
      )}
    </svg>
  );
}
