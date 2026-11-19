// Audience landing page (currently /jigsaw-puzzles-for-seniors). Content comes
// from src/data/landings.json via the store's landingKey; the puzzles shown are
// the hand-written puzzle pages, easiest (fewest recommended pieces) first.
import { useEffect } from 'react'
import { landingByKey } from '@/data/landings'
import { FEATURED_PUZZLES } from '@/data/featuredPuzzles.mjs'
import { useUiStore } from '@/store/uiStore'
import { applyLandingHead } from './landingSeo'
import { FeaturedGrid } from './FeaturedGrid'
import './GalleryHome.css'

/** Gentlest puzzles first; ties keep their original order. */
const EASIEST_FIRST = [...FEATURED_PUZZLES].sort(
  (a, b) => a.recommended.pieces - b.recommended.pieces,
)

export function LandingPage() {
  const landingKey = useUiStore((s) => s.landingKey)
  const landing = landingKey ? landingByKey(landingKey) : null

  useEffect(() => {
    if (!landing) return
    const cleanup = applyLandingHead(landing)
    if (landing.difficulty) useUiStore.getState().setDifficulty(landing.difficulty)
    return cleanup
  }, [landing])

  if (!landing) return null

  return (
    <div className="gallery">
      <h1 className="sr-only">{landing.h1}</h1>

      <section className="ghome-about" aria-labelledby="landing-title">
        <div className="ghome-head">
          <div className="ghome-head-text">
            <span className="ghome-eyebrow">Free online jigsaw puzzles</span>
            <h2 className="section-title" id="landing-title">
              {landing.h1}
            </h2>
          </div>
        </div>
        <p className="ghome-about-lead">{landing.lead}</p>
        {landing.paras.map((p, i) => (
          <p className="ghome-about-lead" key={i}>
            {p}
          </p>
        ))}

        <h2 className="section-title ghome-faq-title">Pick a puzzle</h2>
        <FeaturedGrid items={EASIEST_FIRST} />

        <h2 className="section-title ghome-faq-title">Frequently asked questions</h2>
        <dl className="ghome-faq">
          {landing.faq.map(([q, a]) => (
            <div className="ghome-faq-item" key={q}>
              <dt>{q}</dt>
              <dd>{a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
