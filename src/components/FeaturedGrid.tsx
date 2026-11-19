// Cards for the hand-written puzzle pages (src/data/featuredPuzzles.mjs).
// Shared by the home page, the seniors page and the custom puzzle maker.
import { useUiStore } from '@/store/uiStore'
import { Icon } from '@/components/Icon'
import { featuredBlurb, featuredPath, type FeaturedPuzzle } from '@/data/featuredPuzzles.mjs'
import './FeaturedHome.css'

/** Open a puzzle page inside the app (the real href stays for crawlers and new tabs). */
export function openFeatured(e: React.MouseEvent, f: FeaturedPuzzle) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  e.preventDefault()
  useUiStore.getState().applyRoute('puzzle', null, null, 1, {
    category: f.category,
    id: f.id,
    slug: f.slug,
  })
  window.scrollTo({ top: 0 })
}

export function PuzzleTile({ f }: { f: FeaturedPuzzle }) {
  return (
    <li className="fhome-card">
      <a href={featuredPath(f)} onClick={(e) => openFeatured(e, f)}>
        <div className="fhome-card-media">
          <img src={f.thumb} alt={f.alt} width={f.width} height={f.height} loading="lazy" />
          <span className="fhome-badge">Best at {f.recommended.pieces} pieces</span>
        </div>
        <div className="fhome-card-body">
          <h3>{f.h1}</h3>
          <p>{featuredBlurb(f)}</p>
          <span className="fhome-card-cta">
            Play puzzle <Icon name="arrow-right" size={16} />
          </span>
        </div>
      </a>
    </li>
  )
}

export function FeaturedGrid({ items, className }: { items: FeaturedPuzzle[]; className?: string }) {
  return (
    <ul className={`fhome-grid${className ? ` ${className}` : ''}`}>
      {items.map((f) => (
        <PuzzleTile key={f.slug} f={f} />
      ))}
    </ul>
  )
}
