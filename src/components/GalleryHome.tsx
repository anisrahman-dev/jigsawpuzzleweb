import { useEffect, useState } from 'react'
import { loadShowcase, type GallerySection } from '@/data/gallery'
import { ALL_CATEGORIES, HOME_CATEGORIES, categorySlug } from '@/data/categories'
import { useUiStore } from '@/store/uiStore'
import { activeEvent } from '@/data/events'
import { SITE, absUrl, setMeta, setCanonical, setJsonLd, removeJsonLd, resetHead } from '@/lib/seo'
import { Hero } from './Hero'
import { EventBanner } from './EventBanner'
import { CategoryTiles } from './CategoryTiles'
import { PuzzleOfTheDay } from './PuzzleOfTheDay'
import { PuzzleCard } from './PuzzleCard'
import { Icon } from '@/components/Icon'
import './GalleryHome.css'

const HOME_TITLE = 'Free Online Jigsaw Puzzles - No Login | JigsawJam'
const HOME_DESC =
  'Free online jigsaw puzzles you play in your browser - no login, no downloads. 32,850 puzzles in 73 categories, 12 to 300 pieces. New puzzle daily.'

/** Top categories surfaced as text links + in the ItemList structured data. */
const TOP_KEYS = ['dogs', 'cats', 'birds', 'flowers', 'beaches', 'landscapes', 'space', 'food', 'castles', 'trains']
const TOP_CATEGORIES = TOP_KEYS.map((k) => {
  const c = ALL_CATEGORIES.find((x) => x.key === k)
  const label = c?.label ?? k
  return { key: k, label, path: `/${categorySlug(label)}` }
})

const HOME_FAQ: { q: string; a: string }[] = [
  {
    q: 'Is JigsawJam free?',
    a: 'Yes. Every jigsaw puzzle on JigsawJam is free to play online. There is no account, no subscription, and no app or download required - you play directly in your web browser.',
  },
  {
    q: 'Do I need an account or login to play?',
    a: 'No. You can start any puzzle straight away in your browser without signing up or logging in, on desktop or mobile.',
  },
  {
    q: 'How many pieces can a puzzle have?',
    a: 'Every puzzle can be played from 12 pieces up to 300 pieces. Pick fewer pieces for a quick game or more for a longer, relaxing challenge.',
  },
  {
    q: 'How many puzzles and categories are there?',
    a: 'JigsawJam has 32,850 puzzles organized into 73 categories, including Dogs, Cats, Birds, Flowers, Beaches, Landscapes, Space, Food, Castles and Trains.',
  },
  {
    q: 'What is the Puzzle of the Day?',
    a: 'A new featured puzzle is published every day. During seasonal events such as Halloween and Christmas, solving puzzles earns triple (3x) points while the event is running.',
  },
]

/** schema.org @graph for the home page (WebSite+SearchAction, Organization, WebPage, ItemList, FAQPage). */
function homeGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': absUrl('/#website'),
        url: absUrl('/'),
        name: SITE,
        description: HOME_DESC,
        inLanguage: 'en',
        publisher: { '@id': absUrl('/#organization') },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: absUrl('/search?q={search_term_string}') },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': absUrl('/#organization'),
        name: SITE,
        url: absUrl('/'),
        logo: { '@type': 'ImageObject', url: absUrl('/puzzle.svg') },
      },
      {
        '@type': 'WebPage',
        '@id': absUrl('/#webpage'),
        url: absUrl('/'),
        name: 'Free Online Jigsaw Puzzles',
        isPartOf: { '@id': absUrl('/#website') },
        about: { '@id': absUrl('/#organization') },
        inLanguage: 'en',
        mainEntity: { '@id': absUrl('/#top-categories') },
      },
      {
        '@type': 'ItemList',
        '@id': absUrl('/#top-categories'),
        name: 'Popular jigsaw puzzle categories',
        itemListOrder: 'https://schema.org/ItemListUnordered',
        numberOfItems: TOP_CATEGORIES.length,
        itemListElement: TOP_CATEGORIES.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.label,
          url: absUrl(c.path),
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': absUrl('/#faq'),
        mainEntity: HOME_FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}

export function GalleryHome() {
  const [query, setQuery] = useState('')
  const [showcase, setShowcase] = useState<GallerySection[]>([])

  // Scenic home rows (houses, architecture, boats, mountains…) from the catalog.
  useEffect(() => {
    let cancelled = false
    loadShowcase()
      .then((s) => !cancelled && setShowcase(s))
      .catch(() => {
        /* showcase missing - just render no rows */
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Home SEO: title, meta description, canonical, and the schema.org @graph.
  useEffect(() => {
    document.title = HOME_TITLE
    setMeta('description', HOME_DESC)
    setCanonical('/')
    setJsonLd('ld-home', homeGraph())
    return () => {
      resetHead()
      removeJsonLd('ld-home')
    }
  }, [])

  function runSearch() {
    const q = query.trim()
    if (!q) return
    useUiStore.getState().browseCategory({ key: 'search', label: q, query: q })
  }

  const featured = activeEvent()

  const SUGGESTIONS = [
    { key: 'dogs', label: 'Dogs', query: 'dog puppy' },
    { key: 'nature', label: 'Nature', query: 'nature landscape' },
    { key: 'space', label: 'Space', query: 'space galaxy stars' },
    { key: 'flowers', label: 'Flowers', query: 'flowers bloom' },
    { key: 'cities', label: 'Cities', query: 'city skyline' },
  ]

  return (
    <div className="gallery">
      {featured ? <EventBanner event={featured} /> : <Hero />}

      <div className="ghome-searchwrap">
        <form
          className="ghome-search"
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            runSearch()
          }}
        >
          <span className="ghome-search-icon" aria-hidden="true">
            <Icon name="search" size={20} />
          </span>
          <input
            className="input ghome-search-input"
            type="search"
            placeholder="Search puzzles…"
            aria-label="Search puzzles"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn--primary ghome-search-btn">
            <span className="ghome-search-btn-label">Search</span>
            <Icon name="arrow-right" size={18} />
          </button>
        </form>

        {!featured && (
          <div className="ghome-suggest">
            <span className="ghome-suggest-label">Try</span>
            {SUGGESTIONS.map((node) => (
              <button
                key={node.key}
                type="button"
                className="chip"
                onClick={() => useUiStore.getState().browseCategory(node)}
              >
                {node.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <PuzzleOfTheDay />

      <section className="ghome-cats">
        <div className="ghome-cats-head ghome-head">
          <div className="ghome-head-text">
            <span className="ghome-eyebrow">Best for jigsaw</span>
            <h2 className="section-title">Browse Categories</h2>
            <p className="ghome-head-sub">
              {HOME_CATEGORIES.length} top categories for jigsaw puzzles
            </p>
          </div>
          <button
            type="button"
            className="ghome-viewall"
            onClick={() => useUiStore.getState().showCategories()}
          >
            View all categories <Icon name="chevron-right" size={16} />
          </button>
        </div>
        <CategoryTiles
          items={HOME_CATEGORIES}
          onSelect={(node) => useUiStore.getState().browseCategory(node)}
        />
      </section>

      <div className="ghome-sections">
        {showcase.map((s) => (
          <section key={s.key} className="ghome-section">
            <div className="ghome-head">
              <div className="ghome-head-text">
                <span className="ghome-eyebrow">Collection</span>
                <h2 className="section-title">{s.title}</h2>
                <p className="ghome-head-sub">
                  {s.puzzles.length} {s.puzzles.length === 1 ? 'puzzle' : 'puzzles'}
                </p>
              </div>
            </div>
            <div className="puzzle-grid">
              {s.puzzles.map((p) => (
                <PuzzleCard key={p.id} puzzle={p} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="ghome-about" aria-labelledby="ghome-about-title">
        <div className="ghome-head">
          <div className="ghome-head-text">
            <span className="ghome-eyebrow">About</span>
            <h2 className="section-title" id="ghome-about-title">
              Free online jigsaw puzzles
            </h2>
          </div>
        </div>
        <p className="ghome-about-lead">
          JigsawJam is a free online jigsaw puzzle site you play right in your browser - no
          login, no app, and no downloads. Choose from 32,850 puzzles across 73 categories, set any
          puzzle from 12 to 300 pieces, and play on desktop or mobile. A new{' '}
          <button type="button" className="ghome-inlink" onClick={() => useUiStore.getState().goHome()}>
            Puzzle of the Day
          </button>{' '}
          is featured daily, and seasonal events earn 3× points.
        </p>
        <ul className="ghome-toplinks">
          {TOP_CATEGORIES.map((c) => {
            const node = ALL_CATEGORIES.find((x) => x.key === c.key)
            return (
              <li key={c.key}>
                <a
                  href={c.path}
                  onClick={(e) => {
                    e.preventDefault()
                    if (node) useUiStore.getState().browseCategory(node)
                  }}
                >
                  {c.label} puzzles
                </a>
              </li>
            )
          })}
        </ul>

        <h2 className="section-title ghome-faq-title">Frequently asked questions</h2>
        <dl className="ghome-faq">
          {HOME_FAQ.map((f) => (
            <div className="ghome-faq-item" key={f.q}>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
