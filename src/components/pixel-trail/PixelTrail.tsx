/* eslint-disable react/no-unknown-property */
"use client";

import { Canvas, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { shaderMaterial, useTrailTexture } from "@react-three/drei";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import * as THREE from "three";

import "./PixelTrail.css";

const TrailDotMaterial = shaderMaterial(
  {
    resolution: new THREE.Vector2(1, 1),
    mouseTrail: new THREE.Texture(),
    gridSize: 40,
    pixelColor: new THREE.Color("#ffffff"),
  },
  /* glsl */ `
    void main() {
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  /* glsl */ `
    uniform vec2 resolution;
    uniform sampler2D mouseTrail;
    uniform float gridSize;
    uniform vec3 pixelColor;

    vec2 coverUv(vec2 uv) {
      vec2 s = resolution.xy / max(resolution.x, resolution.y);
      vec2 newUv = (uv - 0.5) * s + 0.5;
      return clamp(newUv, 0.0, 1.0);
    }

    void main() {
      vec2 screenUv = gl_FragCoord.xy / resolution;
      vec2 uv = coverUv(screenUv);

      vec2 gridUv = fract(uv * gridSize);
      vec2 gridUvCenter = (floor(uv * gridSize) + 0.5) / gridSize;

      float trail = texture2D(mouseTrail, gridUvCenter).r;

      gl_FragColor = vec4(pixelColor, trail);
    }
  `,
  (mat) => {
    if (!mat) return;
    mat.transparent = true;
    mat.depthTest = false;
    mat.depthWrite = false;
  },
);

type GooeyFilterConfig = {
  id: string;
  strength: number;
};

type SceneProps = {
  gridSize: number;
  trailSize: number;
  maxAge: number;
  interpolate: number;
  easingFunction: (x: number) => number;
  pixelColor: string;
  globalPointer: boolean;
};

function Scene({
  gridSize,
  trailSize,
  maxAge,
  interpolate,
  easingFunction,
  pixelColor,
  globalPointer,
}: SceneProps) {
  const size = useThree((s) => s.size);
  const viewport = useThree((s) => s.viewport);
  const gl = useThree((s) => s.gl);

  const colorThree = useMemo(() => new THREE.Color(pixelColor), [pixelColor]);

  const [trail, onMove] = useTrailTexture({
    size: 512,
    radius: trailSize,
    maxAge,
    interpolate: interpolate || 0.1,
    ease: easingFunction,
  });

  useLayoutEffect(() => {
    trail.minFilter = THREE.NearestFilter;
    trail.magFilter = THREE.NearestFilter;
    trail.wrapS = THREE.ClampToEdgeWrapping;
    trail.wrapT = THREE.ClampToEdgeWrapping;
  }, [trail]);

  const material = useMemo(() => new TrailDotMaterial(), []);

  useLayoutEffect(() => {
    material.uniforms.gridSize.value = gridSize;
  }, [gridSize, material]);

  useLayoutEffect(() => {
    material.uniforms.pixelColor.value.copy(colorThree);
  }, [colorThree, material]);

  useLayoutEffect(() => {
    material.uniforms.mouseTrail.value = trail;
  }, [trail, material]);

  useLayoutEffect(() => {
    material.uniforms.resolution.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr,
    );
  }, [material, size.height, size.width, viewport.dpr]);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  const scale = Math.max(viewport.width, viewport.height) / 2;

  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;
  const uvScratch = useMemo(() => new THREE.Vector2(), []);

  useEffect(() => {
    if (!globalPointer) return;
    const canvas = gl.domElement;
    const handler = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      uvScratch.set(x, y);
      onMoveRef.current({ uv: uvScratch } as ThreeEvent<PointerEvent>);
    };
    window.addEventListener("pointermove", handler, { passive: true });
    return () => window.removeEventListener("pointermove", handler);
  }, [gl, globalPointer, uvScratch]);

  const onMeshPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (globalPointer) return;
    onMove(e);
  };

  return (
    <mesh scale={[scale, scale, 1]} onPointerMove={onMeshPointerMove}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function GooeyFilter({ id, strength }: { id: string; strength: number }) {
  return (
    <svg className="goo-filter-container" aria-hidden>
      <defs>
        <filter id={id}>
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={strength}
            result="blur"
          />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}

export type PixelTrailProps = {
  gridSize?: number;
  trailSize?: number;
  maxAge?: number;
  interpolate?: number;
  easingFunction?: (x: number) => number;
  color?: string;
  gooeyFilter?: Partial<GooeyFilterConfig> | null;
  gooStrength?: number;
  canvasProps?: ComponentProps<typeof Canvas>;
  glProps?: Partial<THREE.WebGLRendererParameters>;
  className?: string;
  /** Overall visual strength of the trail layer (0–1). Default `1`. */
  opacity?: number;
  /**
   * When true (default), pointer tracking uses window coordinates mapped into the canvas,
   * so UI layered above the WebGL view does not block the trail.
   */
  globalPointer?: boolean;
};

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export default function PixelTrail({
  gridSize = 40,
  trailSize = 0.1,
  maxAge = 250,
  interpolate = 5,
  easingFunction = (x: number) => x,
  canvasProps,
  glProps = {
    antialias: false,
    powerPreference: "high-performance",
    alpha: true,
  },
  gooeyFilter,
  gooStrength,
  color = "#ffffff",
  className = "",
  opacity = 1,
  globalPointer = true,
}: PixelTrailProps) {
  const reduceMotion = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, "");
  const defaultGoo: GooeyFilterConfig = {
    id: `pixel-trail-goo-${uid}`,
    strength: 5,
  };
  const gooDisabled = gooeyFilter === null;
  const gooFromProps: GooeyFilterConfig | null = gooDisabled
    ? null
    : { ...defaultGoo, ...(gooeyFilter ?? {}) };
  const blurStrength = gooStrength ?? gooFromProps?.strength ?? defaultGoo.strength;
  const filterId = gooFromProps?.id ?? defaultGoo.id;

  if (reduceMotion) {
    return null;
  }

  return (
    <>
      {!gooDisabled ? (
        <GooeyFilter id={filterId} strength={blurStrength} />
      ) : null}
      <Canvas
        {...canvasProps}
        gl={glProps}
        className={`pixel-canvas ${className}`.trim()}
        style={{
          ...(canvasProps?.style ?? undefined),
          ...(gooDisabled ? {} : { filter: `url(#${filterId})` }),
          opacity,
        }}
        dpr={[1, 2]}
      >
        <Scene
          gridSize={gridSize}
          trailSize={trailSize}
          maxAge={maxAge}
          interpolate={interpolate}
          easingFunction={easingFunction}
          pixelColor={color}
          globalPointer={globalPointer}
        />
      </Canvas>
    </>
  );
}
