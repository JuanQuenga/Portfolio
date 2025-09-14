import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import RevealOnView from "@/components/reveal-on-view";

type Props = {
  title?: string;
  subtitle?: string;
  imageSrc?: string;
  screenshotSrc?: string;
  tags?: string[];
  href?: string;
  githubHref?: string;
  priority?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  imageContainerClassName?: string;
  containerClassName?: string;
  revealDelay?: number;
};

// Server Component (no client hooks)
export default function ProjectCard({
  title = "Project title",
  subtitle = "Project subtitle",
  imageSrc = "/placeholder.svg?height=720&width=1280",
  screenshotSrc,
  tags = ["Design", "Web"],
  href = "#",
  githubHref,
  priority = false,
  gradientFrom = "#0f172a",
  gradientTo = "#6d28d9",
  imageContainerClassName,
  containerClassName,
  revealDelay = 0,
}: Props) {
  return (
    <article className={cn("group relative", containerClassName)}>
      <RevealOnView
        delay={revealDelay}
        className="rounded-3xl border border-white/10 p-1 shadow-[0_10px_60px_-10px_rgba(0,0,0,0.6)] lg:h-full"
        style={{
          backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        }}
      >
        <div className="relative overflow-hidden rounded-[1.35rem] bg-black lg:h-full">
          {/* Screenshot placeholder */}
          <div
            className={cn(
              "relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:h-full bg-gray-900/50 border border-white/10",
              imageContainerClassName
            )}
          >
            <div className="absolute inset-4 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-lg border border-white/10 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-white/60 font-medium">Screenshot</p>
                <p className="text-xs text-white/40 mt-1">{title}</p>
              </div>
            </div>
            {/* Show background image if provided */}
            {imageSrc && imageSrc !== "/placeholder.svg" && (
              <Image
                src={imageSrc}
                alt={title}
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                priority={priority}
                className="object-cover opacity-20 blur-xl"
              />
            )}

            {/* Show screenshot as contained image if provided */}
            {screenshotSrc && (
              <div className="absolute inset-4 flex items-center justify-center">
                <div className="relative max-w-full max-h-full rounded-lg overflow-hidden border border-white/20 shadow-2xl">
                  <Image
                    src={screenshotSrc}
                    alt={title}
                    width={800}
                    height={600}
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    priority={priority}
                    className="object-contain"
                  />
                </div>
              </div>
            )}
            {/* Subtle vignette */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
          </div>

          {/* Top-left tags */}
          <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2">
            {tags.map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="pointer-events-auto bg-black/50 text-white border-white/20 backdrop-blur-sm"
              >
                {t}
              </Badge>
            ))}
          </div>

          {/* Bottom content */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold sm:text-xl">{title}</h3>
                <p className="text-sm text-white/70">{subtitle}</p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {githubHref && (
                  <Link
                    href={githubHref}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur transition-colors hover:bg-white/20"
                    aria-label={`View GitHub repository: ${title}`}
                  >
                    <Image
                      src="/icons/GitHub_Invertocat_Light.svg"
                      alt="GitHub"
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                  </Link>
                )}
                <Link
                  href={href}
                  className=" inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-medium backdrop-blur transition-colors hover:bg-white/20"
                  aria-label={`Open Demo: ${title}`}
                >
                  View Demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </RevealOnView>
    </article>
  );
}
