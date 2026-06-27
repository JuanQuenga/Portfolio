# Juan Quenga - Portfolio

A modern, responsive portfolio website built with TanStack Start, React 19, and Tailwind CSS v4.

## Live Demo

[View Portfolio](https://www.juanquenga.com)

## Features

- Modern portfolio layout with smooth reveal animations
- Responsive design for mobile, tablet, and desktop
- Project cards with screenshots, demo links, and GitHub links
- Tailwind CSS v4 styling with shadcn-style CSS variables
- TanStack Start SSR build powered by Vite and Nitro

## Tech Stack

- **Framework**: TanStack Start with React 19
- **Routing**: TanStack Router file-based routes
- **Build Tool**: Vite
- **Server Build**: Nitro
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives with custom styling
- **Animations**: Motion
- **Icons**: Lucide React
- **Package Manager**: pnpm
- **TypeScript**: Strict type checking

## Project Structure

```text
Portfolio/
├── src/
│   ├── routes/
│   │   ├── __root.tsx
│   │   └── index.tsx
│   ├── router.tsx
│   ├── routeTree.gen.ts
│   └── styles/app.css
├── components/
│   ├── ui/
│   ├── animated-heading.tsx
│   ├── project-card.tsx
│   └── reveal-on-view.tsx
├── hooks/
├── lib/
├── public/
│   ├── images/
│   ├── icons/
│   └── screenshots/
├── vite.config.ts
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Installation

```bash
git clone https://github.com/JuanQuenga/Portfolio.git
cd Portfolio
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production

```bash
pnpm build
pnpm start
```

## Customization

Add or edit projects in `src/routes/index.tsx` inside the `projects` array.

Global styles and Tailwind v4 theme variables live in `src/styles/app.css`.

## Contact

Juan Quenga - [juanquenga@gmail.com](mailto:juanquenga@gmail.com)

Project Link: [https://github.com/JuanQuenga/Portfolio](https://github.com/JuanQuenga/Portfolio)
