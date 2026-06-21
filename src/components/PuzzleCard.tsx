import type { GalleryPuzzle } from '@/data/gallery'
import { useUiStore } from '@/store/uiStore'
import { Icon } from '@/components/Icon'
import './PuzzleCard.css'

const TAG_LABEL: Record<'new' | 'hot' | 'staff', string> = {
  new: 'New',
  hot: 'Hot',
  staff: 'Staff pick',
}

/**
 * PuzzleCard - an image-forward gallery card. The photo fills the tile with the
 * title & photographer overlaid on a soft gradient; a piece-count badge sits
 * top-right and an optional tag ribbon top-left. The whole card opens the start
 * preview; on hover it lifts, the image gently zooms, and a "Play" pill appears.
 */
export function PuzzleCard({ puzzle }: { puzzle: GalleryPuzzle }) {
  const tag = puzzle.tag

  return (
    <button
      type="button"
      className="card-root"
      onClick={() => useUiStore.getState().viewPuzzle(puzzle)}
      aria-label={`Open ${puzzle.title} by ${puzzle.author}`}
    >
      <img
        className="card-img"
        // Tiny ~150px thumbnail (~10KB) so browse grids load near-instantly,
        // even on slow connections. The full image loads only when you play.
        src={puzzle.thumbUrl.replace('_640.', '_150.')}
        alt={puzzle.title}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <span className="card-overlay" aria-hidden="true" />

      {tag && (
        <span className={`card-ribbon card-ribbon--${tag}`}>
          {tag === 'hot' && <Icon name="flame" size={12} />}
          {tag === 'staff' && <Icon name="sparkle" size={12} />}
          {TAG_LABEL[tag]}
        </span>
      )}

      <span className="card-play" aria-hidden="true">
        <Icon name="play" size={16} />
        Play
      </span>

      <span className="card-info">
        <span className="card-title" title={`by ${puzzle.author}`}>
          by {puzzle.author}
        </span>
      </span>
    </button>
  )
}
