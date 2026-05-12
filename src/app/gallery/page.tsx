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
    <div className="relative flex min-h-[100svh] flex-col">
      <SiteHeader />

      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/gallery/graveyard-bg.png)",
          }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </div>

      <main className="relative z-[1] mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-20 pt-[max(6.5rem,calc(env(safe-area-inset-top,0px)+5.25rem))]">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            The Cold Cave
          </p>
          <h1 className="font-russo mt-2 text-4xl tracking-tight text-white sm:text-5xl md:text-6xl">
            Gallery
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-zinc-300 drop-shadow-[0_1px_12px_rgba(0,0,0,0.85)]">
            Selected artwork and album imagery — a visual thread through the catalog.
          </p>
        </header>

        <section
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Gallery artworks"
        >
          {galleryPieces.map((piece) => (
            <figure
              key={piece.src}
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)] ring-1 ring-white/10"
            >
              <Image
                src={piece.src}
                alt={piece.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
              />
            </figure>
          ))}
        </section>
      </main>
    </div>
  );
}
