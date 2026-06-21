import { useShallow } from 'zustand/react/shallow'
import { usePuzzleStore } from '@/store/puzzleStore'
import { usePrefsStore } from '@/store/prefsStore'
import { useTimer } from '@/hooks/useTimer'
import { Icon } from '@/components/Icon'
import './Timer.css'

export function Timer() {
  const { label } = useTimer()
  const moves = usePuzzleStore((s) => s.moves)
  const hideTimer = usePrefsStore((s) => s.hideTimer)
  const { pct } = usePuzzleStore(
    useShallow((s) => ({
      pct:
        s.pieces.length <= 1
          ? 0
          : (s.pieces.length - Object.keys(s.groups).length) / (s.pieces.length - 1),
    })),
  )

  const percent = Math.round(pct * 100)

  return (
    <div className="timer-bar" role="status" aria-live="polite">
      <div className="timer-inner">
        {!hideTimer && (
          <>
            <div className="timer-stat">
              <Icon name="clock" size={15} className="timer-icon" />
              <span className="timer-label">Time</span>
              <span className="timer-value">{label}</span>
            </div>
            <span className="timer-divider" aria-hidden="true" />
          </>
        )}

        <div className="timer-stat">
          <Icon name="grid" size={15} className="timer-icon" />
          <span className="timer-label">Moves</span>
          <span className="timer-value">{moves}</span>
        </div>

        <span className="timer-divider" aria-hidden="true" />

        <div className="timer-stat timer-stat--progress">
          <div className="timer-progress-head">
            <span className="timer-label">Progress</span>
            <span className="timer-value">{percent}%</span>
          </div>
          <div
            className="timer-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
          >
            <div className="timer-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
