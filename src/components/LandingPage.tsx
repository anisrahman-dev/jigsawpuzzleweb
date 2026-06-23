// Generic SEO landing page (piece-count + audience pages). Content comes from
// src/data/landings.json via the store's landingKey. Piece-count / audience
// pages pre-select their difficulty preset so the next puzzle opens at it.
import { useEffect } from 'react'
import { ALL_CATEGORIES, categorySlug } from '@/data/categories'
import { landingByKey } from '@/data/landings'
import { useUiStore } from '@/store/uiStore'
import { applyLandingHead } from './landingSeo'
import './GalleryHome.css'

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

  const cats = landing.categoryKeys
    .map((k) => ALL_CATEGORIES.find((c) => c.key === k))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))

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

        <ul className="ghome-toplinks">
          {cats.map((c) => (
            <li key={c.key}>
              <a
                href={`/${categorySlug(c.label)}`}
                onClick={(e) => {
                  e.preventDefault()
                  useUiStore.getState().browseCategory(c)
                }}
              >
                {c.label} puzzles
              </a>
            </li>
          ))}
          <li>
            <a
              href="/categories"
              onClick={(e) => {
                e.preventDefault()
                useUiStore.getState().showCategories()
              }}
            >
              All categories
            </a>
          </li>
        </ul>

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
