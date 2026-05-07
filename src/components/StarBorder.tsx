import {
  createElement,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import "./StarBorder.css";

/**
 * Radial halo built from primary pill lime hues (#1fff3a → #dfff5f),
 * used when glow="brand".
 */
export const STAR_BORDER_BRAND_RADIAL =
  "radial-gradient(circle at 50% 50%, rgba(31, 255, 58, 0.55) 0%, rgba(173, 246, 90, 0.4) 22%, rgba(202, 246, 122, 0.28) 42%, rgba(223, 255, 95, 0.14) 62%, transparent 78%)" as const;

type GlowMode = "brand" | "solid";

/** React Bits parity: opaque inner chrome (`inner-content`). Default strips it for composing `<a>` / Tailwind pills. */
export type StarBorderInnerPreset = "minimal" | "opaque";

export type StarBorderProps = Omit<
  HTMLAttributes<HTMLElement>,
  "children"
> & {
  as?: ElementType;
  innerClassName?: string;
  innerPreset?: StarBorderInnerPreset;
  color?: string;
  glow?: GlowMode;
  speed?: string;
  /** Matches React Bits: vertical padding `${thickness}px 0`. */
  thickness?: number;
  /**
   * When using `innerPreset="minimal"` with translucent buttons, hides glow in the middle
   * so shimmer reads on the capsule edge (parity with Bits’ opaque inner).
   */
  edgeMask?: boolean;
  /** Inset for the edge mask; smaller = wider visible ring. Default 2. */
  edgeInsetPx?: number;
  /** Optional override when `edgeMask` can’t use `var(--background)` (e.g. custom stage). */
  edgeMaskBg?: string;
  children?: ReactNode;
};

function solidRadialGlow(c: string) {
  return `radial-gradient(circle, ${c}, transparent 10%)`;
}

/** Stagger the two shimmer layers so motion feels more continuous around the pill. */
function halfCycleDelay(duration: string): string | undefined {
  const t = duration.trim();
  if (t.endsWith("ms")) {
    const n = Number.parseFloat(t.slice(0, -2));
    return Number.isFinite(n) ? `${-n / 2}ms` : undefined;
  }
  if (t.endsWith("s")) {
    const n = Number.parseFloat(t.slice(0, -1));
    return Number.isFinite(n) ? `${-n / 2}s` : undefined;
  }
  return undefined;
}

/**
 * Animated border shimmer — [React Bits Star Border](https://reactbits.dev/animations/star-border).
 */
export default function StarBorder({
  as,
  className = "",
  innerClassName = "",
  innerPreset = "minimal",
  color = "white",
  glow = "solid",
  speed = "6s",
  thickness = 1,
  edgeMask,
  edgeInsetPx = 2,
  edgeMaskBg,
  children,
  style,
  ...rest
}: StarBorderProps) {
  const Tag = as ?? "div";

  const radialBackground =
    glow === "brand" ? STAR_BORDER_BRAND_RADIAL : solidRadialGlow(color);

  const useEdgeMask =
    innerPreset === "minimal" && edgeMask !== false;

  const mergedStyle: CSSProperties & {
    ["--sb-edge-inset"]?: string;
    ["--sb-edge-mask-bg"]?: string;
  } = {
    ...style,
    padding: `${thickness}px 0`,
    ...(useEdgeMask
      ? {
          "--sb-edge-inset": `${edgeInsetPx}px`,
          ...(edgeMaskBg ? { "--sb-edge-mask-bg": edgeMaskBg } : {}),
        }
      : {}),
  };

  const innerClasses = [
    "sb-star-border-inner",
    innerPreset === "opaque" && "sb-star-border-inner--opaque",
    innerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const topStagger = halfCycleDelay(speed);

  return createElement(
    Tag as ElementType,
    {
      ...rest,
      className: `sb-star-border-container ${className}`.trim(),
      style: mergedStyle,
    },
    <>
      <div
        className="sb-border-gradient-bottom"
        aria-hidden
        style={{
          background: radialBackground,
          animationDuration: speed,
        }}
      />
      <div
        className="sb-border-gradient-top"
        aria-hidden
        style={{
          background: radialBackground,
          animationDuration: speed,
          ...(topStagger ? { animationDelay: topStagger } : {}),
        }}
      />
      {useEdgeMask ? (
        <div className="sb-star-edge-mask" aria-hidden />
      ) : null}
      <div className={innerClasses}>{children}</div>
    </>
  );
}
