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

/**
 * Choose a cols×rows grid whose total is close to `targetPieces` while keeping
 * piece cells as square as possible for the given image aspect ratio.
 */
export function fitGrid(
  targetPieces: number,
  imgWidth: number,
  imgHeight: number,
): { cols: number; rows: number } {
  const aspect = imgWidth / imgHeight
  // cols/rows ≈ aspect, cols*rows ≈ target  →  cols ≈ sqrt(target*aspect)
  let cols = Math.max(2, Math.round(Math.sqrt(targetPieces * aspect)))
  let rows = Math.max(2, Math.round(targetPieces / cols))
  // nudge toward target
  while (cols * rows < targetPieces * 0.8) {
    if (cols / rows < aspect) cols++
    else rows++
  }
  return { cols, rows }
}

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
