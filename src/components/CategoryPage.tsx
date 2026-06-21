// A single category's page: "<Category> Online Free Jigsaw Puzzles" + intro
// description + a grid of that category's puzzles (live Pixabay search).
import { useEffect, useState } from 'react'
import {
  GALLERY_PUZZLES,
  loadCategoryCatalog,
  searchGallery,
  type GalleryPuzzle,
} from '@/data/gallery'
import { PixabayError } from '@/api/pixabay'
import { categorySlug } from '@/data/categories'
import { urlForRoute, puzzleSlug } from '@/router'
import {
  SITE,
  absUrl,
  setMeta,
  setCanonical,
  setPrevNext,
  setJsonLd,
  removeJsonLd,
  resetHead,
} from '@/lib/seo'
import { useUiStore } from '@/store/uiStore'
import { PuzzleCard } from './PuzzleCard'
import { Spinner } from './Spinner'
import { Icon } from '@/components/Icon'
import './CategoryPage.css'

const PAGE_SIZE = 24

/** Short, category-aware Q&A - visible on the page AND emitted as FAQPage JSON-LD. */
function faqFor(label: string): { q: string; a: string }[] {
  const l = label.toLowerCase()
  return [
    {
      q: `Are the ${l} jigsaw puzzles free?`,
      a: `Yes. Every ${l} jigsaw puzzle on ${SITE} is free to play online - no login, no app, and no downloads.`,
    },
    {
      q: `How many pieces can I choose?`,
      a: `Each ${l} puzzle can be played from 12 pieces up to 300 pieces, so it suits a quick break or a longer, relaxing session.`,
    },
    {
      q: `Do I need an account to play ${l} puzzles?`,
      a: `No account is needed. Pick any ${l} picture and start solving instantly in your browser, on desktop or mobile.`,
    },
  ]
}

/** Page numbers to show, with '…' gaps for long ranges (e.g. 1 … 6 7 [8] 9 10 … 19). */
function pageWindow(current: number, total: number): (number | '…')[] {
  const out: (number | '…')[] = []
  const add = (p: number) => out.push(p)
  const lo = Math.max(2, current - 1)
  const hi = Math.min(total - 1, current + 1)
  add(1)
  if (lo > 2) out.push('…')
  for (let p = lo; p <= hi; p++) add(p)
  if (hi < total - 1) out.push('…')
  if (total > 1) add(total)
  return out
}

function pageTitle(label: string): string {
  return `${label} Online Free Jigsaw Puzzles`
}

function describe(label: string): string {
  const l = label.toLowerCase()
  return (
    `Play free online ${l} jigsaw puzzles - no login, no downloads, ever. ` +
    `Browse a fresh collection of ${l} pictures below, pick the one you like, then choose ` +
    `anywhere from a quick 12-piece puzzle to a challenging 300-piece one. Drag the pieces, ` +
    `watch them snap together, and relax at your own pace.`
  )
}

export function CategoryPage() {
  const node = useUiStore((s) => s.selectedCategory)
  const [results, setResults] = useState<GalleryPuzzle[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const page = useUiStore((s) => s.categoryPage)

  const label = node?.label ?? 'Jigsaw'

  // Fetch this category's puzzles.
  useEffect(() => {
    if (!node) return
    let cancelled = false
    setLoading(true)
    setError(null)
    setResults(null)
    // Prefer the pre-fetched static catalogue (≈450 photos, no API key needed);
    // fall back to live Pixabay search, then to the curated catalogue.
    loadCategoryCatalog(node.key)
      .catch(() => searchGallery(node.query))
      .then((r) => !cancelled && setResults(r))
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof PixabayError ? e.kind : 'error')
        setResults([])
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [node])

  // SEO + AI: title, meta description, canonical, pagination links and JSON-LD
  // (breadcrumb, collection/ItemList, FAQ). Runs once results are known so the
  // count and the item list reflect real puzzles.
  useEffect(() => {
    if (!node) return
    const l = label.toLowerCase()
    const count = results?.length ?? 0
    const totalPages = Math.max(1, Math.ceil((count || PAGE_SIZE) / PAGE_SIZE))
    const current = Math.min(page, totalPages)
    const path = urlForRoute('category', node, null, current)

    const pageSuffix = current > 1 ? ` (Page ${current})` : ''
    document.title = `${pageTitle(label)}${pageSuffix} | ${SITE}`
    const countWord = count > 0 ? `${count}` : 'hundreds of'
    setMeta(
      'description',
      `Play free online ${l} jigsaw puzzles - browse ${countWord} hand-picked ${l} ` +
        `pictures and solve any of them in 12 to 300 pieces. No login, no downloads.`,
    )

    // Self-referencing canonical + prev/next so paginated pages aren't seen as duplicates.
    setCanonical(path)
    setPrevNext(
      current > 1 ? urlForRoute('category', node, null, current - 1) : null,
      current < totalPages ? urlForRoute('category', node, null, current + 1) : null,
    )

    setJsonLd('ld-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Categories', item: absUrl('/categories') },
        { '@type': 'ListItem', position: 3, name: label, item: absUrl(`/${categorySlug(label)}`) },
      ],
    })

    // CollectionPage + ItemList of the puzzles visible on this page.
    const start = (current - 1) * PAGE_SIZE
    const slice = (results ?? []).slice(start, start + PAGE_SIZE)
    setJsonLd('ld-collection', {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageTitle(label),
      url: absUrl(path),
      isPartOf: { '@type': 'WebSite', name: SITE, url: absUrl('/') },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: slice.length,
        itemListElement: slice.map((p, i) => ({
          '@type': 'ListItem',
          position: start + i + 1,
          name: `${p.title} Jigsaw Puzzle`,
          image: p.thumbUrl,
          url: absUrl(
            `/puzzle/${node.key}/${p.id.replace(/^[a-z]-/, '')}/${puzzleSlug(p.title, p.author)}`,
          ),
        })),
      },
    })

    setJsonLd('ld-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqFor(label).map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })

    return () => {
      resetHead()
      removeJsonLd('ld-breadcrumb', 'ld-collection', 'ld-faq')
    }
  }, [node, label, page, results])

  if (!node) {
    return (
      <div className="catpg">
        <p>No category selected.</p>
        <button className="btn btn--primary" onClick={() => useUiStore.getState().goHome()}>
          Back home
        </button>
      </div>
    )
  }

  return (
    <div className="catpg">
      <nav className="catpg-crumbs" aria-label="Breadcrumb">
        <button type="button" className="catpg-crumb" onClick={() => useUiStore.getState().goHome()}>
          Home
        </button>
        <span aria-hidden="true" className="catpg-sep">
          /
        </span>
        <button
          type="button"
          className="catpg-crumb"
          onClick={() => useUiStore.getState().showCategories()}
        >
          Categories
        </button>
        <span aria-hidden="true" className="catpg-sep">
          /
        </span>
        <span className="catpg-crumb is-current">{label}</span>
      </nav>

      <header className="catpg-head">
        <h1 className="catpg-title">{pageTitle(label)}</h1>
        <p className="catpg-desc">{describe(label)}</p>
        {!loading && results && results.length > 0 ? (
          <p className="catpg-count">
            <strong>{results.length}</strong> free {label.toLowerCase()} puzzles · play any from 12
            to 300 pieces
          </p>
        ) : null}
      </header>

      {loading && (
        <div className="catpg-state">
          <Spinner />
          <p>Finding {label.toLowerCase()} puzzles…</p>
        </div>
      )}

      {!loading && results && (
        <>
          {error === 'no-key' ? (
            <div className="catpg-note">
              <p>Search is unavailable right now. Here are puzzles you can play:</p>
            </div>
          ) : error ? (
            <div className="catpg-note">
              <p>Couldn’t load this category. Here are puzzles you can play right now:</p>
            </div>
          ) : results.length === 0 ? (
            <div className="catpg-note">
              <p>No puzzles found for {label}. Try another category:</p>
            </div>
          ) : null}

          {(() => {
            const all = error || results.length === 0 ? GALLERY_PUZZLES : results
            const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE))
            const current = Math.min(page, totalPages)
            const start = (current - 1) * PAGE_SIZE
            const slice = all.slice(start, start + PAGE_SIZE)
            const goTo = (p: number) => {
              useUiStore.getState().setCategoryPage(p)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
            return (
              <>
                <div className="puzzle-grid">
                  {slice.map((p) => (
                    <PuzzleCard key={p.id} puzzle={p} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <nav className="catpg-pager" aria-label="Puzzle pages">
                    <button
                      type="button"
                      className="catpg-page catpg-page--nav"
                      onClick={() => goTo(current - 1)}
                      disabled={current === 1}
                    >
                      <Icon name="arrow-left" size={16} /> Prev
                    </button>
                    {pageWindow(current, totalPages).map((p, i) =>
                      p === '…' ? (
                        <span key={`gap-${i}`} className="catpg-gap">
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          type="button"
                          className={`catpg-page${p === current ? ' is-current' : ''}`}
                          aria-current={p === current ? 'page' : undefined}
                          onClick={() => goTo(p)}
                        >
                          {p}
                        </button>
                      ),
                    )}
                    <button
                      type="button"
                      className="catpg-page catpg-page--nav"
                      onClick={() => goTo(current + 1)}
                      disabled={current === totalPages}
                    >
                      Next <Icon name="arrow-right" size={16} />
                    </button>
                  </nav>
                )}
              </>
            )
          })()}
        </>
      )}

      <section className="catpg-faq" aria-labelledby="catpg-faq-title">
        <h2 id="catpg-faq-title" className="catpg-faq-title">
          {label} jigsaw puzzles - frequently asked questions
        </h2>
        <dl className="catpg-faq-list">
          {faqFor(label).map((f) => (
            <div className="catpg-faq-item" key={f.q}>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="catpg-foot">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => useUiStore.getState().showCategories()}
        >
          <Icon name="grid" size={18} /> Browse all categories
        </button>
      </div>
    </div>
  )
}
