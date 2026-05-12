import type { Metadata } from "next";
import Image from "next/image";

import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "The Cold Cave Gallery — Dark Star",
  description:
    "Browse curated work from The Cold Cave gallery — generations, experiments, and community highlights.",
};

const galleryPieces = [
  {
    src: "/gallery/art/album-1.png",
    alt: "Cold Cave — Love Comes Close album artwork",
  },
  {
    src: "/gallery/art/album-2.png",
    alt: "Cold Cave album artwork with sunflowers and red logotype",
  },
  {
    src: "/gallery/art/album-3.png",
    alt: "Black-and-white cherub statue",
  },
  {
    src: "/gallery/art/album-4.png",
    alt: "Portrait beside flowers, black and white",
  },
  {
    src: "/gallery/art/album-5.png",
    alt: "Floral still life on dark background",
  },
  {
    src: "/gallery/art/album-6.png",
    alt: "Figure in hood with dramatic light",
  },
] as const;

export default function GalleryPage() {
  return (
    <div className="relative z-[2] flex min-h-full flex-1 flex-col overflow-x-hidden">
      <SiteHeader />

      {/* ~18% wider than max-w-7xl (80rem) so each tile is ~18% larger at same column counts */}
      <main className="relative z-[1] mx-auto flex w-full max-w-[min(100%,calc(80rem*1.18))] flex-1 flex-col rounded-2xl bg-zinc-950 px-6 pb-20 pt-[max(6.5rem,calc(env(safe-area-inset-top,0px)+5.25rem))] ring-1 ring-white/[0.06] sm:px-8">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            COLD CAVE STILLS
          </p>
          <h1 className="font-russo mt-2 text-4xl tracking-tight text-white sm:text-5xl md:text-6xl">
            Gallery
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-zinc-300 drop-shadow-[0_1px_12px_rgba(0,0,0,0.85)]">
            Selected artwork and album imagery — a visual thread through the catalog.
          </p>
        </header>

        <section
          className="mt-14 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Gallery artworks"
        >
          {galleryPieces.map((piece, index) => (
            <figure
              key={piece.src}
              className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)] ring-1 ring-white/10"
            >
              <Image
                src={piece.src}
                alt={piece.alt}
                fill
                sizes="(max-width: 640px) min(100vw,661px), (max-width: 1024px) 50vw, 425px"
                priority={index === 0}
                decoding="async"
                className="object-cover"
              />
            </figure>
          ))}
        </section>
      </main>
    </div>
  );
}
