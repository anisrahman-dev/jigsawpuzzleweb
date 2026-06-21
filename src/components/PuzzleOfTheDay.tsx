// Puzzle of the Day - a deterministic daily pick from the (human-free) catalog.
// Everyone sees the same puzzle each calendar day, stable across reloads; it
// rotates category + image by the UTC day index.
import { useEffect, useState } from 'react'
import { loadCategoryCatalog, type GalleryPuzzle } from '@/data/gallery'
import { useUiStore } from '@/store/uiStore'
import { Icon } from '@/components/Icon'
import './PuzzleOfTheDay.css'

/** 0-based day of the year - maps each calendar day to one of the 365 picks. */
function dayOfYear(): number {
  const now = new Date()
  const start = Date.UTC(now.getFullYear(), 0, 0)
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.floor((today - start) / 86_400_000) - 1
}

export function PuzzleOfTheDay() {
  const [puzzle, setPuzzle] = useState<GalleryPuzzle | null>(null)

  useEffect(() => {
    let cancelled = false
    // A dedicated 365-image, human-free daily set; one image per day of the year.
    loadCategoryCatalog('daily')
      .then((list) => {
        if (cancelled || list.length === 0) return
        setPuzzle(list[((dayOfYear() % list.length) + list.length) % list.length])
      })
      .catch(() => {
        /* daily set missing - just skip the feature */
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (!puzzle) return null

  const open = () => useUiStore.getState().viewPuzzle(puzzle)

  // Today's date, e.g. "Jun 21" - a quiet tag on the right side.
  const today = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

  // A light difficulty hint derived purely from the piece count.
  const difficulty = puzzle.pieces <= 48 ? 'Easy' : puzzle.pieces <= 150 ? 'Medium' : 'Hard'

  return (
    <section className="potd" aria-label="Puzzle of the day">
      <button type="button" className="potd-card" onClick={open}>
        <span className="potd-media">
          <span className="potd-badge">
            <Icon name="puzzle" size={13} />
            <b>{puzzle.pieces}</b> pieces
          </span>
          <img
            className="potd-img"
            src={puzzle.thumbUrl}
            alt={puzzle.title}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </span>

        <span className="potd-body">
          <span className="potd-head">
            <span className="potd-eyebrow">
              <Icon name="sparkle" size={13} /> Puzzle of the day
            </span>
            <span className="potd-date">
              <Icon name="clock" size={12} /> {today}
            </span>
          </span>

          <span className="potd-title">{puzzle.title}</span>

          <span className="potd-meta">
            <span className="potd-author">by {puzzle.author}</span>
            <span className="potd-chip potd-chip--accent">
              <Icon name="grid" size={12} /> {difficulty}
            </span>
          </span>

          <span className="potd-foot">
            <span className="potd-cta">
              Play now <Icon name="arrow-right" size={16} />
            </span>
          </span>
        </span>
      </button>
    </section>
  )
}
