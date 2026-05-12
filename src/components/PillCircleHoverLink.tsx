import type { ReactNode } from "react";

const PILL_TIMING =
  "duration-[1180ms] ease-[cubic-bezier(0.62_0.01_0.33_1)]" as const;

/** Same gradient as primary hover fill (Tailwind arbitrary bg). */
const LIME_GRADIENT_BG =
  "bg-[linear-gradient(159deg,#1fff3a_0%,#1fff3a_16%,#adf65a_42%,#caf67a_62%,#daf88c_82%,#dfff5f_100%)]" as const;

/** Static gradient fill for text (matches secondary pill label at rest). */
export const LIME_GRADIENT_CLIP_TEXT =
  `${LIME_GRADIENT_BG} bg-clip-text text-transparent [-webkit-text-fill-color:transparent]` as const;

/** `inline-block` + `w-max` so gradients map across glyphs, not full layout width (avoids flat‑green headings). */
export const LIME_GRADIENT_HEADLINE =
  `${LIME_GRADIENT_CLIP_TEXT} inline-block w-max max-w-full` as const;

const SECONDARY_LABEL_REST =
  `${LIME_GRADIENT_CLIP_TEXT} group-hover:bg-none group-hover:bg-clip-border group-hover:text-black group-hover:[-webkit-text-fill-color:unset]` as const;

type PillVariant = "primary" | "secondary";

type PillCircleHoverLinkProps =
  Omit<React.ComponentPropsWithoutRef<"a">, "className"> & {
    className?: string;
    /** Extra classes on the label wrapper for color transitions etc. */
    labelClassName?: string;
    /** Primary: lime-gradient hover fill. Secondary: lime-gradient label, black on hover. */
    variant?: PillVariant;
    children: ReactNode;
  };

const variantAccent: Record<
  PillVariant,
  { fill: string; hoverBorder: string; focusRing: string }
> = {
  primary: {
    fill: LIME_GRADIENT_BG,
    hoverBorder: "hover:border-[#c5f066]",
    focusRing: "focus-visible:ring-[#c5f066]",
  },
  secondary: {
    fill: "bg-white",
    hoverBorder: "hover:border-white",
    focusRing: "focus-visible:ring-white",
  },
};

export function PillCircleHoverLink({
  children,
  className = "",
  labelClassName = "",
  variant = "primary",
  ...rest
}: PillCircleHoverLinkProps) {
  const accent = variantAccent[variant];
  return (
    <a
      {...rest}
      className={`group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full outline-none ring-offset-zinc-950 transition-[border-color,box-shadow] ${PILL_TIMING} focus-visible:ring-2 ${accent.focusRing} focus-visible:ring-offset-2 ${className} ${accent.hoverBorder}`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-0 ${accent.fill} [clip-path:circle(0%_at_50%_-12%)] transition-[clip-path] ${PILL_TIMING} group-hover:[clip-path:circle(165%_at_50%_-12%)] motion-reduce:transition-none motion-reduce:duration-0`}
      />
      <span
        className={`relative z-10 inline-flex items-center justify-center gap-2 transition-colors ${PILL_TIMING} ${variant === "secondary" ? SECONDARY_LABEL_REST : ""} ${labelClassName}`}
      >
        {children}
      </span>
    </a>
  );
}
