import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Player points, persisted to localStorage. Base points for a solve = piece
// count; event puzzles multiply it (see EVENT_POINTS_MULTIPLIER).

interface ScoreState {
  points: number
  solves: number
  award: (basePoints: number, multiplier: number) => number
  reset: () => void
}

export const useScoreStore = create<ScoreState>()(
  persist(
    (set) => ({
      points: 0,
      solves: 0,
      award: (basePoints, multiplier) => {
        const gained = Math.round(basePoints * multiplier)
        set((s) => ({ points: s.points + gained, solves: s.solves + 1 }))
        return gained
      },
      reset: () => set({ points: 0, solves: 0 }),
    }),
    { name: 'jigsaw.score' },
  ),
)
