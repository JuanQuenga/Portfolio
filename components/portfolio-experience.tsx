import { useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { StraitsScene } from "@/components/straits-scene";
import { ThemeSelect } from "@/components/theme-select";

const projects = [
  {
    title: "StatsConnect",
    category: "Player stats platform",
    summary: "Your players, battles, and progress, together.",
    description:
      "Clash Royale and Brawl Stars statistics in one place, with player lookup and Google sign-in.",
    href: "https://statsconnect.app",
    image: "/screenshots/statsconnect.png",
    alt: "StatsConnect home page for Clash Royale and Brawl Stars player statistics",
    tone: "stats",
  },
  {
    title: "Volt",
    category: "Product tool",
    summary: "From a scan to a clearer product record.",
    description:
      "Scanner-first product capture, with review flows for messy item data.",
    href: "https://volt-scanner.vercel.app/",
    image: "/screenshots/volt.png",
    alt: "Volt product scanning and item review interface",
    tone: "volt",
  },
  {
    title: "ClashCrown",
    category: "Gaming companion",
    summary: "A closer look at the competition.",
    description:
      "A Clash Royale companion for player lookup, comparison, and game tools.",
    href: "https://clashcrown.vercel.app/",
    image: "/screenshots/clashcrown.png",
    alt: "ClashCrown Clash Royale player lookup website",
    tone: "clash",
  },
  {
    title: "BrawlStats",
    category: "Player stats",
    summary: "Player data, without the digging.",
    description:
      "Brawl Stars profile lookup that makes player statistics easier to read.",
    href: "https://brawlstatsio.vercel.app/",
    image: "/screenshots/brawlstats.png",
    alt: "BrawlStats website for Brawl Stars player statistics",
    tone: "brawl",
  },
  {
    title: "Herman’s Modern Bakery",
    category: "Business website",
    summary: "A neighborhood bakery, online.",
    description:
      "A storefront with the menu, hours, and location in easy reach on any screen.",
    href: "https://hermans.vercel.app",
    image: "/screenshots/hermans.png",
    alt: "Herman's Modern Bakery storefront website",
    tone: "bakery",
  },
  {
    title: "Multi Auto",
    category: "Service website",
    summary: "A straightforward service experience.",
    description:
      "Responsive service screens built around compact workflows and quick comparisons.",
    href: "https://multi-auto.vercel.app",
    image: "/screenshots/multi-auto.png",
    alt: "Multi Auto responsive automotive service website",
    tone: "auto",
  },
];

export default function PortfolioExperience() {
  const [active, setActive] = useState(0);

  return (
    <div className="portfolio" id="home">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header page-width">
        <a className="brand" href="#home" aria-label="Juan Quenga, home">
          <img src="/favicon.svg" width={40} height={40} alt="" />
          <span>Software engineer</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <ThemeSelect />
        </nav>
      </header>
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <StraitsScene>
            <h1 className="hero-name page-width" id="hero-title">
              Juan Quenga
            </h1>
          </StraitsScene>
          <div className="hero-foot page-width">
            <p className="hero-intro">
              I’m a self-taught software engineer in Southeast Michigan. I build
              websites and web apps that make everyday things a little easier.
            </p>
            <div className="hero-actions">
              <a className="button" href="#work">
                See my work
              </a>
              <a className="quiet-link" href="#contact">
                Get in touch
              </a>
            </div>
            <p className="hero-caption">The Mackinac Bridge, drawn in code</p>
          </div>
        </section>

        <section className="work page-width" id="work" aria-labelledby="work-title">
          <div className="section-head">
            <h2 id="work-title">Selected work</h2>
            <p>
              Product tools, websites for local businesses, and stat companions
              for Clash Royale and Brawl Stars.
            </p>
          </div>
          <div
            className="work-index"
            style={{ gridTemplateRows: `repeat(${projects.length}, auto) 1fr` }}
          >
            {projects.map((project, index) => (
              <article
                className="work-item"
                data-tone={project.tone}
                data-active={index === active}
                key={project.title}
              >
                <a
                  className="work-row"
                  style={{ gridRow: index + 1 }}
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                >
                  <span className="work-lamp" aria-hidden="true" />
                  <h3>{project.title}</h3>
                  <span className="work-kind">{project.category}</span>
                  <ArrowUpRight className="work-arrow" size={22} aria-hidden="true" />
                  <span className="sr-only">, opens in a new tab</span>
                </a>
                <figure className="work-figure">
                  <div className="work-screen">
                    <img
                      src={project.image}
                      alt={project.alt}
                      width={1440}
                      height={900}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                  <figcaption>
                    <strong>{project.summary}</strong> {project.description}
                  </figcaption>
                </figure>
              </article>
            ))}
          </div>
        </section>

        <section className="about page-width" id="about" aria-labelledby="about-title">
          <h2 id="about-title">
            I like figuring things out, then making them work for someone else.
          </h2>
          <div className="about-body">
            <p>
              I’m self-taught and work across the frontend and backend. My
              projects range from game statistics to product scanning and
              websites for local businesses.
            </p>
            <p>
              I care about readable interfaces and the code behind them. Most
              days that means TypeScript and React, with Next.js, TanStack,
              Convex, and Tailwind CSS connecting what people see with the data
              they need.
            </p>
            <a
              className="quiet-link"
              href="https://github.com/JuanQuenga"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={18} aria-hidden="true" /> Read my code on GitHub
              <span className="sr-only">, opens in a new tab</span>
            </a>
          </div>
        </section>

        <section className="contact" id="contact" aria-labelledby="contact-title">
          <div className="page-width">
            <h2 id="contact-title">Tell me what you’re working on.</h2>
            <p className="contact-note">
              Hiring for your team or planning a project? Email is the quickest
              way to reach me.
            </p>
            <div className="contact-intents">
              <a href="mailto:juanquenga@gmail.com?subject=Engineering%20opportunity">
                Discuss a role
              </a>
              <a href="mailto:juanquenga@gmail.com?subject=New%20project%20inquiry">
                Start a project
              </a>
            </div>
            <a
              className="contact-email"
              href="mailto:juanquenga@gmail.com?subject=Let%E2%80%99s%20work%20together"
            >
              juanquenga@gmail.com
            </a>
          </div>
        </section>
      </main>
      <footer className="site-footer page-width">
        <span>Juan Quenga, built in Michigan.</span>
        <a href="https://github.com/JuanQuenga" target="_blank" rel="noreferrer">
          GitHub
          <span className="sr-only">, opens in a new tab</span>
        </a>
        <a href="#home">Back to top</a>
      </footer>
    </div>
  );
}
