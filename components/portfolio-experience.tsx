"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { ArrowRight, ArrowUpRight, Github, MapPin } from "lucide-react";
import { backdropShaderPreset } from "@/components/shader-backdrop";
import { HeroTitle } from "@/components/hero-title";
import { PortfolioStageBackground } from "@/components/portfolio-stage-background";

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

// Screens render in a fixed order: home, approach, work intro, one per
// project, then contact. Deriving the indices from this order keeps the offset
// math in one place instead of sprinkling `+ 2` / `+ 3` literals everywhere.
const HOME_SCREEN = 0;
const PRACTICE_SCREEN = 1;
const WORK_SCREEN = 2;
const FIRST_PROJECT_SCREEN = 3;
const CONTACT_SCREEN = FIRST_PROJECT_SCREEN + projects.length;
const SCREEN_COUNT = CONTACT_SCREEN + 1;

const heroSkills = ["React", "Next", "TanStack", "Convex"];

const heroNameLines = ["Juan", "Quenga"];
const heroGlassPreset = {
  width: 1600,
  height: 104,
} as const;

type HeroGlassSettings = typeof heroGlassPreset;

const approachFocus = [
  {
    label: "Type safety",
    copy: "End-to-end types across React, APIs, and data — fewer surprises from UI to backend.",
  },
  {
    label: "Agentic workflows",
    copy: "Cursor, Codex, and LLM agents in the loop for faster iteration without losing judgment.",
  },
  {
    label: "Modern tooling",
    copy: "TanStack, Tailwind, Convex, CI/CD, and deploy pipelines that keep shipping predictable.",
  },
];

export default function PortfolioExperience() {
  const stageRef = useRef<HTMLElement | null>(null);
  const isCompactViewport = useCompactViewport();
  const { activeScreen, goToScreen } = useNativeScreens(SCREEN_COUNT, stageRef);
  const activeProjectIndex =
    activeScreen >= FIRST_PROJECT_SCREEN && activeScreen < CONTACT_SCREEN
      ? activeScreen - FIRST_PROJECT_SCREEN
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

  return (
    <main
      ref={stageRef}
      className="portfolio-stage relative isolate bg-void text-ink"
      style={
        {
          "--glass-height": `${renderedGlassHeight}px`,
          "--mobile-dock-space": `${renderedGlassHeight + 44}px`,
        } as CSSProperties
      }
    >
      <PortfolioStageBackground settings={backdropShaderPreset} />
      <Header onNavigate={goToScreen} />
      <SectionNavigator
        activeScreen={activeScreen}
        screenCount={SCREEN_COUNT}
        glassHeight={renderedGlassHeight}
        onNavigate={goToScreen}
      />
      <PageContent onNavigate={goToScreen} />
      <SharedGlassBar
        project={activeProject}
        settings={heroGlassPreset}
        renderedHeight={renderedGlassHeight}
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

function useNativeScreens(
  screenCount: number,
  stageRef: RefObject<HTMLElement | null>,
) {
  const [activeScreen, setActiveScreen] = useState(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const updateActiveScreen = () => {
      const stageRect = stage.getBoundingClientRect();
      const stageCenter = stageRect.top + stageRect.height / 2;
      const screens = Array.from(
        stage.querySelectorAll<HTMLElement>("[data-portfolio-screen]"),
      );
      const closestScreen = screens.reduce(
        (closest, screen) => {
          const rect = screen.getBoundingClientRect();
          const screenIndex = Number(screen.dataset.portfolioScreen ?? 0);
          const distance = Math.abs(rect.top + rect.height / 2 - stageCenter);

          return distance < closest.distance
            ? { distance, screen: screenIndex }
            : closest;
        },
        { distance: Number.POSITIVE_INFINITY, screen: 0 },
      );

      setActiveScreen(closestScreen.screen);
    };

    updateActiveScreen();
    stage.addEventListener("scroll", updateActiveScreen, { passive: true });
    window.addEventListener("resize", updateActiveScreen);

    return () => {
      stage.removeEventListener("scroll", updateActiveScreen);
      window.removeEventListener("resize", updateActiveScreen);
    };
  }, [stageRef]);

  return {
    activeScreen,
    goToScreen: (screen: number) => {
      const nextScreen = Math.max(0, Math.min(screenCount - 1, screen));
      stageRef.current
        ?.querySelector<HTMLElement>(`[data-portfolio-screen="${nextScreen}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveScreen(nextScreen);
    },
  };
}

function getRenderedGlassHeight(
  baseHeight: number,
  isCompactViewport: boolean,
  hasProject: boolean,
) {
  if (!isCompactViewport) return baseHeight;
  // Portrait dock is a compact bottom bar, not the wide landscape pill.
  return hasProject ? 64 : 68;
}

function formatHost(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

function getScreenLabel(screen: number) {
  if (screen === HOME_SCREEN) return "Home";
  if (screen === WORK_SCREEN) return "My Work";
  if (screen === PRACTICE_SCREEN) return "Approach";
  if (screen === CONTACT_SCREEN) return "Contact";

  const projectIndex = screen - FIRST_PROJECT_SCREEN;
  if (projectIndex >= 0 && projectIndex < projects.length) {
    return projects[projectIndex]?.title ?? `Project ${projectIndex + 1}`;
  }

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
  onNavigate,
}: {
  onNavigate?: (screen: number) => void;
}) {
  return (
    <div className="portfolio-track relative z-10">
      {Array.from({ length: SCREEN_COUNT }, (_, screen) => (
        <div
          key={screen}
          className="portfolio-screen"
          data-portfolio-screen={screen}
        >
          <ScreenContent screen={screen} onNavigate={onNavigate} />
        </div>
      ))}
    </div>
  );
}

function ScreenContent({
  screen,
  onNavigate,
}: {
  screen: number;
  onNavigate?: (screen: number) => void;
}) {
  if (screen === HOME_SCREEN) return <Hero onNavigate={onNavigate} />;
  if (screen === WORK_SCREEN) return <WorkIntro onNavigate={onNavigate} />;
  if (screen === PRACTICE_SCREEN) return <Practice />;
  if (screen === CONTACT_SCREEN) return <Contact />;

  const projectIndex = screen - FIRST_PROJECT_SCREEN;
  const project = projects[projectIndex];
  if (!project) return null;
  return <ProjectScreen index={projectIndex} project={project} />;
}

function Header({ onNavigate }: { onNavigate: (screen: number) => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 grid grid-cols-[auto_1fr_auto] items-start px-4 pt-4 sm:px-7 sm:pt-6">
      {/* Spacer balances the GitHub button so the nav stays centered. */}
      <div className="size-12" aria-hidden="true" />
      <nav className="liquid-glass header-nav justify-self-center flex items-center gap-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink/68 sm:gap-2 sm:text-xs sm:tracking-[0.16em]">
        <span className="header-nav-shell" aria-hidden="true" />
        <a
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            onNavigate(HOME_SCREEN);
          }}
          className="transition hover:text-white"
        >
          Home
        </a>
        <a
          href="#work"
          onClick={(event) => {
            event.preventDefault();
            onNavigate(WORK_SCREEN);
          }}
          className="transition hover:text-white"
        >
          <span className="sm:hidden">Work</span>
          <span className="hidden sm:inline">My Work</span>
        </a>
        <a
          href="#contact"
          onClick={(event) => {
            event.preventDefault();
            onNavigate(CONTACT_SCREEN);
          }}
          className="transition hover:text-white"
        >
          Contact
        </a>
      </nav>
      <div className="flex items-center justify-end gap-3">
        <a
          href="https://github.com/JuanQuenga"
          className="glass-button inline-flex size-12 items-center justify-center transition hover:border-signal/70 hover:text-signal"
          aria-label="Juan Quenga GitHub"
        >
          <Github className="size-5" />
        </a>
      </div>
    </header>
  );
}

function Hero({ onNavigate }: { onNavigate?: (screen: number) => void }) {
  return (
    <section
      id="top"
      data-glass-context="home"
      className="hero-mobile relative flex min-h-[100svh] px-4 pb-[clamp(8rem,17svh,12rem)] pt-28 sm:px-7"
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-end">
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(220px,0.28fr)] lg:items-end">
          <div>
            <HeroTitle lines={heroNameLines} />
            <div className="hero-kicker-wrap mt-5 w-fit max-w-[22rem] sm:max-w-full">
              <p
                className="hero-kicker text-[clamp(0.95rem,3.8vw,1.9rem)] font-black uppercase leading-tight tracking-normal text-white"
                data-text="<Self Taught Software Engineer />"
                aria-label="Self Taught Software Engineer"
              >
                <span className="text-signal">&lt;</span>
                Self Taught Software Engineer
                <span className="text-signal">/&gt;</span>
              </p>
            </div>
            <a
              href="#work"
              onClick={(event) => {
                event.preventDefault();
                onNavigate?.(WORK_SCREEN);
              }}
              className="hero-mobile-cta sm:hidden"
            >
              <span className="hero-mobile-cta-rule" aria-hidden="true" />
              View work
              <ArrowRight className="size-3.5 text-signal" />
            </a>
          </div>

          <div className="hidden lg:block">
            <a
              href="#work"
              onClick={(event) => {
                event.preventDefault();
                onNavigate?.(WORK_SCREEN);
              }}
              className="group block pb-2 text-right text-sm font-black text-ink"
            >
              My Work
              <span className="mt-5 block h-px w-full bg-ink/28 transition group-hover:bg-signal" />
            </a>
          </div>
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
      <span className="header-nav-shell project-glass-shell" aria-hidden="true" />
      {project ? (
        <div className="hero-glass-content project-glass-content grid h-full gap-5 px-5 py-4 text-base font-semibold text-ink/78 sm:px-7 sm:grid-cols-[1fr_auto] sm:items-center lg:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)_auto]">
          <div className="project-glass-text min-w-0">
            {/* Portrait already shows the title in-page, so the dock carries the
                destination instead of repeating it. */}
            <div className="project-glass-host truncate sm:hidden">
              {formatHost(project.href)}
            </div>
            <div className="project-glass-title hidden truncate text-2xl font-black uppercase leading-none text-white sm:block">
              {project.title}
            </div>
            <p className="project-glass-summary mt-2 hidden max-w-3xl truncate leading-6 text-ink/62 sm:block">
              {project.summary}
            </p>
          </div>
          <div className="hidden min-w-0 flex-wrap justify-center gap-x-9 gap-y-2 text-ink/72 lg:flex">
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
        <div className="hero-glass-content flex h-full items-center gap-4 px-5 py-4 text-base font-semibold text-ink/78 sm:gap-6 sm:px-7">
          <div className="flex min-w-0 shrink-0 items-center gap-4">
            <div className="glass-button flex size-14 shrink-0 items-center justify-center text-lg font-black leading-none text-white">
              JQ
            </div>
            <div className="min-w-0">
              <div className="text-[1.05rem] leading-5 text-white">
                Juan Quenga
              </div>
              <div className="mt-1 leading-5 text-ink/58">
                Software Engineer
              </div>
            </div>
          </div>

          <div className="hero-glass-location ml-auto flex shrink-0 items-center gap-2 truncate text-ink/72 sm:gap-3">
            <MapPin className="size-5 shrink-0 text-signal" />
            <span className="sm:hidden">SE Michigan</span>
            <span className="hidden sm:inline">Southeast Michigan</span>
          </div>
        </div>
      )}
    </div>
  );
}

function WorkIntro({ onNavigate }: { onNavigate?: (screen: number) => void }) {
  return (
    <section
      id="work"
      data-glass-context="work"
      className="work-mobile relative flex min-h-[100svh] px-4 py-16 sm:px-6 lg:py-24"
    >
      <div className="work-mobile-inner mx-auto grid w-full max-w-7xl content-center gap-10 border-b border-ink/12 pb-32 pt-28 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16 lg:pb-36 lg:pt-24">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/48">
            My Work
          </p>
          <h2 className="mt-5 text-4xl font-black uppercase leading-[0.95] tracking-normal sm:text-6xl">
            Recent projects.
          </h2>
          <p className="mt-6 max-w-lg text-base font-semibold leading-7 text-ink/70 sm:text-lg sm:leading-8">
            I love building solutions for stores, local businesses, and
            internal teams.
          </p>
          <p className="mt-4 text-sm font-semibold text-ink/48">
            {projects.length} projects
          </p>
        </div>
        <ol className="work-project-list">
          {projects.map((project, index) => (
            <li key={project.title}>
              <a
                href={`#project-${index}`}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate?.(FIRST_PROJECT_SCREEN + index);
                }}
                className="work-project-link"
              >
                <span className="work-project-name">{project.title}</span>
                <ArrowRight className="work-project-arrow size-4 shrink-0" />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProjectScreen({
  index,
  project,
}: {
  index: number;
  project: (typeof projects)[number];
}) {
  return (
    <section
      id={`project-${index}`}
      data-glass-context="project"
      data-project-index={index}
      className="project-screen relative flex h-[100svh] items-center px-4 py-10 sm:px-6"
    >
      <div className="project-screen-layout mx-auto flex h-full w-full max-w-[1700px] items-center justify-center pb-[clamp(7rem,14svh,10rem)] pt-[clamp(4rem,9svh,6rem)]">
        <div className="project-mobile-meta sm:hidden">
          <h2 className="text-[clamp(2rem,11vw,3.35rem)] font-black uppercase leading-[0.88] tracking-normal text-white">
            {project.title}
          </h2>
          <p className="mt-2 max-w-[24rem] text-sm font-semibold leading-6 text-ink/66">
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
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              className="aspect-[16/9] w-full object-cover object-top opacity-95 transition duration-500 group-hover:scale-[1.012] group-hover:opacity-100"
            />
          </a>
        </div>
      </div>
    </section>
  );
}

function Practice() {
  return (
    <section
      id="practice"
      data-glass-context="practice"
      className="practice-mobile relative flex min-h-[100svh] items-center px-4 py-16 sm:px-6 lg:py-24"
    >
      <div className="practice-mobile-inner mx-auto grid w-full max-w-7xl content-center gap-10 border-y border-ink/12 py-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-16 lg:py-16">
        <div className="max-w-xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-ink/48">
            Approach
          </p>
          <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-normal sm:text-6xl">
            How I build.
          </h2>
          <p className="mt-6 max-w-md text-base font-semibold leading-7 text-ink/70 sm:text-lg sm:leading-8">
            Full-stack type safety, agentic coding workflows, and modern
            tooling from local build to production deploy.
          </p>
        </div>
        <div className="grid gap-0 border-t border-ink/12">
          {approachFocus.map((item) => (
            <div
              key={item.label}
              className="grid gap-3 border-b border-ink/12 py-5 sm:grid-cols-[8.5rem_1fr] sm:items-baseline sm:gap-8"
            >
              <div className="text-xs font-black uppercase tracking-[0.12em] text-signal sm:text-[0.8rem]">
                {item.label}
              </div>
              <p className="max-w-xl text-sm font-semibold leading-6 text-ink/70 sm:text-base sm:leading-7">
                {item.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section
      id="contact"
      data-glass-context="contact"
      className="contact-mobile relative flex min-h-[100svh] items-center px-4 py-16 sm:px-6 lg:py-24"
    >
      <div className="contact-mobile-inner mx-auto grid w-full max-w-7xl gap-8 border-t border-ink/12 pt-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-ink/48">
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
      </div>
    </section>
  );
}
