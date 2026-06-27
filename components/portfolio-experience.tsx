"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Github,
  MapPin,
  MonitorCheck,
  PackageCheck,
  PanelsTopLeft,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { motion } from "motion/react";
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

const workFocus = [
  {
    label: "Systems",
    copy: "Type-safe frontends wired to real product data.",
  },
  {
    label: "Tools",
    copy: "React, TanStack, Tailwind, Convex, and modern app primitives.",
  },
  {
    label: "AI workflow",
    copy: "Cursor, Codex, agentic coding, and LLMs in dev environments.",
  },
];
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
  { key: "depth", label: "Depth", min: 0, max: 80, step: 1 },
  { key: "curvature", label: "Curvature", min: 0, max: 1, step: 0.01 },
  { key: "glow", label: "Glow", min: 0, max: 1, step: 0.01 },
  {
    key: "edgeHighlight",
    label: "Edge",
    min: 0,
    max: 1,
    step: 0.01,
  },
  { key: "edgeWidth", label: "Edge Width", min: 0, max: 10, step: 0.1 },
  { key: "specular", label: "Specular", min: 0, max: 1, step: 0.01 },
  { key: "specularAngle", label: "Light", min: 0, max: 360, step: 1 },
  {
    key: "squircleExponent",
    label: "Squircle",
    min: 2,
    max: 8,
    step: 0.1,
  },
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
  const stageRef = useRef<HTMLElement | null>(null);
  const isCompactViewport = useCompactViewport();
  const screenCount = projects.length + 4;
  const { activeScreen, goToScreen } = useVirtualScreens(screenCount, stageRef);
  const activeProjectIndex =
    activeScreen >= 2 && activeScreen < 2 + projects.length
      ? activeScreen - 2
      : null;
  const activeProject = useMemo(
    () =>
      activeProjectIndex === null ? null : (projects[activeProjectIndex] ?? null),
    [activeProjectIndex],
  );
  const renderedGlassHeight = getRenderedGlassHeight(
    glassSettings.height,
    isCompactViewport,
    activeProject !== null,
  );

  return (
    <main
      ref={stageRef}
      className="portfolio-stage relative h-screen isolate overflow-hidden bg-[#020203] text-[#f4f1ea]"
    >
      <ParallaxBackdrop />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-32 bg-gradient-to-b from-[#020203] to-transparent" />
      <Header
        onNavigate={goToScreen}
        onOpenControls={() => setShowGlassControls(true)}
      />
      <SectionNavigator
        activeScreen={activeScreen}
        screenCount={screenCount}
        glassHeight={renderedGlassHeight}
        onNavigate={goToScreen}
      />
      <PageContent
        activeScreen={activeScreen}
        onNavigate={goToScreen}
      />
      <SharedGlassBar
        project={activeProject}
        settings={glassSettings}
        renderedHeight={renderedGlassHeight}
        isCompactViewport={isCompactViewport}
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

function useCompactViewport() {
  const [isCompactViewport, setIsCompactViewport] = useState(false);

  useLayoutEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");

    const updateViewport = () => {
      setIsCompactViewport(media.matches);
    };

    updateViewport();
    media.addEventListener("change", updateViewport);

    return () => media.removeEventListener("change", updateViewport);
  }, []);

  return isCompactViewport;
}

function getRenderedGlassHeight(
  baseHeight: number,
  isCompactViewport: boolean,
  hasProject: boolean,
) {
  if (!isCompactViewport) return baseHeight;
  return Math.round(baseHeight * (hasProject ? 0.96 : 1.12));
}

function getScreenLabel(screen: number) {
  if (screen === 0) return "Home";
  if (screen === 1) return "Selected work";

  const projectIndex = screen - 2;
  if (projectIndex >= 0 && projectIndex < projects.length) {
    return projects[projectIndex]?.title ?? `Project ${projectIndex + 1}`;
  }

  if (screen === projects.length + 2) return "Practice";
  if (screen === projects.length + 3) return "Contact";
  return `Section ${screen + 1}`;
}

function SectionNavigator({
  activeScreen,
  screenCount,
  glassHeight,
  onNavigate,
}: {
  activeScreen: number;
  screenCount: number;
  glassHeight: number;
  onNavigate: (screen: number) => void;
}) {
  return (
    <nav
      aria-label="Portfolio sections"
      className="section-navigator"
      style={{ "--glass-height": `${glassHeight}px` } as CSSProperties}
    >
      <ol className="section-navigator-list">
        {Array.from({ length: screenCount }, (_, screen) => {
          const isActive = screen === activeScreen;
          const label = getScreenLabel(screen);

          return (
            <li key={screen}>
              <button
                type="button"
                aria-label={`Go to ${label}`}
                aria-current={isActive ? "step" : undefined}
                className="section-navigator-button"
                onClick={() => onNavigate(screen)}
              >
                <span className="section-navigator-mark" />
                <span className="sr-only">{label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function PageContent({
  mirror = false,
  activeScreen = 0,
  onNavigate,
}: {
  mirror?: boolean;
  activeScreen?: number;
  onNavigate?: (screen: number) => void;
}) {
  const visibleScreens = [activeScreen - 1, activeScreen, activeScreen + 1].filter(
    (screen) => screen >= 0 && screen < projects.length + 4,
  );

  return (
    <div className="portfolio-track relative z-10 h-[100svh] overflow-hidden">
      {visibleScreens.map((screen) => (
        <div
          key={screen}
          className="portfolio-screen absolute inset-0"
          style={
            {
              "--screen-y": `calc(${(screen - activeScreen) * 100}svh + var(--drag-offset, 0px))`,
            } as CSSProperties
          }
        >
          <ScreenContent
            screen={screen}
            mirror={mirror}
            onNavigate={onNavigate}
          />
        </div>
      ))}
    </div>
  );
}

function ScreenContent({
  screen,
  mirror,
  onNavigate,
}: {
  screen: number;
  mirror: boolean;
  onNavigate?: (screen: number) => void;
}) {
  if (screen === 0) return <Hero mirror={mirror} onNavigate={onNavigate} />;
  if (screen === 1) return <WorkIntro mirror={mirror} />;

  const projectIndex = screen - 2;
  if (projectIndex >= 0 && projectIndex < projects.length) {
    const project = projects[projectIndex];
    if (!project) return null;
    return (
      <ProjectScreen
        index={projectIndex}
        project={project}
        mirror={mirror}
      />
    );
  }

  if (screen === projects.length + 2) return <Practice mirror={mirror} />;
  if (screen === projects.length + 3) return <Contact mirror={mirror} />;
  return null;
}

const screenTransition = "transform 580ms cubic-bezier(0.22, 1, 0.36, 1)";
const screenInputLockMs = 240;
const residualWheelQuietMs = 120;
const residualWheelBreakoutDelta = 110;
const residualWheelGrowthFactor = 1.35;
const wheelPreviewThreshold = 6;
const wheelCommitThreshold = 430;
const wheelPreviewDamping = 0.86;
const wheelPreviewLimitRatio = 0.72;
const wheelRestMs = 180;

function useVirtualScreens(
  screenCount: number,
  stageRef: RefObject<HTMLElement | null>,
) {
  const [activeScreen, setActiveScreen] = useState(0);
  const activeScreenRef = useRef(activeScreen);
  const dragOffsetFrame = useRef<number | undefined>(undefined);
  const pendingDragOffset = useRef(0);

  useEffect(() => {
    activeScreenRef.current = activeScreen;
  }, [activeScreen]);

  useEffect(() => {
    let wheelTotal = 0;
    let wheelTimer: number | undefined;
    let transitionTimer: number | undefined;
    let residualWheelTimer: number | undefined;
    let isTransitioning = false;
    let isAbsorbingResidualWheel = false;
    let residualWheelDirection: -1 | 1 = 1;
    let residualWheelMagnitude = 0;
    let touchStartY: number | undefined;
    let lastTouchY: number | undefined;

    const getBoundedOffset = (delta: number) => {
      const limit = window.innerHeight * wheelPreviewLimitRatio;
      return Math.max(-limit, Math.min(limit, -delta * wheelPreviewDamping));
    };

    const setDragOffsetOnFrame = (offset: number) => {
      pendingDragOffset.current = offset;
      if (dragOffsetFrame.current !== undefined) return;
      dragOffsetFrame.current = window.requestAnimationFrame(() => {
        dragOffsetFrame.current = undefined;
        stageRef.current?.style.setProperty(
          "--drag-offset",
          `${pendingDragOffset.current}px`,
        );
      });
    };

    const setScreenTransition = (transition: string) => {
      stageRef.current?.style.setProperty("--screen-transition", transition);
    };

    const setDragOffsetNow = (offset: number) => {
      pendingDragOffset.current = offset;
      if (dragOffsetFrame.current !== undefined) {
        window.cancelAnimationFrame(dragOffsetFrame.current);
        dragOffsetFrame.current = undefined;
      }
      stageRef.current?.style.setProperty("--drag-offset", `${offset}px`);
    };

    const releaseResidualWheel = () => {
      if (isTransitioning) return;
      isAbsorbingResidualWheel = false;
      residualWheelTimer = undefined;
      residualWheelMagnitude = 0;
      wheelTotal = 0;
    };

    const resetWheelGesture = () => {
      wheelTotal = 0;
      isAbsorbingResidualWheel = false;
      residualWheelMagnitude = 0;
      if (wheelTimer) window.clearTimeout(wheelTimer);
      if (residualWheelTimer) {
        window.clearTimeout(residualWheelTimer);
        residualWheelTimer = undefined;
      }
      setScreenTransition(screenTransition);
      setDragOffsetNow(0);
    };

    const scheduleResidualWheelRelease = () => {
      if (residualWheelTimer) window.clearTimeout(residualWheelTimer);
      residualWheelTimer = window.setTimeout(
        releaseResidualWheel,
        residualWheelQuietMs,
      );
    };

    const go = (direction: -1 | 1, triggerMagnitude = 0) => {
      if (isTransitioning) return;
      const nextScreen = Math.max(
        0,
        Math.min(screenCount - 1, activeScreenRef.current + direction),
      );

      if (nextScreen === activeScreenRef.current) {
        resetWheelGesture();
        return;
      }

      isTransitioning = true;
      isAbsorbingResidualWheel = false;
      residualWheelDirection = direction;
      residualWheelMagnitude = triggerMagnitude;
      if (residualWheelTimer) window.clearTimeout(residualWheelTimer);
      if (transitionTimer) window.clearTimeout(transitionTimer);
      setScreenTransition(screenTransition);
      flushSync(() => {
        setActiveScreen(nextScreen);
      });
      activeScreenRef.current = nextScreen;
      setDragOffsetNow(0);
      wheelTotal = 0;
      transitionTimer = window.setTimeout(() => {
        isTransitioning = false;
        isAbsorbingResidualWheel = true;
        scheduleResidualWheelRelease();
      }, screenInputLockMs);
    };

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      const direction = event.deltaY > 0 ? 1 : -1;
      const magnitude = Math.abs(event.deltaY);
      const currentScreen = activeScreenRef.current;

      if (
        (currentScreen === 0 && direction < 0) ||
        (currentScreen === screenCount - 1 && direction > 0)
      ) {
        resetWheelGesture();
        return;
      }

      if (isTransitioning || isAbsorbingResidualWheel) {
        wheelTotal = 0;
        if (wheelTimer) window.clearTimeout(wheelTimer);
        if (isAbsorbingResidualWheel) {
          const isFreshSwipe =
            direction === residualWheelDirection &&
            magnitude >= residualWheelBreakoutDelta &&
            magnitude >= residualWheelMagnitude * residualWheelGrowthFactor;

          if (isFreshSwipe) {
            releaseResidualWheel();
          } else {
            residualWheelDirection = direction;
            residualWheelMagnitude = Math.max(magnitude, residualWheelMagnitude * 0.86);
            scheduleResidualWheelRelease();
            return;
          }
        } else {
          residualWheelDirection = direction;
          residualWheelMagnitude = Math.max(magnitude, residualWheelMagnitude);
          return;
        }
      } else {
        residualWheelMagnitude = magnitude;
        residualWheelDirection = direction;
      }

      if (residualWheelTimer) {
        window.clearTimeout(residualWheelTimer);
        residualWheelTimer = undefined;
      }

      if (isTransitioning) {
        return;
      }

      wheelTotal += event.deltaY;
      const wheelDistance = Math.abs(wheelTotal);
      if (wheelDistance < wheelPreviewThreshold) {
        if (wheelTimer) window.clearTimeout(wheelTimer);
        wheelTimer = window.setTimeout(() => {
          wheelTotal = 0;
        }, wheelRestMs);
        return;
      }

      setScreenTransition("none");
      setDragOffsetOnFrame(
        getBoundedOffset(
          wheelTotal - Math.sign(wheelTotal) * wheelPreviewThreshold,
        ),
      );
      if (wheelDistance >= wheelCommitThreshold) {
        if (wheelTimer) window.clearTimeout(wheelTimer);
        go(wheelTotal > 0 ? 1 : -1, magnitude);
        return;
      }
      if (wheelTimer) window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => {
        setScreenTransition(screenTransition);
        setDragOffsetOnFrame(0);
        wheelTotal = 0;
      }, wheelRestMs);
    };

    const handleTouchStart = (event: TouchEvent) => {
      setScreenTransition("none");
      touchStartY = event.touches[0]?.clientY;
      lastTouchY = touchStartY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (touchStartY === undefined) return;
      if (isTransitioning) return;
      lastTouchY = event.touches[0]?.clientY;
      if (lastTouchY === undefined) return;
      const delta = touchStartY - lastTouchY;
      const direction = delta > 0 ? 1 : -1;
      const currentScreen = activeScreenRef.current;

      if (
        (currentScreen === 0 && direction < 0) ||
        (currentScreen === screenCount - 1 && direction > 0)
      ) {
        setScreenTransition(screenTransition);
        setDragOffsetNow(0);
        return;
      }

      setDragOffsetOnFrame(getBoundedOffset(delta));
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (touchStartY === undefined) return;
      const endY = event.changedTouches[0]?.clientY ?? lastTouchY;
      if (endY === undefined) return;
      const delta = touchStartY - endY;
      if (Math.abs(delta) >= window.innerHeight * 0.28) go(delta > 0 ? 1 : -1);
      else {
        setScreenTransition(screenTransition);
        setDragOffsetOnFrame(0);
      }
      touchStartY = undefined;
      lastTouchY = undefined;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        go(1);
      }
      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        go(-1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (wheelTimer) window.clearTimeout(wheelTimer);
      if (transitionTimer) window.clearTimeout(transitionTimer);
      if (residualWheelTimer) window.clearTimeout(residualWheelTimer);
      if (dragOffsetFrame.current !== undefined) {
        window.cancelAnimationFrame(dragOffsetFrame.current);
      }
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [screenCount]);

  return {
    activeScreen,
    goToScreen: (screen: number) => {
      const nextScreen = Math.max(0, Math.min(screenCount - 1, screen));
      pendingDragOffset.current = 0;
      activeScreenRef.current = nextScreen;
      stageRef.current?.style.setProperty("--screen-transition", screenTransition);
      stageRef.current?.style.setProperty("--drag-offset", "0px");
      setActiveScreen(nextScreen);
    },
  };
}

function ParallaxBackdrop() {
  return (
    <div
      className="site-backdrop pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="site-backdrop-grid absolute -inset-[28svh]"
      />
      <div
        className="site-backdrop-beam absolute left-1/2 top-1/2 h-[34rem] w-[150vw] -translate-x-1/2 -translate-y-1/2 rotate-[-18deg]"
      />
      <div
        className="site-backdrop-glow site-backdrop-glow-cyan absolute -left-[18rem] top-[58svh] h-[42rem] w-[42rem]"
      />
      <div
        className="site-backdrop-glow site-backdrop-glow-lime absolute -right-[16rem] top-[8svh] h-[38rem] w-[38rem]"
      />
      <div
        className="site-backdrop-glow site-backdrop-glow-rose absolute left-[44vw] top-[72svh] h-[28rem] w-[28rem]"
      />
    </div>
  );
}

function Header({
  onNavigate,
  onOpenControls,
}: {
  onNavigate: (screen: number) => void;
  onOpenControls: () => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-start justify-between px-4 pt-4 sm:px-7 sm:pt-6">
      <nav className="liquid-glass header-nav flex h-12 items-center gap-4 px-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#f4f1ea]/68 sm:gap-7 sm:px-6 sm:text-xs sm:tracking-[0.16em]">
        <a
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            onNavigate(0);
          }}
          className="transition hover:text-white"
        >
          Home
        </a>
        <a
          href="#work"
          onClick={(event) => {
            event.preventDefault();
            onNavigate(1);
          }}
          className="transition hover:text-white"
        >
          Builds
        </a>
        <a
          href="#contact"
          onClick={(event) => {
            event.preventDefault();
            onNavigate(projects.length + 3);
          }}
          className="transition hover:text-white"
        >
          Contact
        </a>
      </nav>
      <div className="flex items-center gap-3">
        <a
          href="https://github.com/JuanQuenga"
          className="glass-button hidden size-12 items-center justify-center transition hover:border-[#d7ff63]/70 hover:text-[#d7ff63] sm:inline-flex"
          aria-label="Juan Quenga GitHub"
        >
          <Github className="size-5" />
        </a>
        <button
          type="button"
          onClick={onOpenControls}
          className="glass-button inline-flex size-12 items-center justify-center transition hover:border-[#d7ff63]/70 hover:text-[#d7ff63]"
          aria-label="Tune glass"
        >
          <SlidersHorizontal className="size-5" />
        </button>
      </div>
    </header>
  );
}

function Hero({
  mirror = false,
  onNavigate,
}: {
  mirror?: boolean;
  onNavigate?: (screen: number) => void;
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
            <GlitchTitle lines={heroNameLines} />
            <div className="hero-kicker-wrap mt-5 w-fit max-w-[22rem] sm:max-w-full">
              <p
                className="hero-kicker font-mono text-[clamp(0.95rem,3.8vw,1.9rem)] font-black uppercase leading-tight tracking-normal text-white"
                data-text="<Full Stack Product Engineer />"
                aria-label="Full Stack Product Engineer"
              >
                <span className="text-[#d7ff63]">&lt;</span>
                Full Stack Product Engineer
                <span className="text-[#d7ff63]">/&gt;</span>
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="hidden lg:block">
            <a
              href="#work"
              onClick={(event) => {
                event.preventDefault();
                onNavigate?.(1);
              }}
              className="group block pb-2 text-right text-sm font-black text-[#f4f1ea]"
            >
              Work
              <span className="mt-5 block h-px w-full bg-[#f4f1ea]/28 transition group-hover:bg-[#d7ff63]" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function SharedGlassBar({
  project,
  settings,
  renderedHeight,
  isCompactViewport,
}: {
  project: (typeof projects)[number] | null;
  settings: HeroGlassSettings;
  renderedHeight: number;
  isCompactViewport: boolean;
}) {
  const barRef = useRef<HTMLDivElement | null>(null);
  const glassRadius = isCompactViewport ? renderedHeight / 3 : settings.radius;

  return (
    <div
      ref={barRef}
      className="project-glass-bar px-5 py-4 sm:px-7"
      style={
        {
          "--hero-glass-width": `${settings.width}px`,
          "--glass-height": `${renderedHeight}px`,
          "--glass-radius": `${glassRadius}px`,
          "--glass-bottom": "max(1rem, env(safe-area-inset-bottom))",
          height: `${renderedHeight}px`,
          minHeight: `${renderedHeight}px`,
        } as CSSProperties
      }
    >
      <ShaderGlassLayer
        width={settings.width}
        height={renderedHeight}
        radius={glassRadius}
        strength={settings.strength}
        chromaticAberration={settings.chromaticAberration}
        depth={settings.depth}
        curvature={settings.curvature}
        glow={settings.glow}
        edgeHighlight={settings.edgeHighlight}
        edgeWidth={settings.edgeWidth}
        specular={settings.specular}
        specularAngle={settings.specularAngle}
        squircleExponent={settings.squircleExponent}
        className="project-glass-layer"
      />
      {project ? (
        <div className="hero-glass-content project-glass-content grid h-full gap-5 text-base font-semibold text-[#f4f1ea]/78 sm:grid-cols-[1fr_auto] sm:items-center lg:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)_auto]">
          <div className="project-glass-text min-w-0">
            <div className="project-glass-title truncate text-2xl font-black uppercase leading-none text-white">
              {project.title}
            </div>
            <p className="project-glass-summary mt-2 max-w-3xl truncate leading-6 text-[#f4f1ea]/62">
              {project.summary}
            </p>
          </div>
          <div className="hidden min-w-0 flex-wrap justify-center gap-x-9 gap-y-2 text-[#f4f1ea]/72 lg:flex">
            {heroSkills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
          <div className="project-glass-actions flex items-center gap-3 justify-self-end">
            <a
              href={project.href}
              className="glass-button glass-button-primary inline-flex h-[3.25rem] items-center gap-2 px-5 text-xs font-bold uppercase tracking-[0.14em] transition hover:scale-[1.015]"
            >
              Open
              <ArrowUpRight className="size-4" />
            </a>
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

          <p className="mobile-glass-copy min-w-0 max-w-none leading-7 text-[#f4f1ea]/62">
            I build React products for stores, local businesses, and internal
            teams.
          </p>

          <div className="mobile-glass-secondary flex min-w-0 flex-wrap justify-center gap-x-9 gap-y-2 text-[#f4f1ea]/72">
            {heroSkills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>

          <div className="mobile-glass-secondary flex min-w-0 items-center justify-end gap-3 truncate text-[#f4f1ea]/72">
            <MapPin className="size-5 shrink-0 text-[#d7ff63]" />
            Southeast Michigan
          </div>
        </div>
      )}
    </div>
  );
}

const shaderVertexSource = `
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const shaderFragmentSource = `
  precision mediump float;

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uRadius;
  uniform float uStrength;
  uniform float uChroma;
  uniform float uDepth;
  uniform float uCurvature;
  uniform float uGlow;
  uniform float uEdge;
  uniform float uEdgeWidth;
  uniform float uSpecular;
  uniform float uSpecularAngle;
  uniform float uSquircleExponent;

  float roundedSquircleSdf(vec2 p, vec2 halfSize, float radius, float exponent) {
    float r = min(radius, min(halfSize.x, halfSize.y));
    vec2 q = abs(p) - (halfSize - vec2(r));
    vec2 outside = max(q, 0.0);
    float outsideDistance = pow(pow(outside.x, exponent) + pow(outside.y, exponent), 1.0 / exponent) - r;
    float insideDistance = min(max(q.x, q.y), 0.0);
    return outsideDistance + insideDistance;
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  vec3 backdrop(vec2 uv) {
    vec2 p = uv - 0.5;
    float cyan = exp(-dot(p - vec2(-0.36, -0.18), p - vec2(-0.36, -0.18)) * 6.0);
    float lime = exp(-dot(p - vec2(0.38, 0.18), p - vec2(0.38, 0.18)) * 4.4);
    float rose = exp(-dot(p - vec2(0.08, -0.46), p - vec2(0.08, -0.46)) * 7.5);
    vec3 color = vec3(0.014, 0.017, 0.02);
    color += vec3(0.035, 0.22, 0.24) * cyan;
    color += vec3(0.22, 0.25, 0.065) * lime;
    color += vec3(0.22, 0.055, 0.14) * rose;
    color += vec3(0.045) * noise(uv * vec2(18.0, 5.0));
    return color;
  }

  void main() {
    vec2 px = vUv * uResolution;
    vec2 halfSize = uResolution * 0.5;
    vec2 p = px - halfSize;
    float sdf = roundedSquircleSdf(p, halfSize - vec2(1.0), uRadius, uSquircleExponent);
    float mask = 1.0 - smoothstep(-1.0, 1.0, sdf);

    vec2 normalized = p / max(halfSize, vec2(1.0));
    float dome = pow(max(0.0, 1.0 - dot(normalized, normalized) * 0.36), 1.3);
    vec2 bend = normalized * dome * uStrength * (82.0 + uDepth * 1.6) * uCurvature / max(uResolution, vec2(1.0));

    vec3 refracted;
    refracted.r = backdrop(vUv + bend * (1.0 + uChroma * 0.85)).r;
    refracted.g = backdrop(vUv + bend * (1.0 + uChroma * 0.25)).g;
    refracted.b = backdrop(vUv + bend).b;

    float edge = 1.0 - smoothstep(0.0, max(1.0, uEdgeWidth * 3.4), -sdf);
    float inner = 1.0 - smoothstep(0.0, 28.0 + uDepth * 0.55, -sdf);
    float ring = smoothstep(0.08, 0.86, edge) * smoothstep(1.0, 0.18, inner);
    float innerRing = smoothstep(0.08, 0.82, inner) * (1.0 - smoothstep(0.82, 1.0, inner));

    float angle = radians(uSpecularAngle);
    vec2 lightDir = normalize(vec2(cos(angle), sin(angle)));
    float sweep = pow(max(0.0, dot(normalize(normalized + 0.0001), lightDir)), 10.0);
    float topLight = smoothstep(0.98, 0.08, vUv.y) * 0.34;
    float bottomShade = smoothstep(0.46, 1.0, vUv.y) * 0.14;

    vec3 color = refracted;
    color = mix(color, vec3(0.004, 0.006, 0.008), 0.34);
    color += vec3(0.86, 0.95, 0.78) * ring * uEdge * 0.55;
    color += vec3(0.5, 0.78, 0.86) * innerRing * uEdge * 0.18;
    color += vec3(1.0, 0.98, 0.88) * sweep * uSpecular * 0.24;
    color += vec3(0.72, 0.98, 1.0) * uGlow * topLight;
    color -= vec3(bottomShade);

    gl_FragColor = vec4(color, mask);
  }
`;

function ShaderGlassLayer({
  className,
  width,
  height,
  radius,
  strength,
  chromaticAberration,
  depth,
  curvature,
  glow,
  edgeHighlight,
  edgeWidth,
  specular,
  specularAngle,
  squircleExponent,
}: {
  className?: string;
  width: number;
  height: number;
  radius: number;
  strength: number;
  chromaticAberration: number;
  depth: number;
  curvature: number;
  glow: number;
  edgeHighlight: number;
  edgeWidth: number;
  specular: number;
  specularAngle: number;
  squircleExponent: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      depth: false,
      powerPreference: "high-performance",
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      stencil: false,
    });

    if (!gl) return;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, shaderVertexSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, shaderFragmentSource);
    const program = gl.createProgram();

    if (!vertexShader || !fragmentShader || !program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    const buffer = gl.createBuffer();
    const positionLocation = gl.getAttribLocation(program, "aPosition");
    const uniforms = {
      resolution: gl.getUniformLocation(program, "uResolution"),
      radius: gl.getUniformLocation(program, "uRadius"),
      strength: gl.getUniformLocation(program, "uStrength"),
      chroma: gl.getUniformLocation(program, "uChroma"),
      depth: gl.getUniformLocation(program, "uDepth"),
      curvature: gl.getUniformLocation(program, "uCurvature"),
      glow: gl.getUniformLocation(program, "uGlow"),
      edge: gl.getUniformLocation(program, "uEdge"),
      edgeWidth: gl.getUniformLocation(program, "uEdgeWidth"),
      specular: gl.getUniformLocation(program, "uSpecular"),
      specularAngle: gl.getUniformLocation(program, "uSpecularAngle"),
      squircleExponent: gl.getUniformLocation(program, "uSquircleExponent"),
    };

    if (!buffer || positionLocation < 0) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    let frame: number | undefined;

    const render = () => {
      frame = undefined;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const canvasWidth = Math.max(1, Math.round(rect.width * dpr));
      const canvasHeight = Math.max(1, Math.round(rect.height * dpr));

      if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      }

      gl.viewport(0, 0, canvasWidth, canvasHeight);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uniforms.resolution, canvasWidth, canvasHeight);
      gl.uniform1f(uniforms.radius, radius * dpr);
      gl.uniform1f(uniforms.strength, strength);
      gl.uniform1f(uniforms.chroma, chromaticAberration);
      gl.uniform1f(uniforms.depth, depth);
      gl.uniform1f(uniforms.curvature, curvature);
      gl.uniform1f(uniforms.glow, glow);
      gl.uniform1f(uniforms.edge, edgeHighlight);
      gl.uniform1f(uniforms.edgeWidth, edgeWidth * dpr);
      gl.uniform1f(uniforms.specular, specular);
      gl.uniform1f(uniforms.specularAngle, specularAngle);
      gl.uniform1f(uniforms.squircleExponent, squircleExponent);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const queueRender = () => {
      if (frame !== undefined) return;
      frame = window.requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(queueRender);
    resizeObserver.observe(canvas);
    queueRender();

    return () => {
      resizeObserver.disconnect();
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [
    chromaticAberration,
    curvature,
    depth,
    edgeHighlight,
    edgeWidth,
    glow,
    height,
    radius,
    specular,
    specularAngle,
    squircleExponent,
    strength,
    width,
  ]);

  return (
    <div className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="shader-glass-canvas" />
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

function WorkIntro({
  mirror = false,
}: {
  mirror?: boolean;
}) {
  return (
    <section
      id={mirror ? undefined : "work"}
      data-glass-context={mirror ? undefined : "work"}
      className="relative flex min-h-[100svh] px-4 py-16 sm:px-6 lg:py-24"
    >
      <Reveal className="mx-auto grid w-full max-w-7xl content-center gap-10 border-b border-[#f4f1ea]/12 pb-32 pt-28 lg:grid-cols-[0.72fr_1fr] lg:items-center lg:pb-36 lg:pt-24">
        <div className="max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f4f1ea]/48">
            Selected Work
          </p>
          <div className="mt-8 grid gap-5 sm:max-w-xl lg:mt-12">
            {workFocus.map((item) => (
              <div
                key={item.label}
                className="grid gap-3 border-t border-[#f4f1ea]/12 pt-5 sm:grid-cols-[7rem_1fr]"
              >
                <div className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#d7ff63]/78">
                  {item.label}
                </div>
                <p className="max-w-md text-sm font-semibold leading-6 text-[#f4f1ea]/56">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-4xl">
          <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-normal sm:text-6xl">
            Recent builds.
          </h2>
          <p className="mt-6 max-w-2xl text-base font-semibold leading-7 text-[#f4f1ea]/58 sm:text-lg sm:leading-8">
            Full-stack React interfaces with type-safe data flows, modern
            tools like TanStack and Tailwind, and AI-aware workflows built
            around Cursor, Codex, and agentic development.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

function ProjectScreen({
  index,
  project,
  mirror = false,
}: {
  index: number;
  project: (typeof projects)[number];
  mirror?: boolean;
}) {
  return (
    <section
      data-glass-context={mirror ? undefined : "project"}
      data-project-index={mirror ? undefined : index}
      className="project-screen relative flex h-[100svh] items-center px-4 py-10 sm:px-6"
    >
      <Reveal className="project-screen-layout mx-auto flex h-full w-full max-w-[1700px] items-center justify-center pb-[clamp(7rem,14svh,10rem)] pt-[clamp(4rem,9svh,6rem)]">
        <div className="project-mobile-meta sm:hidden">
          <div className="flex items-center justify-between gap-4 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#d7ff63]">
            <span>Project {String(index + 1).padStart(2, "0")}</span>
            <span>{heroSkills[0]}</span>
          </div>
          <h2 className="mt-3 text-[clamp(2rem,11vw,3.35rem)] font-black uppercase leading-[0.88] tracking-normal text-white">
            {project.title}
          </h2>
          <p className="mt-3 max-w-[24rem] text-sm font-semibold leading-6 text-[#f4f1ea]/66">
            {project.summary}
          </p>
        </div>
        <div className="glass-frame project-shot relative overflow-hidden">
          <a
            href={project.href}
            className="group block"
            aria-label={`Open ${project.title}`}
          >
            <img
              src={project.screenshotSrc}
              alt={`${project.title} screenshot`}
              loading={mirror || index === 0 ? "eager" : "lazy"}
              decoding={mirror ? "sync" : "async"}
              className="aspect-[16/9] w-full object-cover object-top opacity-95 transition duration-500 group-hover:scale-[1.012] group-hover:opacity-100"
            />
          </a>
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
