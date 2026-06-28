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
  "#2ec8d6",
  "#4ee5ff",
  "#d7ff63",
] as const;

export const backdropShaderShapes = ["checks", "stripes", "edge"] as const;

export type BackdropShaderShape = (typeof backdropShaderShapes)[number];

export const backdropShaderPreset = {
  shape: passionPreset.params.shape,
  speed: 0.42,
  scale: passionPreset.params.scale,
  rotation: passionPreset.params.rotation,
  proportion: 0.64,
  softness: passionPreset.params.softness,
  distortion: passionPreset.params.distortion,
  swirl: passionPreset.params.swirl,
  swirlIterations: passionPreset.params.swirlIterations,
  shapeScale: passionPreset.params.shapeScale,
  offsetX: 0.42,
  offsetY: 0,
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

export const backdropShaderControls = [
  { key: "speed", label: "Speed", min: 0, max: 1, step: 0.01 },
  { key: "scale", label: "Scale", min: 0.5, max: 4, step: 0.01 },
  { key: "proportion", label: "Proportion", min: 0, max: 1, step: 0.01 },
  { key: "softness", label: "Softness", min: 0, max: 1.5, step: 0.01 },
  { key: "distortion", label: "Distortion", min: 0, max: 1, step: 0.01 },
  { key: "swirl", label: "Swirl", min: 0, max: 1, step: 0.01 },
  { key: "swirlIterations", label: "Swirl Passes", min: 0, max: 20, step: 1 },
  { key: "shapeScale", label: "Pattern Scale", min: 0, max: 1, step: 0.01 },
  { key: "rotation", label: "Rotation", min: 0, max: 360, step: 1 },
  { key: "offsetX", label: "Offset X", min: -1, max: 1, step: 0.01 },
  { key: "offsetY", label: "Offset Y", min: -1, max: 1, step: 0.01 },
] as const satisfies Array<{
  key: Exclude<keyof BackdropShaderSettings, "shape">;
  label: string;
  min: number;
  max: number;
  step: number;
}>;

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
