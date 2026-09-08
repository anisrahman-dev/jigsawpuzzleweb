// A single puzzle's own page: "<Image name> Jigsaw Puzzle" with the photo,
// photographer credit, a difficulty picker and a Play button. Each image has
// its own shareable, indexable URL (/puzzle/<category>/<id>/<name>-by-<author>).
import { useEffect, useState } from 'react'
import { ALL_CATEGORIES } from '@/data/categories'
import { findPuzzle, type GalleryPuzzle } from '@/data/gallery'
import { puzzleDescription } from '@/data/puzzleTitles.mjs'
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
  const heading = `${name} Jigsaw Puzzle`

  // SEO: unique <title> (subject + category) and a unique meta description built
  // from this image's own tags - so 32k pages don't share templated metadata.
  useEffect(() => {
    if (!puzzle) {
      document.title = SITE
      return
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
  }, [puzzle, name, categoryNode, heading, route])

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
        {categoryNode ? (
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
        <span className="puzpg-crumb is-current">{name}</span>
      </nav>

      <div className="puzpg-grid">
        <figure className="puzpg-figure">
          <img
            className="puzpg-img"
            src={puzzle.url}
            alt={`${heading} - free online jigsaw puzzle photo`}
            width={puzzle.width}
            height={puzzle.height}
          />
        </figure>

        <div className="puzpg-panel">
          <h1 className="puzpg-title">{heading}</h1>
          {puzzle.author ? (
            <p className="puzpg-credit">
              Photo by{' '}
              <a href="https://pixabay.com" target="_blank" rel="noreferrer">
                {puzzle.author}
              </a>{' '}
              on Pixabay
            </p>
          ) : null}

          <p className="puzpg-lead">
            Choose your difficulty and start solving - drag the pieces, watch them snap together,
            and relax at your own pace.
          </p>

          <DifficultyPicker />

          <button type="button" className="btn btn--primary btn--lg puzpg-play" onClick={play}>
            <Icon name="play" size={18} /> Play puzzle
          </button>
        </div>
      </div>
    </div>
  )
}
