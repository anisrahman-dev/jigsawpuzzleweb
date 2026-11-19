// A single puzzle's own page: "<Image name> Jigsaw Puzzle" with the photo,
// photographer credit, a difficulty picker and a Play button. Each image has
// its own shareable, indexable URL (/puzzle/<category>/<id>/<name>-by-<author>).
import { useEffect, useMemo, useState } from 'react'
import { ALL_CATEGORIES } from '@/data/categories'
import { findPuzzle, loadCategoryCatalog, type GalleryPuzzle } from '@/data/gallery'
import { puzzleDescription } from '@/data/puzzleTitles.mjs'
import { categoryContext, puzzleCopy } from '@/data/puzzleCopy.mjs'
import { puzzleSlug } from '@/router'
import {
  FEATURED_LINKS,
  FEATURED_PUZZLES,
  featuredFor,
  featuredPath,
  type FeaturedPuzzle,
} from '@/data/featuredPuzzles.mjs'
import { DIFFICULTIES } from '@/engine/grid'
import { SITE, setCanonical, setMeta, resetHead } from '@/lib/seo'
import { useUiStore } from '@/store/uiStore'
import { DifficultyPicker } from './DifficultyPicker'
import { Spinner } from './Spinner'
import { Icon } from '@/components/Icon'
import './PuzzlePage.css'

// The canonical the server sent for the URL we actually landed on. A photo can
// belong to several categories, and the prerendered page already points at the
// single canonical copy - so on the entry page we keep that rather than
// clobbering it with a self-reference. Read at module load, before any effect
// touches <head>. (Client-side navigation self-references, which is right: no
// crawler ever sees those.)
const ENTRY =
  typeof window === 'undefined'
    ? null
    : {
        path: window.location.pathname,
        canonical:
          document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.getAttribute('href') ??
          null,
      }

const rawId = (p: GalleryPuzzle) => p.id.replace(/^[a-z]-/, '')
const hrefFor = (p: GalleryPuzzle) =>
  `/puzzle/${p.category}/${rawId(p)}/${puzzleSlug(p.slugTitle, p.author)}`

/**
 * The photo's siblings, for the per-photo copy and "similar puzzles" - the same
 * catalogue the prerender used, so the hydrated text matches the static HTML.
 */
function useSiblings(puzzle: GalleryPuzzle | null): GalleryPuzzle[] | null {
  const [list, setList] = useState<GalleryPuzzle[] | null>(null)
  useEffect(() => {
    if (!puzzle) return
    let cancelled = false
    setList(null)
    loadCategoryCatalog(puzzle.category)
      .then((l) => !cancelled && setList(l.some((p) => p.id === puzzle.id) ? l : [puzzle]))
      .catch(() => !cancelled && setList([puzzle]))
    return () => {
      cancelled = true
    }
  }, [puzzle])
  return list
}

export function PuzzlePage() {
  const puzzle = useUiStore((s) => s.detailPuzzle)
  const route = useUiStore((s) => s.puzzleRoute)
  const [notFound, setNotFound] = useState(false)

  // Resolve the puzzle on a cold deep link (store has only the URL parts).
  useEffect(() => {
    if (puzzle || !route) return
    let cancelled = false
    setNotFound(false)
    findPuzzle(route.category, route.id)
      .then((p) => {
        if (cancelled) return
        if (p) useUiStore.getState().setDetailPuzzle(p)
        else setNotFound(true)
      })
      .catch(() => !cancelled && setNotFound(true))
    return () => {
      cancelled = true
    }
  }, [puzzle, route])

  // Subject name (from tags) and its category - computed before any early return
  // so the SEO effect's deps stay stable.
  const name = puzzle?.title?.trim() || 'Jigsaw'
  const categoryNode = puzzle
    ? ALL_CATEGORIES.find((c) => c.key === puzzle.category)
    : undefined
  // Hand-written page for this photo, if it has one (src/data/featuredPuzzles.mjs).
  const featured = puzzle ? featuredFor(puzzle.category, rawId(puzzle)) : undefined
  const heading = featured?.h1 ?? `${name} Jigsaw Puzzle`

  // Pre-select the piece count the hand-written page recommends.
  useEffect(() => {
    const preset = featured && DIFFICULTIES.find((d) => d.pieces === featured.recommended.pieces)
    if (preset) useUiStore.getState().setDifficulty(preset.key)
  }, [featured])

  const siblings = useSiblings(puzzle ?? null)
  const info = useMemo(() => {
    if (!puzzle || !siblings) return null
    const ctx = categoryContext(
      siblings.map((p) => ({ id: rawId(p), tags: p.tags, author: p.author, w: p.width, h: p.height })),
      siblings.map((p) => p.title),
    )
    const i = siblings.findIndex((p) => p.id === puzzle.id)
    return { copy: puzzleCopy(ctx, Math.max(0, i), categoryNode?.label ?? null), siblings }
  }, [puzzle, siblings, categoryNode])

  // SEO: unique <title> (subject + category) and a unique meta description built
  // from this image's own tags - so 32k pages don't share templated metadata.
  useEffect(() => {
    if (!puzzle) {
      document.title = SITE
      return
    }
    if (featured) {
      document.title = featured.title
      setMeta('description', featured.description)
      setCanonical(featuredPath(featured))
      return resetHead
    }
    const catBit = categoryNode ? ` ${categoryNode.label}` : ''
    document.title = `${heading} - Free${catBit} Puzzle Online | ${SITE}`
    setMeta('description', puzzleDescription(name, puzzle.tags, puzzle.author))
    // Self-referencing canonical so client-side navigation to a puzzle doesn't
    // leave the previous page's canonical in the head.
    if (route) {
      const path = `/puzzle/${route.category}/${route.id}/${route.slug}`
      setCanonical(ENTRY?.path === path && ENTRY.canonical ? ENTRY.canonical : path)
    }
    return resetHead
  }, [puzzle, name, categoryNode, heading, route, featured])

  if (notFound) {
    return (
      <div className="puzpg">
        <div className="puzpg-state">
          <p>Sorry, we couldn’t find that puzzle.</p>
          <button className="btn btn--primary" onClick={() => useUiStore.getState().goHome()}>
            Back home
          </button>
        </div>
      </div>
    )
  }

  if (!puzzle) {
    return (
      <div className="puzpg">
        <div className="puzpg-state">
          <Spinner />
          <p>Loading puzzle…</p>
        </div>
      </div>
    )
  }

  const play = () => {
    const { difficulty, startPuzzle } = useUiStore.getState()
    startPuzzle(puzzle, difficulty)
  }

  return (
    <div className="puzpg">
      <nav className="puzpg-crumbs" aria-label="Breadcrumb">
        <button type="button" className="puzpg-crumb" onClick={() => useUiStore.getState().goHome()}>
          Home
        </button>
        <span className="puzpg-sep" aria-hidden="true">
          /
        </span>
        {categoryNode && !featured ? (
          <>
            <button
              type="button"
              className="puzpg-crumb"
              onClick={() => useUiStore.getState().browseCategory(categoryNode)}
            >
              {categoryNode.label}
            </button>
            <span className="puzpg-sep" aria-hidden="true">
              /
            </span>
          </>
        ) : null}
        <span className="puzpg-crumb is-current">{featured ? heading : name}</span>
      </nav>

      <div className={`puzpg-grid${featured ? ' puzpg-grid--featured' : ''}`}>
        <figure className="puzpg-figure">
          <img
            className="puzpg-img"
            src={puzzle.url}
            alt={featured?.alt ?? `${heading} - free online jigsaw puzzle photo`}
            width={puzzle.width}
            height={puzzle.height}
          />
        </figure>

        <div className="puzpg-panel">
          <h1 className="puzpg-title">{heading}</h1>
          {puzzle.author && !featured ? (
            <p className="puzpg-credit">
              Photo by{' '}
              <a href="https://pixabay.com" target="_blank" rel="noreferrer">
                {puzzle.author}
              </a>{' '}
              on Pixabay
            </p>
          ) : null}

          {/* Hand-written pages put the intro under the photo instead (see below). */}
          {featured ? null : (
            <p className="puzpg-lead">
              Choose your difficulty and start solving - drag the pieces, watch them snap together,
              and relax at your own pace.
            </p>
          )}

          <DifficultyPicker />

          <button type="button" className="btn btn--primary btn--lg puzpg-play" onClick={play}>
            <Icon name="play" size={18} /> Play puzzle
          </button>

          {featured ? (
            <p className="puzpg-recommend">
              <strong>Recommended: {featured.recommended.pieces} pieces.</strong>{' '}
              {featured.recommended.why}
            </p>
          ) : null}
        </div>

        {featured ? <p className="puzpg-lead puzpg-intro">{featured.lead}</p> : null}
      </div>

      {featured ? (
        <FeaturedInfo featured={featured} onPlay={play} />
      ) : info ? (
        <PuzzleInfo copy={info.copy} siblings={info.siblings} />
      ) : null}
    </div>
  )
}

function PuzzleInfo({
  copy,
  siblings,
}: {
  copy: ReturnType<typeof puzzleCopy>
  siblings: GalleryPuzzle[]
}) {
  const open = (e: React.MouseEvent, p: GalleryPuzzle) => {
    // Real <a href> so crawlers follow it; plain clicks stay in the SPA.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    useUiStore.getState().viewPuzzle(p)
    window.scrollTo({ top: 0 })
  }
  return (
    <div className="puzpg-info">
      <section className="puzpg-sec">
        <h2>{copy.headings.about}</h2>
        <p>{copy.about}</p>
        {copy.photographer ? <p>{copy.photographer}</p> : null}
        <dl className="puzpg-facts">
          {copy.facts.map((f) => (
            <div key={f.k}>
              <dt>{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
        </dl>
        {copy.tags.length ? (
          <ul className="puzpg-tags" aria-label="Tags">
            {copy.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="puzpg-sec">
        <h2>{copy.headings.sizes}</h2>
        <p>{copy.sizes}</p>
      </section>

      <section className="puzpg-sec">
        <h2>{copy.headings.tips}</h2>
        <ul>
          {copy.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      {copy.similar.length ? (
        <section className="puzpg-sec">
          <h2>{copy.headings.similar}</h2>
          <ul className="puzpg-similar">
            {copy.similar.map((j) => {
              const p = siblings[j]
              return (
                <li key={p.id}>
                  <a href={hrefFor(p)} onClick={(e) => open(e, p)}>
                    <img src={p.thumbUrl} alt={`${p.title} jigsaw puzzle`} loading="lazy" width={p.width} height={p.height} />
                    <span>{p.title}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

/** Hand-written sections, FAQ and links to the other hand-written puzzles. */
function FeaturedInfo({ featured, onPlay }: { featured: FeaturedPuzzle; onPlay: () => void }) {
  const others = FEATURED_PUZZLES.filter((f) => f !== featured)
  const go = (e: React.MouseEvent, f: FeaturedPuzzle) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    useUiStore.getState().applyRoute('puzzle', null, null, 1, {
      category: f.category,
      id: f.id,
      slug: f.slug,
    })
    window.scrollTo({ top: 0 })
  }
  return (
    <div className="puzpg-info">
      {featured.sections.map((sec) => (
        <section className="puzpg-sec" key={sec.heading}>
          <h2>{sec.heading}</h2>
          {sec.paras?.map((t) => (
            <p key={t}>{t}</p>
          ))}
          {sec.items ? (
            <ul className="puzpg-list">
              {sec.items.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      <section className="puzpg-sec">
        <h2>Frequently asked questions</h2>
        <dl className="puzpg-faq">
          {featured.faq.map((f) => (
            <div key={f.q}>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="puzpg-cta">
        <p>Ready? Play the {featured.h1.toLowerCase()} now - free, no sign-up.</p>
        <button type="button" className="btn btn--primary btn--lg" onClick={onPlay}>
          <Icon name="play" size={18} /> Play puzzle
        </button>
      </div>

      <section className="puzpg-sec">
        <h2>More free jigsaw puzzles</h2>
        <ul className="puzpg-more">
          {others.map((f) => (
            <li key={f.slug}>
              <a href={featuredPath(f)} onClick={(e) => go(e, f)}>
                {f.h1}
              </a>
            </li>
          ))}
          {FEATURED_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
