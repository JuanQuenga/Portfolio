# Juan Quenga - Portfolio

A modern, responsive portfolio website built with Next.js 15, showcasing my work as an aspiring software engineer based in Michigan.

## 🚀 Live Demo

[View Portfolio](https://juanquenga.vercel.app)

## ✨ Features

- **Modern Design**: Clean, professional layout with smooth animations
- **Responsive**: Fully responsive design that works on all devices
- **Interactive Elements**: Hover effects, reveal animations, and smooth transitions
- **Project Showcase**: Dynamic project cards with screenshots and GitHub links
- **Performance Optimized**: Built with Next.js 15 and optimized for speed
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI primitives with custom styling
- **Animations**: Motion library for smooth transitions
- **Icons**: Lucide React
- **Fonts**: Geist font family
- **Package Manager**: pnpm
- **TypeScript**: Full type safety

## 📦 Key Dependencies

- `next` - React framework
- `react` & `react-dom` - UI library
- `tailwindcss` - Utility-first CSS framework
- `@radix-ui/*` - Accessible UI primitives
- `motion` - Animation library
- `lucide-react` - Icon library
- `class-variance-authority` - Component variant management
- `tailwind-merge` - Tailwind class merging utility

## 🏗️ Project Structure

````
portfolio-nextjs/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── animated-heading.tsx
│   ├── project-card.tsx
│   ├── reveal-on-view.tsx
│   └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
│   ├── images/          # Project images
│   ├── icons/           # SVG icons
│   └── screenshots/     # Project screenshots
└── styles/              # Additional styles
```f

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/juanquenga/portfolio-nextjs.git
   cd portfolio-nextjs
````

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## 🎨 Customization

### Adding New Projects

Edit `app/page.tsx` and add new project objects to the `projects` array:

```typescript
{
  title: "Your Project",
  subtitle: "Project description",
  imageSrc: "/images/your-project.webp",
  tags: ["NextJS", "TypeScript", "Tailwind"],
  href: "#your-project",
  priority: false,
  gradientFrom: "#0f172a",
  gradientTo: "#6d28d9",
  screenshotSrc: "/screenshots/your-project.png",
  githubHref: "https://github.com/yourusername/your-project",
}
```

### Updating Personal Information

Modify the hero section in `app/page.tsx`:

- Update name, bio, and contact information
- Replace the Michigan icon with your location
- Update the companies list
- Modify the call-to-action button

### Styling

- Global styles: `app/globals.css`
- Component styles: Individual component files
- Tailwind config: `tailwind.config.js`

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints:

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## ⚡ Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Image Optimization**: Next.js Image component with proper sizing
- **Code Splitting**: Automatic route-based code splitting
- **Bundle Analysis**: Use `pnpm build` to analyze bundle size

## 🔧 Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/juanquenga/portfolio-nextjs/issues).

## 📞 Contact

Juan Quenga - [juanquenga@gmail.com](mailto:juanquenga@gmail.com)

Project Link: [https://github.com/juanquenga/portfolio-nextjs](https://github.com/juanquenga/portfolio-nextjs)

---

⭐ Star this repo if you found it helpful!
