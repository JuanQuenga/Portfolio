"use client";

import { useEffect, useState } from "react";
import { Heatmap } from "@paper-design/shaders-react";

const HEATMAP_COLORS = [
  "#071114",
  "#0e2a32",
  "#1a5560",
  "#4ee5ff",
  "#8ff7c8",
  "#d7ff63",
  "#ff70c2",
  "#4a1848",
] as const;

function getViewportSize() {
  if (typeof window === "undefined") {
    return { width: 1440, height: 900 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function HeatmapBackdrop() {
  const [size, setSize] = useState(getViewportSize);

  useEffect(() => {
    const updateSize = () => setSize(getViewportSize());

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="heatmap-backdrop pointer-events-none fixed inset-0 z-0 overflow-hidden"
      data-liquid-glass-background
      aria-hidden="true"
    >
      <Heatmap
        width={size.width}
        height={size.height}
        image="/heatmap-mask.svg"
        colors={[...HEATMAP_COLORS]}
        colorBack="#020203"
        contour={0.44}
        angle={38}
        noise={0.38}
        innerGlow={0.64}
        outerGlow={0.94}
        speed={0.42}
        scale={1.08}
        fit="cover"
        minPixelRatio={1.5}
        maxPixelCount={2_500_000}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      <div className="heatmap-backdrop__vignette" />
      <div className="heatmap-backdrop__grain" />
    </div>
  );
}
