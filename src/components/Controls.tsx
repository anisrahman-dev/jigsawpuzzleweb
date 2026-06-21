import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { usePuzzleStore } from '@/store/puzzleStore'
import { usePrefsStore } from '@/store/prefsStore'
import { useUiStore } from '@/store/uiStore'
import './Controls.css'

function capitalize(s: string): string {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s
}

export function Controls() {
  const difficulty = usePuzzleStore((s) => s.difficulty)
  const cols = usePuzzleStore((s) => s.cols)
  const rows = usePuzzleStore((s) => s.rows)
  const showGhost = usePuzzleStore((s) => s.showGhost)
  const hideTimer = usePrefsStore((s) => s.hideTimer)

  // Two-step shuffle: a mis-tap shouldn't destroy a half-solved board.
  const [confirmingShuffle, setConfirmingShuffle] = useState(false)

  const pieceCount = cols * rows

  const goHome = (): void => useUiStore.getState().goHome()
  const togglePreview = (): void => usePuzzleStore.getState().toggleGhost()
  const toggleHideTimer = (): void => usePrefsStore.getState().toggleHideTimer()

  const onShuffle = (): void => {
    if (!confirmingShuffle) {
      setConfirmingShuffle(true)
      window.setTimeout(() => setConfirmingShuffle(false), 3500)
      return
    }
    setConfirmingShuffle(false)
    usePuzzleStore.getState().scatter()
  }

  return (
    <div className="controls-bar">
      <div className="controls-inner">
        <div className="controls-left">
          <button type="button" className="btn btn--ghost btn--sm controls-back" onClick={goHome}>
            <Icon name="arrow-left" size={18} />
            <span className="controls-label">Gallery</span>
          </button>
        </div>

        <div className="controls-center">
          <span className="controls-difficulty">{capitalize(difficulty)}</span>
          <span className="controls-dot" aria-hidden="true">
            ·
          </span>
          <span className="controls-count">
            {pieceCount} {pieceCount === 1 ? 'piece' : 'pieces'}
          </span>
        </div>

        <div className="controls-right">
          <button
            type="button"
            className={'btn btn--sm controls-tool' + (confirmingShuffle ? ' controls-tool--warn' : '')}
            onClick={onShuffle}
            aria-label={confirmingShuffle ? 'Confirm shuffle - this clears your progress' : 'Shuffle pieces'}
          >
            <Icon name="shuffle" size={18} />
            <span className="controls-label">{confirmingShuffle ? 'Confirm?' : 'Shuffle'}</span>
          </button>
          <button
            type="button"
            className="btn btn--sm controls-tool controls-tool--toggle"
            aria-pressed={showGhost}
            onClick={togglePreview}
          >
            <Icon name={showGhost ? 'eye-off' : 'eye'} size={18} />
            <span className="controls-label">Preview</span>
          </button>
          <button
            type="button"
            className="btn btn--sm controls-tool controls-tool--toggle"
            aria-pressed={hideTimer}
            onClick={toggleHideTimer}
            title={hideTimer ? 'Timer hidden (relaxed mode)' : 'Hide the timer'}
          >
            <Icon name="clock" size={18} />
            <span className="controls-label">{hideTimer ? 'Timer off' : 'Timer'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
