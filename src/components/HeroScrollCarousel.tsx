"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

export type HeroCarouselSlide = {
  src: string;
  alt: string;
};

type HeroScrollCarouselProps = {
  slides: readonly HeroCarouselSlide[];
  /** 0 = below frame, 1 = fully settled in frame (scroll-driven). */
  entrancePhase: number;
  /** Optional logo / wordmark above the carousel (same scroll stage). */
  brandImage?: { src: string; alt: string; eyebrow?: string } | null;
  /** 0–1 scroll-driven phase for `brandImage` (eased in component). */
  brandEntrancePhase?: number;
  /**
   * Legacy: when false, brand was fully hidden (caused a snap). Prefer `brandAccessible`
   * + opacity overrides; when a brand image exists we keep this true so the mark can
   * sit below the fold and slide in continuously.
   */
  brandLayerActive?: boolean;
  /** When false, brand is present visually but hidden from assistive tech until scroll-in. */
  brandAccessible?: boolean;
  /** When set, overrides default brand Y (vh) from `brandEntrancePhase` when parent drives motion. */
  brandOffsetYvhOverride?: number;
  /** When set, combined with `brandLayerActive` for hero-computed fade-out while exiting. */
  brandOpacityOverride?: number;
};

function easeOutCubic(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return 1 - (1 - x) ** 3;
}

export function HeroScrollCarousel({
  slides,
  entrancePhase,
  brandImage,
  brandEntrancePhase = 0,
  brandLayerActive = true,
  brandAccessible = true,
  brandOffsetYvhOverride,
  brandOpacityOverride,
}: HeroScrollCarouselProps) {
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (dir: -1 | 1) => {
      if (slides.length === 0) return;
      setIndex((i) => (i + dir + slides.length) % slides.length);
    },
    [slides.length],
  );

  const showBrand = Boolean(brandImage?.src);

  if (slides.length === 0 && !showBrand) return null;

  const carouselEased = easeOutCubic(entrancePhase);
  const lift = Math.max(0, 1 - carouselEased);
  const visible = Math.min(1, carouselEased * 1.08);

  /** Linear scroll phase from parent (matches `HeroParallax` — no ease “plateau”). */
  const brandSlideLinear = Math.min(1, Math.max(0, brandEntrancePhase));
  /** Positive = further down; shrinks toward 0 as scroll progresses (slide up into place). */
  const brandOffsetDefaultVh = (1 - brandSlideLinear) * 58;
  const brandOffsetYvh =
    brandOffsetYvhOverride !== undefined
      ? brandOffsetYvhOverride
      : brandOffsetDefaultVh;

  const brandOpacity =
    brandOpacityOverride !== undefined
      ? brandOpacityOverride
      : brandLayerActive
        ? 1
        : 0;

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[8] flex flex-col items-center overflow-visible px-2 sm:px-4 ${
        showBrand
          ? slides.length === 0
            ? "justify-center gap-4 pb-[min(30svh,14rem)] pt-[min(8vh,4rem)] sm:gap-5 sm:pb-[min(32svh,15rem)] sm:pt-[min(9vh,4.5rem)]"
            : "gap-8 justify-end pb-8 sm:gap-10 sm:pb-14"
          : "justify-center gap-8 sm:gap-10"
      }`}
      style={{ transition: "none" }}
    >
      {showBrand && brandImage ? (
        <div
          className={`relative flex w-full shrink-0 flex-col items-center justify-center px-1 sm:px-2 ${
            slides.length === 0
              ? "mt-[min(16vh,8.5rem)] sm:mt-[min(18vh,9.5rem)] md:mt-[min(20vh,10.5rem)]"
              : ""
          }`}
          style={{
            opacity: brandOpacity,
            transform: `translate3d(0, ${brandOffsetYvh}vh, 0)`,
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
          }}
          aria-hidden={!brandAccessible}
        >
          <div className="relative z-[1] flex w-full flex-col items-center">
            {brandImage.eyebrow ? (
              <p className="listen-to-neon mb-1 max-w-[min(100vw-1rem,2200px)] text-center [font-family:var(--font-neonderthaw)] text-[clamp(1.95rem,5.9vw,3.95rem)] font-normal leading-snug tracking-wide [paint-order:stroke_fill] sm:mb-1.5">
                {brandImage.eyebrow}
              </p>
            ) : null}
            <img
              src={brandImage.src}
              alt={brandImage.alt}
              className={`block h-auto w-[98vw] max-w-[min(100vw-1rem,2200px)] select-none object-contain sm:max-w-[min(100vw-2rem,2400px)] ${
                brandImage.src.includes("cold-cave")
                  ? "cold-cave-logo-neon"
                  : ""
              }`}
              draggable={false}
              decoding="async"
              width={3754}
              height={617}
            />
          </div>
        </div>
      ) : null}

      {slides.length > 0 ? (
        <div
          className={`pointer-events-auto w-full max-w-5xl ${entrancePhase > 0.12 ? "" : "pointer-events-none"}`}
          style={{
            opacity: visible,
            transform: `translate3d(0, ${lift * 40}vh, 0)`,
            willChange: "transform, opacity",
            transition: "none",
          }}
          aria-hidden={entrancePhase < 0.08}
        >
        <div
          className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/90 shadow-[0_24px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.04]"
          role="region"
          aria-roledescription="carousel"
          aria-label="COLD CAVE STILLS photo carousel"
        >
          <div
            className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((s) => (
              <div
                key={s.src}
                className="relative h-full min-w-full shrink-0"
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between gap-2 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-3 pb-3 pt-16 sm:px-4 sm:pb-4">
            <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                className="grid size-10 place-items-center rounded-full border border-white/15 bg-zinc-950/80 text-zinc-100 shadow-sm transition hover:border-white/30 hover:bg-zinc-900"
                aria-label="Previous slide"
              >
                <Chevron dir="left" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="grid size-10 place-items-center rounded-full border border-white/15 bg-zinc-950/80 text-zinc-100 shadow-sm transition hover:border-white/30 hover:bg-zinc-900"
                aria-label="Next slide"
              >
                <Chevron dir="right" />
              </button>
            </div>
            <div className="pointer-events-auto flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-[width,background] ${
                    i === index
                      ? "w-6 bg-white"
                      : "w-2 bg-white/35 hover:bg-white/55"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      ) : null}
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
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
