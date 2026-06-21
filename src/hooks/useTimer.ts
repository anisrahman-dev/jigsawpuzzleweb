import { useEffect, useState } from 'react'
import { usePuzzleStore } from '@/store/puzzleStore'

function computeSeconds(startedAt: number | null, solvedAt: number | null): number {
  if (startedAt == null) return 0
  const end = solvedAt ?? Date.now()
  return Math.max(0, Math.floor((end - startedAt) / 1000))
}

function formatLabel(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const ss = String(seconds).padStart(2, '0')
  if (hours >= 1) {
    const mm = String(minutes).padStart(2, '0')
    return `${hours}:${mm}:${ss}`
  }
  return `${minutes}:${ss}`
}

export function useTimer(): { seconds: number; label: string } {
  const startedAt = usePuzzleStore((s) => s.startedAt)
  const solvedAt = usePuzzleStore((s) => s.solvedAt)

  const [seconds, setSeconds] = useState<number>(() => computeSeconds(startedAt, solvedAt))

  useEffect(() => {
    // Recompute immediately whenever startedAt/solvedAt change.
    setSeconds(computeSeconds(startedAt, solvedAt))

    // Only tick while the puzzle is in progress: started but not yet solved.
    if (startedAt == null || solvedAt != null) return

    const id = setInterval(() => {
      setSeconds(computeSeconds(startedAt, solvedAt))
    }, 1000)

    return () => clearInterval(id)
  }, [startedAt, solvedAt])

  return { seconds, label: formatLabel(seconds) }
}
