"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

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
  /** Letterbox fades in sync with zoom/spin (full fade by end of hero scroll strip). */
  const letterboxOpacity = Math.max(0, 1 - letterboxMotionT * 1.12);
  /**
   * Center block (static headline + CTAs): matches letterbox visibility so it’s fully
   * gone as soon as the letterbox graphic has faded out — not lingering on linear `progress`.
   */
  const heroFgOpacity =
    staticLines && letterboxSrc
      ? letterboxOpacity
      : staticLines
        ? Math.max(0, 1 - progress * 1.55)
        : undefined;

  const showEyebrow = eyebrow != null;
  const showSubtitle = subtitle != null;
  const showActions = actions != null;

  return (
    <section
      ref={outerRef}
      className="relative"
      style={{ minHeight: `calc(${scrollScreens} * 100vh)` }}
    >
      {/* Fixed viewport-height stage so layers share one box that tracks resize (svh ~= visible chrome) */}
      <div className="sticky top-0 flex h-[100svh] min-h-[100svh] w-full max-w-none shrink-0 flex-col overflow-hidden">
        <div className="relative flex h-full min-h-0 w-full max-w-none flex-col">
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
      </div>
    </section>
  );
}
