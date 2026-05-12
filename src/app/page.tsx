import { HeroParallax } from "@/components/HeroParallax";
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
          line2: "A vibe-coded experiment.",
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
        stickyScrollScreens={7}
        backgroundDrift={64}
        backgroundScale={0.08}
        carouselSlides={homeCarouselSlides}
        brandImage={{
          src: "/cold-cave-logo.svg",
          alt: "Cold Cave",
        }}
      />
    </div>
  );
}
