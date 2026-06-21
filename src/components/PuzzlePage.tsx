// A single puzzle's own page: "<Image name> Jigsaw Puzzle" with the photo,
// photographer credit, a difficulty picker and a Play button. Each image has
// its own shareable, indexable URL (/puzzle/<category>/<id>/<name>-by-<author>).
import { useEffect, useState } from 'react'
import { ALL_CATEGORIES } from '@/data/categories'
import { findPuzzle, type GalleryPuzzle } from '@/data/gallery'
import { setCanonical } from '@/lib/seo'
import { useUiStore } from '@/store/uiStore'
import { DifficultyPicker } from './DifficultyPicker'
import { Spinner } from './Spinner'
import { Icon } from '@/components/Icon'
import './PuzzlePage.css'

const SITE = 'JigsawJam'
const DEFAULT_DESC =
  'Play free online jigsaw puzzles - no login required. Choose any image, pick your difficulty, and start solving.'

/** Distinct descriptive tags from the image, skipping ones already in `name`. */
function extraTags(tags: string | undefined, name: string, limit: number): string[] {
  const seen = name.toLowerCase()
  const out: string[] = []
  for (const raw of (tags ?? '').split(',')) {
    const t = raw.trim()
    if (!t || seen.includes(t.toLowerCase()) || out.some((o) => o.toLowerCase() === t.toLowerCase()))
      continue
    out.push(t.replace(/\b\w/g, (m) => m.toUpperCase()))
    if (out.length >= limit) break
  }
  return out
}

/** Add or update a <meta name="..."> tag in the document head. */
function setMeta(name: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
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
    // Lead with the unique bits (subject + this image's own tags) so the part
    // that differs across pages survives Google's ~160-char snippet cut.
    const tags = extraTags(puzzle.tags, name, 2)
    const feature = tags.length ? ` featuring ${tags.join(' and ').toLowerCase()}` : ''
    setMeta(
      'description',
      `Free ${name} jigsaw puzzle${feature} - play online with 12 to 300 pieces, no login.`,
    )
    // Self-referencing canonical so client-side navigation to a puzzle doesn't
    // leave the previous page's canonical in the head.
    if (route) setCanonical(`/puzzle/${route.category}/${route.id}/${route.slug}`)
    return () => {
      document.title = `${SITE} - Free Online Jigsaw Puzzles`
      setMeta('description', DEFAULT_DESC)
    }
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
