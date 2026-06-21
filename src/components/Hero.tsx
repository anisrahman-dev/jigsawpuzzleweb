import { useUiStore } from '@/store/uiStore'
import { HERO_PUZZLE } from '@/data/gallery'
import { Icon } from '@/components/Icon'
import './Hero.css'

/**
 * Spotlight banner at the top of the gallery home. Big serif headline + subtitle
 * on the left; a richly framed, slightly tilted preview of HERO_PUZZLE on the right.
 */
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-inner">
        <div className="hero-copy">
          <span className="hero-eyebrow">
            <Icon name="sparkle" size={16} className="hero-eyebrow-icon" />
            Free jigsaw puzzles
          </span>

          <h2 id="hero-title" className="hero-title">
            Unwind with a<br />
            beautiful jigsaw
          </h2>

          <p className="hero-subtitle">
            Hundreds of free puzzles. Pick a picture, choose your pieces, and start
            solving - no login, ever.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn btn--primary btn--lg hero-cta"
              onClick={() => useUiStore.getState().openPreview(HERO_PUZZLE)}
            >
              <Icon name="play" size={18} />
              Play this puzzle
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--lg"
              onClick={() => useUiStore.getState().openHowTo()}
            >
              <Icon name="help" size={18} />
              How to play
            </button>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="hero-frame">
            <div className="hero-photo">
              <img className="hero-img" src={HERO_PUZZLE.url} alt="" loading="eager" />
              <span className="hero-cut hero-cut--v" />
              <span className="hero-cut hero-cut--h" />
              <span className="hero-knob hero-knob--top" />
              <span className="hero-knob hero-knob--right" />
            </div>
          </div>

          {/* Loose decorative pieces resting beside the frame */}
          <span className="hero-piece hero-piece--a">
            <PieceGlyph />
          </span>
          <span className="hero-piece hero-piece--b">
            <PieceGlyph />
          </span>
        </div>
      </div>
    </section>
  )
}

/** A small jigsaw-piece silhouette used for the loose decorative pieces. */
function PieceGlyph() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" focusable="false">
      <path
        d="M14 14h24a8 8 0 0 1 8-8 8 8 0 0 1 8 8h24v24a8 8 0 0 0 8 8 8 8 0 0 0 8-8v24H14V58a8 8 0 0 1 8-8 8 8 0 0 1-8-8V14Z"
        fill="currentColor"
      />
    </svg>
  )
}
