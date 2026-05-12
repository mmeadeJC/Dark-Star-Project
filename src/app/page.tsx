import { HeroParallax } from "@/components/HeroParallax";
import { HomeFeaturedCarousel } from "@/components/HomeFeaturedCarousel";
import PixelTrail from "@/components/pixel-trail/PixelTrail";
import { PillCircleHoverLink } from "@/components/PillCircleHoverLink";
import StarBorder from "@/components/StarBorder";
import { SiteHeader } from "@/components/SiteHeader";
import { homeCarouselSlides } from "@/data/homeCarouselSlides";

export default function Home() {
  return (
    <div className="flex flex-col">
      <SiteHeader />

      <HeroParallax
        staticLines={{
          line1: "This is Dark Star",
          line2: "a vibe-coded experiment.",
        }}
        actions={
          <>
            <StarBorder
              glow="brand"
              speed="6.5s"
              thickness={0}
              className="inline-flex rounded-full"
              innerClassName="rounded-full [&_a]:inline-flex"
            >
              <PillCircleHoverLink
                variant="secondary"
                href="#"
                className="min-h-[3.25rem] border border-white/20 bg-transparent px-8 py-3.5 text-lg font-semibold"
              >
                The Center
              </PillCircleHoverLink>
            </StarBorder>
            <PillCircleHoverLink
              href="#"
              className="min-h-[3.25rem] border border-white/10 bg-white px-8 py-3.5 text-lg font-semibold"
              labelClassName="text-zinc-950"
            >
              Of the Universe
            </PillCircleHoverLink>
          </>
        }
        stickyScrollScreens={2.48}
        heroForegroundFadeEndProgress={0.26}
        brandEnterStart={0.28}
        brandEnterEnd={0.4}
        brandPostEndProgress={0.62}
        backgroundDrift={64}
        backgroundScale={0.08}
        brandImage={{
          src: "/cold-cave-logo.svg",
          alt: "COLD CAVE STILLS",
          eyebrow: "Listen to",
        }}
      >
        <div className="pointer-events-none absolute inset-0 h-full w-full">
          <PixelTrail
            gridSize={73}
            trailSize={0.14}
            maxAge={450}
            interpolate={4.1}
            color="#44ef7d"
            gooeyFilter={{ id: "dark-star-hero-pixel-goo", strength: 2 }}
            gooStrength={15}
          />
        </div>
      </HeroParallax>

      <section
        aria-label="Cold Cave stills carousel"
        className="relative -mt-[30rem] scroll-mt-2 w-full overflow-visible px-0 pb-2 pt-0 sm:-mt-[34rem] sm:scroll-mt-4 sm:pb-3 md:-mt-[36.5rem] lg:-mt-[41rem] mb-32 sm:mb-44"
      >
        <HomeFeaturedCarousel slides={homeCarouselSlides} />
      </section>
    </div>
  );
}
