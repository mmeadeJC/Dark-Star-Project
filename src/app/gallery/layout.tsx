import type { ReactNode } from "react";

/**
 * Opaque plane above the global WebGL `Galaxy` (z-0) only on this route.
 * Stops constant WebGL + scrolling DOM compositing, which often reads as flicker.
 */
export default function GalleryLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] bg-zinc-950"
      />
      {children}
    </>
  );
}
