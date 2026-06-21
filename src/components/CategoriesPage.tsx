// Dedicated page listing every category as a photo tile.
import { useEffect } from 'react'
import { ALL_CATEGORIES, categorySlug, type CategoryNode } from '@/data/categories'
import { useUiStore } from '@/store/uiStore'
import { SITE, absUrl, setMeta, setCanonical, setJsonLd, removeJsonLd, resetHead } from '@/lib/seo'
import { CategoryTiles } from './CategoryTiles'
import { Icon } from '@/components/Icon'
import './CategoriesPage.css'

const COUNT = ALL_CATEGORIES.length

export function CategoriesPage() {
  const onSelect = (node: CategoryNode) => useUiStore.getState().browseCategory(node)

  // ── On-page SEO: title, meta description, canonical, breadcrumb + ItemList ──
  useEffect(() => {
    document.title = `Free Online Jigsaw Puzzle Categories - ${COUNT} Themes | ${SITE}`
    setMeta(
      'description',
      `Browse all ${COUNT} free online jigsaw puzzle categories on ${SITE} - nature, ` +
        `wildlife, flowers, cities, food, travel and more. Pick a category, choose a ` +
        `picture, and play from 12 to 300 pieces. No login, no downloads.`,
    )
    setCanonical('/categories')

    setJsonLd('ld-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Categories', item: absUrl('/categories') },
      ],
    })
    setJsonLd('ld-collection', {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Free Online Jigsaw Puzzle Categories',
      url: absUrl('/categories'),
      isPartOf: { '@type': 'WebSite', name: SITE, url: absUrl('/') },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: COUNT,
        itemListElement: ALL_CATEGORIES.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${c.label} Jigsaw Puzzles`,
          url: absUrl(`/${categorySlug(c.label)}`),
        })),
      },
    })

    return () => {
      resetHead()
      removeJsonLd('ld-breadcrumb', 'ld-collection')
    }
  }, [])

  return (
    <div className="catpage">
      <header className="catpage-head">
        <button type="button" className="btn btn--ghost" onClick={() => useUiStore.getState().goHome()}>
          <Icon name="arrow-left" size={18} /> Home
        </button>
        <div className="catpage-titles">
          <h1 className="catpage-title">Free Online Jigsaw Puzzle Categories</h1>
          <p className="catpage-sub">
            Browse all {COUNT} categories - from nature, wildlife and flowers to cities, food and
            travel. Pick one, choose a picture, and play free from 12 to 300 pieces.
          </p>
        </div>
      </header>
      <CategoryTiles items={ALL_CATEGORIES} onSelect={onSelect} />
    </div>
  )
}
