"use client";

import { useEffect, useState } from "react";
import { Warp, warpPresets } from "@paper-design/shaders-react";

const passionPreset =
  warpPresets.find((preset) => preset.name === "Passion") ?? warpPresets[0]!;

export const WARP_COLORS = [
  "#020203",
  "#071114",
  "#0e2a32",
  "#1a5560",
  "#2299a5",
  "#38c8d1",
  "#a8cf62",
] as const;

export const backdropShaderShapes = ["checks", "stripes", "edge"] as const;

export type BackdropShaderShape = (typeof backdropShaderShapes)[number];

export const backdropShaderPreset = {
  shape: passionPreset.params.shape,
  speed: 0.42,
  scale: passionPreset.params.scale,
  rotation: passionPreset.params.rotation,
  proportion: 0.56,
  softness: passionPreset.params.softness,
  distortion: passionPreset.params.distortion,
  swirl: passionPreset.params.swirl,
  swirlIterations: passionPreset.params.swirlIterations,
  shapeScale: passionPreset.params.shapeScale,
  offsetX: 0.34,
  offsetY: 0.12,
} as const satisfies {
  shape: BackdropShaderShape;
  speed: number;
  scale: number;
  rotation: number;
  proportion: number;
  softness: number;
  distortion: number;
  swirl: number;
  swirlIterations: number;
  shapeScale: number;
  offsetX: number;
  offsetY: number;
};

export type BackdropShaderSettings = {
  shape: BackdropShaderShape;
  speed: number;
  scale: number;
  rotation: number;
  proportion: number;
  softness: number;
  distortion: number;
  swirl: number;
  swirlIterations: number;
  shapeScale: number;
  offsetX: number;
  offsetY: number;
};

function getViewportSize() {
  if (typeof window === "undefined") {
    return { width: 1440, height: 900 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function ShaderBackdrop({
  settings,
}: {
  settings: BackdropShaderSettings;
}) {
  const [size, setSize] = useState(getViewportSize);
  const shaderWidth = Math.ceil(size.width * 1.28);
  const shaderHeight = Math.ceil(size.height * 1.28);

  useEffect(() => {
    const updateSize = () => setSize(getViewportSize());

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="shader-backdrop pointer-events-none fixed inset-0 z-0 overflow-hidden"
      data-liquid-glass-background
      aria-hidden="true"
    >
      <Warp
        width={shaderWidth}
        height={shaderHeight}
        className="shader-backdrop__canvas"
        colors={[...WARP_COLORS]}
        shape={settings.shape}
        proportion={settings.proportion}
        softness={settings.softness}
        distortion={settings.distortion}
        swirl={settings.swirl}
        swirlIterations={settings.swirlIterations}
        shapeScale={settings.shapeScale}
        speed={settings.speed}
        scale={settings.scale}
        rotation={settings.rotation}
        offsetX={settings.offsetX}
        offsetY={settings.offsetY}
        fit="cover"
        minPixelRatio={1.5}
        maxPixelCount={4_500_000}
      />
      <div className="shader-backdrop__overlay" />
      <div className="shader-backdrop__scrim" />
      <div className="shader-backdrop__vignette" />
    </div>
  );
}
