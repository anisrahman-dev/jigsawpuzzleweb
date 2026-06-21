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
 * Build a full-quality, retina-aware source set for a gallery thumbnail.
 * The top variant is the full-resolution image (`url`) so large / high-DPI
 * tiles render the original picture; smaller variants keep phones light.
 * - Pixabay: thumb is `..._640.jpg`, full is `..._1280.jpg` → 640 / 960 / 1280.
 * - Picsum covers (`/id/<n>/600/400`) → 600 / 1200 (full 1200×800).
 * The browser picks the best size from `sizes` (tile ≈ 300px, ~50vw on phones).
 */
function thumbSources(url: string, thumbUrl: string): { src: string; srcSet?: string } {
  if (thumbUrl.includes('_640.')) {
    const at960 = thumbUrl.replace('_640.', '_960.')
    return { src: url, srcSet: `${thumbUrl} 640w, ${at960} 960w, ${url} 1280w` }
  }
  const m = thumbUrl.match(/picsum\.photos\/id\/(\d+)\//)
  if (m) {
    const id = m[1]
    const at = (w: number, h: number) => `https://picsum.photos/id/${id}/${w}/${h}`
    return { src: at(1200, 800), srcSet: `${at(600, 400)} 600w, ${at(1200, 800)} 1200w` }
  }
  return { src: url || thumbUrl }
}

/**
 * PuzzleCard - an image-forward gallery card. The photo fills the tile with the
 * title & photographer overlaid on a soft gradient; a piece-count badge sits
 * top-right and an optional tag ribbon top-left. The whole card opens the start
 * preview; on hover it lifts, the image gently zooms, and a "Play" pill appears.
 */
export function PuzzleCard({ puzzle }: { puzzle: GalleryPuzzle }) {
  const tag = puzzle.tag
  const { src, srcSet } = thumbSources(puzzle.url, puzzle.thumbUrl)

  return (
    <button
      type="button"
      className="card-root"
      onClick={() => useUiStore.getState().viewPuzzle(puzzle)}
      aria-label={`Open ${puzzle.title} by ${puzzle.author}`}
    >
      <img
        className="card-img"
        // Full-quality image on large/retina tiles, lighter variants on phones
        // (see thumbSources). Lazy + async keeps the grid fast to load.
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
