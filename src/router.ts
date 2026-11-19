// Tiny URL <-> app-state router (no dependency). Maps the History API path to a
// view + selected category/event, and back. Pure functions - no store import.
import { categorySlug, type CategoryNode } from '@/data/categories'
import type { PuzzleEvent } from '@/data/events'
import { LANDING_KEYS } from '@/data/landings'
import { featuredByPath, featuredFor, featuredPath } from '@/data/featuredPuzzles.mjs'
import type { View } from '@/store/uiStore'

/** URL path for the custom-puzzle-maker landing page. */
const CUSTOM_KEY = 'create-a-custom-jigsaw-puzzle'

/** A single puzzle's URL parts: category key, raw image id, and the descriptive slug. */
export interface PuzzleRef {
  category: string
  id: string
  slug: string
}

export interface Route {
  view: View
  category: CategoryNode | null
  event: PuzzleEvent | null
  /** 1-based grid page for the category view. */
  page: number
  /** Target puzzle for the puzzle-detail view. */
  puzzle: PuzzleRef | null
  /** Active SEO landing-page key (landing/custom views), else null. */
  landing: string | null
}

/** Kebab-case a string for use in a URL slug. */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Descriptive "<image-name>-by-<author>" slug for a puzzle URL. */
export function puzzleSlug(title: string, author: string): string {
  const t = slugify(title) || 'puzzle'
  const a = slugify(author)
  return a ? `${t}-by-${a}` : t
}

/** Append `?page=N`/`&page=N` only for pages past the first (page 1 = canonical). */
function withPage(path: string, page: number): string {
  if (page <= 1) return path
  return path + (path.includes('?') ? '&' : '?') + 'page=' + page
}

/** Build the URL path for a given app state. */
export function urlForRoute(
  view: View,
  category: CategoryNode | null,
  event: PuzzleEvent | null,
  page = 1,
  puzzle: PuzzleRef | null = null,
  landing: string | null = null,
): string {
  if (view === 'puzzle' && puzzle) {
    // Hand-written puzzle pages live at a short /<category>/<slug> URL.
    const f = featuredFor(puzzle.category, puzzle.id)
    if (f) return featuredPath(f)
    return `/puzzle/${puzzle.category}/${puzzle.id}/${puzzle.slug}`
  }
  if (view === 'event' && event) return '/event/' + event.key
  if (view === 'daily') return '/daily-jigsaw-puzzle'
  if (view === 'custom') return '/' + CUSTOM_KEY
  if (view === 'landing' && landing) return '/' + landing
  if (view === 'categories') return '/categories'
  if (view === 'category' && category) {
    if (category.key === 'search')
      return withPage('/search?q=' + encodeURIComponent(category.query), page)
    return withPage('/' + categorySlug(category.label), page)
  }
  if (view === 'play') return '/play'
  return '/'
}

/** Parse the current browser location into an app state. */
export function parseRoute(): Route {
  const none = { category: null, event: null, page: 1, puzzle: null, landing: null }
  if (typeof window === 'undefined') return { view: 'home', ...none }
  const path = window.location.pathname
  if (path === '/' || path === '') return { view: 'home', ...none }
  // The site is now the home page, the hand-written puzzle pages, the seniors
  // page and the custom puzzle maker. Categories, events, search, the daily
  // puzzle and the generated /puzzle/... pages were removed (the host
  // 301-redirects their URLs to "/"), so anything else lands on home.
  if (path === '/play') return { view: 'play', ...none }
  const featured = featuredByPath(path)
  if (featured) {
    const puzzle = { category: featured.category, id: featured.id, slug: featured.slug }
    return { view: 'puzzle', category: null, event: null, page: 1, puzzle, landing: null }
  }
  const slug = decodeURIComponent(path.replace(/^\/+|\/+$/g, ''))
  if (LANDING_KEYS.has(slug))
    return { view: slug === CUSTOM_KEY ? 'custom' : 'landing', ...none, landing: slug }
  return { view: 'home', ...none }
}

export function currentUrl(): string {
  return window.location.pathname + window.location.search
}
