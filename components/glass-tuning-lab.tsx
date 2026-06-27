"use client";

import { useMemo, useRef, useState, type CSSProperties } from "react";

import {
  LiquidGlassCard,
  type LiquidGlassSettings,
} from "@ogtirth/liquid-glass-oss";

type GlassSettings = {
  width: number;
  height: number;
  radius: number;
  refraction: number;
  chromaticAberration: number;
  blur: number;
  depth: number;
  distortion: number;
  edgeHighlight: number;
  specular: number;
  fresnel: number;
  brightness: number;
  saturation: number;
  darkTint: number;
  tintStrength: number;
  opacity: number;
  bevel: number;
  liquidMotion: number;
  liquidSpring: number;
  liquidDamping: number;
};

const initialSettings: GlassSettings = {
  width: 620,
  height: 240,
  radius: 72,
  refraction: 0.82,
  chromaticAberration: 0.18,
  blur: 0.06,
  depth: 48,
  distortion: 0.035,
  edgeHighlight: 0.13,
  specular: 0.08,
  fresnel: 1.18,
  brightness: 0.02,
  saturation: 0.1,
  darkTint: 0.12,
  tintStrength: 0.14,
  opacity: 1,
  bevel: 0,
  liquidMotion: 0.16,
  liquidSpring: 0.06,
  liquidDamping: 0.83,
};

const controls = [
  { key: "width", label: "Width", min: 180, max: 960, step: 1 },
  { key: "height", label: "Height", min: 90, max: 420, step: 1 },
  { key: "radius", label: "Radius", min: 16, max: 180, step: 1 },
  { key: "refraction", label: "Refraction", min: 0, max: 1.4, step: 0.01 },
  { key: "chromaticAberration", label: "Chroma", min: 0, max: 0.28, step: 0.005 },
  { key: "blur", label: "Blur", min: 0, max: 1.5, step: 0.01 },
  { key: "depth", label: "Depth", min: 4, max: 72, step: 1 },
  { key: "distortion", label: "Distortion", min: 0, max: 0.1, step: 0.001 },
  { key: "edgeHighlight", label: "Edge", min: 0, max: 0.4, step: 0.005 },
  { key: "specular", label: "Specular", min: 0, max: 0.5, step: 0.005 },
  { key: "fresnel", label: "Fresnel", min: 0, max: 1.5, step: 0.01 },
  { key: "brightness", label: "Brightness", min: -0.2, max: 0.2, step: 0.005 },
  { key: "saturation", label: "Saturation", min: -0.5, max: 0.5, step: 0.01 },
  { key: "darkTint", label: "Dark tint", min: 0, max: 0.5, step: 0.005 },
  { key: "tintStrength", label: "Tint", min: 0, max: 0.5, step: 0.005 },
  { key: "opacity", label: "Opacity", min: 0.2, max: 1, step: 0.01 },
  { key: "bevel", label: "Bevel", min: 0, max: 1, step: 1 },
  { key: "liquidMotion", label: "Motion", min: 0, max: 0.4, step: 0.005 },
  { key: "liquidSpring", label: "Spring", min: 0.01, max: 0.12, step: 0.001 },
  { key: "liquidDamping", label: "Damping", min: 0.6, max: 0.95, step: 0.005 },
] satisfies Array<{
  key: keyof GlassSettings;
  label: string;
  min: number;
  max: number;
  step: number;
}>;

const swatches = [
  "#d7ff63",
  "#4ee5ff",
  "#ff70c2",
  "#ffffff",
  "#161616",
];

const sceneBackgrounds = {
  bands: svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
      <rect width="1600" height="900" fill="#050506"/>
      <radialGradient id="a" cx="15%" cy="72%" r="38%"><stop stop-color="#4ee5ff" stop-opacity=".34"/><stop offset="1" stop-color="#050506" stop-opacity="0"/></radialGradient>
      <radialGradient id="b" cx="86%" cy="24%" r="36%"><stop stop-color="#d7ff63" stop-opacity=".26"/><stop offset="1" stop-color="#050506" stop-opacity="0"/></radialGradient>
      <radialGradient id="c" cx="68%" cy="82%" r="35%"><stop stop-color="#ff70c2" stop-opacity=".22"/><stop offset="1" stop-color="#050506" stop-opacity="0"/></radialGradient>
      <rect width="1600" height="900" fill="url(#a)"/>
      <rect width="1600" height="900" fill="url(#b)"/>
      <rect width="1600" height="900" fill="url(#c)"/>
      <rect x="-220" y="190" width="2040" height="112" fill="#d7ff63" opacity=".62" transform="rotate(-12 800 246)"/>
      <rect x="-180" y="410" width="1960" height="82" fill="#4ee5ff" opacity=".54" transform="rotate(8 800 451)"/>
      <rect x="-120" y="610" width="1840" height="96" fill="#ff70c2" opacity=".46" transform="rotate(-5 800 658)"/>
      <circle cx="270" cy="235" r="78" fill="white" opacity=".8"/>
      <circle cx="1340" cy="690" r="104" fill="#050506" stroke="white" stroke-opacity=".2" stroke-width="5"/>
    </svg>
  `),
  image: "/screenshots/multi-auto.png",
  text: svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
      <rect width="1600" height="900" fill="#050506"/>
      <circle cx="260" cy="660" r="350" fill="#4ee5ff" opacity=".2"/>
      <circle cx="1370" cy="210" r="330" fill="#d7ff63" opacity=".17"/>
      <text x="110" y="305" fill="#d7ff63" font-family="Arial, sans-serif" font-size="24" font-weight="900" letter-spacing="8">REFRACTION SAMPLE</text>
      <text x="105" y="535" fill="#ffffff" font-family="Arial Black, Arial, sans-serif" font-size="180" font-weight="900">LIQUID</text>
      <text x="105" y="700" fill="#ffffff" font-family="Arial Black, Arial, sans-serif" font-size="180" font-weight="900">GLASS</text>
      <line x1="0" y1="450" x2="1600" y2="450" stroke="white" stroke-opacity=".32"/>
      <line x1="800" y1="0" x2="800" y2="900" stroke="white" stroke-opacity=".3"/>
    </svg>
  `),
} satisfies Record<"bands" | "image" | "text", string>;

function svgDataUri(svg: string) {
  return `data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;
}

function superellipsePoint(
  centerX: number,
  centerY: number,
  radius: number,
  exponent: number,
  angle: number,
) {
  const power = 2 / exponent;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return {
    x: centerX + radius * Math.sign(cos) * Math.abs(cos) ** power,
    y: centerY + radius * Math.sign(sin) * Math.abs(sin) ** power,
  };
}

function buildSquirclePath({
  width,
  height,
  radius,
  exponent,
}: {
  width: number;
  height: number;
  radius: number;
  exponent: number;
}) {
  const r = Math.max(0.001, Math.min(radius, width / 2, height / 2));
  const steps = 18;
  const points: Array<{ x: number; y: number }> = [
    { x: r, y: 0 },
    { x: width - r, y: 0 },
  ];

  const addCorner = (
    centerX: number,
    centerY: number,
    start: number,
    end: number,
  ) => {
    for (let index = 1; index <= steps; index += 1) {
      const angle = start + ((end - start) * index) / steps;
      points.push(superellipsePoint(centerX, centerY, r, exponent, angle));
    }
  };

  addCorner(width - r, r, -Math.PI / 2, 0);
  points.push({ x: width, y: height - r });
  addCorner(width - r, height - r, 0, Math.PI / 2);
  points.push({ x: r, y: height });
  addCorner(r, height - r, Math.PI / 2, Math.PI);
  points.push({ x: 0, y: r });
  addCorner(r, r, Math.PI, (3 * Math.PI) / 2);

  return `${points
    .map(({ x, y }, index) => `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ")} Z`;
}

export default function GlassTuningLab() {
  const stageRef = useRef<HTMLElement>(null);
  const [settings, setSettings] = useState<GlassSettings>(initialSettings);
  const [showOutline, setShowOutline] = useState(true);
  const [scene, setScene] = useState<"bands" | "image" | "text">("bands");
  const [lensPosition, setLensPosition] = useState({ x: 0.5, y: 0.5 });
  const backgroundImage = sceneBackgrounds[scene];

  const outlineStyle = useMemo(
    () =>
      ({
        width: settings.width,
        height: settings.height,
        left: `${lensPosition.x * 100}%`,
        top: `${lensPosition.y * 100}%`,
        transform: "translate3d(-50%, -50%, 0)",
      }) as CSSProperties,
    [lensPosition.x, lensPosition.y, settings.height, settings.width]
  );

  const outlinePath = useMemo(
    () =>
      buildSquirclePath({
        width: settings.width,
        height: settings.height,
        radius: settings.radius,
        exponent: 4.7,
      }),
    [settings.height, settings.radius, settings.width],
  );

  const glassMaterial = useMemo(
    () =>
      ({
        radius: settings.radius,
        blur: settings.blur,
        refraction: settings.refraction,
        chromaticAberration: settings.chromaticAberration,
        distortion: settings.distortion,
        edgeHighlight: settings.edgeHighlight,
        specular: settings.specular,
        fresnel: settings.fresnel,
        depth: settings.depth,
        brightness: settings.brightness,
        saturation: settings.saturation,
        darkTint: settings.darkTint,
        tintStrength: settings.tintStrength,
        tintColor: [0.92, 0.95, 1.05],
        tint: 0,
        opacity: settings.opacity,
        bevel: settings.bevel,
        lensWidth: Math.max(1, settings.width - 4),
        lensHeight: Math.max(1, settings.height - 4),
        liquidMotion: settings.liquidMotion,
        liquidSpring: settings.liquidSpring,
        liquidDamping: settings.liquidDamping,
      }) satisfies Partial<LiquidGlassSettings>,
    [settings],
  );

  const updateSetting = (key: keyof GlassSettings, value: number) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const resetLab = () => {
    setSettings(initialSettings);
    setLensPosition({ x: 0.5, y: 0.5 });
    setScene("bands");
    setShowOutline(true);
  };

  const updateLensFromPointer = (clientX: number, clientY: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    setLensPosition({
      x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)),
    });
  };

  return (
    <main className="h-screen overflow-hidden bg-[#050506] text-[#f4f1ea]">
      <div className="grid h-full lg:grid-cols-[minmax(0,1fr)_390px]">
        <section
          ref={stageRef}
          className="glass-lab-stage relative h-full min-h-0 overflow-hidden"
          data-liquid-glass-background
          style={{ backgroundImage: `url("${backgroundImage}")` }}
        >
          <LabScene scene={scene} backgroundImage={backgroundImage} />

          <div
            className="absolute z-10 touch-none"
            style={outlineStyle}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              updateLensFromPointer(event.clientX, event.clientY);
              event.preventDefault();
            }}
            onPointerMove={(event) => {
              if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
              updateLensFromPointer(event.clientX, event.clientY);
              event.preventDefault();
            }}
          >
            <LiquidGlassCard
              backgroundImage={backgroundImage}
              variant="prism"
              settings={glassMaterial}
              className="glass-lab-surface h-full min-h-0 w-full"
            />
          </div>

          {showOutline ? (
            <svg
              className="pointer-events-none absolute z-20 overflow-visible drop-shadow-[0_0_30px_rgba(215,255,99,0.16)]"
              style={outlineStyle}
              viewBox={`0 0 ${settings.width} ${settings.height}`}
              aria-hidden="true"
            >
              <path
                d={outlinePath}
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={outlinePath}
                fill="none"
                stroke="rgba(215,255,99,0.72)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          ) : null}
        </section>

        <aside className="min-h-0 overflow-y-auto border-l border-white/10 bg-[#0d0d10]/92 p-5">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black uppercase leading-none">
                Glass Lab
              </h1>
              <p className="mt-2 text-sm leading-6 text-white/54">
                Tune the liquidglass-oss WebGL material.
              </p>
            </div>
            <a
              href="/"
              className="rounded-full border border-white/18 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white/72 transition hover:text-white"
            >
              Home
            </a>
          </div>

          <button
            type="button"
            onClick={resetLab}
            className="mb-5 h-10 w-full rounded-full border border-white/18 bg-white/[0.04] text-xs font-bold uppercase tracking-[0.12em] text-white/72 transition hover:border-[#d7ff63]/70 hover:text-white"
          >
            Reset Lab
          </button>

          <div className="mb-5 grid grid-cols-3 gap-2">
            {(["bands", "image", "text"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setScene(mode)}
                className={`h-10 rounded-full border text-xs font-bold uppercase tracking-[0.12em] transition ${
                  scene === mode
                    ? "border-[#d7ff63]/70 bg-[#d7ff63] text-black"
                    : "border-white/14 bg-white/[0.04] text-white/64 hover:text-white"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <label className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-white/72">
            Squircle outline
            <input
              type="checkbox"
              checked={showOutline}
              onChange={(event) => setShowOutline(event.currentTarget.checked)}
              className="size-4 accent-[#d7ff63]"
            />
          </label>

          <div className="space-y-4">
            {controls.map((control) => (
              <RangeControl
                key={control.key}
                label={control.label}
                min={control.min}
                max={control.max}
                step={control.step}
                value={settings[control.key]}
                onChange={(value) => updateSetting(control.key, value)}
              />
            ))}
          </div>

          <pre className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-black/32 p-4 text-xs leading-5 text-white/62">
            {JSON.stringify(settings, null, 2)}
          </pre>
        </aside>
      </div>
    </main>
  );
}

function LabScene({
  scene,
  backgroundImage,
}: {
  scene: "bands" | "image" | "text";
  backgroundImage: string;
}) {
  if (scene === "image") {
    return (
      <div className="glass-lab-scene relative h-full min-h-0 overflow-hidden">
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-92"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.32),transparent_46%,rgba(0,0,0,0.38))]" />
        <SceneMarkers />
      </div>
    );
  }

  if (scene === "text") {
    return (
      <div
        className="glass-lab-scene relative flex h-full min-h-0 items-center overflow-hidden bg-cover bg-center px-10"
        style={{ backgroundImage: `url("${backgroundImage}")` }}
      >
        <div className="max-w-[1200px]">
          <p className="mb-6 text-sm font-black uppercase tracking-[0.2em] text-[#d7ff63]">
            Refraction sample
          </p>
          <div className="text-[clamp(4rem,13vw,13rem)] font-black uppercase leading-[0.78] tracking-normal">
            Squircle
            <br />
            Glass
          </div>
        </div>
        <SceneMarkers />
      </div>
    );
  }

  return (
    <div
      className="glass-lab-scene relative h-full min-h-0 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url("${backgroundImage}")` }}
    >
      <SceneMarkers />
    </div>
  );
}

function SceneMarkers() {
  return (
    <>
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/32" />
      <div className="absolute left-1/2 inset-y-0 w-px bg-white/30" />
      <div className="absolute left-10 top-10 flex gap-2">
        {swatches.map((color) => (
          <span
            key={color}
            className="block size-10 rounded-full border border-white/24"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </>
  );
}

function RangeControl({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  const displayValue = step < 1 ? value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "") : value;

  return (
    <label className="block rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-3 flex items-center justify-between gap-3 text-sm font-semibold">
        <span className="text-white/62">{label}</span>
        <span className="font-mono text-white">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        className="glass-lab-range w-full"
      />
    </label>
  );
}
