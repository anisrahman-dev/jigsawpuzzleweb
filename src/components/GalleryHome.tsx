// Home page: the 10 hand-written puzzle pages (src/data/featuredPuzzles.mjs),
// a featured hero, two card rows, a few other ways to play, and the FAQ.
// The prerender step (buildHome in scripts/seo-build.mjs) emits the same
// content as static HTML from the same data modules.
import { useEffect } from 'react'
import { useUiStore } from '@/store/uiStore'
import { SITE, absUrl, setMeta, setCanonical, setJsonLd, removeJsonLd, resetHead } from '@/lib/seo'
import { Icon } from '@/components/Icon'
import { HOME_TITLE, HOME_DESC, HOME_FAQ } from '@/data/homeCopy.mjs'
import {
  FEATURED_PUZZLES,
  featuredBlurb,
  featuredPath,
} from '@/data/featuredPuzzles.mjs'
import { FeaturedGrid, openFeatured as openPuzzle } from './FeaturedGrid'
import './FeaturedHome.css'

const HERO = FEATURED_PUZZLES[0]
const CHRISTMAS = FEATURED_PUZZLES.filter((f) => f.category === 'christmas' && f !== HERO)
// Two big cards first (train, castle), then three - balanced 2 + 3 on desktop.
const MORE_ORDER = ['trains', 'castles', 'dogs', 'fish', 'flowers']
const MORE = FEATURED_PUZZLES.filter((f) => f.category !== 'christmas').sort(
  (a, b) => MORE_ORDER.indexOf(a.category) - MORE_ORDER.indexOf(b.category),
)

/** schema.org @graph: WebSite, Organization, WebPage, the 10 puzzles, FAQ. */
function homeGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': absUrl('/#website'),
        url: absUrl('/'),
        name: SITE,
        description: HOME_DESC,
        inLanguage: 'en',
        publisher: { '@id': absUrl('/#organization') },
      },
      {
        '@type': 'Organization',
        '@id': absUrl('/#organization'),
        name: SITE,
        url: absUrl('/'),
        logo: { '@type': 'ImageObject', url: absUrl('/logo.png') },
      },
      {
        '@type': 'WebPage',
        '@id': absUrl('/#webpage'),
        url: absUrl('/'),
        name: 'Free Online Jigsaw Puzzles',
        isPartOf: { '@id': absUrl('/#website') },
        inLanguage: 'en',
        mainEntity: { '@id': absUrl('/#puzzles') },
      },
      {
        '@type': 'ItemList',
        '@id': absUrl('/#puzzles'),
        name: 'Free online jigsaw puzzles',
        numberOfItems: FEATURED_PUZZLES.length,
        itemListElement: FEATURED_PUZZLES.map((f, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: f.h1,
          url: absUrl(featuredPath(f)),
          image: f.thumb,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': absUrl('/#faq'),
        mainEntity: HOME_FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}

export function GalleryHome() {
  useEffect(() => {
    document.title = HOME_TITLE
    setMeta('description', HOME_DESC)
    setCanonical('/')
    setJsonLd('ld-home', homeGraph())
    return () => {
      resetHead()
      removeJsonLd('ld-home')
    }
  }, [])

  return (
    <div className="fhome">
      <header className="fhome-intro">
        <h1>Free Online Jigsaw Puzzles</h1>
        <p>
          Ten hand-picked jigsaw puzzles, each with its own story - from a glowing Christmas market
          to a steam train in the Scottish Highlands. Free to play in your browser at 12 to 300
          pieces. No download, no sign-up.
        </p>
      </header>

      <section className="fhome-hero" aria-label="Featured puzzle">
        <a
          className="fhome-hero-media"
          href={featuredPath(HERO)}
          onClick={(e) => openPuzzle(e, HERO)}
          tabIndex={-1}
          aria-hidden="true"
        >
          <img src={HERO.thumb} alt="" width={HERO.width} height={HERO.height} />
        </a>
        <div className="fhome-hero-body">
          <span className="fhome-eyebrow">Puzzle of the season</span>
          <h2>{HERO.h1}</h2>
          <p>{featuredBlurb(HERO)}</p>
          <p className="fhome-hero-meta">Best at {HERO.recommended.pieces} pieces · free · no download</p>
          <a
            className="btn btn--primary btn--lg fhome-hero-btn"
            href={featuredPath(HERO)}
            onClick={(e) => openPuzzle(e, HERO)}
          >
            <Icon name="play" size={18} /> Play this puzzle
          </a>
        </div>
      </section>

      <section className="fhome-section" aria-labelledby="fhome-xmas">
        <div className="fhome-head">
          <span className="fhome-eyebrow">Festive favourites</span>
          <h2 id="fhome-xmas">Christmas jigsaw puzzles</h2>
        </div>
        <FeaturedGrid items={CHRISTMAS} />
      </section>

      <section className="fhome-section" aria-labelledby="fhome-more">
        <div className="fhome-head">
          <span className="fhome-eyebrow">All year round</span>
          <h2 id="fhome-more">More free jigsaw puzzles</h2>
        </div>
        <FeaturedGrid items={MORE} className="fhome-grid--more" />
      </section>

      <section className="fhome-section" aria-labelledby="fhome-ways">
        <div className="fhome-head">
          <h2 id="fhome-ways">More ways to play</h2>
        </div>
        <ul className="fhome-ways">
          <li>
            <a
              href="/jigsaw-puzzles-for-seniors"
              onClick={(e) => {
                e.preventDefault()
                useUiStore.getState().showLanding('jigsaw-puzzles-for-seniors')
              }}
            >
              <strong>Jigsaw puzzles for seniors</strong>
              <span>Easy, relaxing puzzles with large pieces.</span>
            </a>
          </li>
          <li>
            <a
              href="/create-a-custom-jigsaw-puzzle"
              onClick={(e) => {
                e.preventDefault()
                useUiStore.getState().showCustom()
              }}
            >
              <strong>Make a puzzle from your photo</strong>
              <span>Turn any picture into a free online jigsaw.</span>
            </a>
          </li>
        </ul>
      </section>

      <section className="fhome-section fhome-about" aria-labelledby="fhome-about">
        <h2 id="fhome-about">About JigsawJam</h2>
        <p>
          JigsawJam is a home for free online jigsaw puzzles you can play right in your browser - no
          login, no app and no downloads. Instead of thousands of look-alike pictures, every puzzle
          here is chosen by hand and comes with its own page: what is in the photo, the story behind
          it, the best piece count and tips for solving it.
        </p>
        <p>
          Every puzzle can be played at 12, 48, 108 or 300 pieces, on a phone, tablet or computer.
          Pick a quick 12-piece warm-up or settle in with a 300-piece challenge.
        </p>
      </section>

      <section className="fhome-section" aria-labelledby="fhome-faq">
        <h2 id="fhome-faq">Frequently asked questions</h2>
        <dl className="fhome-faq">
          {HOME_FAQ.map((f) => (
            <div key={f.q}>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
