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
import {
  backdropShaderControls,
  backdropShaderPreset,
  backdropShaderShapes,
  type BackdropShaderSettings,
  type BackdropShaderShape,
} from "@/components/shader-backdrop";
import { HeroTitle } from "@/components/hero-title";
import { PortfolioStageBackground } from "@/components/portfolio-stage-background";
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
} as const;

const squircleSelector =
  ".liquid-glass, .project-shot, .project-liquid-stage, .glass-frame.project-shot";

type HeroGlassSettings = typeof heroGlassPreset;

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
  const [backdropSettings, setBackdropSettings] = useState<BackdropShaderSettings>({
    ...backdropShaderPreset,
  });
  const [showBackdropControls, setShowBackdropControls] = useState(false);
  const stageRef = useRef<HTMLElement | null>(null);
  const isCompactViewport = useCompactViewport();
  const screenCount = projects.length + 4;
  const { activeScreen, screenTransitionPair, goToScreen } = useVirtualScreens(
    screenCount,
    stageRef,
    isCompactViewport,
  );
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
    heroGlassPreset.height,
    isCompactViewport,
    activeProject !== null,
  );
  useSquircleMasks(stageRef, [
    activeScreen,
    isCompactViewport,
    renderedGlassHeight,
    showBackdropControls,
  ]);

  return (
    <main
      ref={stageRef}
      className="portfolio-stage relative h-screen isolate overflow-hidden bg-[#020203] text-[#f4f1ea]"
    >
      <PortfolioStageBackground settings={backdropSettings} />
      <Header
        onNavigate={goToScreen}
        onOpenControls={() => setShowBackdropControls(true)}
      />
      <SectionNavigator
        activeScreen={activeScreen}
        screenCount={screenCount}
        glassHeight={renderedGlassHeight}
        onNavigate={goToScreen}
      />
      <PageContent
        activeScreen={activeScreen}
        screenTransitionPair={screenTransitionPair}
        isHorizontal={isCompactViewport}
        onNavigate={goToScreen}
      />
      <SharedGlassBar
        project={activeProject}
        settings={heroGlassPreset}
        renderedHeight={renderedGlassHeight}
      />
      <BackdropControlPopover
        open={showBackdropControls}
        settings={backdropSettings}
        onClose={() => setShowBackdropControls(false)}
        onReset={() => setBackdropSettings({ ...backdropShaderPreset })}
        onChange={(key, value) =>
          setBackdropSettings((current) => ({ ...current, [key]: value }))
        }
        onShapeChange={(shape) =>
          setBackdropSettings((current) => ({ ...current, shape }))
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

function useSquircleMasks(
  rootRef: RefObject<HTMLElement | null>,
  dependencies: ReadonlyArray<unknown>,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;

    const managedElements = new Set<HTMLElement>();
    const snapshots = new WeakMap<
      HTMLElement,
      { height: number; radius: number; width: number }
    >();
    let frame: number | undefined;
    let refreshTimer: number | undefined;

    const getRadius = (element: HTMLElement) => {
      const styles = window.getComputedStyle(element);
      return Number.parseFloat(styles.borderTopLeftRadius) || 0;
    };

    const applyElement = (element: HTMLElement) => {
      const width = element.offsetWidth;
      const height = element.offsetHeight;

      if (!element.isConnected || width < 1 || height < 1) {
        return;
      }

      const radius = getRadius(element);
      const snapshot = snapshots.get(element);

      if (
        snapshot &&
        Math.abs(snapshot.radius - radius) < 0.5 &&
        Math.abs(snapshot.width - width) < 1 &&
        Math.abs(snapshot.height - height) < 1
      ) {
        return;
      }

      const mask = `url("${buildSquircleMask(width, height, radius)}")`;
      element.style.webkitMaskImage = mask;
      element.style.maskImage = mask;
      element.style.webkitMaskSize = "100% 100%";
      element.style.maskSize = "100% 100%";
      element.style.webkitMaskRepeat = "no-repeat";
      element.style.maskRepeat = "no-repeat";

      snapshots.set(element, { height, radius, width });
      managedElements.add(element);
    };

    const refresh = () => {
      frame = undefined;
      root.querySelectorAll<HTMLElement>(squircleSelector).forEach(applyElement);

      managedElements.forEach((element) => {
        if (!element.isConnected || !root.contains(element)) {
          managedElements.delete(element);
        }
      });
    };

    const scheduleRefresh = () => {
      if (frame !== undefined) return;
      frame = window.requestAnimationFrame(refresh);
    };

    const scheduleTransitionRefresh = () => {
      scheduleRefresh();
      if (refreshTimer !== undefined) window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(scheduleRefresh, 280);
    };

    const resizeObserver = new ResizeObserver(scheduleRefresh);
    resizeObserver.observe(root);

    const mutationObserver = new MutationObserver(scheduleRefresh);
    mutationObserver.observe(root, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["class", "style"],
    });

    root.addEventListener("pointerenter", scheduleTransitionRefresh, true);
    root.addEventListener("pointerleave", scheduleTransitionRefresh, true);
    root.addEventListener("focusin", scheduleTransitionRefresh);
    root.addEventListener("focusout", scheduleTransitionRefresh);
    root.addEventListener("transitionend", scheduleRefresh, true);
    window.addEventListener("resize", scheduleRefresh);

    scheduleRefresh();

    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      if (refreshTimer !== undefined) window.clearTimeout(refreshTimer);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      root.removeEventListener("pointerenter", scheduleTransitionRefresh, true);
      root.removeEventListener("pointerleave", scheduleTransitionRefresh, true);
      root.removeEventListener("focusin", scheduleTransitionRefresh);
      root.removeEventListener("focusout", scheduleTransitionRefresh);
      root.removeEventListener("transitionend", scheduleRefresh, true);
      window.removeEventListener("resize", scheduleRefresh);
      managedElements.forEach((element) => {
        element.style.webkitMaskImage = "";
        element.style.maskImage = "";
        element.style.webkitMaskSize = "";
        element.style.maskSize = "";
        element.style.webkitMaskRepeat = "";
        element.style.maskRepeat = "";
      });
    };
  }, [rootRef, ...dependencies]);
}

function buildSquircleMask(width: number, height: number, radius: number) {
  const path = buildSquirclePath(width, height, radius);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path fill="white" d="${path}"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function buildSquirclePath(width: number, height: number, radius: number) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  if (r <= 0) return `M 0 0 H ${width} V ${height} H 0 Z`;

  const pointsPerCorner = 14;
  const exponent = 0.5;
  const points: string[] = [
    `M ${formatNumber(r)} 0`,
    `L ${formatNumber(width - r)} 0`,
  ];

  const addCorner = (
    centerX: number,
    centerY: number,
    startAngle: number,
    endAngle: number,
  ) => {
    for (let index = 1; index <= pointsPerCorner; index += 1) {
      const angle =
        startAngle + ((endAngle - startAngle) * index) / pointsPerCorner;
      const radians = (angle * Math.PI) / 180;
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);
      const x = centerX + r * Math.sign(cos) * Math.abs(cos) ** exponent;
      const y = centerY + r * Math.sign(sin) * Math.abs(sin) ** exponent;
      points.push(`L ${formatNumber(x)} ${formatNumber(y)}`);
    }
  };

  addCorner(width - r, r, -90, 0);
  points.push(`L ${formatNumber(width)} ${formatNumber(height - r)}`);
  addCorner(width - r, height - r, 0, 90);
  points.push(`L ${formatNumber(r)} ${formatNumber(height)}`);
  addCorner(r, height - r, 90, 180);
  points.push(`L 0 ${formatNumber(r)}`);
  addCorner(r, r, 180, 270);
  points.push("Z");

  return points.join(" ");
}

function formatNumber(value: number) {
  return `${Math.round(value * 100) / 100}`;
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
  screenTransitionPair = null,
  isHorizontal = false,
  onNavigate,
}: {
  mirror?: boolean;
  activeScreen?: number;
  screenTransitionPair?: [number, number] | null;
  isHorizontal?: boolean;
  onNavigate?: (screen: number) => void;
}) {
  const maxScreen = projects.length + 3;
  const visibleScreens = screenTransitionPair
    ? screenTransitionPair.filter(
        (screen) => screen >= 0 && screen <= maxScreen,
      )
    : [activeScreen - 1, activeScreen, activeScreen + 1].filter(
        (screen) => screen >= 0 && screen <= maxScreen,
      );

  return (
    <div className="portfolio-track relative z-10 h-[100svh] overflow-hidden">
      {visibleScreens.map((screen) => (
        <div
          key={screen}
          className="portfolio-screen absolute inset-0"
          style={
            {
              "--screen-x": isHorizontal
                ? `calc(${(screen - activeScreen) * 100}vw + var(--drag-offset, 0px))`
                : "0px",
              "--screen-y": isHorizontal
                ? "0px"
                : `calc(${(screen - activeScreen) * 100}svh + var(--drag-offset, 0px))`,
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
const screenTransitionMs = 580;
const wheelCommitThreshold = 120;
const wheelPreviewDamping = 0.86;
const touchPreviewLimitRatio = 0.42;
const wheelRestMs = 140;

function useVirtualScreens(
  screenCount: number,
  stageRef: RefObject<HTMLElement | null>,
  isHorizontal: boolean,
) {
  const [activeScreen, setActiveScreen] = useState(0);
  const [screenTransitionPair, setScreenTransitionPair] = useState<
    [number, number] | null
  >(null);
  const activeScreenRef = useRef(activeScreen);
  const dragOffsetFrame = useRef<number | undefined>(undefined);
  const programmaticTransitionFrame = useRef<number | undefined>(undefined);
  const pendingDragOffset = useRef(0);
  const navigationTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    activeScreenRef.current = activeScreen;
  }, [activeScreen]);

  useEffect(() => {
    let wheelTotal = 0;
    let wheelTimer: number | undefined;
    let transitionTimer: number | undefined;
    let isTransitioning = false;
    let transitionDirection: -1 | 1 | null = null;
    let queuedReverseWheelTotal = 0;
    let touchStartPosition: number | undefined;
    let lastTouchPosition: number | undefined;

    const getBoundedOffset = (delta: number) => {
      const limit =
        (isHorizontal ? window.innerWidth : window.innerHeight) *
        touchPreviewLimitRatio;
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

    const resetWheelGesture = () => {
      wheelTotal = 0;
      if (wheelTimer) window.clearTimeout(wheelTimer);
      setScreenTransition(screenTransition);
      setDragOffsetNow(0);
    };

    const go = (direction: -1 | 1) => {
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
      transitionDirection = direction;
      queuedReverseWheelTotal = 0;
      if (transitionTimer) window.clearTimeout(transitionTimer);
      if (navigationTimer.current) {
        window.clearTimeout(navigationTimer.current);
        navigationTimer.current = undefined;
      }
      setScreenTransition(screenTransition);
      setScreenTransitionPair([activeScreenRef.current, nextScreen]);
      flushSync(() => {
        setActiveScreen(nextScreen);
      });
      activeScreenRef.current = nextScreen;
      setDragOffsetNow(0);
      wheelTotal = 0;
      transitionTimer = window.setTimeout(() => {
        isTransitioning = false;
        transitionDirection = null;
        setScreenTransitionPair(null);

        if (Math.abs(queuedReverseWheelTotal) >= wheelCommitThreshold) {
          const queuedDirection = queuedReverseWheelTotal > 0 ? 1 : -1;
          queuedReverseWheelTotal = 0;
          go(queuedDirection);
          return;
        }

        queuedReverseWheelTotal = 0;
      }, screenTransitionMs);
    };

    const handleWheel = (event: WheelEvent) => {
      const rawDelta = isHorizontal
        ? Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY
        : event.deltaY;

      if (!isHorizontal && Math.abs(event.deltaY) < Math.abs(event.deltaX)) {
        return;
      }

      const delta =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? rawDelta * 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? rawDelta * (isHorizontal ? window.innerWidth : window.innerHeight)
            : rawDelta;
      const direction = delta > 0 ? 1 : -1;

      if (isTransitioning) {
        if (transitionDirection !== null && direction !== transitionDirection) {
          if (Math.sign(queuedReverseWheelTotal) !== Math.sign(delta)) {
            queuedReverseWheelTotal = 0;
          }
          queuedReverseWheelTotal += delta;
        }
        return;
      }

      const currentScreen = activeScreenRef.current;

      if (
        (currentScreen === 0 && direction < 0) ||
        (currentScreen === screenCount - 1 && direction > 0)
      ) {
        resetWheelGesture();
        return;
      }

      if (Math.sign(wheelTotal) !== Math.sign(delta)) {
        wheelTotal = 0;
      }

      wheelTotal += delta;
      const wheelDistance = Math.abs(wheelTotal);

      if (wheelDistance >= wheelCommitThreshold) {
        if (wheelTimer) window.clearTimeout(wheelTimer);
        go(wheelTotal > 0 ? 1 : -1);
        return;
      }

      if (wheelTimer) window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => {
        wheelTotal = 0;
      }, wheelRestMs);
    };

    const handleTouchStart = (event: TouchEvent) => {
      setScreenTransition("none");
      const touch = event.touches[0];
      touchStartPosition = isHorizontal ? touch?.clientX : touch?.clientY;
      lastTouchPosition = touchStartPosition;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (touchStartPosition === undefined) return;
      if (isTransitioning) return;
      const touch = event.touches[0];
      lastTouchPosition = isHorizontal ? touch?.clientX : touch?.clientY;
      if (lastTouchPosition === undefined) return;
      const delta = isHorizontal
        ? lastTouchPosition - touchStartPosition
        : touchStartPosition - lastTouchPosition;
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
      if (touchStartPosition === undefined) return;
      const touch = event.changedTouches[0];
      const endPosition =
        (isHorizontal ? touch?.clientX : touch?.clientY) ?? lastTouchPosition;
      if (endPosition === undefined) return;
      const delta = isHorizontal
        ? endPosition - touchStartPosition
        : touchStartPosition - endPosition;
      const commitDistance =
        (isHorizontal ? window.innerWidth : window.innerHeight) * 0.28;
      if (Math.abs(delta) >= commitDistance) go(delta > 0 ? 1 : -1);
      else {
        setScreenTransition(screenTransition);
        setDragOffsetOnFrame(0);
      }
      touchStartPosition = undefined;
      lastTouchPosition = undefined;
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
      if (navigationTimer.current) {
        window.clearTimeout(navigationTimer.current);
        navigationTimer.current = undefined;
      }
      if (dragOffsetFrame.current !== undefined) {
        window.cancelAnimationFrame(dragOffsetFrame.current);
      }
      if (programmaticTransitionFrame.current !== undefined) {
        window.cancelAnimationFrame(programmaticTransitionFrame.current);
        programmaticTransitionFrame.current = undefined;
      }
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isHorizontal, screenCount]);

  return {
    activeScreen,
    screenTransitionPair,
    goToScreen: (screen: number) => {
      const nextScreen = Math.max(0, Math.min(screenCount - 1, screen));
      if (nextScreen === activeScreenRef.current) return;
      if (navigationTimer.current) {
        window.clearTimeout(navigationTimer.current);
        navigationTimer.current = undefined;
      }
      if (programmaticTransitionFrame.current !== undefined) {
        window.cancelAnimationFrame(programmaticTransitionFrame.current);
        programmaticTransitionFrame.current = undefined;
      }
      const currentScreen = activeScreenRef.current;
      pendingDragOffset.current = 0;
      stageRef.current?.style.setProperty("--screen-transition", "none");
      stageRef.current?.style.setProperty("--drag-offset", "0px");
      flushSync(() => {
        setScreenTransitionPair([currentScreen, nextScreen]);
      });
      programmaticTransitionFrame.current = window.requestAnimationFrame(() => {
        programmaticTransitionFrame.current = undefined;
        activeScreenRef.current = nextScreen;
        stageRef.current?.style.setProperty("--screen-transition", screenTransition);
        setActiveScreen(nextScreen);
      });
      navigationTimer.current = window.setTimeout(() => {
        setScreenTransitionPair(null);
        navigationTimer.current = undefined;
      }, screenTransitionMs);
    },
  };
}

function Header({
  onNavigate,
  onOpenControls,
}: {
  onNavigate: (screen: number) => void;
  onOpenControls: () => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 grid grid-cols-[auto_1fr_auto] items-start px-4 pt-4 sm:px-7 sm:pt-6">
      <button
        type="button"
        onClick={onOpenControls}
        className="glass-button inline-flex size-12 items-center justify-center transition hover:border-[#d7ff63]/70 hover:text-[#d7ff63]"
        aria-label="Tune background"
      >
        <SlidersHorizontal className="size-5" />
      </button>
      <nav className="liquid-glass header-nav justify-self-center flex items-center gap-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#f4f1ea]/68 sm:gap-2 sm:text-xs sm:tracking-[0.16em]">
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
      <div className="flex items-center justify-end gap-3">
        <a
          href="https://github.com/JuanQuenga"
          className="glass-button inline-flex size-12 items-center justify-center transition hover:border-[#d7ff63]/70 hover:text-[#d7ff63]"
          aria-label="Juan Quenga GitHub"
        >
          <Github className="size-5" />
        </a>
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
            <HeroTitle lines={heroNameLines} />
            <div className="hero-kicker-wrap mt-5 w-fit max-w-[22rem] sm:max-w-full">
              <p
                className="hero-kicker text-[clamp(0.95rem,3.8vw,1.9rem)] font-black uppercase leading-tight tracking-normal text-white"
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
}: {
  project: (typeof projects)[number] | null;
  settings: HeroGlassSettings;
  renderedHeight: number;
}) {
  return (
    <div
      className="liquid-glass header-nav project-glass-bar"
      style={
        {
          "--hero-glass-width": `${settings.width}px`,
          "--glass-height": `${renderedHeight}px`,
          height: `${renderedHeight}px`,
          minHeight: `${renderedHeight}px`,
        } as CSSProperties
      }
    >
      {project ? (
        <div className="hero-glass-content project-glass-content grid h-full gap-5 px-5 py-4 text-base font-semibold text-[#f4f1ea]/78 sm:px-7 sm:grid-cols-[1fr_auto] sm:items-center lg:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)_auto]">
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
        <div className="hero-glass-content flex h-full items-center gap-4 px-5 py-4 text-base font-semibold text-[#f4f1ea]/78 sm:gap-6 sm:px-7">
          <div className="flex min-w-0 shrink-0 items-center gap-4">
            <div className="glass-button flex size-14 shrink-0 items-center justify-center text-lg font-black leading-none text-white">
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

          <p className="mobile-glass-copy hidden min-w-0 flex-1 leading-7 text-[#f4f1ea]/62 sm:block">
            I build React products for stores, local businesses, and internal
            teams.
          </p>

          <div className="hero-glass-location ml-auto flex shrink-0 items-center gap-3 truncate text-[#f4f1ea]/72">
            <MapPin className="size-5 shrink-0 text-[#d7ff63]" />
            Southeast Michigan
          </div>
        </div>
      )}
    </div>
  );
}

function BackdropControlPopover({
  open,
  settings,
  onChange,
  onShapeChange,
  onClose,
  onReset,
}: {
  open: boolean;
  settings: BackdropShaderSettings;
  onChange: (
    key: (typeof backdropShaderControls)[number]["key"],
    value: number,
  ) => void;
  onShapeChange: (shape: BackdropShaderShape) => void;
  onClose: () => void;
  onReset: () => void;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        popoverRef.current?.contains(target)
      ) {
        return;
      }

      onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      ref={popoverRef}
      className="glass-control-popover fixed z-50 w-[min(25rem,calc(100vw-2rem))] rounded-[1.35rem] border border-white/12 bg-[#09090b]/92 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white">
            Background
          </h2>
          <p className="mt-1 text-xs font-semibold text-white/44">
            Warp · Passion
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="glass-control-icon"
            aria-label="Reset background"
          >
            <RotateCcw className="size-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="glass-control-icon"
            aria-label="Close background controls"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="glass-control-scroll max-h-[min(34rem,calc(100svh-13rem))] space-y-3 overflow-y-auto pr-1">
        <fieldset className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
          <legend className="mb-3 px-1 text-xs font-bold uppercase tracking-[0.08em] text-white/62">
            Shape
          </legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {backdropShaderShapes.map((shape) => {
              const isActive = settings.shape === shape;

              return (
                <button
                  key={shape}
                  type="button"
                  onClick={() => onShapeChange(shape)}
                  className={
                    isActive
                      ? "rounded-xl border border-[#d7ff63] bg-[#d7ff63] px-2 py-2 text-[0.62rem] font-black uppercase tracking-[0.08em] text-black transition"
                      : "rounded-xl border border-white/12 bg-white/[0.04] px-2 py-2 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-white/62 transition hover:border-white/24 hover:text-white"
                  }
                >
                  {shape}
                </button>
              );
            })}
          </div>
        </fieldset>

        {backdropShaderControls.map((control) => (
          <GlassControlSlider
            key={control.key}
            label={control.label}
            min={control.min}
            max={control.max}
            step={control.step}
            value={settings[control.key]}
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
          <p className="mt-6 max-w-2xl text-base font-semibold leading-7 text-[#f4f1ea]/70 sm:text-lg sm:leading-8">
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
