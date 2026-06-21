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
 * Build a high-quality, retina-aware source set for a gallery thumbnail.
 * - Pixabay CDN thumbs come as `..._640.jpg`; we serve 640px as the base and a
 *   960px variant so tiles stay crisp on large / high-DPI screens.
 * - Curated Picsum covers (`/id/<n>/600/400`) get a 2× (1200×800) variant.
 * The browser picks a size from `sizes` (one tile ≈ 300px, or ~50vw on phones),
 * so cards look sharp without shipping the full puzzle image.
 */
function thumbSources(thumbUrl: string): { src: string; srcSet?: string } {
  if (thumbUrl.includes('_640.')) {
    return { src: thumbUrl, srcSet: `${thumbUrl} 640w, ${thumbUrl.replace('_640.', '_960.')} 960w` }
  }
  const m = thumbUrl.match(/picsum\.photos\/id\/(\d+)\//)
  if (m) {
    const id = m[1]
    const at = (w: number, h: number) => `https://picsum.photos/id/${id}/${w}/${h}`
    return { src: at(600, 400), srcSet: `${at(600, 400)} 600w, ${at(1200, 800)} 1200w` }
  }
  return { src: thumbUrl }
}

/**
 * PuzzleCard - an image-forward gallery card. The photo fills the tile with the
 * title & photographer overlaid on a soft gradient; a piece-count badge sits
 * top-right and an optional tag ribbon top-left. The whole card opens the start
 * preview; on hover it lifts, the image gently zooms, and a "Play" pill appears.
 */
export function PuzzleCard({ puzzle }: { puzzle: GalleryPuzzle }) {
  const tag = puzzle.tag
  const { src, srcSet } = thumbSources(puzzle.thumbUrl)

  return (
    <button
      type="button"
      className="card-root"
      onClick={() => useUiStore.getState().viewPuzzle(puzzle)}
      aria-label={`Open ${puzzle.title} by ${puzzle.author}`}
    >
      <img
        className="card-img"
        // High-quality thumbnail (640px base, 960px on large/retina tiles) so
        // browse grids look crisp; the full image still loads only on play.
        src={src}
        srcSet={srcSet}
        sizes="(max-width: 600px) 50vw, 300px"
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
