"use client";

import { useEffect, useState } from "react";
import { GrainGradient } from "@paper-design/shaders-react";

export const GRADIENT_COLORS = [
  "#020203",
  "#050508",
  "#071114",
  "#0e2a32",
  "#1a5560",
  "#4ee5ff",
  "#d7ff63",
] as const;

export const backdropShaderShapes = [
  "blob",
  "wave",
  "ripple",
  "sphere",
  "corners",
  "dots",
  "truchet",
] as const;

export type BackdropShaderShape = (typeof backdropShaderShapes)[number];

export const backdropShaderPreset = {
  shape: "blob",
  speed: 0.35,
  scale: 1.85,
  softness: 0.9,
  intensity: 0.46,
  noise: 0,
  offsetX: 0.34,
  offsetY: -0.02,
} as const satisfies {
  shape: BackdropShaderShape;
  speed: number;
  scale: number;
  softness: number;
  intensity: number;
  noise: number;
  offsetX: number;
  offsetY: number;
};

export type BackdropShaderSettings = {
  shape: BackdropShaderShape;
  speed: number;
  scale: number;
  softness: number;
  intensity: number;
  noise: number;
  offsetX: number;
  offsetY: number;
};

export const backdropShaderControls = [
  { key: "speed", label: "Speed", min: 0, max: 1, step: 0.01 },
  { key: "scale", label: "Scale", min: 0.5, max: 2, step: 0.01 },
  { key: "softness", label: "Softness", min: 0, max: 1, step: 0.01 },
  { key: "intensity", label: "Intensity", min: 0, max: 1, step: 0.01 },
  { key: "noise", label: "Grain", min: 0, max: 0.6, step: 0.01 },
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
      <GrainGradient
        width={size.width}
        height={size.height}
        colors={[...GRADIENT_COLORS]}
        colorBack="#020203"
        shape={settings.shape}
        softness={settings.softness}
        intensity={settings.intensity}
        noise={settings.noise}
        speed={settings.speed}
        scale={settings.scale}
        offsetX={settings.offsetX}
        offsetY={settings.offsetY}
        fit="cover"
        minPixelRatio={1.5}
        maxPixelCount={2_500_000}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          opacity: 0.24,
          filter: "blur(18px) saturate(1.04)",
          transform: "scale(1.04)",
        }}
      />
      <div className="shader-backdrop__scrim" />
      <div className="shader-backdrop__vignette" />
    </div>
  );
}
