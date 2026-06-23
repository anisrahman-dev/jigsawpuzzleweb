import { useUiStore } from '@/store/uiStore'
import { BrandMark } from './BrandMark'
import { Icon } from '@/components/Icon'
import './Footer.css'

/**
 * Footer - a warm, calm site footer for the "Sunlit Puzzle Table" theme.
 * Top hairline, content capped at --max-w, generous padding. Carries the
 * brand mark + tagline, a column of quiet link-buttons (How to play, Settings),
 * and a faint copyright line.
 */
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <BrandMark size={24} />
          <p className="footer-tagline">
            Free online jigsaw puzzles - no login required.
          </p>
        </div>

        <nav className="footer-links" aria-label="Footer">
          <a
            href="/daily-jigsaw-puzzle"
            className="footer-link"
            onClick={(e) => {
              e.preventDefault()
              useUiStore.getState().showDaily()
            }}
          >
            <Icon name="sparkle" size={16} />
            Daily puzzle
          </a>
          <a
            href="/categories"
            className="footer-link"
            onClick={(e) => {
              e.preventDefault()
              useUiStore.getState().showCategories()
            }}
          >
            <Icon name="grid" size={16} />
            Categories
          </a>
          <button
            type="button"
            className="footer-link"
            onClick={() => useUiStore.getState().openHowTo()}
          >
            <Icon name="help" size={16} />
            How to play
          </button>
          <button
            type="button"
            className="footer-link"
            onClick={() => useUiStore.getState().openSettings()}
          >
            <Icon name="settings" size={16} />
            Settings
          </button>
        </nav>

        <p className="footer-attribution">
          © {new Date().getFullYear()} JigsawJam. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
