// A responsive grid of category photo-tiles. Used on the home (curated 28) and
// the all-categories page (every category). Selecting one runs its search.
import { categoryCover, type CategoryNode } from '@/data/categories'
import './CategoryTiles.css'

export interface CategoryTilesProps {
  items: CategoryNode[]
  activeKey?: string | null
  onSelect: (node: CategoryNode) => void
}

export function CategoryTiles({ items, activeKey = null, onSelect }: CategoryTilesProps) {
  return (
    <div className="cattiles">
      {items.map((cat) => (
        <button
          key={cat.key}
          type="button"
          className={'cattile' + (activeKey === cat.key ? ' is-active' : '')}
          aria-pressed={activeKey === cat.key}
          onClick={() => onSelect(cat)}
        >
          <img className="cattile-img" src={categoryCover(cat.key)} alt="" loading="lazy" />
          <span className="cattile-overlay" aria-hidden="true" />
          <span className="cattile-label">{cat.label}</span>
        </button>
      ))}
    </div>
  )
}
