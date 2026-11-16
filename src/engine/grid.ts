import type { Difficulty, DifficultyPreset } from '@/types'

export const DIFFICULTIES: DifficultyPreset[] = [
  { key: 'easy', label: 'Easy', pieces: 12 },
  { key: 'medium', label: 'Medium', pieces: 48 },
  { key: 'hard', label: 'Hard', pieces: 108 },
  { key: 'expert', label: 'Expert', pieces: 300 },
]

export function presetFor(key: Difficulty): DifficultyPreset {
  return DIFFICULTIES.find((d) => d.key === key) ?? DIFFICULTIES[1]
}

// Lives in plain ESM so the prerender step (scripts/seo-build.mjs, via
// src/data/puzzleCopy.mjs) quotes exactly the grid the game will cut.
export { fitGrid } from './fitGrid.mjs'

/**
 * Fit a board of the image aspect ratio inside the available area, capped so
 * pieces stay a comfortable size.
 */
export function fitBoard(
  imgWidth: number,
  imgHeight: number,
  maxW: number,
  maxH: number,
): { width: number; height: number } {
  const aspect = imgWidth / imgHeight
  let width = maxW
  let height = width / aspect
  if (height > maxH) {
    height = maxH
    width = height * aspect
  }
  return { width: Math.round(width), height: Math.round(height) }
}
