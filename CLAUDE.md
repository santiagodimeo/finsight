# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server on 0.0.0.0:3000
npm run build    # production build
npm run start    # start production server on 0.0.0.0:3000
npx tsc --noEmit # type-check without emitting
```

No test suite is configured. Type-checking via `npx tsc --noEmit` is the primary correctness gate.

## Architecture

Next.js 15 App Router project. All UI is in `app/` (layout + page) and `components/`. No API routes exist yet — the backend integration is pending.

### State ownership

`app/page.tsx` is the single state owner for the entire app. It holds `uploadedFiles` (File[]) and `messages` (Message[]) and passes them down as props. Components are controlled — they receive state and callbacks, they do not manage their own top-level data.

### Components

| Component | Role |
|---|---|
| `Chat` | Scrollable message history + input form. Receives `messages` and `onSend`. |
| `Dashboard` | 4 static stat cards. Only live prop is `documentCount` from `uploadedFiles.length`. |
| `FileUpload` | Drag-and-drop + file picker. Accepts PDF, CSV, PNG, JPG. Appends to parent's `uploadedFiles`. |

### Design system

The SRCL (sacred.computer) terminal aesthetic is applied via CSS custom properties only — not npm components. `app/srcl.css` is the raw global.css fetched from the `internet-development/www-sacred` GitHub repo. It is imported before Tailwind in `app/globals.css`:

```css
@import "./srcl.css";
@import "tailwindcss";
```

`app/layout.tsx` applies `className="theme-light"` to `<body>` to activate the SRCL token set.

**Rule**: use Tailwind for layout/spacing; use SRCL CSS variables via inline `style` props for all colours, borders, and backgrounds. Never use Tailwind colour utilities (`bg-*`, `text-*`, `border-*` for colours) — use `var(--theme-*)` instead.

Key SRCL tokens:
- `--theme-background` — page background (white)
- `--theme-background-input` — card/input fill (gray-89)
- `--theme-border` — all borders
- `--theme-text` — primary text
- `--theme-button` / `--theme-button-text` — action buttons

**Hydration rule**: never call `Math.random()` or `Date.now()` outside a `useEffect`. SRCL's CSS reset overrides Tailwind's `border-box` on `<span>` — always set `boxSizing: 'border-box'` and `display: 'inline-block'` on bubble spans to avoid clipping.

### Path alias

`@/*` maps to the repo root (see `tsconfig.json`). Import components as `@/components/Foo`.

## Deployment

Configured for Replit Cloud Run via `.replit`. The `--hostname 0.0.0.0` flag in all npm scripts is required for Replit to expose port 3000 → 80. Deploy via the Replit Deploy button; it runs `npm run build` then `npm run start`.

## Pending work

- Wire `Chat` and `FileUpload` to the finsight-server RAG API (FastAPI, Supabase, at `/Users/work/Development/Projects/finsight-server`).
- `Dashboard` stat cards (Total Spending, Total Income, Largest Transaction) are hardcoded to `$0.00` and need real data from the backend.
