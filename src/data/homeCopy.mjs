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
  'Free online jigsaw puzzles to play in your browser: a Christmas market, a steam train, Neuschwanstein Castle and more. 12 to 300 pieces, no download.'

export const HOME_FAQ = [
  {
    q: 'Are these jigsaw puzzles free?',
    a: 'Yes. Every jigsaw puzzle on JigsawJam is free to play online. There is no account, no subscription, and no app or download - you play directly in your web browser.',
  },
  {
    q: 'Do I need to download anything or sign up?',
    a: 'No. Pick a puzzle and start straight away in your browser, on a phone, tablet or computer. Nothing to install and no login.',
  },
  {
    q: 'How many pieces can a puzzle have?',
    a: 'You choose: every puzzle can be played at 12, 48, 108 or 300 pieces. Each puzzle page also recommends the piece count that suits its picture best.',
  },
  {
    q: 'Which puzzle should I start with?',
    a: 'For something quick and cheerful, try the gingerbread house, nutcracker or snowman at 48 pieces. For a longer game, try the Christmas market, steam train or Neuschwanstein Castle at 108 or 300 pieces.',
  },
  {
    q: 'Are these classic jigsaw puzzles?',
    a: 'Yes. Every puzzle is a real photograph cut into traditional interlocking pieces that you drag into place and snap together - a classic jigsaw you play online, not a sliding puzzle.',
  },
  {
    q: 'Can I make a jigsaw puzzle from my own photo?',
    a: 'Yes. The custom puzzle maker turns any photo into a free online jigsaw puzzle you can play right away.',
  },
]
