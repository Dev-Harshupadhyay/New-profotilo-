# Harsh Upadhyay — Full-Stack Developer Portfolio

<div align="center">
  <a href="https://new-profotilo-flame.vercel.app/">
    <img src="https://i.ibb.co/KpZMRvwY/image.png" alt="Harsh Upadhyay Portfolio Banner" width="100%">
  </a>
</div>

A modern, high-performance, responsive developer portfolio built with React, TypeScript, Vite, and Tailwind CSS. Designed with clean UI components, interactive states, and smooth performance.

---

## 🚀 Live Demos & Featured Showcase Projects

| Project Name | Stack & Focus | Live URL & Deployment |
|---|---|---|
| **Cinevood** | Media Streaming & Content Platform | [![Render](https://img.shields.io/badge/Render-%46E3B7?style=flat&logo=render&logoColor=white)](https://cinenvood.onrender.com) [cinenvood.onrender.com](https://cinenvood.onrender.com) |
| **Tarzau** | Web Application & Interactive UI | [![Netlify](https://img.shields.io/badge/Netlify-%2300C7B7?style=flat&logo=netlify&logoColor=white)](https://tarzau.netlify.app) [tarzau.netlify.app](https://tarzau.netlify.app) |
| **Climatek** | Environmental & Climate Tech Hub | [![Netlify](https://img.shields.io/badge/Netlify-%2300C7B7?style=flat&logo=netlify&logoColor=white)](https://climatek.netlify.app) [climatek.netlify.app](https://climatek.netlify.app) |

---

## 🌟 Key Features & Architecture

- **⚡ Vite + React + TS**: Lightning-fast build tooling combined with strong typing for robust component architecture.
- **🎨 Tailwind CSS Styling**: Fully responsive, utility-first styling system tailored for modern web aesthetics.
- **⌨️ Command Palette**: Press `Ctrl+K` (desktop) or tap the floating button (mobile) to jump to any section or project.
- **♿ Accessibility-first controls**: Consolidated button system with visible keyboard focus states on every interactive element.
- **🛠️ Tech Stack & Skills**:
  - **Frontend Architecture**: <img src="https://skillicons.dev/icons?i=react,ts,tailwind,vite" height="24" alt="Frontend"/> React, TypeScript, Tailwind CSS, Vite
  - **Backend & Database**: <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,firebase" height="24" alt="Backend"/> Node.js, Express.js, MongoDB, Firebase
  - **DevOps & Tools**: <img src="https://skillicons.dev/icons?i=git,github,vercel,linux" height="24" alt="Tools"/> Git, GitHub, Vercel, Linux, Termux

---

## 🎨 Button System

All buttons use the shared `Button` component (`src/components/ui/button.tsx`) and resolve to **5 consistent visual styles**:

| Variant | Purpose | Where it's used |
|---|---|---|
| `pill` | Primary solid CTA | Hero, Contact, Navbar "Let's talk", 404 page |
| `pill-outline` | Secondary bordered CTA (inverts on hover) | "View Resume", "Explore Projects" |
| `pill-soft` | Subtle tertiary action | "Show more" (Projects) |
| `glass` / `glass-dark` | Translucent controls on dark surfaces & media overlays | Project modal links, carousel arrows, modal close, Footer "Back to top" |
| `quiet` | Borderless circular icon buttons | Theme toggle, menu open/close |

Sizes: `pill-sm`, `pill-lg`, `icon-sm`, `icon-lg` (plus default shadcn sizes). Filter chips in Projects reuse the pill language with an active/inactive state.

---

## 🏃‍♂️ Getting Started

### Prerequisites

- **Node.js** 24.x (or ≥ 20.19)
- npm (comes with Node)

### Install & Run

```bash
# 1. Clone the repository
git clone https://github.com/Dev-Harshupadhyay/New-profotilo-.git
cd New-profotilo-

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The site will be available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run build:dev` | Production build in development mode |
| `npm run lint` | Run ESLint over the project |
| `npm run preview` | Preview the production build locally |

---

## 📂 Project Directory Structure

```text
New-profotilo-/
├── public/                     # Static assets (favicon, images, gifs)
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitives (button, dialog, command, …)
│   │   ├── About.tsx           # About + skills sections
│   │   ├── CommandPalette.tsx  # Ctrl+K command palette (desktop)
│   │   ├── Contact.tsx         # Contact section & CTA card
│   │   ├── FAQ.tsx             # Accordion FAQ
│   │   ├── Footer.tsx          # Footer with social links
│   │   ├── Hero.tsx            # Hero section with badge & CTAs
│   │   ├── MobileCommandDialog.tsx / MobileFAB.tsx  # Mobile command palette + FAB
│   │   ├── Navbar.tsx          # Sticky navbar + mobile sheet menu
│   │   ├── Preloader.tsx       # Intro preloader
│   │   ├── ProjectDetailModal.tsx # Project detail lightbox with gallery
│   │   ├── Projects.tsx        # Projects grid with filters
│   │   └── ThemeToggle.tsx     # Light/dark theme switch
│   ├── data/                   # projects.ts data source
│   ├── hooks/                  # use-mobile, use-toast, scroll animation hooks
│   ├── lib/                    # utils (cn), aiSearch, imagePreloader
│   ├── pages/                  # Index, NotFound
│   ├── App.tsx                 # Router + global chrome
│   └── index.css               # Tailwind + design tokens (CSS variables)
├── index.html                  # Main HTML entry point
├── package.json                # Dependencies & scripts
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite bundler configuration
```

---

## ♿ Accessibility Notes

- Every interactive element (buttons, filter chips, carousel arrows/dots, FABs) has a visible `focus-visible` ring for keyboard users.
- Interactive links that look like buttons use a single interactive element (no nested `<button>` inside `<a>`).
- Icon-only controls carry `aria-label`s (menu, close, carousel, theme toggle).
- Theme colors are defined as CSS variables with light/dark pairs to keep text contrast WCAG-friendly.

---

## 📦 Deployment

The site deploys to **Vercel** automatically from the `main` branch:

```bash
npm run build   # outputs static site to dist/
```

Live: [new-profotilo-flame.vercel.app](https://new-profotilo-flame.vercel.app/)

---

## 📄 License

Personal portfolio project — all rights reserved by Harsh Upadhyay.
