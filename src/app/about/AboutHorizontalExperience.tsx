"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { LIME_GRADIENT_HEADLINE } from "@/components/PillCircleHoverLink";

import { GloryRotatingMark } from "./GloryRotatingMark";

/** Home hero uses `stickyScrollScreens={7}`; About uses 60% of that vertical scroll range. */
const HOME_HERO_SCROLL_SCREENS = 7;
const ABOUT_VERTICAL_SCROLL_FRACTION = 0.6;
const ABOUT_SCROLL_SCREENS =
  HOME_HERO_SCROLL_SCREENS * ABOUT_VERTICAL_SCROLL_FRACTION;

function prefersReducedMotionQuery(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Scroll-linked spotlight: sharper + brighter toward viewport center (#2 polish). */
function applyHorizontalPanelFocus(opts: {
  viewport: HTMLElement;
  panels: readonly (HTMLElement | null)[];
}) {
  const { viewport, panels } = opts;

  const vRect = viewport.getBoundingClientRect();
  if (vRect.width <= 0) return;

  const centerX = vRect.left + vRect.width / 2;
  const fadeRadius = Math.max(vRect.width * 0.42, 260);

  for (let i = 0; i < panels.length; i++) {
    const el = panels[i];
    if (!el) continue;

    const r = el.getBoundingClientRect();
    if (r.width <= 0) continue;

    const sectionCx = r.left + r.width / 2;
    const d = Math.abs(centerX - sectionCx);

    let proximity = 1 - Math.min(d / fadeRadius, 1);
    proximity = 1 - (1 - proximity) ** 1.45;

    const isLastPanel = i === panels.length - 1;
    const opacity = 0.38 + proximity * 0.62;
    const blurPx = isLastPanel ? 0 : (1 - proximity) * 7;
    const scale = isLastPanel ? 1 : 0.982 + proximity * 0.018;

    el.style.opacity = opacity.toFixed(3);
    el.style.filter = blurPx < 0.35 ? "none" : `blur(${blurPx.toFixed(2)}px)`;
    el.style.transform = isLastPanel ? "translateZ(0)" : `scale(${scale.toFixed(4)}) translateZ(0)`;
    el.style.transformOrigin = "50% 50%";
    el.style.willChange = isLastPanel ? "opacity" : "opacity, filter, transform";
  }
}

function clearPanelFocusStyles(panels: readonly (HTMLElement | null)[]) {
  for (const el of panels) {
    if (!el) continue;
    el.style.opacity = "";
    el.style.filter = "";
    el.style.transform = "";
    el.style.willChange = "";
    el.style.transformOrigin = "";
  }
}

export function AboutHorizontalExperience() {
  const outerRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([null, null, null]);

  const setPanelRef = useCallback((index: number) => (node: HTMLElement | null) => {
    panelRefs.current[index] = node;
  }, []);

  const [progress, setProgress] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);

  const recomputeMaxOffset = useCallback(() => {
    const row = trackRef.current;
    const view = viewportRef.current;
    if (!row || !view) return;
    setMaxOffset(Math.max(0, row.scrollWidth - view.clientWidth));
  }, []);

  const measure = useCallback(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const topAbs = outer.getBoundingClientRect().top + window.scrollY;
    const scrollRange = Math.max(1, outer.offsetHeight - window.innerHeight);
    const scrolledInto = window.scrollY - topAbs;
    const t = Math.min(1, Math.max(0, scrolledInto / scrollRange));
    setProgress(t);
  }, []);

  const syncHorizontalPanelFocus = useCallback(() => {
    const view = viewportRef.current;
    const panels = panelRefs.current;
    if (prefersReducedMotionQuery()) {
      clearPanelFocusStyles(panels);
      return;
    }
    if (!view) return;
    applyHorizontalPanelFocus({ viewport: view, panels });
  }, []);

  useLayoutEffect(() => {
    recomputeMaxOffset();
  }, [recomputeMaxOffset]);

  useLayoutEffect(() => {
    syncHorizontalPanelFocus();
  }, [progress, maxOffset, syncHorizontalPanelFocus]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      syncHorizontalPanelFocus();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [syncHorizontalPanelFocus]);

  useEffect(() => {
    measure();

    let frame = 0;
    const onScrollOrResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        measure();
        recomputeMaxOffset();
      });
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    const row = trackRef.current;
    const view = viewportRef.current;
    const ro =
      typeof ResizeObserver !== "undefined" && row && view
        ? new ResizeObserver(onScrollOrResize)
        : null;
    if (ro && row && view) {
      ro.observe(row);
      ro.observe(view);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      ro?.disconnect();
    };
  }, [measure, recomputeMaxOffset]);

  const translateX = -progress * maxOffset;

  const headerPad =
    "pt-[max(6.5rem,calc(env(safe-area-inset-top,0px)+5.25rem))]";

  return (
    <section
      ref={outerRef}
      className="relative w-full"
      style={{ minHeight: `calc(${ABOUT_SCROLL_SCREENS} * 100svh)` }}
      aria-label="About"
    >
      <div className="sticky top-0 h-[100svh] min-h-[100svh] w-full overflow-x-hidden overflow-y-hidden">
        <div className={`relative z-[1] flex h-full min-h-0 flex-col ${headerPad}`}>
          <div
            ref={viewportRef}
            className="relative min-h-0 flex-1 overflow-hidden"
          >
            <div
              ref={trackRef}
              className="relative z-[3] flex h-full min-h-[min(560px,calc(100svh-6.5rem))] w-max flex-row pl-8 md:pl-[2.75in]"
              style={{
                transform: `translate3d(${translateX}px, 0, 0)`,
                transition: "none",
              }}
            >
              <section
                ref={setPanelRef(0)}
                className="flex w-[min(100vw,1200px)] shrink-0 flex-col items-center justify-center border-r border-white/[0.06] px-4 sm:px-14"
                aria-label="Intro"
              >
                <div className="about-hand-cue pointer-events-none w-full max-w-[760px] shrink-0">
                  <img
                    src="/about/skeleton-hand.svg"
                    alt=""
                    width={2074}
                    height={1193}
                    decoding="async"
                    fetchPriority="high"
                    className="h-auto w-full object-contain"
                  />
                </div>
                <span className="sr-only">
                  Scroll down to move sideways through About
                </span>
              </section>

              <section
                ref={setPanelRef(1)}
                className="flex w-[min(100vw,1200px)] shrink-0 flex-col justify-center border-r border-white/[0.06] px-8 sm:px-14"
                aria-label="Cold Cave biography"
              >
                <div className="mx-auto w-full max-w-4xl self-center text-left">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400 sm:text-[0.8125rem]">
                    Cold Cave
                  </p>
                  <h2
                    className={`font-russo mt-2 text-4xl tracking-tight sm:mt-2.5 sm:text-5xl md:text-6xl ${LIME_GRADIENT_HEADLINE}`}
                  >
                    Biography
                  </h2>
                  <div className="mt-8 space-y-6 text-pretty text-left text-lg leading-[1.75] text-zinc-300 sm:text-xl sm:leading-[1.82] lg:text-[1.35rem] lg:leading-[1.9]">
                    <p>
                      If you&apos;re looking for the architect of the modern
                      darkwave revival, look no further than Cold Cave. Founded
                      in 2007 by Wesley Eisold—a veteran of the hardcore scene.
                      In the late &apos;90s and early 2000s he fronted the band
                      American Nightmare and traded heavy breakdowns for dark
                      synth pop—the project has spent nearly two decades
                      defining the &ldquo;black-clad and brooding&rdquo; aesthetic
                      for a new generation.
                    </p>
                    <p>
                      Originally emerging from the gritty art scenes of New York
                      and Philadelphia before settling into the sun-drenched noir
                      of Los Angeles, Cold Cave is less of a traditional band
                      and more of a shifting electronic collective centered
                      around Eisold&apos;s poetic nihilism.
                    </p>
                    <p>
                      Cold Cave&apos;s music is a masterclass in Darkwave,
                      Synth-pop, and Industrial Noise. Imagine the skeletal,
                      motorik beats of Nitzer Ebb crashing into the melodic,
                      heart-on-sleeve yearning of New Order. You won&apos;t find
                      Cold Cave chasing TikTok trends; they&apos;ve built a
                      massive, fiercely loyal cult following through pure
                      atmosphere and aesthetic consistency. Their audience is a
                      stylish cross-section of old-school goths, underground
                      electronic heads, and &ldquo;fashion-forward&rdquo; punks.
                      They are the kind of band that headlines major alternative
                      festivals like Cruel World or Darker Waves and performs at
                      the Guggenheim, proving that their brand of synth-misery is
                      as much high art as it is dance-floor filler.
                    </p>
                  </div>
                </div>
              </section>

              <section
                ref={setPanelRef(2)}
                className="flex w-[min(100vw,1200px)] shrink-0 flex-col items-center justify-center px-6 sm:px-14"
                aria-label="Glory mark"
              >
                <GloryRotatingMark />
              </section>
              {/* Extra horizontal slack (~2.5in) so Glory can linger before footer enters. */}
              <div className="h-full w-[2.5in] shrink-0" aria-hidden />
            </div>
          </div>

          <div
            className="pointer-events-none absolute bottom-0 left-0 top-0 z-[2] w-10 bg-gradient-to-r from-zinc-950/80 to-transparent sm:w-14"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 top-0 z-[2] w-12 bg-gradient-to-l from-zinc-950/85 to-transparent sm:w-16"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
