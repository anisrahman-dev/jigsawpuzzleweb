import { Icon } from '@/components/Icon'
import { usePuzzleStore } from '@/store/puzzleStore'
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

  const pieceCount = cols * rows

  const goHome = (): void => useUiStore.getState().goHome()
  const shuffle = (): void => usePuzzleStore.getState().scatter()
  const togglePreview = (): void => usePuzzleStore.getState().toggleGhost()
  const solve = (): void => {
    if (window.confirm('Auto-solve the whole puzzle?')) {
      usePuzzleStore.getState().autoSolve()
    }
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
          <button type="button" className="btn btn--sm controls-tool" onClick={shuffle}>
            <Icon name="shuffle" size={18} />
            <span className="controls-label">Shuffle</span>
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
          <button type="button" className="btn btn--sm controls-tool" onClick={solve}>
            <Icon name="check" size={18} />
            <span className="controls-label">Solve</span>
          </button>
        </div>
      </div>
    </div>
  )
}
