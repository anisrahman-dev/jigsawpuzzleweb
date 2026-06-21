# 🧩 Jigsaw Studio

A free, **no-login** online jigsaw puzzle game with a warm, gallery-first home.
Browse a curated catalogue of puzzles — Featured, Popular, and category rows of
image cards, each tagged with a piece-count badge — preview one to pick your
difficulty, then solve real interlocking jigsaw pieces with smooth drag-and-drop,
piece-to-piece snapping, and a live timer. Or search millions of photos via the
[Pixabay API](https://pixabay.com/api/docs/).

Built with **React + TypeScript + Vite + Zustand**. No backend, no accounts —
all state lives in the browser.

## Features

- **Gallery-first home** — a spotlight hero plus Featured / Popular / category
  rows of puzzle cards. Each card shows the image, title, and a jigsaw
  piece-count badge; click to open a preview.
- **Preview → play** — a preview modal shows the image big and lets you choose a
  difficulty before starting, so you always know what you're getting into.
- **Browse & search** — filter by category (Nature, Animals, Cities, Flowers,
  Food, Space, Travel, Art), or search Pixabay's library when a key is set.
- **Real jigsaw pieces** — procedurally generated interlocking bézier tabs/blanks;
  neighbouring pieces share the exact same boundary curve so they always fit.
- **Drag & snap** — pieces connect to correct neighbours and lock onto the board;
  connected pieces move together as a group.
- **Difficulties** — Easy (~12) → Expert (~300), grid auto-fit to image aspect.
- **Tools** — preview ghost, re-shuffle, auto-solve, live timer / moves / progress.
- **Warm premium-light theme** — a cozy "sunlit puzzle table" look with cream
  paper surfaces, a serif display type, and a marigold→terracotta accent.
- **Touch & mouse**, fully responsive and keyboard-accessible.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

The app ships with a built-in catalogue of sample puzzles that work with **no
API key** — just run it and start playing.

### Pixabay API key (optional)

To search Pixabay's photo library, add a free key (get one at
<https://pixabay.com/api/docs/>):

- **Per-browser:** open **Settings** in the app and paste your key (stored only
  in your browser's `localStorage`).
- **Site-wide:** copy `.env.example` to `.env` and set
  `VITE_PIXABAY_API_KEY=your_key`, then restart `npm run dev`.

Without a key, the catalogue and category browsing work fully; only live Pixabay
search is unavailable (it falls back to the catalogue with a friendly note).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | Type-check only |

## Architecture

```
src/
  theme.css               warm premium-light design system (tokens + shared classes)
  data/gallery.ts         curated, zero-config puzzle catalogue + sections,
                          categories, hero puzzle & Pixabay-backed searchGallery()
  api/pixabay.ts          Pixabay search + CORS-safe image loading
  engine/
    grid.ts               difficulty presets, grid/board fitting
    pieceGeometry.ts      interlocking jigsaw piece path generator
  store/
    puzzleStore.ts        game state, drag, snapping & win detection
    uiStore.ts            navigation / modals / selection / preview
  components/             gallery (Hero, CategoryNav, PuzzleRow, PuzzleCard,
                          PieceBadge, PreviewModal …), board, HUD, modals
  hooks/                  useTimer, useElementSize
```

The home is driven by `src/data/gallery.ts`, rendered by the gallery components
into rows of cards. Picking a card opens the preview modal; choosing a difficulty
hands off to the puzzle "engine" (geometry + snapping), the core of the app.
Everything reads from the two Zustand stores and is styled entirely from the
design system tokens in `src/theme.css` — no hardcoded colors.

## Deploy

It's a static site — `npm run build` then serve `dist/` on any static host
(Netlify, Vercel, GitHub Pages, Cloudflare Pages …). Set `VITE_PIXABAY_API_KEY`
in the host's build env if you want site-wide Pixabay search.

## Credits

Images via [Pixabay](https://pixabay.com) and catalogue photos via
[Lorem Picsum](https://picsum.photos).
