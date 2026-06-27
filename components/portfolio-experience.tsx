"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Github,
  Mail,
  Menu,
  MapPin,
  MonitorCheck,
  PackageCheck,
  PanelsTopLeft,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  LiquidGlass,
} from "@/lib/liquid-glass-squircle";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Slider } from "@/components/ui/slider";

const projects = [
  {
    title: "Volt",
    summary:
      "Scanner-first product capture with review flows for messy item data.",
    href: "https://volt-scanner.vercel.app/",
    screenshotSrc: "/screenshots/volt.png",
  },
  {
    title: "ClashCrown",
    summary:
      "A Clash Royale companion for lookup, comparison, and player tools.",
    href: "https://clashcrown.vercel.app/",
    screenshotSrc: "/screenshots/clashcrown.png",
  },
  {
    title: "BrawlStats",
    summary: "Brawl Stars stats with profile lookup and readable player data.",
    href: "https://brawlstatsio.vercel.app/",
    screenshotSrc: "/screenshots/brawlstats.png",
  },
  {
    title: "Herman's Modern Bakery",
    summary:
      "A simple storefront for menu, hours, location, and quick mobile browsing.",
    href: "https://hermans.vercel.app",
    screenshotSrc: "/screenshots/hermans.png",
  },
  {
    title: "Multi Auto",
    summary:
      "Responsive service screens for compact workflows and quick comparisons.",
    href: "https://multi-auto.vercel.app",
    screenshotSrc: "/screenshots/multi-auto.png",
  },
  {
    title: "Piggies US",
    summary:
      "A social app with accounts, subscriptions, and live community screens.",
    href: "https://www.piggies.us/",
    githubHref: "https://github.com/piggies-us/piggies-us",
    screenshotSrc: "/screenshots/piggies.png",
  },
];

const heroSkills = ["React", "Next", "TanStack", "Convex"];
const heroNameLines = ["Juan", "Quenga"];
const heroGlassPreset = {
  width: 1600,
  height: 104,
  radius: 69,
  strength: 0.065,
  chromaticAberration: 0.28,
  blur: 0,
  depth: 34,
  curvature: 0.58,
  splay: 1,
  glow: 0.22,
  glowSpread: 1,
  glowExponent: 1.5,
  edgeHighlight: 0.33,
  edgeWidth: 3,
  edgeExponent: 1.5,
  specular: 1,
  specularAngle: 130,
  shape: "squircle" as const,
  squircleExponent: 3.9,
  quality: 512,
};

type HeroGlassSettings = typeof heroGlassPreset;

const glassControls = [
  { key: "width", label: "Width", min: 520, max: 1920, step: 1 },
  { key: "height", label: "Height", min: 80, max: 220, step: 1 },
  { key: "radius", label: "Radius", min: 0, max: 130, step: 1 },
  { key: "strength", label: "Strength", min: -0.18, max: 0.18, step: 0.001 },
  {
    key: "chromaticAberration",
    label: "Chroma",
    min: 0,
    max: 1,
    step: 0.01,
  },
  { key: "blur", label: "Blur", min: 0, max: 6, step: 0.1 },
  { key: "depth", label: "Depth", min: 0, max: 80, step: 1 },
  { key: "curvature", label: "Curvature", min: 0, max: 1, step: 0.01 },
  { key: "splay", label: "Splay", min: -1, max: 1, step: 0.01 },
  { key: "glow", label: "Glow", min: 0, max: 1, step: 0.01 },
  { key: "glowSpread", label: "Glow Spread", min: 0.1, max: 4, step: 0.05 },
  { key: "glowExponent", label: "Glow Exp", min: 0.2, max: 4, step: 0.05 },
  {
    key: "edgeHighlight",
    label: "Edge",
    min: 0,
    max: 1,
    step: 0.01,
  },
  { key: "edgeWidth", label: "Edge Width", min: 0, max: 10, step: 0.1 },
  { key: "edgeExponent", label: "Edge Exp", min: 0.2, max: 5, step: 0.05 },
  { key: "specular", label: "Specular", min: 0, max: 1, step: 0.01 },
  { key: "specularAngle", label: "Light", min: 0, max: 360, step: 1 },
  {
    key: "squircleExponent",
    label: "Squircle",
    min: 2,
    max: 8,
    step: 0.1,
  },
  { key: "quality", label: "Quality", min: 128, max: 1024, step: 64 },
] satisfies Array<{
  key: keyof Omit<HeroGlassSettings, "shape">;
  label: string;
  min: number;
  max: number;
  step: number;
}>;

const capabilities = [
  {
    icon: PanelsTopLeft,
    title: "Product UI",
    body: "Interfaces for real product flows.",
  },
  {
    icon: PackageCheck,
    title: "Full-stack",
    body: "Frontend, data, auth, payments.",
  },
  {
    icon: MonitorCheck,
    title: "Internal tools",
    body: "Fast screens for repetitive work.",
  },
];

export default function PortfolioExperience() {
  const [glassSettings, setGlassSettings] =
    useState<HeroGlassSettings>(heroGlassPreset);
  const [showGlassControls, setShowGlassControls] = useState(false);

  return (
    <main className="relative min-h-screen isolate overflow-x-hidden bg-[#020203] text-[#f4f1ea]">
      <ParallaxBackdrop />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-32 bg-gradient-to-b from-[#020203] to-transparent" />
      <Header />
      <PageContent
        settings={glassSettings}
        onOpenControls={() => setShowGlassControls(true)}
      />
      <GlassControlPopover
        open={showGlassControls}
        settings={glassSettings}
        onClose={() => setShowGlassControls(false)}
        onReset={() => setGlassSettings(heroGlassPreset)}
        onChange={(key, value) =>
          setGlassSettings((current) => ({ ...current, [key]: value }))
        }
      />
    </main>
  );
}

function PageContent({
  mirror = false,
  settings,
  onOpenControls,
}: {
  mirror?: boolean;
  settings: HeroGlassSettings;
  onOpenControls: () => void;
}) {
  return (
    <div className="relative z-10">
      <Hero
        mirror={mirror}
        settings={settings}
        onOpenControls={onOpenControls}
      />
      <Work
        mirror={mirror}
        settings={settings}
        onOpenControls={onOpenControls}
      />
      <Practice mirror={mirror} />
      <Contact mirror={mirror} />
    </div>
  );
}

function ParallaxBackdrop() {
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 58,
    damping: 24,
    mass: 0.42,
    restDelta: 0.001,
  });

  const layerY = useTransform(smoothScrollProgress, [0, 1], [-28, 28]);
  const gridY = useTransform(smoothScrollProgress, [0, 1], [-180, 180]);
  const beamY = useTransform(smoothScrollProgress, [0, 1], [-240, 240]);
  const glowY = useTransform(smoothScrollProgress, [0, 1], [170, -170]);
  const glowX = useTransform(smoothScrollProgress, [0, 1], [-70, 70]);

  return (
    <motion.div
      className="site-backdrop pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ y: layerY }}
      aria-hidden="true"
    >
      <motion.div
        className="site-backdrop-grid absolute -inset-[28svh]"
        style={{ y: gridY }}
      />
      <motion.div
        className="site-backdrop-beam absolute left-1/2 top-1/2 h-[34rem] w-[150vw] -translate-x-1/2 -translate-y-1/2 rotate-[-18deg]"
        style={{ y: beamY }}
      />
      <motion.div
        className="site-backdrop-glow site-backdrop-glow-cyan absolute -left-[18rem] top-[58svh] h-[42rem] w-[42rem]"
        style={{ x: glowX, y: glowY }}
      />
      <motion.div
        className="site-backdrop-glow site-backdrop-glow-lime absolute -right-[16rem] top-[8svh] h-[38rem] w-[38rem]"
        style={{ x: glowX, y: beamY }}
      />
      <motion.div
        className="site-backdrop-glow site-backdrop-glow-rose absolute left-[44vw] top-[72svh] h-[28rem] w-[28rem]"
        style={{ x: glowX, y: beamY }}
      />
    </motion.div>
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-start justify-between px-4 pt-4 sm:px-7 sm:pt-6">
      <a
        href="#top"
        className="glass-button inline-flex size-12 items-center justify-center text-[#f4f1ea]"
        aria-label="Juan Quenga home"
      >
        <Code2 className="size-5" />
      </a>
      <div className="flex items-center gap-3">
        <nav className="liquid-glass hidden h-12 items-center gap-7 px-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#f4f1ea]/68 sm:flex">
          <a href="#work" className="transition hover:text-white">
            Work
          </a>
          <a href="#practice" className="transition hover:text-white">
            Practice
          </a>
          <a href="#contact" className="transition hover:text-white">
            Contact
          </a>
        </nav>
        <a
          href="mailto:juanquenga@gmail.com?subject=Let's work together"
          className="glass-button hidden size-12 items-center justify-center transition hover:border-[#d7ff63]/70 hover:text-[#d7ff63] sm:inline-flex"
          aria-label="Email Juan"
        >
          <Mail className="size-4" />
        </a>
        <a
          href="#work"
          className="glass-button inline-flex size-12 items-center justify-center transition hover:border-[#d7ff63]/70 hover:text-[#d7ff63]"
          aria-label="Open work section"
        >
          <Menu className="size-5" />
        </a>
      </div>
    </header>
  );
}

function Hero({
  mirror = false,
  settings,
  onOpenControls,
}: {
  mirror?: boolean;
  settings: HeroGlassSettings;
  onOpenControls: () => void;
}) {
  return (
    <section
      id={mirror ? undefined : "top"}
      data-glass-context={mirror ? undefined : "home"}
      className="relative flex min-h-[100svh] px-4 pb-[clamp(8rem,17svh,12rem)] pt-28 sm:px-7"
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-end">
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(220px,0.28fr)] lg:items-end">
          <Reveal>
            <Code2 className="mb-5 size-8 text-[#f4f1ea] sm:size-9" />
            <GlitchTitle lines={heroNameLines} />
            <p
              className="hero-kicker mt-4 max-w-[22rem] font-mono text-[clamp(0.95rem,3.8vw,1.9rem)] font-black uppercase leading-tight tracking-normal text-white sm:max-w-full"
              data-text="Full Stack Product Engineer"
            >
              Full Stack Product Engineer
            </p>
          </Reveal>

          <Reveal delay={0.08} className="hidden lg:block">
            <a
              href="#work"
              className="group block pb-2 text-right text-sm font-black text-[#f4f1ea]"
            >
              Work
              <span className="mt-5 block h-px w-full bg-[#f4f1ea]/28 transition group-hover:bg-[#d7ff63]" />
            </a>
          </Reveal>
        </div>
      </div>
      <SharedGlassBar
        project={null}
        settings={settings}
        onOpenControls={onOpenControls}
      />
    </section>
  );
}

function SharedGlassBar({
  project,
  settings,
  onOpenControls,
}: {
  project: (typeof projects)[number] | null;
  settings: HeroGlassSettings;
  onOpenControls: () => void;
}) {
  return (
    <div
      className="project-glass-bar px-5 py-4 sm:px-7"
      style={
        {
          "--hero-glass-width": `${settings.width}px`,
          "--glass-height": `${settings.height}px`,
          "--glass-radius": `${settings.radius}px`,
          height: `${settings.height}px`,
          minHeight: `${settings.height}px`,
        } as CSSProperties
      }
    >
      {project ? (
        <div className="hero-glass-content grid h-full gap-5 text-base font-semibold text-[#f4f1ea]/78 sm:grid-cols-[1fr_auto] sm:items-center lg:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)_auto]">
          <div className="min-w-0">
            <div className="truncate text-2xl font-black uppercase leading-none text-white">
              {project.title}
            </div>
            <p className="mt-2 max-w-3xl truncate leading-6 text-[#f4f1ea]/62">
              {project.summary}
            </p>
          </div>
          <div className="hidden min-w-0 flex-wrap justify-center gap-x-9 gap-y-2 text-[#f4f1ea]/72 lg:flex">
            {heroSkills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
          <div className="flex items-center gap-3 justify-self-end">
            <a
              href={project.href}
              className="glass-button glass-button-primary inline-flex h-[3.25rem] items-center gap-2 px-5 text-xs font-bold uppercase tracking-[0.14em] transition hover:scale-[1.015]"
            >
              Open
              <ArrowUpRight className="size-4" />
            </a>
            {project.githubHref ? (
              <a
                href={project.githubHref}
                className="glass-button inline-flex size-[3.25rem] items-center justify-center transition hover:border-[#d7ff63]/70 hover:text-[#d7ff63]"
                aria-label={`View ${project.title} on GitHub`}
              >
                <Github className="size-5" />
              </a>
            ) : null}
            <button
              type="button"
              onClick={onOpenControls}
              className="glass-button inline-flex size-[3.25rem] items-center justify-center transition hover:border-[#d7ff63]/70 hover:text-[#d7ff63]"
              aria-label="Tune glass"
            >
              <SlidersHorizontal className="size-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="hero-glass-content grid h-full gap-5 text-base font-semibold text-[#f4f1ea]/78 sm:grid-cols-[1.1fr_1.4fr_1fr] lg:grid-cols-[minmax(220px,0.95fr)_minmax(380px,1.65fr)_minmax(320px,1.25fr)_auto_auto_minmax(230px,1fr)] lg:items-center">
          <div className="flex min-w-0 items-center gap-4">
            <div className="glass-button flex size-14 shrink-0 items-center justify-center font-mono text-lg font-black leading-none text-white">
              JQ
            </div>
            <div className="min-w-0">
              <div className="text-[1.05rem] leading-5 text-white">
                Juan Quenga
              </div>
              <div className="mt-1 leading-5 text-[#f4f1ea]/58">
                Product interfaces
              </div>
            </div>
          </div>

          <p className="min-w-0 max-w-none leading-7 text-[#f4f1ea]/62">
            I build React products for stores, local businesses, and internal
            teams.
          </p>

          <div className="flex min-w-0 flex-wrap justify-center gap-x-9 gap-y-2 text-[#f4f1ea]/72">
            {heroSkills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>

          <a
            href="https://github.com/JuanQuenga"
            className="glass-button inline-flex size-[3.25rem] items-center justify-center transition hover:border-[#d7ff63]/70 hover:text-[#d7ff63]"
            aria-label="Juan Quenga GitHub"
          >
            <Github className="size-5" />
          </a>

          <button
            type="button"
            onClick={onOpenControls}
            className="glass-button inline-flex size-[3.25rem] items-center justify-center transition hover:border-[#d7ff63]/70 hover:text-[#d7ff63]"
            aria-label="Tune glass"
          >
            <SlidersHorizontal className="size-5" />
          </button>

          <div className="flex min-w-0 items-center justify-end gap-3 truncate text-[#f4f1ea]/72">
            <MapPin className="size-5 shrink-0 text-[#d7ff63]" />
            Southeast Michigan
          </div>
        </div>
      )}
    </div>
  );
}

function GlassControlPopover({
  open,
  settings,
  onChange,
  onClose,
  onReset,
}: {
  open: boolean;
  settings: HeroGlassSettings;
  onChange: (key: keyof Omit<HeroGlassSettings, "shape">, value: number) => void;
  onClose: () => void;
  onReset: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="glass-control-popover fixed right-4 z-50 w-[min(25rem,calc(100vw-2rem))] rounded-[1.35rem] border border-white/12 bg-[#09090b]/92 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
      style={{ "--glass-height": `${settings.height}px` } as CSSProperties}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white">
            Glass Controls
          </h2>
          <p className="mt-1 text-xs font-semibold text-white/44">
            Homepage fixed bar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="glass-control-icon"
            aria-label="Reset glass"
          >
            <RotateCcw className="size-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="glass-control-icon"
            aria-label="Close glass controls"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="max-h-[min(34rem,calc(100svh-13rem))] space-y-3 overflow-y-auto pr-1">
        {glassControls.map((control) => (
          <GlassControlSlider
            key={control.key}
            label={control.label}
            min={control.min}
            max={control.max}
            step={control.step}
            value={settings[control.key] as number}
            onChange={(value) => onChange(control.key, value)}
          />
        ))}
      </div>
    </div>
  );
}

function GlassControlSlider({
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
  const valueLabel =
    step >= 1 ? Math.round(value).toString() : value.toFixed(step < 0.01 ? 3 : 2);

  return (
    <label className="block rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
      <span className="mb-3 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.08em] text-white/62">
        {label}
        <span className="font-mono text-white">{valueLabel}</span>
      </span>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([nextValue]) => {
          if (nextValue === undefined) return;
          onChange(nextValue);
        }}
        className="glass-control-slider"
      />
    </label>
  );
}

function GlitchTitle({ lines }: { lines: string[] }) {
  return (
    <h1
      className="hero-name hero-title font-black uppercase leading-[0.82] tracking-normal text-[#f4f1ea]"
      aria-label={lines.join(" ")}
    >
      <span aria-hidden="true">
        {lines.map((line, lineIndex) => (
          <span className="block" key={line}>
            {[...line].map((letter, letterIndex) => {
              const characterIndex = lineIndex * 7 + letterIndex;

              return (
                <span
                  className="glitch-letter"
                  data-letter={letter}
                  key={`${line}-${letter}-${letterIndex}`}
                  style={
                    {
                      "--glitch-delay": `${characterIndex * -0.17}s`,
                      "--glitch-x-sm":
                        letterIndex % 2 === 0 ? "0.025em" : "-0.025em",
                      "--glitch-x-sm-neg":
                        letterIndex % 2 === 0 ? "-0.018em" : "0.018em",
                      "--glitch-cyan-idle":
                        letterIndex % 2 === 0 ? "0.035em" : "-0.035em",
                      "--glitch-cyan-far":
                        letterIndex % 2 === 0 ? "0.11em" : "-0.11em",
                      "--glitch-cyan-mid":
                        letterIndex % 2 === 0 ? "-0.06em" : "0.06em",
                      "--glitch-cyan-low":
                        letterIndex % 2 === 0 ? "0.09em" : "-0.09em",
                      "--glitch-magenta-idle":
                        letterIndex % 2 === 0 ? "-0.03em" : "0.03em",
                      "--glitch-magenta-far":
                        letterIndex % 2 === 0 ? "-0.1em" : "0.1em",
                      "--glitch-magenta-mid":
                        letterIndex % 2 === 0 ? "0.055em" : "-0.055em",
                      "--glitch-magenta-low":
                        letterIndex % 2 === 0 ? "-0.08em" : "0.08em",
                    } as CSSProperties
                  }
                >
                  {letter}
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </h1>
  );
}

function Work({
  mirror = false,
  settings,
  onOpenControls,
}: {
  mirror?: boolean;
  settings: HeroGlassSettings;
  onOpenControls: () => void;
}) {
  return (
    <>
      <section
        id={mirror ? undefined : "work"}
        data-glass-context={mirror ? undefined : "work"}
        className="relative flex min-h-[100svh] px-4 py-16 sm:px-6 lg:py-24"
      >
        <Reveal className="mx-auto grid w-full max-w-7xl content-end gap-6 border-b border-[#f4f1ea]/12 pb-36 lg:grid-cols-[0.78fr_1fr] lg:items-end">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f4f1ea]/48">
            Selected Work
          </p>
          <h2 className="max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-normal sm:text-6xl">
            Recent builds.
          </h2>
        </Reveal>
      </section>

      {projects.map((project, index) => (
        <ProjectScreen
          key={project.title}
          index={index}
          project={project}
          mirror={mirror}
          settings={settings}
          onOpenControls={onOpenControls}
        />
      ))}
    </>
  );
}

function ProjectScreen({
  index,
  project,
  mirror = false,
  settings,
  onOpenControls,
}: {
  index: number;
  project: (typeof projects)[number];
  mirror?: boolean;
  settings: HeroGlassSettings;
  onOpenControls: () => void;
}) {
  return (
    <section
      data-glass-context={mirror ? undefined : "project"}
      data-project-index={mirror ? undefined : index}
      className="project-screen relative flex h-[100svh] items-center px-4 py-10 sm:px-6"
    >
      <Reveal className="mx-auto flex h-full w-full max-w-[1700px] items-center justify-center pb-[clamp(7rem,14svh,10rem)] pt-[clamp(4rem,9svh,6rem)]">
        <div className="glass-frame project-shot relative overflow-hidden">
          <a
            href={project.href}
            className="group block"
            aria-label={`Open ${project.title}`}
          >
            <LiquidGlass
              x={0.5}
              y={0.88}
              width={Math.min(settings.width, 1480)}
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
              shape={settings.shape}
              squircleExponent={settings.squircleExponent}
              quality={settings.quality}
              shadow={false}
              className="project-liquid-stage"
            >
              <img
                src={project.screenshotSrc}
                alt={`${project.title} screenshot`}
                loading={mirror || index === 0 ? "eager" : "lazy"}
                decoding={mirror ? "sync" : "async"}
                className="glass-refract aspect-[16/9] w-full object-cover object-top opacity-95 transition duration-500 group-hover:scale-[1.012] group-hover:opacity-100"
              />
            </LiquidGlass>
          </a>
          <SharedGlassBar
            project={project}
            settings={settings}
            onOpenControls={onOpenControls}
          />
        </div>
      </Reveal>
    </section>
  );
}

function Practice({ mirror = false }: { mirror?: boolean }) {
  return (
    <section
      id={mirror ? undefined : "practice"}
      data-glass-context={mirror ? undefined : "practice"}
      className="relative px-4 py-16 sm:px-6 lg:py-24"
    >
      <div className="mx-auto max-w-7xl border-y border-[#f4f1ea]/12 py-12">
        <Reveal className="grid gap-8 lg:grid-cols-[0.44fr_0.56fr]">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#f4f1ea]/48">
              Practice
            </p>
            <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-normal sm:text-6xl">
              What I do.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {capabilities.map(({ icon: Icon, title, body }) => (
              <div key={title} className="liquid-glass p-5">
                <Icon className="mb-6 size-5 text-[#d7ff63]" />
                <div className="text-sm font-bold uppercase tracking-[0.14em]">
                  {title}
                </div>
                <p className="mt-4 text-sm leading-6 text-[#f4f1ea]/58">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Contact({ mirror = false }: { mirror?: boolean }) {
  return (
    <section
      id={mirror ? undefined : "contact"}
      data-glass-context={mirror ? undefined : "contact"}
      className="relative px-4 py-16 sm:px-6 lg:py-24"
    >
      <Reveal className="mx-auto grid max-w-7xl gap-8 border-t border-[#f4f1ea]/12 pt-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#f4f1ea]/48">
            Contact
          </p>
          <h2 className="max-w-5xl text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-7xl">
            Let’s build something useful.
          </h2>
        </div>
        <a
          href="mailto:juanquenga@gmail.com?subject=Let's work together&body=Hi Juan, I'd like to discuss a potential project with you."
          className="glass-button glass-button-primary inline-flex h-12 w-fit items-center gap-3 px-5 text-sm font-bold uppercase tracking-[0.12em] transition hover:scale-[1.015]"
        >
          Email
          <ArrowRight className="size-4" />
        </a>
      </Reveal>
    </section>
  );
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
