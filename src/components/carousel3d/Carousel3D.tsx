"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

import type { EditorialCarouselSlide } from "@/components/DragWheelEditorialCarousel";

const PLANE_W = 3.2;
const PLANE_H = 1.91;
const CYL_R = 3.55;
const CYL_H = 2.5;
const CYL_SEG = 96;
/** Lifts cylinder in frame so the bottom edge isn’t clipped by the viewport. */
const CYL_GROUP_Y = 0.58;
const DRAG_SENS = 0.0045;
/** Radians per second — full turn ≈ 105 s at 0.06. */
const AUTO_ROTATE_RAD_PER_SEC = 0.06;

const TWO_PI = Math.PI * 2;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Build one horizontal strip texture from already-loaded Three textures. */
function buildStripAtlas(
  textureSources: THREE.Texture[],
  stripH = 1800,
): THREE.CanvasTexture {
  const n = textureSources.length;
  const aspect = PLANE_W / PLANE_H;
  const cellW = Math.round(stripH * aspect);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(2, cellW * n);
  canvas.height = stripH;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas2D not available");
  }

  for (let i = 0; i < n; i += 1) {
    const srcTex = textureSources[i];
    const img = srcTex.image as HTMLImageElement | ImageBitmap | undefined;
    if (!img || !("width" in img) || img.width === 0) continue;
    ctx.drawImage(img as CanvasImageSource, i * cellW, 0, cellW, stripH);
  }

  const atlas = new THREE.CanvasTexture(canvas);
  atlas.colorSpace = THREE.SRGBColorSpace;
  atlas.wrapS = THREE.ClampToEdgeWrapping;
  atlas.wrapT = THREE.ClampToEdgeWrapping;
  atlas.needsUpdate = true;
  return atlas;
}

type CarouselSceneProps = {
  slides: readonly EditorialCarouselSlide[];
  urls: string[];
  onActiveIndex: (i: number) => void;
  nudgeRef: React.MutableRefObject<0 | -1 | 1 | null>;
  gotoRef: React.MutableRefObject<number | null>;
  reducedMotion: boolean;
};

function CylinderCarouselScene({
  slides,
  urls,
  onActiveIndex,
  nudgeRef,
  gotoRef,
  reducedMotion,
}: CarouselSceneProps) {
  const loaded = useTexture(urls);
  const texList = useMemo(
    () => (Array.isArray(loaded) ? loaded : [loaded]),
    [loaded],
  );

  useLayoutEffect(() => {
    for (const t of texList) {
      t.colorSpace = THREE.SRGBColorSpace;
    }
  }, [texList]);

  const n = slides.length;
  const step = useMemo(() => TWO_PI / Math.max(1, n), [n]);

  const imageKey = texList
    .map((t) => {
      const im = t.image as HTMLImageElement | ImageBitmap | undefined;
      if (!im || !("width" in im)) return "";
      return `${im.width}x${im.height}`;
    })
    .join("|");

  const atlas = useMemo(
    () => buildStripAtlas(texList),
    [texList, imageKey],
  );

  useLayoutEffect(() => {
    const a = atlas;
    return () => {
      a.dispose();
    };
  }, [atlas]);

  const groupRef = useRef<THREE.Group>(null);
  const rotationRef = useRef(0);
  const draggingRef = useRef(false);
  const lastIdx = useRef(-1);

  useEffect(() => {
    rotationRef.current = 0;
    lastIdx.current = -1;
  }, [n, urls.join("|")]);

  useFrame((_, dt) => {
    if (!groupRef.current) return;

    const gi = gotoRef.current;
    if (gi !== null) {
      const desired = -gi * step;
      const cur = rotationRef.current;
      const k = Math.round((cur - desired) / TWO_PI);
      rotationRef.current = desired + k * TWO_PI;
      gotoRef.current = null;
    }

    const nudge = nudgeRef.current;
    if (nudge !== null) {
      rotationRef.current += nudge * step;
      nudgeRef.current = null;
    }

    if (!draggingRef.current && !reducedMotion) {
      rotationRef.current += AUTO_ROTATE_RAD_PER_SEC * dt;
    }

    groupRef.current.rotation.y = rotationRef.current;

    const logical = Math.round(rotationRef.current / step);
    const idx = mod(logical, n);
    if (idx !== lastIdx.current) {
      lastIdx.current = idx;
      onActiveIndex(idx);
    }
  });

  const onDrag = useCallback(
    (dx: number) => {
      if (reducedMotion) return;
      const next = rotationRef.current + dx * DRAG_SENS;
      rotationRef.current = next;
      if (groupRef.current) groupRef.current.rotation.y = next;
    },
    [reducedMotion],
  );

  const onDragEnd = useCallback(() => {
    draggingRef.current = false;
  }, []);

  return (
    <>
      <group ref={groupRef} position={[0, CYL_GROUP_Y, 0]}>
        <mesh>
          <cylinderGeometry
            args={[CYL_R, CYL_R, CYL_H, CYL_SEG, 1, true]}
          />
          {/* Unlit: shows atlas colors as-authored (no PBR / env dimming). */}
          <meshBasicMaterial
            map={atlas}
            side={THREE.FrontSide}
            toneMapped={false}
          />
        </mesh>
      </group>

      <CarouselPointerBridge
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        onDragStart={() => {
          draggingRef.current = true;
        }}
      />
    </>
  );
}

function CarouselCameraRig() {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(0, 1.22, 9.35);
    camera.lookAt(0, CYL_GROUP_Y + 0.05, 0);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.updateProjectionMatrix();
    }
  }, [camera]);
  return null;
}

function CarouselPointerBridge({
  onDrag,
  onDragEnd,
  onDragStart,
}: {
  onDrag: (dx: number) => void;
  onDragEnd: () => void;
  onDragStart: () => void;
}) {
  const { gl } = useThree();
  const dragging = useRef(false);
  const lastX = useRef(0);

  const onDragRef = useRef(onDrag);
  const onDragEndRef = useRef(onDragEnd);
  const onDragStartRef = useRef(onDragStart);
  onDragRef.current = onDrag;
  onDragEndRef.current = onDragEnd;
  onDragStartRef.current = onDragStart;

  useEffect(() => {
    const canvas = gl.domElement;
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging.current = true;
      lastX.current = e.clientX;
      onDragStartRef.current();
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      onDragRef.current(dx);
    };
    const up = (e: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      onDragEndRef.current();
    };

    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const d = e.deltaX + e.deltaY;
      if (Math.abs(d) < 0.5) return;
      onDragRef.current(Math.sign(d) * 38);
      onDragEndRef.current();
    };

    canvas.style.touchAction = "none";
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("wheel", wheel, { passive: false });

    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("wheel", wheel);
    };
  }, [gl]);

  return null;
}

function CarouselFallback() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
      <circleGeometry args={[3, 48]} />
      <meshBasicMaterial color="#18181b" toneMapped={false} />
    </mesh>
  );
}

type Carousel3DProps = {
  slides: readonly EditorialCarouselSlide[];
  ariaLabel: string;
  className?: string;
};

export function Carousel3D({ slides, ariaLabel, className = "" }: Carousel3DProps) {
  const n = slides.length;
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const nudgeRef = useRef<0 | -1 | 1 | null>(null);
  const gotoRef = useRef<number | null>(null);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
  }, []);

  const urls = useMemo(
    () => slides.map((s) => (s.src.startsWith("/") ? s.src : `/${s.src}`)),
    [slides],
  );

  const go = useCallback(
    (dir: -1 | 1) => {
      if (n <= 1) return;
      nudgeRef.current = dir;
    },
    [n],
  );

  const goTo = useCallback(
    (i: number) => {
      if (n <= 1) return;
      gotoRef.current = ((i % n) + n) % n;
    },
    [n],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (n <= 1) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    },
    [n, go],
  );

  if (n === 0) return null;

  const multi = n > 1;
  const cap = slides[active];

  return (
    <div
      className={`relative w-full overflow-visible ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={multi ? 0 : undefined}
      onKeyDown={multi ? onKeyDown : undefined}
    >
      {multi ? (
        <>
          <p className="sr-only">
            Carousel rotates slowly on its own. You can drag, scroll the wheel, or use
            arrow keys when focused. Dots jump to a slide.
          </p>
          <p className="sr-only" aria-live="polite">
            {cap?.alt ?? ""}
          </p>
        </>
      ) : null}

      <Canvas
        shadows={false}
        dpr={[1, 1.75]}
        className="block h-[min(88vh,900px)] w-full min-h-[360px] touch-none overflow-visible [&_canvas]:block [&_canvas]:min-h-[360px] [&_canvas]:h-full [&_canvas]:w-full"
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        onCreated={({ gl, scene }) => {
          scene.background = null;
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.NoToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        camera={{
          position: [0, 1.22, 9.35],
          fov: 44,
          near: 0.1,
          far: 80,
        }}
      >
        <CarouselCameraRig />
        <Suspense fallback={<CarouselFallback />}>
          <CylinderCarouselScene
            slides={slides}
            urls={urls}
            onActiveIndex={setActive}
            nudgeRef={nudgeRef}
            gotoRef={gotoRef}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>

      {multi ? (
        <div className="flex justify-center px-4 pb-2 pt-2 sm:pt-3">
          <div className="flex flex-wrap justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-[width,background] duration-300 ${
                  i === active
                    ? "w-8 bg-white/90"
                    : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
