import { Icon } from '@/components/Icon'
import { usePuzzleStore, ZOOM_MIN, ZOOM_MAX } from '@/store/puzzleStore'
import './ZoomControls.css'

/**
 * Floating zoom widget pinned to the play stage's bottom-right. Zoom out to see
 * all the scattered pieces at once, in to place tricky ones; the percentage
 * resets to 100% on click. Stays put while the stage scrolls/pans when zoomed.
 */
export function ZoomControls() {
  const zoom = usePuzzleStore((s) => s.zoom)
  const pct = Math.round(zoom * 100)

  return (
    <div className="zoomctl" role="group" aria-label="Zoom">
      <button
        type="button"
        className="zoomctl-btn"
        onClick={() => usePuzzleStore.getState().zoomOut()}
        disabled={zoom <= ZOOM_MIN}
        aria-label="Zoom out"
      >
        <Icon name="zoom-out" size={18} />
      </button>
      <button
        type="button"
        className="zoomctl-pct"
        onClick={() => usePuzzleStore.getState().resetView()}
        aria-label={`Zoom ${pct} percent. Click to reset view.`}
        title="Reset view"
      >
        {pct}%
      </button>
      <button
        type="button"
        className="zoomctl-btn"
        onClick={() => usePuzzleStore.getState().zoomIn()}
        disabled={zoom >= ZOOM_MAX}
        aria-label="Zoom in"
      >
        <Icon name="zoom-in" size={18} />
      </button>
    </div>
  )
}
