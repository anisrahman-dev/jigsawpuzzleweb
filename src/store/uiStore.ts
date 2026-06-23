import { create } from 'zustand'
import type { Difficulty, PuzzleImage } from '@/types'
import type { CategoryNode } from '@/data/categories'
import type { PuzzleEvent } from '@/data/events'
import { EVENT_POINTS_MULTIPLIER } from '@/data/events'
import type { GalleryPuzzle } from '@/data/gallery'
import { parseRoute, puzzleSlug, type PuzzleRef } from '@/router'

export type View = 'home' | 'categories' | 'category' | 'event' | 'play' | 'puzzle' | 'daily'

interface UiState {
  view: View
  selectedImage: PuzzleImage | null
  difficulty: Difficulty

  previewImage: PuzzleImage | null
  showPreview: boolean

  showSettings: boolean
  showHowTo: boolean
  showProfile: boolean

  selectedCategory: CategoryNode | null
  selectedEvent: PuzzleEvent | null
  /** 1-based page of the category grid (mirrored in the URL as ?page=N). */
  categoryPage: number
  /** The puzzle shown on the detail page (null until resolved on a deep link). */
  detailPuzzle: GalleryPuzzle | null
  /** URL parts for the current puzzle detail page. */
  puzzleRoute: PuzzleRef | null

  /** Points multiplier for the current browsing context (3 on an event page). */
  contextMultiplier: number
  /** Multiplier captured when the preview opened. */
  previewMultiplier: number
  /** Multiplier for the puzzle currently being played (awarded on solve). */
  playMultiplier: number

  setView: (v: View) => void
  selectImage: (img: PuzzleImage | null) => void
  setDifficulty: (d: Difficulty) => void
  startPuzzle: (img: PuzzleImage, difficulty: Difficulty) => void
  goHome: () => void
  showCategories: () => void
  /** Open the Daily Jigsaw Puzzle / Puzzle of the Day landing page. */
  showDaily: () => void
  browseCategory: (node: CategoryNode) => void
  clearCategory: () => void
  /** Jump to a page within the current category grid. */
  setCategoryPage: (page: number) => void
  /** Open a puzzle's own detail page (its own URL with name + author). */
  viewPuzzle: (puzzle: GalleryPuzzle) => void
  /** Populate the detail puzzle once resolved from a deep link. */
  setDetailPuzzle: (puzzle: GalleryPuzzle) => void
  /** Open an event page (themed puzzles, 3× points). */
  browseEvent: (event: PuzzleEvent) => void
  applyRoute: (
    view: View,
    category: CategoryNode | null,
    event: PuzzleEvent | null,
    page?: number,
    puzzle?: PuzzleRef | null,
  ) => void

  openPreview: (img: PuzzleImage) => void
  closePreview: () => void

  openSettings: () => void
  closeSettings: () => void
  openHowTo: () => void
  closeHowTo: () => void
  openProfile: () => void
  closeProfile: () => void
}

const initialRoute = parseRoute()

export const useUiStore = create<UiState>((set, get) => ({
  view: initialRoute.view,
  selectedImage: null,
  difficulty: 'medium',
  previewImage: null,
  showPreview: false,
  showSettings: false,
  showHowTo: false,
  showProfile: false,
  selectedCategory: initialRoute.category,
  selectedEvent: initialRoute.event,
  categoryPage: initialRoute.page,
  detailPuzzle: null,
  puzzleRoute: initialRoute.puzzle,
  contextMultiplier: initialRoute.event ? EVENT_POINTS_MULTIPLIER : 1,
  previewMultiplier: 1,
  playMultiplier: 1,

  setView: (view) => set({ view }),
  selectImage: (selectedImage) => set({ selectedImage }),
  setDifficulty: (difficulty) => set({ difficulty }),
  startPuzzle: (img, difficulty) =>
    set({
      selectedImage: img,
      difficulty,
      view: 'play',
      showPreview: false,
      previewImage: null,
      playMultiplier: get().previewMultiplier,
    }),
  goHome: () => set({ view: 'home', selectedCategory: null, selectedEvent: null, contextMultiplier: 1 }),
  showCategories: () => set({ view: 'categories', selectedEvent: null, contextMultiplier: 1 }),
  showDaily: () =>
    set({ view: 'daily', selectedCategory: null, selectedEvent: null, contextMultiplier: 1 }),
  browseCategory: (node) =>
    set({
      selectedCategory: node,
      view: 'category',
      selectedEvent: null,
      categoryPage: 1,
      contextMultiplier: 1,
    }),
  clearCategory: () => set({ selectedCategory: null }),
  setCategoryPage: (categoryPage) => set({ categoryPage }),
  viewPuzzle: (puzzle) =>
    set({
      view: 'puzzle',
      detailPuzzle: puzzle,
      puzzleRoute: {
        category: puzzle.category,
        id: puzzle.id.replace(/^[a-z]-/, ''),
        slug: puzzleSlug(puzzle.title, puzzle.author),
      },
    }),
  setDetailPuzzle: (detailPuzzle) => set({ detailPuzzle }),
  browseEvent: (event) =>
    set({
      selectedEvent: event,
      view: 'event',
      selectedCategory: null,
      contextMultiplier: EVENT_POINTS_MULTIPLIER,
    }),
  applyRoute: (view, category, event, page = 1, puzzle = null) =>
    set((s) => ({
      view,
      selectedCategory: category,
      selectedEvent: event,
      categoryPage: page,
      puzzleRoute: puzzle,
      // Keep the resolved puzzle only if the route still points at it.
      detailPuzzle:
        puzzle && s.detailPuzzle && s.detailPuzzle.id === `c-${puzzle.id}` ? s.detailPuzzle : null,
      contextMultiplier: event ? EVENT_POINTS_MULTIPLIER : 1,
    })),

  openPreview: (img) =>
    set({ previewImage: img, showPreview: true, previewMultiplier: get().contextMultiplier }),
  closePreview: () => set({ showPreview: false }),

  openSettings: () => set({ showSettings: true }),
  closeSettings: () => set({ showSettings: false }),
  openHowTo: () => set({ showHowTo: true }),
  closeHowTo: () => set({ showHowTo: false }),
  openProfile: () => set({ showProfile: true }),
  closeProfile: () => set({ showProfile: false }),
}))
