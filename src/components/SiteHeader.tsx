"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LogoStar } from "@/components/icons/LogoStar";
import { PillCircleHoverLink } from "@/components/PillCircleHoverLink";
import StarBorder from "@/components/StarBorder";

const navLinks = [
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
];

/**
 * Hysteresis + rAF so scrolled chrome does not thrash at a pixel threshold
 * (mobile URL bars, subpixel scroll). Scrolled state uses opaque paint only (no backdrop-filter).
 */
const SCROLL_CHROME_ON_PX = 22;
const SCROLL_CHROME_OFF_PX = 5;

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let rafId = 0;

    const apply = () => {
      rafId = 0;
      const y = window.scrollY;
      setScrolled((prev) => {
        if (prev) return y > SCROLL_CHROME_OFF_PX;
        return y > SCROLL_CHROME_ON_PX;
      });
    };

    const onScrollOrResize = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-[background-color,border-color,box-shadow] duration-300 ease-out ${
        scrolled
          ? "border-b border-white/[0.08] bg-zinc-950/[0.93] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
          : "border-b border-transparent bg-transparent shadow-none"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-[1.125rem]">
        <Link
          href="/"
          aria-label="Dark Star home"
          className="inline-flex items-center gap-1 text-white [font-family:var(--font-russo-one)] text-2xl tracking-tight sm:gap-1 sm:text-3xl md:text-4xl md:tracking-tighter drop-shadow-[0_1px_12px_rgba(0,0,0,0.55)]"
          onClick={() => {
            if (pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <LogoStar className="h-[1.06em] w-[1.06em] shrink-0 -translate-y-px" />
          <span className="leading-none">Dark Star</span>
        </Link>
        <nav className="hidden items-center gap-9 lg:gap-10 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={
                scrolled
                  ? "text-lg font-semibold text-zinc-400 tracking-tight transition hover:text-white"
                  : "text-lg font-semibold tracking-tight text-white/90 transition hover:text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]"
              }
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <StarBorder
            glow="brand"
            tone="static"
            speed="6.5s"
            thickness={0}
            className="hidden rounded-full sm:inline-flex"
            innerClassName="rounded-full [&_a]:inline-flex"
          >
            <PillCircleHoverLink
              variant="secondary"
              href="#"
              className={
                scrolled
                  ? "min-h-[3.25rem] items-center rounded-full border border-transparent bg-transparent px-7 py-3 text-lg font-semibold inline-flex"
                  : "min-h-[3.25rem] items-center rounded-full border border-white/20 bg-transparent px-7 py-3 text-lg font-semibold inline-flex drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]"
              }
            >
              Are you
            </PillCircleHoverLink>
          </StarBorder>
          <PillCircleHoverLink
            href="#"
            className="inline-flex min-h-[3.25rem] border border-white/15 bg-white px-7 py-3 text-lg font-semibold shadow-md"
            labelClassName="text-zinc-950"
          >
            Happier Now
          </PillCircleHoverLink>
        </div>
      </div>
    </header>
  );
}
