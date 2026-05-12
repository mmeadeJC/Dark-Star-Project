import {
  FooterAppStoreBadgeLink,
  FooterGooglePlayBadgeLink,
} from "@/components/FooterStoreBadgeLinks";
import { FooterWordmark } from "@/components/FooterWordmark";

const columnA = [
  { label: "Innovate", href: "#" },
  { label: "Collaborate", href: "#" },
  { label: "Activate", href: "#" },
  { label: "Integrate", href: "#" },
  { label: "Accumulate", href: "#" },
  { label: "Incinerate", href: "#" },
] as const;

const columnB = [
  { label: "Null space", href: "#" },
  { label: "Outface", href: "#" },
  { label: "Time base", href: "#" },
  { label: "Snail's pace", href: "#" },
  { label: "Seed case", href: "#" },
  { label: "Tide race", href: "#" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="scroll-mt-24 relative z-10 max-w-full overflow-x-clip border-t border-white/[0.06] bg-[#181818] text-zinc-300"
    >
      <div className="mx-auto max-w-7xl px-6 pt-16 sm:pt-20">
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-start lg:gap-x-12 xl:gap-x-20">
          <div className="mx-auto flex w-[68%] max-w-[min(100%,326px)] shrink-0 flex-col gap-3 select-none lg:mx-0 lg:ml-[50px] lg:w-[68%] lg:max-w-none">
            <FooterAppStoreBadgeLink />
            <FooterGooglePlayBadgeLink />
          </div>

          <div className="flex w-full flex-wrap justify-center gap-x-16 gap-y-8 sm:gap-x-24 lg:-ml-10 lg:justify-center lg:gap-x-16">
            <nav
              aria-label="Product links"
              className="font-sans flex min-w-[9rem] flex-col gap-[0.85rem] text-[0.9375rem] font-normal tracking-wide text-zinc-400"
            >
              {columnA.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="transition hover:text-zinc-100"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <nav
              aria-label="More links"
              className="font-sans flex min-w-[9rem] flex-col gap-[0.85rem] text-[0.9375rem] font-normal tracking-wide text-zinc-400"
            >
              {columnB.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="transition hover:text-zinc-100"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <FooterWordmark />

      <div className="font-sans box-border -mt-[50px] flex min-w-0 max-w-full flex-wrap items-center justify-between gap-x-4 gap-y-3 px-[40px] pb-10 pt-3 text-[11px] leading-relaxed text-zinc-400 sm:pb-12 sm:pt-4">
        <nav
          aria-label="Legal"
          className="flex flex-wrap items-center gap-x-1.5 gap-y-2"
        >
          <a href="#" className="transition hover:text-zinc-200">
            Privacy Policy
          </a>
          <span className="text-zinc-600" aria-hidden>
            |
          </span>
          <a href="#" className="transition hover:text-zinc-200">
            Terms of Service
          </a>
          <span className="text-zinc-600" aria-hidden>
            |
          </span>
          <a href="#" className="transition hover:text-zinc-200">
            Cookie Policy
          </a>
        </nav>
        <p className="shrink-0 text-right">
          © {year} All Rights Reserved Dark Star Co. Inc.{" "}
          <span className="text-zinc-600">|</span> Orlando, FL USA
        </p>
      </div>
    </footer>
  );
}
