"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  HeroScrollCarousel,
  type HeroCarouselSlide,
} from "@/components/HeroScrollCarousel";

export type ParallaxWord = {
  text: string;
  /** Vertical drift in px when scroll progress reaches 1 (larger = moves faster). */
  drift: number;
};

type HeroParallaxProps = {
  eyebrow?: ReactNode | null;
  /** When set, shows a centered headline that does not move with scroll for `stickyScrollScreens`. */
  staticLines?: { line1: string; line2: string };
  /**
   * How many full viewport heights (100vh) of scroll the sticky hero occupies.
   * Default 7 with `staticLines`, ~2.2 otherwise.
   */
  stickyScrollScreens?: number;
  words?: ParallaxWord[];
  subtitle?: ReactNode | null;
  actions?: ReactNode | null;
  /** Background drift in px at progress 1 (usually smaller than words). */
  backgroundDrift?: number;
  /** Optional scale added to background at end of scroll (0 = none). */
  backgroundScale?: number;
  children?: ReactNode;
  /**
   * Letterbox artwork (SVG or raster), full viewport width; under headline.
   * Set `null` to hide.
   */
  letterboxSrc?: string | null;
  /** Extra scale at full scroll (`scale = 1 + progress × this`). Larger = exits frame faster. */
  letterboxScrollZoom?: number;
  /** Clockwise rotation in degrees when scroll reaches end of hero range. */
  letterboxScrollRotateDeg?: number;
  /** Optional carousel that rises from the bottom late in the hero scroll range. */
  carouselSlides?: readonly HeroCarouselSlide[];
  /** Scroll progress (0–1) when the carousel begins moving in. */
  carouselEnterStart?: number;
  /** Scroll progress when the carousel finishes settling. */
  carouselEnterEnd?: number;
  /**
   * Headline + CTAs are fully transparent when scroll progress reaches this value (linear 1 → 0).
   * Example: `0.34` ≈ first 34% of the hero scroll track (about 2.4 viewport heights when `stickyScrollScreens` is 7).
   */
  heroForegroundFadeEndProgress?: number;
  /** Logo / wordmark above the carousel; scrolls up after hero copy fades. */
  brandImage?: { src: string; alt: string; eyebrow?: string } | null;
  /** When set, begins `brandImage` entrance (0–1 scroll progress). */
  brandEnterStart?: number;
  /** When set, `brandImage` entrance completes. */
  brandEnterEnd?: number;
  /**
   * When there is no in-hero carousel, scroll progress (0–1) where the logo exit is done.
   * If this is too close to `brandInEnd`, the exit is stretched to at least ~16% of hero
   * progress so motion stays smooth.
   */
  brandPostEndProgress?: number;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HeroParallax({
  eyebrow,
  staticLines,
  stickyScrollScreens,
  words = [],
  subtitle,
  actions,
  backgroundDrift = 48,
  backgroundScale = 0.06,
  children,
  letterboxSrc = "/DarkStarLetter%20box%203.svg",
  letterboxScrollZoom = 6.25,
  letterboxScrollRotateDeg = 68,
  carouselSlides,
  carouselEnterStart,
  carouselEnterEnd,
  heroForegroundFadeEndProgress,
  brandImage,
  brandEnterStart,
  brandEnterEnd,
  brandPostEndProgress,
}: HeroParallaxProps) {
  const outerRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const reducedMotion = useRef(false);

  const scrollScreens =
    stickyScrollScreens ?? (staticLines ? 7 : 2.2);

  const measure = useCallback(() => {
    const outer = outerRef.current;
    if (!outer) return;

    if (reducedMotion.current) {
      setProgress(0);
      return;
    }

    const topAbs = outer.getBoundingClientRect().top + window.scrollY;
    const scrollRange = Math.max(1, outer.offsetHeight - window.innerHeight);
    const scrolledInto = window.scrollY - topAbs;
    const t = scrolledInto / scrollRange;
    setProgress(Math.min(1, Math.max(0, t)));
  }, []);

  useEffect(() => {
    reducedMotion.current = prefersReducedMotion();
    measure();

    let frame = 0;
    const onScrollOrResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [measure]);

  const bgY = progress * backgroundDrift;
  const bgScale = 1 + progress * backgroundScale;

  /** Eased scroll for letterbox motion (accel into zoom / spin). With reduced motion, `progress` stays 0 from `measure`. */
  const letterboxMotionT = 1 - (1 - progress) ** 2.05;
  const letterboxScale = 1 + letterboxMotionT * letterboxScrollZoom;
  const letterboxRotateDeg = letterboxMotionT * letterboxScrollRotateDeg;
  /**
   * Letterbox dims faster mid-scroll (power curve), then settles at ~1% opacity when the
   * hero strip ends so a faint graphic can still read under the next section.
   */
  const letterboxFadePower = 2.45;
  const letterboxOpacityFloor = 0.01;
  const tMotion = Math.min(1, Math.max(0, letterboxMotionT));
  const letterboxOpacity =
    letterboxOpacityFloor +
    (1 - letterboxOpacityFloor) * (1 - tMotion) ** letterboxFadePower;

  /** Headline + CTAs: linear fade 1 → 0 over the first portion of hero scroll (independent of letterbox floor). */
  const fgFadeEnd = Math.max(
    0.08,
    Math.min(1, heroForegroundFadeEndProgress ?? 0.34),
  );
  const heroFgOpacity = staticLines
    ? Math.max(0, 1 - Math.min(1, progress / fgFadeEnd))
    : undefined;

  const defaultBrandStart = Math.min(0.58, fgFadeEnd + 0.12);
  const defaultBrandEnd = Math.min(0.8, Math.max(defaultBrandStart + 0.14, fgFadeEnd + 0.36));
  /** Never begin the Cold Cave slide-in until the headline has fully faded. */
  const brandInStart = Math.max(fgFadeEnd + 0.02, brandEnterStart ?? defaultBrandStart);
  /** Minimum scroll progress span for brand slide-in (smaller = brand settles sooner on short heroes). */
  const BRAND_IN_MIN_SPAN = 0.15;
  const brandInEnd = Math.max(
    brandEnterEnd ?? defaultBrandEnd,
    brandInStart + BRAND_IN_MIN_SPAN,
  );

  const brandT =
    brandImage?.src && brandInEnd > 1e-6
      ? Math.min(1, Math.max(0, progress / brandInEnd))
      : 0;

  const resolvedCarouselEnterStart =
    carouselEnterStart ??
    (brandImage?.src
      ? Math.min(0.9, brandInEnd + 0.08)
      : Math.min(0.92, fgFadeEnd + 0.1));
  const resolvedCarouselEnterEnd = carouselEnterEnd ?? 0.98;

  const carouselT =
    carouselSlides?.length &&
    resolvedCarouselEnterEnd > resolvedCarouselEnterStart
      ? Math.min(
          1,
          Math.max(
            0,
            (progress - resolvedCarouselEnterStart) /
              (resolvedCarouselEnterEnd - resolvedCarouselEnterStart),
          ),
        )
      : 0;

  const showEyebrow = eyebrow != null;
  const showSubtitle = subtitle != null;
  const showActions = actions != null;

  let brandOffsetYvhOverride: number | undefined;
  let brandOpacityOverride: number | undefined;

  /**
   * Brand vertical motion: one continuous ramp from first scroll — no idle band
   * before `brandInStart` (avoids “nothing moves then it jumps”). `Y_MAX` starts well
   * below frame; `Y_SETTLED` parks the block low, under the letterbox band.
   */
  const BRAND_Y_MAX_VH = 72;
  const BRAND_Y_SETTLED_VH = 12;
  /** 0–1: share of the fade segment spent at full opacity before opacity starts dropping. */
  const BRAND_OPACITY_HOLD_RATIO = 0.34;

  if (brandImage?.src) {
    if (progress <= brandInEnd) {
      brandOffsetYvhOverride =
        BRAND_Y_MAX_VH * (1 - brandT) + BRAND_Y_SETTLED_VH * brandT;
      brandOpacityOverride = 1;
    } else if (carouselSlides?.length) {
      const c0 = resolvedCarouselEnterStart;
      const c1 = resolvedCarouselEnterEnd;
      if (progress < c0) {
        const u =
          (progress - brandInEnd) /
          Math.max(1e-4, c0 - brandInEnd);
        brandOffsetYvhOverride = -u * 52;
        brandOpacityOverride = 1;
      } else {
        const v = (progress - c0) / Math.max(1e-4, c1 - c0);
        brandOffsetYvhOverride = -52 - v * 40;
        const vFade =
          v <= BRAND_OPACITY_HOLD_RATIO
            ? 0
            : (v - BRAND_OPACITY_HOLD_RATIO) /
              Math.max(1e-4, 1 - BRAND_OPACITY_HOLD_RATIO);
        brandOpacityOverride = Math.max(0, 1 - vFade * 1.15);
      }
    } else {
      /** Matches carousel path peak (`-52vh`) so exit motion stays one continuous line — no ease plateau. */
      const EXIT_PEAK_VH = 52;
      /** Minimum scroll span so exit motion isn't compressed into a few % of progress (causes a jump). */
      const MIN_EXIT_SPAN = 0.16;
      const exitTarget = brandPostEndProgress ?? 1;
      const exitEnd = Math.min(
        1,
        Math.max(brandInEnd + MIN_EXIT_SPAN, exitTarget),
      );
      const span = Math.max(MIN_EXIT_SPAN, exitEnd - brandInEnd);
      const uLin = Math.min(1, Math.max(0, (progress - brandInEnd) / span));
      brandOffsetYvhOverride =
        BRAND_Y_SETTLED_VH - uLin * (BRAND_Y_SETTLED_VH + EXIT_PEAK_VH);
      const uOpacity =
        uLin <= BRAND_OPACITY_HOLD_RATIO
          ? 0
          : (uLin - BRAND_OPACITY_HOLD_RATIO) /
            Math.max(1e-4, 1 - BRAND_OPACITY_HOLD_RATIO);
      brandOpacityOverride = Math.max(0, 1 - uOpacity);
    }
  }

  return (
    <section
      ref={outerRef}
      className="relative"
      style={{ minHeight: `calc(${scrollScreens} * 100vh)` }}
    >
      {/* Sticky stage: inner clips letterbox zoom; carousel is a sibling so it can translate in from below without being clipped. */}
      <div className="sticky top-0 relative h-[100svh] min-h-[100svh] w-full max-w-none shrink-0 overflow-visible">
        <div className="relative flex h-full min-h-0 w-full max-w-none flex-col overflow-hidden">
            {/* Edge-to-edge (same as nav bar chrome): not inside max-w-7xl */}
            <div
              className="absolute inset-0 z-0 overflow-hidden bg-transparent will-change-transform"
              style={{
                transform: `translate3d(0, ${bgY}px, 0) scale(${bgScale})`,
              }}
            >
              {children}
            </div>

            {letterboxSrc ? (
              <div
                className="pointer-events-none absolute inset-0 z-[5] bg-transparent"
                style={{ backgroundColor: "transparent" }}
                aria-hidden
              >
                <div
                  className="absolute inset-0 will-change-transform"
                  style={{
                    transform: `translateZ(0) scale(${letterboxScale}) rotate(${letterboxRotateDeg}deg)`,
                    transformOrigin: "50% 50%",
                    opacity: letterboxOpacity,
                  }}
                >
                  {/* preserveAspectRatio="none" on SVG + object-fit fill + scroll scale/spin */}
                  <img
                    src={letterboxSrc}
                    alt=""
                    className="absolute inset-0 block min-h-0 min-w-0 select-none"
                    draggable={false}
                    decoding="async"
                    fetchPriority="high"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "fill",
                      maxWidth: "none",
                      maxHeight: "none",
                    }}
                  />
                </div>
              </div>
            ) : null}

            {/* Starts under fixed nav (~overlays letterbox); top padding = chrome + notch only */}
            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-8 pt-[max(5.125rem,calc(env(safe-area-inset-top,0px)+4.5rem))]">
              {showEyebrow ? (
                <div className="shrink-0 text-center">{eyebrow}</div>
              ) : null}

              <div
                className={`relative flex min-h-0 flex-1 flex-col items-center justify-center py-6 ${showEyebrow ? "mt-2 sm:mt-3" : ""}`}
                style={{
                  opacity: staticLines ? heroFgOpacity : undefined,
                  pointerEvents:
                    staticLines && heroFgOpacity !== undefined && heroFgOpacity < 0.02
                      ? "none"
                      : undefined,
                }}
              >
                {staticLines ? (
                  <div className="relative flex max-w-2xl translate-y-2 flex-col items-center sm:max-w-3xl sm:translate-y-0 md:-translate-y-4 lg:-translate-y-8">
                    <h1 className="font-russo text-center text-balance">
                      <span className="block text-3xl font-normal leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                        {staticLines.line1}
                      </span>
                      <span className="mt-3 block text-3xl font-normal leading-tight tracking-tight sm:mt-3.5 sm:text-4xl md:text-5xl lg:text-6xl">
                        {staticLines.line2}
                      </span>
                    </h1>
                    {showActions ? (
                      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-9 sm:flex-row">
                        {actions}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <>
                    <h1 className="relative flex flex-col items-center gap-1 text-balance text-5xl font-semibold tracking-tight sm:gap-2 sm:text-7xl md:text-8xl">
                      {words.map((w, i) => (
                        <span
                          key={`${i}-${w.text}`}
                          className="inline-block will-change-transform"
                          style={{
                            transform: `translate3d(0, ${progress * w.drift}px, 0)`,
                          }}
                        >
                          {w.text}
                        </span>
                      ))}
                    </h1>

                    {showSubtitle ? (
                      <div
                        className="relative mx-auto mt-8 max-w-2xl text-pretty text-center text-lg text-zinc-400 will-change-transform sm:mt-10"
                        style={{
                          transform: `translate3d(0, ${progress * 18}px, 0)`,
                          opacity: 1 - progress * 0.35,
                        }}
                      >
                        {subtitle}
                      </div>
                    ) : null}

                    {showActions ? (
                      <div
                        className="relative mt-10 flex flex-col items-center justify-center gap-3 will-change-transform sm:flex-row sm:mt-12"
                        style={{
                          transform: `translate3d(0, ${progress * 28}px, 0)`,
                          opacity: 1 - progress * 0.45,
                        }}
                      >
                        {actions}
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>

        {(carouselSlides?.length || brandImage?.src) ? (
          <HeroScrollCarousel
            slides={carouselSlides ?? []}
            entrancePhase={carouselT}
            brandImage={brandImage}
            brandEntrancePhase={brandImage?.src ? brandT : 0}
            brandLayerActive={Boolean(brandImage?.src)}
            brandAccessible={
              !brandImage?.src || (brandOpacityOverride ?? 1) > 0.05
            }
            brandOffsetYvhOverride={brandOffsetYvhOverride}
            brandOpacityOverride={brandOpacityOverride}
          />
        ) : null}
      </div>
    </section>
  );
}
