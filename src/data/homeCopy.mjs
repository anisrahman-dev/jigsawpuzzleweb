// Home-page SEO copy shared by the React home (src/components/GalleryHome.tsx)
// and the prerender step (scripts/seo-build.mjs). These three values are the
// page's actual search signals - the title, the meta description and the
// FAQPage structured data - so they must never drift between the static HTML
// and the hydrated app. Counts come from the catalogue, not from memory.
import { TOTALS } from './categoryFacts.mjs'

const PUZZLES = TOTALS.puzzles.toLocaleString('en-US')
const CATEGORIES = TOTALS.categories

export const HOME_COUNTS = { puzzles: PUZZLES, categories: CATEGORIES }

export const HOME_TITLE = 'Free Online Jigsaw Puzzles to Play - No Download | JigsawJam'

export const HOME_DESC =
  `Free online jigsaw puzzles to play in your browser - no login, no download. ${PUZZLES} jigsaw puzzles online free in ${CATEGORIES} categories, 12 to 300 pieces.`

export const HOME_FAQ = [
  {
    q: 'Is JigsawJam free?',
    a: 'Yes. Every jigsaw puzzle on JigsawJam is free to play online. There is no account, no subscription, and no app or download required - you play directly in your web browser.',
  },
  {
    q: 'Are these jigsaw puzzles free online games with no download?',
    a: 'Yes - JigsawJam is jigsaw puzzles free online games no download required. Everything runs inside your web browser, so there is nothing to install on your phone, tablet or computer.',
  },
  {
    q: 'Do I need an account or login to play?',
    a: 'No. You can start any puzzle straight away in your browser without signing up or logging in, on desktop or mobile.',
  },
  {
    q: 'How many pieces can a puzzle have?',
    a: 'Every puzzle can be played from 12 pieces up to 300 pieces. Pick fewer pieces for a quick game or more for a longer, relaxing challenge.',
  },
  {
    q: 'How many puzzles and categories are there?',
    a: `JigsawJam has ${PUZZLES} puzzles organized into ${CATEGORIES} categories, including Dogs, Cats, Birds, Flowers, Beaches, Landscapes, Space, Food, Castles and Trains.`,
  },
  {
    q: 'Are these classic jigsaw puzzles?',
    a: 'Yes. Every puzzle is a classic jigsaw: a real photograph cut into traditional interlocking tab-and-blank pieces that you drag into place and snap together, from a 12-piece warm-up to a 300-piece challenge. It is a jigsaw puzzle game you play online, not a sliding or swap puzzle.',
  },
  {
    q: 'Are the jigsaw puzzles unblocked?',
    a: 'JigsawJam is an ordinary website served over HTTPS with no Flash, plugins, downloads or pop-ups, so it opens wherever normal websites do. Whether a school or office network allows it depends on that network’s own filter.',
  },
  {
    q: 'What is the Puzzle of the Day?',
    a: 'A new featured puzzle is published every day. During seasonal events such as Halloween and Christmas, solving puzzles earns triple (3x) points while the event is running.',
  },
]
