"use client";

import {
  DragWheelEditorialCarousel,
  type EditorialCarouselSlide,
} from "@/components/DragWheelEditorialCarousel";

export type HeroCarouselSlide = EditorialCarouselSlide;

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
  const showBrand = Boolean(brandImage?.src);

  if (slides.length === 0 && !showBrand) return null;

  const carouselEased = easeOutCubic(entrancePhase);
  const lift = Math.max(0, 1 - carouselEased);
  const visible = Math.min(1, carouselEased * 1.08);

  /** Linear scroll phase from parent (matches `HeroParallax` — no ease “plateau”). */
  const brandSlideLinear = Math.min(1, Math.max(0, brandEntrancePhase));
  /** Positive = further down; shrinks toward 0 as scroll progresses (slide up into place). */
  const brandOffsetDefaultVh = (1 - brandSlideLinear) * 40;
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
            ? "justify-end gap-2 pb-[min(14svh,6rem)] pt-[min(4vh,2rem)] sm:gap-2.5 sm:pb-[min(15svh,6.5rem)] sm:pt-[min(5vh,2.5rem)]"
            : "gap-8 justify-end pb-8 sm:gap-10 sm:pb-14"
          : "justify-center gap-8 sm:gap-10"
      }`}
      style={{ transition: "none" }}
    >
      {showBrand && brandImage ? (
        <div
          className="relative flex w-full shrink-0 flex-col items-center justify-center px-1 sm:px-2"
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
          className={`pointer-events-auto w-full max-w-[min(100%,72rem)] ${entrancePhase > 0.12 ? "" : "pointer-events-none"}`}
          style={{
            opacity: visible,
            transform: `translate3d(0, ${lift * 40}vh, 0)`,
            willChange: "transform, opacity",
            transition: "none",
          }}
          aria-hidden={entrancePhase < 0.08}
        >
          <DragWheelEditorialCarousel
            slides={slides}
            ariaLabel="COLD CAVE STILLS photo carousel"
          />
        </div>
      ) : null}
    </div>
  );
}
