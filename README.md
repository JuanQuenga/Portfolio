# Juan Quenga - Portfolio

A modern, responsive portfolio website built with TanStack Start, React 19, and Tailwind CSS v4.

## Live site

[View Portfolio](https://www.juanquenga.com)

## Features

- Screenshot-led portfolio with native section navigation
- Responsive design for mobile, tablet, and desktop
- Six project previews with live-site links
- Live canvas illustration of the Mackinac Bridge in the hero (`components/straits-scene.tsx`)
- Separate contact paths for hiring and project inquiries
- TanStack Start SSR build powered by Vite and Nitro

## Tech stack

- **Framework**: TanStack Start with React 19
- **Routing**: TanStack Router file-based routes
- **Build Tool**: Vite
- **Server Build**: Nitro
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Package Manager**: pnpm
- **TypeScript**: Strict type checking

## Main files

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
│   └── portfolio-experience.tsx
├── scripts/check-portfolio.mjs
├── public/
│   ├── images/
│   ├── icons/
│   └── screenshots/
├── vite.config.ts
└── package.json
```

## Run locally

### Prerequisites

- Node.js 20.19+ or 22.12+, including newer supported releases
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

Open the local URL printed by Vite. It uses HTTPS when both `.certs/dev-cert.pem` and `.certs/dev-key.pem` exist, and HTTP otherwise. Local certificates are ignored by Git. The existing Vite configuration also allows access from your local network.

### Checks

Run the typecheck, then check a running preview:

```bash
pnpm exec tsc --noEmit
node scripts/check-portfolio.mjs http://localhost:3000
```

For a local HTTPS certificate created with mkcert, trust its CA for the check:

```bash
NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem" node scripts/check-portfolio.mjs https://localhost:3000
```

The script checks server-rendered content, section destinations, contact links, project previews, and removal of the excluded project. Also inspect desktop and mobile layouts in a browser.

### Production

```bash
pnpm build
pnpm start
```

## Customization

Add or edit projects in `components/portfolio-experience.tsx` inside the `projects` array.

Global styles and Tailwind v4 theme variables live in `src/styles/app.css`.

## Contact

Juan Quenga - [juanquenga@gmail.com](mailto:juanquenga@gmail.com)

Project Link: [https://github.com/JuanQuenga/Portfolio](https://github.com/JuanQuenga/Portfolio)
