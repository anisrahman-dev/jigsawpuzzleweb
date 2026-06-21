// Tiny URL <-> app-state router (no dependency). Maps the History API path to a
// view + selected category/event, and back. Pure functions - no store import.
import { categoryBySlug, categorySlug, type CategoryNode } from '@/data/categories'
import { eventByKey, type PuzzleEvent } from '@/data/events'
import type { View } from '@/store/uiStore'

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
): string {
  if (view === 'puzzle' && puzzle)
    return `/puzzle/${puzzle.category}/${puzzle.id}/${puzzle.slug}`
  if (view === 'event' && event) return '/event/' + event.key
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
  const none = { category: null, event: null, page: 1, puzzle: null }
  if (typeof window === 'undefined') return { view: 'home', ...none }
  const path = window.location.pathname
  const pageParam = Number(new URLSearchParams(window.location.search).get('page'))
  const page = Number.isInteger(pageParam) && pageParam > 1 ? pageParam : 1
  if (path === '/' || path === '') return { view: 'home', ...none }
  if (path === '/categories') return { view: 'categories', ...none }
  if (path === '/play') return { view: 'play', ...none }
  if (path.startsWith('/puzzle/')) {
    const parts = path.split('/').filter(Boolean) // ['puzzle', category, id, ...slug]
    if (parts.length >= 3) {
      const puzzle = {
        category: decodeURIComponent(parts[1]),
        id: decodeURIComponent(parts[2]),
        slug: parts.slice(3).map(decodeURIComponent).join('/'),
      }
      return { view: 'puzzle', category: null, event: null, page: 1, puzzle }
    }
    return { view: 'home', ...none }
  }
  if (path.startsWith('/event/')) {
    const key = decodeURIComponent(path.slice('/event/'.length))
    const event = eventByKey(key)
    if (event) return { view: 'event', category: null, event, page: 1, puzzle: null }
    return { view: 'home', ...none }
  }
  if (path === '/search') {
    const q = new URLSearchParams(window.location.search).get('q')?.trim()
    if (q)
      return {
        view: 'category',
        category: { key: 'search', label: q, query: q },
        event: null,
        page,
        puzzle: null,
      }
    return { view: 'home', ...none }
  }
  const slug = decodeURIComponent(path.replace(/^\/+|\/+$/g, ''))
  const node = categoryBySlug(slug)
  if (node) return { view: 'category', category: node, event: null, page, puzzle: null }
  return { view: 'home', ...none }
}

export function currentUrl(): string {
  return window.location.pathname + window.location.search
}
