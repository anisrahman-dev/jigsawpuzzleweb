// A single event's page: "<Event> Jigsaw Puzzles" + countdown + 3× points
// banner + themed puzzles. Solving any puzzle here earns triple points.
import { useEffect, useState } from 'react'
import {
  GALLERY_PUZZLES,
  loadCategoryCatalog,
  searchGallery,
  type GalleryPuzzle,
} from '@/data/gallery'
import { eventTarget, EVENT_POINTS_MULTIPLIER } from '@/data/events'
import { eventTitle, eventDescription } from '@/data/categorySeo.mjs'
import { PixabayError } from '@/api/pixabay'
import { useUiStore } from '@/store/uiStore'
import { useCountdown } from '@/hooks/useCountdown'
import {
  SITE,
  absUrl,
  setMeta,
  setCanonical,
  setJsonLd,
  removeJsonLd,
  resetHead,
} from '@/lib/seo'
import { PuzzleCard } from './PuzzleCard'
import { Spinner } from './Spinner'
import { Icon } from '@/components/Icon'
import './EventPage.css'

export function EventPage() {
  const event = useUiStore((s) => s.selectedEvent)
  const [results, setResults] = useState<GalleryPuzzle[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const c = useCountdown(event ? eventTarget(event) : new Date())

  useEffect(() => {
    if (!event) return
    let cancelled = false
    setLoading(true)
    setError(null)
    setResults(null)
    // Prefer the pre-fetched human-free event catalogue; fall back to live search.
    loadCategoryCatalog(`event-${event.key}`)
      .catch(() => searchGallery(event.query))
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
  }, [event])

  // SEO: title, meta description, canonical, breadcrumb + collection JSON-LD.
  useEffect(() => {
    if (!event) return
    const path = `/event/${event.key}`
    const name = `${event.name} Jigsaw Puzzles`
    document.title = eventTitle(event.name, { site: SITE })
    setMeta(
      'description',
      eventDescription(event.name, {
        count: results?.length ?? 0,
        multiplier: EVENT_POINTS_MULTIPLIER,
      }),
    )
    setCanonical(path)
    setJsonLd('ld-ev-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absUrl('/') },
        { '@type': 'ListItem', position: 2, name, item: absUrl(path) },
      ],
    })
    return () => {
      resetHead()
      removeJsonLd('ld-ev-breadcrumb', 'ld-ev-collection')
    }
    // `results` is a dependency because the description quotes the puzzle
    // count, which is only known once the catalogue has loaded - that is what
    // the prerendered HTML says, so the hydrated page must say it too.
  }, [event, results])

  // CollectionPage + ItemList once the themed puzzles are known.
  useEffect(() => {
    if (!event || !results || results.length === 0) return
    const path = `/event/${event.key}`
    setJsonLd('ld-ev-collection', {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${event.name} Jigsaw Puzzles`,
      url: absUrl(path),
      isPartOf: { '@type': 'WebSite', name: SITE, url: absUrl('/') },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: results.length,
        itemListElement: results.slice(0, 24).map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${p.title} Jigsaw Puzzle`,
          image: p.thumbUrl,
        })),
      },
    })
  }, [event, results])

  if (!event) {
    return (
      <div className="evpage">
        <button className="btn btn--primary" onClick={() => useUiStore.getState().goHome()}>
          Back home
        </button>
      </div>
    )
  }

  const counter = c.done ? 'Happening now' : `${c.days}d ${c.hours}h ${c.minutes}m ${c.seconds}s`

  return (
    <div className="evpage">
      <button
        type="button"
        className="btn btn--ghost btn--sm evpage-back"
        onClick={() => useUiStore.getState().goHome()}
      >
        <Icon name="arrow-left" size={16} /> Home
      </button>

      <header
        className="evpage-hero"
        style={{ ['--evbg' as string]: `url("${event.cover}")` }}
      >
        <span className="evpage-bg" aria-hidden="true" />
        <span className="evpage-shade" aria-hidden="true" />
        <div className="evpage-hero-inner">
          <p className="evpage-eyebrow">
            <span className="evpage-emoji" aria-hidden="true">
              {event.emoji}
            </span>
            Featured event
          </p>
          <h1 className="evpage-title">{event.name}</h1>
          <div className="evpage-meta">
            <span className="evpage-chip evpage-chip--points">
              <Icon name="trophy" size={14} /> {EVENT_POINTS_MULTIPLIER}× points
            </span>
            <span className="evpage-when">
              <Icon name="clock" size={14} /> {c.done ? 'Live today' : `Event in ${counter}`}
            </span>
          </div>
        </div>
      </header>

      <p className="evpage-desc">
        Celebrate {event.name} with a free jigsaw puzzle - pick an image, choose your pieces, and
        every solve here earns <strong>triple points</strong>. No login required.
      </p>

      {loading && (
        <div className="evpage-state">
          <Spinner />
          <p>Loading {event.name} puzzles…</p>
        </div>
      )}

      {!loading && results && (
        <>
          {error ? (
            <div className="evpage-note">
              <p>Couldn’t load themed photos right now. Here are puzzles you can play:</p>
            </div>
          ) : null}
          <div className="puzzle-grid">
            {(error || results.length === 0 ? GALLERY_PUZZLES : results).map((p) => (
              <PuzzleCard key={p.id} puzzle={p} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
