import { useEffect, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { IconName } from '@/components/Icon'
import { usePuzzleStore } from '@/store/puzzleStore'
import { useUiStore } from '@/store/uiStore'
import { useScoreStore } from '@/store/scoreStore'
import { Modal } from './Modal'
import { Icon } from '@/components/Icon'
import './CompletionModal.css'

/** Local "m:ss" formatter for the final elapsed time (NOT useTimer). */
function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000))
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/** Confetti ribbons - decorative only, suppressed by prefers-reduced-motion. */
const CONFETTI_COUNT = 16

interface Stat {
  label: string
  value: string
  icon?: IconName
}

export function CompletionModal(): React.JSX.Element {
  const status = usePuzzleStore((s) => s.status)
  const image = usePuzzleStore((s) => s.image)
  const { moves, cols, rows, startedAt, solvedAt } = usePuzzleStore(
    useShallow((s) => ({
      moves: s.moves,
      cols: s.cols,
      rows: s.rows,
      startedAt: s.startedAt,
      solvedAt: s.solvedAt,
    })),
  )

  const [dismissed, setDismissed] = useState(false)
  const playMultiplier = useUiStore((s) => s.playMultiplier)
  const [gained, setGained] = useState(0)
  const awarded = useRef(false)

  // Reset the dismissed flag whenever the puzzle leaves the solved state, so the
  // modal is ready to celebrate the next solve.
  useEffect(() => {
    if (status !== 'solved') setDismissed(false)
  }, [status])

  // Award points once per solve (base = piece count, ×multiplier for events).
  useEffect(() => {
    if (status === 'solved') {
      if (!awarded.current) {
        awarded.current = true
        setGained(useScoreStore.getState().award(cols * rows, playMultiplier))
      }
    } else {
      awarded.current = false
      setGained(0)
    }
  }, [status, cols, rows, playMultiplier])

  const open = status === 'solved' && !dismissed

  const elapsedMs = startedAt != null && solvedAt != null ? solvedAt - startedAt : 0
  const pieceCount = cols * rows

  const stats: Stat[] = [
    { label: 'Time', value: formatElapsed(elapsedMs), icon: 'clock' },
    { label: 'Moves', value: String(moves) },
    { label: 'Pieces', value: String(pieceCount) },
  ]

  const handlePlayAgain = (): void => {
    usePuzzleStore.getState().scatter()
    setDismissed(true)
  }

  const handleBackToGallery = (): void => {
    useUiStore.getState().goHome()
  }

  return (
    <Modal open={open} onClose={() => setDismissed(true)} title="Puzzle solved!" maxWidth={460}>
      <div className="done-root">
        <span className="done-trophy" aria-hidden="true">
          <Icon name="trophy" size={28} />
        </span>
        <div className="done-confetti" aria-hidden="true">
          {Array.from({ length: CONFETTI_COUNT }, (_, i) => (
            <span
              key={i}
              className={`done-ribbon done-ribbon--${i % 4}`}
              style={{
                left: `${(i / (CONFETTI_COUNT - 1)) * 100}%`,
                animationDelay: `${(i % 5) * 90}ms`,
                animationDuration: `${1500 + (i % 4) * 220}ms`,
              }}
            />
          ))}
        </div>

        {image?.thumbUrl ? (
          <figure className="done-figure">
            <img className="done-thumb" src={image.thumbUrl} alt="The completed puzzle" loading="lazy" />
            <span className="done-seal" aria-hidden="true">
              <Icon name="puzzle" size={20} />
            </span>
            {image.credit ? <figcaption className="done-credit">{image.credit}</figcaption> : null}
          </figure>
        ) : null}

        <p className="done-lede">Beautifully done - every piece is home.</p>

        <div className="done-points">
          <Icon name="trophy" size={18} />
          <span>+{gained.toLocaleString()} points</span>
          {playMultiplier > 1 ? <span className="done-bonus">{playMultiplier}× event bonus!</span> : null}
        </div>

        <dl className="done-stats">
          {stats.map((stat) => (
            <div className="done-stat" key={stat.label}>
              <dt className="done-stat-label">
                {stat.icon ? <Icon name={stat.icon} size={13} className="done-stat-icon" /> : null}
                {stat.label}
              </dt>
              <dd className="done-stat-value">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <div className="done-actions">
          <button type="button" className="btn btn--primary btn--lg done-action" onClick={handlePlayAgain}>
            Play again
          </button>
          <button type="button" className="btn btn--lg done-action" onClick={handleBackToGallery}>
            <Icon name="arrow-left" size={18} />
            Back to gallery
          </button>
        </div>
      </div>
    </Modal>
  )
}
