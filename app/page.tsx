import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import DotGridShader from "@/components/DotGridShader";

import ProjectCard from "@/components/project-card";
import AnimatedHeading from "@/components/animated-heading";
import RevealOnView from "@/components/reveal-on-view";

export default function Page() {
  const projects = [
    {
      title: "Kaizen Customs",
      subtitle: "NextJS Shopify Site",
      imageSrc: "/images/project-1.webp",
      tags: ["NextJS", "Shopify", "Typescript", "Tailwind"],
      href: "#kaizen",
      priority: true,
      gradientFrom: "#0f172a",
      gradientTo: "#6d28d9",
      screenshotSrc: "/screenshots/kaizen.png",
      githubHref: "https://github.com/kaizen-customs/kaizen-customs",
    },
    {
      title: "Piggies US",
      subtitle: "Social Media Site",
      imageSrc: "/images/project-2.webp",
      tags: [
        "NextJS",
        "Convex",
        "AuthKit",
        "Typescript",
        "Tailwind",
        "Polar.sh",
      ],
      href: "#piggies",
      priority: false,
      gradientFrom: "#111827",
      gradientTo: "#2563eb",
      screenshotSrc: "/screenshots/piggies.png",
      githubHref: "https://github.com/piggies-us/piggies-us",
    },
    {
      title: "PayMore Eletronics",
      subtitle: "E-Commerce Tools",
      imageSrc: "/images/project-3.webp",
      tags: ["NextJS", "Convex", "AuthKit", "Typescript", "Tailwind"],
      href: "#paymore",
      priority: false,
      gradientFrom: "#0b132b",
      gradientTo: "#5bc0be",
      screenshotSrc: "/screenshots/paymore.png",
      githubHref: "https://github.com/paymore-eletronics/paymore-eletronics",
    },
    // {
    //   title: "CareConnect — Patient portal",
    //   subtitle: "Accessibility‑first UI",
    //   imageSrc: "/images/project-4.webp",
    //   tags: ["A11y", "Web App", "Health"],
    //   href: "#project-4",
    //   priority: false,
    //   gradientFrom: "#0f172a",
    //   gradientTo: "#10b981",
    // },
    // {
    //   title: "Aurora — Creative portfolio",
    //   subtitle: "Motion & interaction design",
    //   imageSrc: "/images/project-5.webp",
    //   tags: ["Portfolio", "Animation", "UI/UX"],
    //   href: "#project-5",
    //   priority: false,
    //   gradientFrom: "#1f2937",
    //   gradientTo: "#8b5cf6",
    // },
    // {
    //   title: "Hydra — AI assistant",
    //   subtitle: "Conversational product UX",
    //   imageSrc: "/images/project-6.webp",
    //   tags: ["AI", "SaaS", "Product"],
    //   href: "#project-6",
    //   priority: false,
    //   gradientFrom: "#0b132b",
    //   gradientTo: "#10b981",
    // },
  ];

  return (
    <main className="bg-neutral-950 text-white">
      {/* HERO: full-viewport row. Left is sticky; right scrolls internally. */}
      <section className="px-4 pt-4 pb-16 lg:pb-4">
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[420px_1fr]">
          {/* LEFT: sticky and full height, no cut off */}
          <aside className="lg:sticky lg:top-4 lg:h-[calc(100svh-2rem)]">
            <RevealOnView
              as="div"
              intensity="hero"
              className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 p-6 sm:p-8"
              staggerChildren
            >
              {/* Texture background */}
              <div className="pointer-events-none absolute inset-0 opacity-5 mix-blend-soft-light">
                <DotGridShader />
              </div>
              <div>
                {/* Wordmark */}
                <div className="mb-8 flex items-center gap-2">
                  <div className="text-2xl font-extrabold tracking-tight">
                    juan quenga
                  </div>
                  {/* <div
                    className="h-2 w-2 rounded-full bg-white/60"
                    aria-hidden="true"
                  /> */}
                  {/* Put the michigan.svg here */}
                  <Image
                    src="/icons/michigan.svg"
                    alt="Michigan"
                    width={20}
                    height={20}
                    className="brightness-0 invert"
                  />
                </div>

                {/* Headline with intro blur effect */}
                <AnimatedHeading
                  className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl"
                  lines={["I build solutions", "that solve problems"]}
                />

                <p className="mt-4 max-w-[42ch] text-lg text-white/70">
                  I'm a software engineer based in southeast Michigan,
                  passionate about building scalable and maintainable solutions.
                  I leverage modern web technologies to tackle complex
                  challenges and deliver solutions that create meaningful
                  impact.
                </p>

                {/* CTAs */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button asChild size="lg" className="rounded-full">
                    <Link
                      href="mailto:juanquenga@gmail.com?subject=Let's work together&body=Hi Juan, I'd like to discuss a potential project with you."
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Hire me
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* Trusted by */}
                <div className="mt-10">
                  <p className="mb-3 text-xs font-semibold tracking-widest text-white/50">
                    COMPANIES I'VE WORKED WITH
                  </p>
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-2xl font-black text-white/25 sm:grid-cols-3">
                    <li>Piggies</li>
                    <li>Kaizen</li>
                    <li>Herman's</li>
                    <li>PayMore</li>
                    <li>Papito</li>
                  </ul>
                </div>
              </div>
            </RevealOnView>
          </aside>

          {/* RIGHT: simplified, no internal card or horizontal carousel */}
          <div className="space-y-4">
            {projects.map((p, idx) => (
              <ProjectCard
                key={p.title}
                title={p.title}
                subtitle={p.subtitle}
                imageSrc={p.imageSrc}
                screenshotSrc={p.screenshotSrc}
                tags={p.tags}
                href={p.href}
                githubHref={p.githubHref}
                priority={p.priority}
                gradientFrom={p.gradientFrom}
                gradientTo={p.gradientTo}
                imageContainerClassName="lg:h-full"
                containerClassName="lg:h-[calc(100svh-2rem)]"
                revealDelay={idx * 0.06}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
