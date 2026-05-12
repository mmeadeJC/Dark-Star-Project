"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useRef } from "react";

import { LogoStar } from "@/components/icons/LogoStar";

const MIN_FONT_PX = 28;
const MAX_FONT_PX = 720;

function fitWordmarkFont(link: HTMLElement, maxWidthPx: number) {
  if (maxWidthPx < 48) return;

  let lo = MIN_FONT_PX;
  let hi = MAX_FONT_PX;
  for (let i = 0; i < 26; i++) {
    const mid = (lo + hi) / 2;
    link.style.fontSize = `${mid}px`;
    if (link.scrollWidth <= maxWidthPx) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  link.style.fontSize = `${lo}px`;
  // scrollWidth vs layout width can disagree by a pixel or two at large sizes
  while (link.scrollWidth > maxWidthPx && lo > MIN_FONT_PX) {
    lo -= 1;
    link.style.fontSize = `${lo}px`;
  }
}

export function FooterWordmark() {
  const measureRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const fit = useCallback(() => {
    const measure = measureRef.current;
    const link = linkRef.current;
    if (!measure || !link) return;
    const bandPx = measure.getBoundingClientRect().width;
    const budget = Math.max(48, Math.floor(bandPx) - 6);
    fitWordmarkFont(link, budget);
  }, []);

  useLayoutEffect(() => {
    const measure = measureRef.current;
    if (!measure) return;
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(measure);
    return () => ro.disconnect();
  }, [fit]);

  return (
    <div className="box-border mt-8 w-full min-w-0 max-w-full px-[40px] pb-1 sm:mt-10">
      <div ref={measureRef} className="w-full min-w-0 max-w-full">
        <div className="flex w-full justify-center">
          <Link
            ref={linkRef}
            href="/"
            className="flex w-max max-w-full shrink-0 translate-x-[calc(12px-0.14em)] items-center gap-[0.04em] whitespace-nowrap text-zinc-100 [font-family:var(--font-russo-one)] leading-none tracking-tight outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400/80 md:tracking-tighter"
            style={{ fontSize: "clamp(3.25rem, 8vw, 8rem)" }}
            aria-label="Dark Star home"
          >
            <LogoStar className="block h-[0.88em] w-[0.88em] shrink-0" />
            <span className="block leading-none">Dark Star</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
