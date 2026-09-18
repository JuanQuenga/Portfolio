import { ArrowDown, ArrowUpRight, Github } from "lucide-react";

const projects = [
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
    title: "Herman's Modern Bakery",
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
const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "TanStack",
  "Convex",
  "Tailwind CSS",
];

export default function PortfolioExperience() {
  return (
    <div className="portfolio">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header page-width">
        <a className="brand" href="#home" aria-label="Juan Quenga, home">
          <span className="brand-mark" aria-hidden="true">
            jq<span>.</span>
          </span>
          <span>
            Juan Quenga<span className="brand-role">Software engineer</span>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">
            Let’s talk <ArrowUpRight aria-hidden="true" size={15} />
          </a>
        </nav>
      </header>
      <main id="main">
        <section
          className="hero page-width"
          id="home"
          aria-labelledby="hero-title"
        >
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="blue-dot" /> Software engineer in Southeast
              Michigan
            </p>
            <h1 id="hero-title">
              Ideas into
              <br />
              <span>interfaces.</span>
            </h1>
            <p className="hero-intro">
              I’m Juan, a self-taught software engineer in Southeast Michigan. I
              build thoughtful websites and web apps that make everyday things a
              little easier.
            </p>
            <div className="hero-actions">
              <a className="button button-blue" href="#work">
                Explore my work <ArrowDown aria-hidden="true" size={17} />
              </a>
              <a className="text-link" href="#contact">
                Have something in mind?{" "}
                <ArrowUpRight aria-hidden="true" size={17} />
              </a>
            </div>
          </div>
          <a
            className="hero-art"
            href="https://volt-scanner.vercel.app/"
            target="_blank"
            rel="noreferrer"
            aria-label="Explore Volt, featured project, opens in a new tab"
          >
            <div className="art-grid" aria-hidden="true" />
            <span className="art-label">A closer look at Volt</span>
            <span className="art-asterisk" aria-hidden="true">
              ✳
            </span>
            <div className="browser-window">
              <div className="browser-bar" aria-hidden="true">
                <span />
                <span />
                <span />
                <p>volt-scanner.vercel.app</p>
                <ArrowUpRight size={12} />
              </div>
              <img
                src="/screenshots/volt.png"
                alt="Volt's product scanning interface"
                width={1440}
                height={900}
                fetchPriority="high"
              />
            </div>
            <span className="art-project">
              Meet Volt <ArrowUpRight size={18} aria-hidden="true" />
            </span>
          </a>
          <div className="hero-bottom">
            <span>Design-minded. Detail-driven.</span>
            <span>
              Scroll to see what I’ve been building{" "}
              <ArrowDown size={14} aria-hidden="true" />
            </span>
          </div>
        </section>
        <section
          className="work-section"
          id="work"
          aria-labelledby="work-title"
        >
          <div className="page-width">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Selected work</p>
                <h2 id="work-title">Made real.</h2>
              </div>
              <p>
                Useful tools. Local businesses.
                <br />A few things I’ve put out into the world.
              </p>
            </div>
            <div className="project-grid">
              {projects.map((project) => (
                <article
                  className={`project project-${project.tone}`}
                  key={project.title}
                >
                  <a
                    className="project-image-link"
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Visit ${project.title}, opens in a new tab`}
                  >
                    <div className="project-image-top">
                      <span>{project.category}</span>
                      <ArrowUpRight aria-hidden="true" size={21} />
                    </div>
                    <div className="project-screen">
                      <img
                        src={project.image}
                        alt={project.alt}
                        width={1440}
                        height={900}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <span className="project-visit">
                      Explore live site{" "}
                      <ArrowUpRight aria-hidden="true" size={16} />
                    </span>
                  </a>
                  <div className="project-info">
                    <div>
                      <h3>
                        <a href={project.href} target="_blank" rel="noreferrer">
                          {project.title}
                          <span className="sr-only">, opens in a new tab</span>
                        </a>
                      </h3>
                      <p className="project-summary">{project.summary}</p>
                    </div>
                    <p className="project-description">{project.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          className="about-section page-width"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="about-heading">
            <p className="eyebrow">A little about me</p>
            <h2 id="about-title">
              Curious by nature.
              <br />
              <span>Builder by choice.</span>
            </h2>
            <div className="location">
              <span className="blue-dot" /> Southeast Michigan, USA
            </div>
          </div>
          <div className="about-copy">
            <p className="about-lead">
              I like figuring things out, then making them work for someone
              else.
            </p>
            <p>
              I’m a self-taught software engineer working across the frontend
              and backend. My projects range from game statistics to product
              scanning and websites for local businesses.
            </p>
            <p>
              I care about readable interfaces and the code behind them. I work
              with TypeScript, React, and modern web tools to connect what
              people see with the data they need.
            </p>
            <div className="skill-list" aria-label="Technologies I work with">
              {skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
            <a
              className="text-link"
              href="https://github.com/JuanQuenga"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={18} aria-hidden="true" /> A look at my code{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only">, opens in a new tab</span>
            </a>
          </div>
        </section>
        <section
          className="contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="page-width">
            <p className="eyebrow">What’s next?</p>
            <div className="contact-heading">
              <h2 id="contact-title">
                Good things start
                <br />
                with a hello.
              </h2>
              <a
                className="contact-arrow"
                href="mailto:juanquenga@gmail.com?subject=Let%E2%80%99s%20work%20together"
                aria-label="Email Juan to work together"
              >
                <ArrowUpRight size={64} strokeWidth={1.3} aria-hidden="true" />
              </a>
            </div>
            <div className="contact-intents">
              <a href="mailto:juanquenga@gmail.com?subject=Engineering%20opportunity">
                Discuss a role <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a href="mailto:juanquenga@gmail.com?subject=New%20project%20inquiry">
                Start a project <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
            <div className="contact-bottom">
              <p>
                Hiring for your team or planning a project?
                <br />
                I’d like to hear what you’re working on.
              </p>
              <a href="mailto:juanquenga@gmail.com?subject=Let%E2%80%99s%20work%20together">
                juanquenga@gmail.com{" "}
                <ArrowUpRight size={20} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer page-width">
        <a
          href="#home"
          className="footer-name"
          aria-label="Juan Quenga, back to top"
        >
          Juan Quenga<span>↗</span>
        </a>
        <div className="footer-bottom">
          <span>Built with care in Michigan.</span>
          <a
            href="https://github.com/JuanQuenga"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <ArrowUpRight size={14} aria-hidden="true" />
            <span className="sr-only">, opens in a new tab</span>
          </a>
          <a href="#home">
            Back to top <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </div>
  );
}
