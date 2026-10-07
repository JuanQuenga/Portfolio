/// <reference types="vite/client" />

import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

import appCss from "@/src/styles/app.css?url";

const description =
  "Juan Quenga is a software engineer in southeast Michigan building web apps, business websites, and practical tools with React and TypeScript. Explore selected work and get in touch.";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Juan Quenga | Software engineer" },
      { name: "description", content: description },
      { property: "og:title", content: "Juan Quenga | Software engineer" },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://www.juanquenga.com" },
      { property: "og:site_name", content: "Juan Quenga Portfolio" },
      { property: "og:locale", content: "en_US" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Juan Quenga | Software engineer" },
      { name: "twitter:description", content: description },
    ],
    links: [
      { rel: "canonical", href: "https://www.juanquenga.com" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Overpass:ital,wght@0,100..900;1,100..900&display=swap",
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  component: Outlet,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          storageKey="portfolio-theme"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
