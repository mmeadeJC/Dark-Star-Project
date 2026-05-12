import { FeaturedCarouselScrollScale } from "@/components/FeaturedCarouselScrollScale";
import { HeroParallax } from "@/components/HeroParallax";
import { HomeFeaturedCarousel } from "@/components/HomeFeaturedCarousel";
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
        stickyScrollScreens={4}
        heroForegroundFadeEndProgress={0.26}
        brandEnterEnd={0.55}
        brandPostEndProgress={0.82}
        backgroundDrift={64}
        backgroundScale={0.08}
        brandImage={{
          src: "/cold-cave-logo.svg",
          alt: "COLD CAVE STILLS",
          eyebrow: "Listen to",
        }}
      />

      <section
        aria-labelledby="cold-cave-stills-heading"
        className="relative -mt-[12.5rem] scroll-mt-2 bg-zinc-950/35 px-6 pb-16 pt-1 sm:-mt-[14.5rem] sm:scroll-mt-4 sm:pb-24 sm:pt-2 md:-mt-[16.5rem] lg:-mt-[18rem] mb-20 sm:mb-28"
      >
        <div className="mx-auto max-w-5xl">
          <p
            id="cold-cave-stills-heading"
            className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 sm:mb-4"
          >
            COLD CAVE STILLS
          </p>
          <FeaturedCarouselScrollScale>
            <HomeFeaturedCarousel slides={homeCarouselSlides} />
          </FeaturedCarouselScrollScale>
        </div>
      </section>
    </div>
  );
}
