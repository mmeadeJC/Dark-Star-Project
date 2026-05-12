"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Inlines the Illustrator SVG (DOMParser keeps it as SVG, not parsed as HTML).
 * Curved type spins via CSS @keyframes inside the asset (SMIL breaks in inlined HTML/Chromium).
 */
export function GloryRotatingMark() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    let cancelled = false;
    fetch("/about/glory-logo.svg")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      })
      .then((svgText) => {
        if (cancelled || !hostRef.current) return;
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const root = doc.documentElement;
        if (!(root instanceof SVGSVGElement)) {
          setFailed(true);
          return;
        }
        const host = hostRef.current;
        host.replaceChildren();
        host.appendChild(document.importNode(root, true));
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      hostRef.current?.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="pointer-events-none relative aspect-square w-full max-w-[760px] shrink-0 select-none [&>svg]:block [&>svg]:h-full [&>svg]:w-full [&>svg]:max-h-full [&>svg]:bg-transparent"
      role="img"
      aria-label="Glory Bound — I've waited so long there's so much more"
    >
      {failed ? (
        <span className="sr-only">Glory logo failed to load</span>
      ) : null}
    </div>
  );
}
