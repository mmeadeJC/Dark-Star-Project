"use client";

import { Carousel3D } from "@/components/carousel3d/Carousel3D";
import type { HeroCarouselSlide } from "@/components/HeroScrollCarousel";

type HomeFeaturedCarouselProps = {
  slides: readonly HeroCarouselSlide[];
};

/** Document-flow carousel for the home page (below the scroll-scrubbed hero). */
export function HomeFeaturedCarousel({ slides }: HomeFeaturedCarouselProps) {
  if (slides.length === 0) return null;

  return (
    <Carousel3D
      slides={slides}
      ariaLabel="COLD CAVE STILLS photo carousel"
    />
  );
}
