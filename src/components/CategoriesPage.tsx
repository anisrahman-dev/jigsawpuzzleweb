// Dedicated page listing every category as a photo tile.
import { ALL_CATEGORIES, type CategoryNode } from '@/data/categories'
import { useUiStore } from '@/store/uiStore'
import { CategoryTiles } from './CategoryTiles'
import { Icon } from '@/components/Icon'
import './CategoriesPage.css'

export function CategoriesPage() {
  const onSelect = (node: CategoryNode) => useUiStore.getState().browseCategory(node)

  return (
    <div className="catpage">
      <header className="catpage-head">
        <button type="button" className="btn btn--ghost" onClick={() => useUiStore.getState().goHome()}>
          <Icon name="arrow-left" size={18} /> Home
        </button>
        <div className="catpage-titles">
          <h1 className="catpage-title">All Categories</h1>
          <p className="catpage-sub">{ALL_CATEGORIES.length} categories - pick one to start a puzzle.</p>
        </div>
      </header>
      <CategoryTiles items={ALL_CATEGORIES} onSelect={onSelect} />
    </div>
  )
}
