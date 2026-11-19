// Shared category-page copy - imported by BOTH the React app
// (src/components/CategoryPage.tsx) and the prerender step
// (scripts/seo-build.mjs), so the static HTML and the hydrated page say exactly
// the same thing. Plain ESM so node can import it; types in categoryCopy.d.mts.
//
// Why this exists: all 74 category pages used to share one paragraph with the
// label swapped in, and one identical 3-question FAQ. To a search engine that
// is 74 copies of the same page. Here the wording varies by category and, more
// importantly, each page describes the photographs it actually contains.
//
// The prose says "dog jigsaw puzzles", not "dogs jigsaw puzzles": it uses the
// same exact-match keyword the title targets (see categorySeo.mjs), so the
// body reinforces the phrase instead of competing with a near-miss variant.
import { categoryKeywordInline } from './categorySeo.mjs'
import { categoryEditorial } from './categoryEditorial.mjs'

/** Stable small hash so a given category always gets the same phrasing. */
function pick(key, n) {
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0
  return h % n
}

/** "a, b, c and d" */
function list(items) {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

const LEAD = [
  (l, n) =>
    `Play free online ${l} jigsaw puzzles - ${n} hand-picked ${l} photographs, each one playable at any size from 12 pieces up to 300. Choose a picture, set how hard you want it, and start solving. No login, no downloads.`,
  (l, n) =>
    `${n} free ${l} jigsaw puzzles, ready to play in your browser. Every ${l} picture below can be cut into anywhere from 12 to 300 pieces, so the same photo works as a five-minute break or a long, absorbing sit-down.`,
  (l, n) =>
    `A collection of ${n} free online ${l} jigsaw puzzles. Pick any ${l} photo, set your piece count between 12 and 300, then drag the pieces around and watch them snap together. Nothing to install and no account needed.`,
  (l, n) =>
    `Free ${l} jigsaw puzzles you can start right now - ${n} ${l} pictures, each solvable at 12, 48, 108 or 300 pieces. Play in the browser on a phone, tablet or computer, with no sign-up and nothing to download.`,
]

const SUBJECTS = [
  (l, s) => `Among the ${l} puzzles in this collection you'll find ${s}.`,
  (l, s) => `The ${l} photographs here range across ${s}, and plenty more besides.`,
  (l, s) => `Recent additions to the ${l} collection include ${s}.`,
  (l, s) => `Browse the grid below and you'll come across ${s}, among other ${l} pictures.`,
]

const ADVICE = [
  (l) =>
    `If you're new to ${l} puzzles, start at 12 or 48 pieces to get a feel for the picture, then replay the same photo at 108 or 300 once you know where everything sits. Your progress stays on screen while you work, and finished sections move together as one block.`,
  (l) =>
    `Larger piece counts suit ${l} photographs with a lot of fine detail; the wider, simpler compositions are more relaxing at 48 pieces. You can switch difficulty at any time by opening a picture again and choosing a different size.`,
  (l) =>
    `Every ${l} picture is a high-resolution photograph, so the detail holds up even when it's cut into 300 pieces. Turn on the preview if you'd like a faint outline of the finished image to work against.`,
]

/**
 * Copy for one category page.
 * @param {string} key   category key, e.g. "dogs"
 * @param {string} label display label, e.g. "Dogs"
 * @param {{count:number,subjects:string[]}=} facts from src/data/categoryFacts.mjs
 */
export function categoryCopy(key, label, facts) {
  // Hand-written pages (categoryEditorial.mjs) replace the template entirely.
  const ed = categoryEditorial(key)
  if (ed) return { lead: ed.lead, paras: [], faq: ed.faq }
  const l = categoryKeywordInline(key, label)
  const count = facts?.count ?? 0
  const subjects = facts?.subjects ?? []
  const n = count > 0 ? count.toLocaleString('en-US') : 'hundreds of'
  const v = pick(key, 4)

  const paras = []
  if (subjects.length >= 3) paras.push(SUBJECTS[pick(`${key}-s`, 4)](l, list(subjects.slice(0, 4))))
  paras.push(ADVICE[pick(key, 3)](l))

  const faq = [
    {
      q: `Are the ${l} jigsaw puzzles free?`,
      a: `Yes. All ${count > 0 ? count.toLocaleString('en-US') + ' ' : ''}${l} jigsaw puzzles here are free to play online - no login, no app, and no downloads.`,
    },
    {
      q: `How many pieces can I choose?`,
      a: `Each ${l} puzzle can be played from 12 pieces up to 300, so it suits a quick break or a longer, relaxing session. The same picture can be replayed at a different size whenever you like.`,
    },
    {
      q: `Do I need an account to play ${l} puzzles?`,
      a: `No account is needed. Pick any ${l} picture and start solving instantly in your browser, on desktop or mobile.`,
    },
  ]
  if (subjects.length >= 3) {
    faq.push({
      q: `What kinds of ${l} pictures are in this collection?`,
      a: `The ${count.toLocaleString('en-US')} ${l} puzzles include ${list(subjects.slice(0, 6))}. Every one is a high-resolution photograph chosen because it makes a good jigsaw - plenty of colour and detail to work from.`,
    })
  }

  // No `description` here: the meta description is built by
  // categoryDescription() in categorySeo.mjs, from a hand-written summary of
  // each catalogue. The auto-generated tag list this used to produce read like
  // "havanese dog, bench dog, expression bulldog and more" - accurate tags,
  // but not a sentence anyone would click.
  return { lead: LEAD[v](l, n), paras, faq }
}
