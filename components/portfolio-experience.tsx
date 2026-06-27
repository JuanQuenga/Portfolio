"use client";

import type { ReactNode } from "react";
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
} from "lucide-react";
import { LiquidGlass } from "liquid-glass-web-react";
import { motion } from "motion/react";

const projects = [
  {
    title: "Volt",
    summary: "Scanner-first product capture with review flows for messy item data.",
    href: "https://volt-scanner.vercel.app/",
    screenshotSrc: "/screenshots/volt.png",
  },
  {
    title: "Piggies US",
    summary: "A social app with accounts, subscriptions, and live community screens.",
    href: "https://piggies.us",
    githubHref: "https://github.com/piggies-us/piggies-us",
    screenshotSrc: "/screenshots/piggies.png",
  },
  {
    title: "PayMore Electronics",
    summary: "Store workflow screens for scanning, editing, and moving inventory faster.",
    href: "https://paymore-extension.vercel.app",
    githubHref: "https://github.com/paymore-eletronics/paymore-eletronics",
    screenshotSrc: "/screenshots/paymore.png",
  },
  {
    title: "Herman's Modern Bakery",
    summary: "A simple storefront for menu, hours, location, and quick mobile browsing.",
    href: "https://hermans.vercel.app",
    screenshotSrc: "/screenshots/hermans.png",
  },
  {
    title: "Multi Auto",
    summary: "Responsive service screens for compact workflows and quick comparisons.",
    href: "https://multi-auto.vercel.app",
    screenshotSrc: "/screenshots/multi-auto.png",
  },
  {
    title: "ClashCrown",
    summary: "A Clash Royale companion for lookup, comparison, and player tools.",
    href: "https://clashcrown.vercel.app/",
    screenshotSrc: "/screenshots/clashcrown.png",
  },
  {
    title: "BrawlStats",
    summary: "Brawl Stars stats with profile lookup and readable player data.",
    href: "https://brawlstatsio.vercel.app/",
    screenshotSrc: "/screenshots/brawlstats.png",
  },
];

const heroSkills = ["React", "Next", "TanStack", "Convex"];

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
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#020203] text-[#f4f1ea]">
      <div className="site-backdrop pointer-events-none fixed inset-0" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-32 bg-gradient-to-b from-[#020203] to-transparent" />
      <Header />
      <Hero />
      <Work />
      <Practice />
      <Contact />
    </main>
  );
}

function GlassRefractionLayer() {
  return (
    <LiquidGlass
      x={0.5}
      y={0.5}
      width={1480}
      height={124}
      radius="auto"
      strength={0.06}
      chromaticAberration={0.12}
      blur={0}
      depth={18}
      curvature={0.9}
      glow={0.08}
      edgeHighlight={0.22}
      quality={512}
      shadow={false}
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] opacity-100"
      aria-hidden="true"
    >
      <div className="glass-backdrop absolute inset-0 rounded-[inherit]" />
    </LiquidGlass>
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

function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] px-4 pb-6 pt-28 sm:px-7 sm:pb-8"
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col justify-end">
        <div className="mb-10 grid gap-10 lg:grid-cols-[1fr_300px] lg:items-end">
          <Reveal>
            <Code2 className="mb-6 size-10 text-[#f4f1ea]" />
            <h1 className="hero-name hero-title font-black uppercase leading-[0.82] tracking-normal text-[#f4f1ea]">
              <span className="block">Juan</span>
              <span className="block">Quenga</span>
            </h1>
            <p className="mt-3 max-w-[22rem] font-mono text-[clamp(0.95rem,4.7vw,2.25rem)] font-black uppercase leading-tight tracking-normal text-white sm:max-w-full">
              Full Stack Product Engineer
            </p>
          </Reveal>

          <Reveal delay={0.08} className="hidden lg:block">
            <a
              href="#work"
              className="group block text-right text-sm font-black text-[#f4f1ea]"
            >
              Work
              <span className="mt-5 block h-px w-full bg-[#f4f1ea]/28 transition group-hover:bg-[#d7ff63]" />
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="liquid-glass hero-glass p-4 sm:p-5">
          <GlassRefractionLayer />
          <div className="grid gap-5 text-sm font-semibold text-[#f4f1ea]/78 sm:grid-cols-[1.2fr_1.4fr_1fr] lg:grid-cols-[0.7fr_1.45fr_2fr_0.8fr_1.15fr] lg:items-center">
            <div className="flex items-center gap-3">
              <div className="glass-button flex size-14 shrink-0 items-center justify-center font-mono text-lg font-black leading-none text-white">
                JQ
              </div>
              <div>
                <div className="text-white">Juan Quenga</div>
                <div className="text-[#f4f1ea]/58">Product interfaces</div>
              </div>
            </div>

            <p className="max-w-md leading-6 text-[#f4f1ea]/62">
              I build React products for stores, local businesses, and internal teams.
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-3 text-[#f4f1ea]/72">
              {heroSkills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>

            <a
              href="https://github.com/JuanQuenga"
              className="glass-button inline-flex size-12 items-center justify-center transition hover:border-[#d7ff63]/70 hover:text-[#d7ff63]"
              aria-label="Juan Quenga GitHub"
            >
              <Github className="size-5" />
            </a>

            <div className="flex items-center gap-2 text-[#f4f1ea]/72">
              <MapPin className="size-4 text-[#d7ff63]" />
              Southeast Michigan
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="relative px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 grid gap-6 border-b border-[#f4f1ea]/12 pb-8 lg:grid-cols-[0.78fr_1fr]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f4f1ea]/48">
            Selected Work
          </p>
          <h2 className="max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-normal sm:text-6xl">
            Recent builds.
          </h2>
        </Reveal>

        <div className="divide-y divide-[#f4f1ea]/12 border-y border-[#f4f1ea]/12">
          {projects.map((project) => (
            <ProjectRow key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectRow({
  project,
}: {
  project: (typeof projects)[number];
}) {
  return (
    <Reveal>
      <article className="grid gap-6 py-8 lg:grid-cols-[0.44fr_0.56fr] lg:gap-10 lg:py-12">
        <div>
          <h3 className="text-4xl font-black uppercase leading-none tracking-normal sm:text-5xl">
            {project.title}
          </h3>
          <p className="mt-5 max-w-xl leading-7 text-[#f4f1ea]/64">
            {project.summary}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={project.href}
              className="glass-button glass-button-primary inline-flex h-11 items-center gap-2 px-4 text-xs font-bold uppercase tracking-[0.12em] transition hover:scale-[1.015]"
            >
              Open
              <ArrowUpRight className="size-4" />
            </a>
            {project.githubHref ? (
              <a
                href={project.githubHref}
                className="glass-button inline-flex size-11 items-center justify-center transition hover:border-[#d7ff63]/70 hover:text-[#d7ff63]"
                aria-label={`View ${project.title} on GitHub`}
              >
                <Github className="size-4" />
              </a>
            ) : null}
          </div>
        </div>

        <a
          href={project.href}
          className="glass-frame group block p-2"
          aria-label={`Open ${project.title}`}
        >
            <img
              src={project.screenshotSrc}
              alt={`${project.title} screenshot`}
              loading="lazy"
              className="glass-refract aspect-[16/9] w-full object-cover object-top opacity-90 transition duration-500 group-hover:scale-[1.012] group-hover:opacity-100"
            />
        </a>
      </article>
    </Reveal>
  );
}

function Practice() {
  return (
    <section id="practice" className="relative px-4 py-16 sm:px-6 lg:py-24">
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

function Contact() {
  return (
    <section id="contact" className="relative px-4 py-16 sm:px-6 lg:py-24">
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
