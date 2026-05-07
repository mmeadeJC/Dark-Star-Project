"use client";

import { useEffect, useState } from "react";

import { LogoStar } from "@/components/icons/LogoStar";
import { PillCircleHoverLink } from "@/components/PillCircleHoverLink";
import StarBorder from "@/components/StarBorder";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Gallery", href: "#gallery" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
  { label: "Contact", href: "#contact" },
];

/** Pixels scrolled before frosted chrome appears */
const SHOW_BAR_AFTER_PX = 12;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SHOW_BAR_AFTER_PX);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300 ease-out ${
        scrolled
          ? "border-b border-white/[0.08] bg-zinc-950/45 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-zinc-950/35"
          : "border-b border-transparent bg-transparent backdrop-blur-none shadow-none backdrop-saturate-100 supports-[backdrop-filter]:bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-[1.125rem]">
        <a
          href="#"
          aria-label="Dark Star"
          className="inline-flex items-center gap-1 text-white [font-family:var(--font-russo-one)] text-2xl tracking-tight sm:gap-1 sm:text-3xl md:text-4xl md:tracking-tighter drop-shadow-[0_1px_12px_rgba(0,0,0,0.55)]"
        >
          <LogoStar className="h-[1.06em] w-[1.06em] shrink-0 -translate-y-px" />
          <span className="leading-none">Dark Star</span>
        </a>
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
              Sign up
            </PillCircleHoverLink>
          </StarBorder>
          <PillCircleHoverLink
            href="#"
            className="inline-flex min-h-[3.25rem] border border-white/15 bg-white px-7 py-3 text-lg font-semibold shadow-md"
            labelClassName="text-zinc-950"
          >
            Log In
          </PillCircleHoverLink>
        </div>
      </div>
    </header>
  );
}
