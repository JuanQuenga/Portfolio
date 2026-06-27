"use client";

import { useMemo, useState, type CSSProperties } from "react";

import { LiquidGlass } from "@/lib/liquid-glass-squircle";

type GlassSettings = {
  width: number;
  height: number;
  radius: number;
  strength: number;
  chromaticAberration: number;
  blur: number;
  depth: number;
  curvature: number;
  splay: number;
  glow: number;
  glowSpread: number;
  glowExponent: number;
  edgeHighlight: number;
  edgeWidth: number;
  edgeExponent: number;
  specular: number;
  specularAngle: number;
  squircleExponent: number;
  quality: number;
};

const initialSettings: GlassSettings = {
  width: 620,
  height: 240,
  radius: 72,
  strength: 0.08,
  chromaticAberration: 0.28,
  blur: 0,
  depth: 30,
  curvature: 0.78,
  splay: 1,
  glow: 0.22,
  glowSpread: 1,
  glowExponent: 1.5,
  edgeHighlight: 0.34,
  edgeWidth: 3,
  edgeExponent: 1.5,
  specular: 1,
  specularAngle: 130,
  squircleExponent: 4.7,
  quality: 512,
};

const controls = [
  { key: "width", label: "Width", min: 180, max: 960, step: 1 },
  { key: "height", label: "Height", min: 90, max: 420, step: 1 },
  { key: "radius", label: "Radius", min: 16, max: 180, step: 1 },
  { key: "squircleExponent", label: "Squircle", min: 2.2, max: 8, step: 0.1 },
  { key: "strength", label: "Strength", min: 0, max: 0.18, step: 0.005 },
  { key: "chromaticAberration", label: "Chroma", min: 0, max: 0.8, step: 0.01 },
  { key: "blur", label: "Blur", min: 0, max: 12, step: 0.1 },
  { key: "depth", label: "Depth", min: 4, max: 72, step: 1 },
  { key: "curvature", label: "Curve", min: 0, max: 1, step: 0.01 },
  { key: "splay", label: "Splay", min: 0, max: 1, step: 0.01 },
  { key: "glow", label: "Glow", min: 0, max: 1, step: 0.01 },
  { key: "glowSpread", label: "Glow spread", min: 0.05, max: 1, step: 0.01 },
  { key: "glowExponent", label: "Glow exp", min: 0.25, max: 4, step: 0.05 },
  { key: "edgeHighlight", label: "Edge", min: 0, max: 1, step: 0.01 },
  { key: "edgeWidth", label: "Edge width", min: 0.5, max: 18, step: 0.5 },
  { key: "edgeExponent", label: "Edge exp", min: 0.25, max: 4, step: 0.05 },
  { key: "specular", label: "Specular", min: 0, max: 2, step: 0.01 },
  { key: "specularAngle", label: "Light", min: 0, max: 360, step: 1 },
  { key: "quality", label: "Quality", min: 128, max: 1024, step: 128 },
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
  const [settings, setSettings] = useState<GlassSettings>(initialSettings);
  const [showOutline, setShowOutline] = useState(true);
  const [scene, setScene] = useState<"bands" | "image" | "text">("bands");
  const [lensPosition, setLensPosition] = useState({ x: 0.5, y: 0.5 });

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
        exponent: settings.squircleExponent,
      }),
    [settings.height, settings.radius, settings.squircleExponent, settings.width],
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

  return (
    <main className="h-screen overflow-hidden bg-[#050506] text-[#f4f1ea]">
      <div className="grid h-full lg:grid-cols-[minmax(0,1fr)_390px]">
        <section className="glass-lab-stage relative h-full min-h-0 overflow-hidden">
          <LiquidGlass
            x={lensPosition.x}
            y={lensPosition.y}
            width={settings.width}
            height={settings.height}
            radius={settings.radius}
            strength={settings.strength}
            chromaticAberration={settings.chromaticAberration}
            blur={settings.blur}
            depth={settings.depth}
            curvature={settings.curvature}
            splay={settings.splay}
            glow={settings.glow}
            glowSpread={settings.glowSpread}
            glowExponent={settings.glowExponent}
            edgeHighlight={settings.edgeHighlight}
            edgeWidth={settings.edgeWidth}
            edgeExponent={settings.edgeExponent}
            specular={settings.specular}
            specularAngle={settings.specularAngle}
            shape="squircle"
            squircleExponent={settings.squircleExponent}
            quality={settings.quality}
            draggable
            shadow={false}
            onMove={(x, y) => setLensPosition({ x, y })}
            className="glass-lab-surface h-full min-h-0 w-full"
          >
            <LabScene scene={scene} />
          </LiquidGlass>

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
                Tune the forked squircle refraction map.
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

function LabScene({ scene }: { scene: "bands" | "image" | "text" }) {
  if (scene === "image") {
    return (
      <div className="glass-lab-scene relative h-full min-h-0 overflow-hidden">
        <img
          src="/screenshots/multi-auto.png"
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
      <div className="glass-lab-scene relative flex h-full min-h-0 items-center overflow-hidden px-10">
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
    <div className="glass-lab-scene relative h-full min-h-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_72%,rgba(78,229,255,0.32),transparent_28%),radial-gradient(circle_at_86%_24%,rgba(215,255,99,0.24),transparent_27%),radial-gradient(circle_at_68%_82%,rgba(255,112,194,0.2),transparent_29%),#050506]" />
      <div className="absolute -left-[20%] top-[16%] h-28 w-[150%] rotate-[-12deg] bg-[#d7ff63]/62 blur-[2px]" />
      <div className="absolute -left-[18%] top-[45%] h-20 w-[140%] rotate-[8deg] bg-[#4ee5ff]/54 blur-[2px]" />
      <div className="absolute -left-[12%] top-[68%] h-24 w-[130%] rotate-[-5deg] bg-[#ff70c2]/46 blur-[2px]" />
      <div className="absolute left-[12%] top-[18%] h-40 w-40 rounded-full bg-white/80" />
      <div className="absolute right-[14%] bottom-[16%] h-52 w-52 rounded-full bg-black/80 ring-2 ring-white/20" />
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
