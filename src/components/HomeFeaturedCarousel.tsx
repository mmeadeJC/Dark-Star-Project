"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

import type { HeroCarouselSlide } from "@/components/HeroScrollCarousel";

type HomeFeaturedCarouselProps = {
  slides: readonly HeroCarouselSlide[];
};

/** Document-flow carousel for the home page (below the scroll-scrubbed hero). */
export function HomeFeaturedCarousel({ slides }: HomeFeaturedCarouselProps) {
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (dir: -1 | 1) => {
      if (slides.length === 0) return;
      setIndex((i) => (i + dir + slides.length) % slides.length);
    },
    [slides.length],
  );

  if (slides.length === 0) return null;

  return (
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
