import { useUiStore } from '@/store/uiStore'
import { FEATURED_PUZZLES, featuredPath, type FeaturedPuzzle } from '@/data/featuredPuzzles.mjs'
import { BrandMark } from './BrandMark'
import { Icon } from '@/components/Icon'
import './Footer.css'

const CHRISTMAS = FEATURED_PUZZLES.filter((f) => f.category === 'christmas')
const MORE = FEATURED_PUZZLES.filter((f) => f.category !== 'christmas')
const HERO = FEATURED_PUZZLES[0]

/** "Christmas Market Jigsaw Puzzle" -> "Christmas Market" for compact link lists. */
const shortName = (f: FeaturedPuzzle) => f.h1.replace(/ Jigsaw Puzzle$/, '')

/** Open a hand-written puzzle page inside the app; the real href stays for crawlers. */
function openPuzzle(e: React.MouseEvent, f: FeaturedPuzzle) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  e.preventDefault()
  useUiStore.getState().applyRoute('puzzle', null, null, 1, {
    category: f.category,
    id: f.id,
    slug: f.slug,
  })
  window.scrollTo({ top: 0 })
}

function PuzzleLinks({ title, items }: { title: string; items: FeaturedPuzzle[] }) {
  return (
    <nav className="footer-col" aria-label={title}>
      <h2 className="footer-col-title">{title}</h2>
      <ul>
        {items.map((f) => (
          <li key={f.slug}>
            <a href={featuredPath(f)} onClick={(e) => openPuzzle(e, f)}>
              {shortName(f)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/**
 * Site footer: brand + call to action, links to all 10 hand-written puzzle
 * pages, a "Play" column, and a bottom bar with copyright and photo credit.
 */
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <BrandMark size={28} />
            <p className="footer-tagline">
              Hand-picked jigsaw puzzles, free to play in your browser. No download, no sign-up -
              just pick a picture and start.
            </p>
            <a
              className="footer-cta"
              href={featuredPath(HERO)}
              onClick={(e) => openPuzzle(e, HERO)}
            >
              <Icon name="play" size={16} />
              Play the puzzle of the season
            </a>
          </div>

          <PuzzleLinks title="Christmas puzzles" items={CHRISTMAS} />
          <PuzzleLinks title="More puzzles" items={MORE} />

          <nav className="footer-col" aria-label="Play">
            <h2 className="footer-col-title">Play</h2>
            <ul>
              <li>
                <a
                  href="/jigsaw-puzzles-for-seniors"
                  onClick={(e) => {
                    e.preventDefault()
                    useUiStore.getState().showLanding('jigsaw-puzzles-for-seniors')
                    window.scrollTo({ top: 0 })
                  }}
                >
                  Puzzles for seniors
                </a>
              </li>
              <li>
                <a
                  href="/create-a-custom-jigsaw-puzzle"
                  onClick={(e) => {
                    e.preventDefault()
                    useUiStore.getState().showCustom()
                    window.scrollTo({ top: 0 })
                  }}
                >
                  Make your own puzzle
                </a>
              </li>
              <li>
                <button type="button" onClick={() => useUiStore.getState().openHowTo()}>
                  How to play
                </button>
              </li>
              <li>
                <button type="button" onClick={() => useUiStore.getState().openSettings()}>
                  Settings
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} JigsawJam. All rights reserved.</p>
          <p>
            Photos from{' '}
            <a href="https://pixabay.com" target="_blank" rel="noreferrer">
              Pixabay
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}
