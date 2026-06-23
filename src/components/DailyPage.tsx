// Daily Jigsaw Puzzle / Puzzle of the Day - a dedicated, crawlable landing page
// that owns the high-volume "daily jigsaw puzzle" / "puzzle of the day" search
// cluster. It surfaces today's deterministic daily pick (the same widget shown
// on the home page) plus keyword-rich copy, an FAQ and internal links.
import { useEffect } from 'react'
import { ALL_CATEGORIES, categorySlug } from '@/data/categories'
import { useUiStore } from '@/store/uiStore'
import { absUrl, setMeta, setCanonical, setJsonLd, removeJsonLd, resetHead } from '@/lib/seo'
import { PuzzleOfTheDay } from './PuzzleOfTheDay'
import { Icon } from '@/components/Icon'
import './GalleryHome.css'

const DAILY_PATH = '/daily-jigsaw-puzzle'
const DAILY_TITLE = 'Daily Jigsaw Puzzle - Free Puzzle of the Day | JigsawJam'
const DAILY_DESC =
  "Play today's free daily jigsaw puzzle online - a new Puzzle of the Day every day, solvable from 12 to 300 pieces. No login, no app, no downloads."

const TOP_KEYS = ['dogs', 'cats', 'birds', 'flowers', 'beaches', 'landscapes', 'space', 'food', 'castles', 'trains']
const TOP_CATEGORIES = TOP_KEYS.map((k) => {
  const c = ALL_CATEGORIES.find((x) => x.key === k)
  const label = c?.label ?? k
  return { key: k, label, path: `/${categorySlug(label)}` }
})

const DAILY_FAQ: { q: string; a: string }[] = [
  {
    q: 'What is the daily jigsaw puzzle?',
    a: 'A new featured jigsaw puzzle - the Puzzle of the Day - is published on JigsawJam every day. Everyone sees the same puzzle each calendar day, and it is free to play with no login or download.',
  },
  {
    q: 'Is the daily puzzle of the day free?',
    a: 'Yes. Today’s daily jigsaw puzzle, and every puzzle on JigsawJam, is completely free to play online in your browser - no account, no subscription and no app required.',
  },
  {
    q: 'How many pieces does the daily puzzle have?',
    a: 'You choose. Every daily jigsaw puzzle can be played from 12 pieces up to 300 pieces, so you can do a quick break or a longer, relaxing challenge.',
  },
  {
    q: 'When does a new daily puzzle appear?',
    a: 'A fresh Puzzle of the Day rotates in each calendar day. Come back tomorrow for a new free daily jigsaw puzzle.',
  },
]

function dailyGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: absUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Daily Jigsaw Puzzle', item: absUrl(DAILY_PATH) },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': absUrl(`${DAILY_PATH}#webpage`),
        url: absUrl(DAILY_PATH),
        name: 'Daily Jigsaw Puzzle - Puzzle of the Day',
        description: DAILY_DESC,
        isPartOf: { '@id': absUrl('/#website') },
        inLanguage: 'en',
      },
      {
        '@type': 'FAQPage',
        mainEntity: DAILY_FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}

export function DailyPage() {
  useEffect(() => {
    document.title = DAILY_TITLE
    setMeta('description', DAILY_DESC)
    setCanonical(DAILY_PATH)
    setJsonLd('ld-daily', dailyGraph())
    return () => {
      resetHead()
      removeJsonLd('ld-daily')
    }
  }, [])

  return (
    <div className="gallery">
      <h1 className="sr-only">Daily Jigsaw Puzzle - Puzzle of the Day</h1>

      <section className="ghome-about" aria-labelledby="daily-title">
        <div className="ghome-head">
          <div className="ghome-head-text">
            <span className="ghome-eyebrow">
              <Icon name="sparkle" size={13} /> Puzzle of the day
            </span>
            <h2 className="section-title" id="daily-title">
              Today’s free daily jigsaw puzzle
            </h2>
          </div>
        </div>
        <p className="ghome-about-lead">
          A brand-new <strong>Puzzle of the Day</strong> is featured every day on JigsawJam - free to
          play right in your browser with no login, no app and no downloads. Solve today’s daily
          jigsaw puzzle from 12 to 300 pieces on desktop or mobile, then come back tomorrow for a
          fresh one.
        </p>
      </section>

      <PuzzleOfTheDay />

      <section className="ghome-about" aria-labelledby="daily-more-title">
        <div className="ghome-head">
          <div className="ghome-head-text">
            <span className="ghome-eyebrow">Keep playing</span>
            <h2 className="section-title" id="daily-more-title">
              More free jigsaw puzzles
            </h2>
          </div>
        </div>
        <p className="ghome-about-lead">
          Want more than the daily puzzle? Browse{' '}
          <button type="button" className="ghome-inlink" onClick={() => useUiStore.getState().showCategories()}>
            all 73 categories
          </button>{' '}
          of free online jigsaw puzzles, or jump straight into a popular one:
        </p>
        <ul className="ghome-toplinks">
          {TOP_CATEGORIES.map((c) => {
            const node = ALL_CATEGORIES.find((x) => x.key === c.key)
            return (
              <li key={c.key}>
                <a
                  href={c.path}
                  onClick={(e) => {
                    e.preventDefault()
                    if (node) useUiStore.getState().browseCategory(node)
                  }}
                >
                  {c.label} puzzles
                </a>
              </li>
            )
          })}
        </ul>

        <h2 className="section-title ghome-faq-title">Daily jigsaw puzzle - frequently asked questions</h2>
        <dl className="ghome-faq">
          {DAILY_FAQ.map((f) => (
            <div className="ghome-faq-item" key={f.q}>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
