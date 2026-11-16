// Per-photo page copy for /puzzle/... pages - imported by BOTH the React app
// (src/components/PuzzlePage.tsx) and the prerender (scripts/seo-build.mjs), so
// the static HTML and the hydrated page say exactly the same thing. Plain ESM
// so node can import it; types in puzzleCopy.d.mts.
//
// Why: Google indexes the rendered page, and every puzzle page used to be the
// same ~90-word template with the subject swapped in - 27k near-duplicates,
// which it files under "Crawled - currently not indexed". Everything here is
// derived from facts about THIS photo (its full tag set, how rare each tag is
// in its own category, its photographer's other work in the category, its
// resolution and shape, the exact grid the game cuts it into), and the
// sentence templates rotate on a hash of the image id, so no two pages share
// either their facts or their sentence structure.

import { fitGrid } from '../engine/fitGrid.mjs'

const DIFFS = [
  { key: 'easy', label: 'Easy', pieces: 12 },
  { key: 'medium', label: 'Medium', pieces: 48 },
  { key: 'hard', label: 'Hard', pieces: 108 },
  { key: 'expert', label: 'Expert', pieces: 300 },
]

const titleCase = (s) => String(s).replace(/\b\w/g, (m) => m.toUpperCase())

function normTags(tagStr) {
  const seen = new Set()
  const out = []
  for (const raw of String(tagStr ?? '').split(',')) {
    const t = raw.trim().toLowerCase().replace(/\s+/g, ' ')
    if (t && !seen.has(t)) {
      seen.add(t)
      out.push(t)
    }
  }
  return out
}

/** FNV-1a - a stable per-image seed for choosing sentence variants. */
function hash(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Pick from `arr` with the image seed, salted per slot so slots vary independently. */
const pick = (arr, seed, salt) => arr[(hash(`${seed}:${salt}`) % arr.length + arr.length) % arr.length]

function list(items) {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

const aOrAn = (w) => (/^[aeiou]/i.test(w) ? 'an' : 'a')

/**
 * Precompute per-category statistics once (tag document frequency,
 * photographer counts), so building copy for every photo stays O(n).
 *
 * @param {{id:string,tags?:string,author?:string,w:number,h:number}[]} images
 * @param {string[]} names display names, same order (from displayNames)
 */
export function categoryContext(images, names) {
  const tags = images.map((im) => normTags(im.tags))
  const df = new Map()
  for (const ts of tags) for (const t of ts) df.set(t, (df.get(t) ?? 0) + 1)
  const byAuthor = new Map()
  images.forEach((im, i) => {
    const a = im.author || ''
    if (!byAuthor.has(a)) byAuthor.set(a, [])
    byAuthor.get(a).push(i)
  })
  return { images, names, tags, df, byAuthor, n: images.length }
}

/**
 * Indices of the most similar photos in the same category: shared tags
 * weighted by rarity (sharing "reykjavik" means more than sharing "city").
 */
export function similarIndices(ctx, i, limit = 8) {
  const mine = new Set(ctx.tags[i])
  const scored = []
  for (let j = 0; j < ctx.n; j++) {
    if (j === i || ctx.images[j].id === ctx.images[i].id) continue
    let s = 0
    for (const t of ctx.tags[j]) if (mine.has(t)) s += 1 / Math.log2(1 + (ctx.df.get(t) ?? 1))
    if (s > 0) scored.push([s, j])
  }
  scored.sort((a, b) => b[0] - a[0] || a[1] - b[1])
  const out = scored.slice(0, limit).map((x) => x[1])
  // Thin tag overlap: top up with neighbours in catalogue order so every page
  // still links onward (no dead ends for crawlers).
  for (let k = 1; out.length < Math.min(limit, ctx.n - 1) && k < ctx.n; k++) {
    const j = (i + k) % ctx.n
    if (j !== i && !out.includes(j)) out.push(j)
  }
  return out
}

// Solving tips keyed to what is actually in the photo. First match wins per
// tip group; tags are matched as whole words.
const TIP_RULES = [
  [/\b(sky|clouds?|sunset|sunrise|dusk|dawn)\b/, (n) => `The ${n} sky is the slowest part: sort those pieces by how light or warm they are, then work the gradient band by band.`],
  [/\b(sea|ocean|water|lake|river|waves?|beach)\b/, () => `Open water looks uniform but is not - group the pieces by ripple direction and highlight, and the surface comes together quickly.`],
  [/\b(snow|winter|ice|frost)\b/, () => `Snow is nearly white everywhere, so lean on piece shape: lay the plain pieces out in rows and test tabs against blanks.`],
  [/\b(flowers?|blossoms?|petals?|roses?|tulips?|garden)\b/, () => `Build the blooms first - each flower is a small, self-contained cluster of colour you can finish before tackling the background.`],
  [/\b(night|stars?|galaxy|milky way|moon|dark)\b/, () => `In a dark scene, the few bright points are your anchors - place every light, star or reflection first and fill the darkness between them.`],
  [/\b(forest|trees?|woods|leaves|foliage|jungle)\b/, () => `Foliage repeats, so use trunks and branches as landmarks and work outward from them rather than matching leaf to leaf.`],
  [/\b(buildings?|city|architecture|houses?|street|town|church|castle)\b/, () => `Straight lines are a gift here: roof edges, windows and walls tell you exactly which way each piece is turned.`],
  [/\b(cat|dog|kitten|puppy|bird|horse|animal|fox|owl|lion|tiger)\b/, () => `Start with the eyes - they are the sharpest, most distinctive area of an animal portrait - then follow the fur direction outward.`],
  [/\b(train|locomotive|railway|car|truck|bus|tram|ship|boat|plane|airplane|aircraft|motorcycle|bicycle)\b/, (n) => `Treat the ${n} as one block: its hard edges and lettering separate cleanly from the scenery, so assemble it first and set it into place whole.`],
  [/\b(mountains?|hills?|valley|alps|peak)\b/, () => `Find the ridge line first; it splits the picture into sky and land and turns one big puzzle into two easier ones.`],
  [/\b(abstract|pattern|texture|background|colorful|colourful|rainbow)\b/, () => `With no single subject, sort strictly by colour into piles, finish each colour region, then join the regions together.`],
]

const GENERIC_TIPS = [
  'Frame it first: pick out the straight-edged pieces and finish the border before anything else.',
  'Sort by colour before you start - five or six small piles make even the busiest photo manageable.',
  'Work from the most detailed area outward; the plain areas go fastest once their surroundings are in place.',
  'Stuck on a patch? Tap Preview to see the finished picture, then go back to the board knowing exactly where that colour belongs.',
]

/**
 * Everything the puzzle page shows beyond the photo itself.
 *
 * @param {ReturnType<typeof categoryContext>} ctx
 * @param {number} i index of this photo in ctx.images
 * @param {string|null} label category label ("Trains"), or null for curated collections
 * @returns {{
 *   about: string, photographer: string, sizes: string,
 *   tips: string[], facts: {k:string,v:string}[], tags: string[],
 *   similar: number[], headings: {about:string, sizes:string, tips:string, similar:string}
 * }}
 */
export function puzzleCopy(ctx, i, label) {
  const im = ctx.images[i]
  const name = ctx.names[i]
  const seed = String(im.id)
  const tags = ctx.tags[i]
  const coll = label ? `${label}` : 'this'
  const collPhrase = label ? `our ${label} collection` : 'this collection'
  const nameL = name.toLowerCase()

  // ── about: the photo's own tags, rarest first ────────────────────────────
  const rarest = [...tags].sort((a, b) => (ctx.df.get(a) ?? 0) - (ctx.df.get(b) ?? 0))
  const detail = tags.filter((t) => !nameL.includes(t)).slice(0, 5)
  const lead = pick(
    [
      `This ${name} jigsaw puzzle is made from a single photograph`,
      `The picture behind the ${name} puzzle is a photograph`,
      `${name} is a free photo jigsaw`,
      `Our ${name} puzzle uses a photograph`,
      `Behind this puzzle is a photograph titled ${name}`,
    ],
    seed,
    'lead',
  )
  const content = detail.length
    ? pick(
        [
          ` that takes in ${list(detail)}.`,
          ` featuring ${list(detail)}.`,
          ` where you will find ${list(detail)}.`,
          ` built around ${list(detail)}.`,
        ],
        seed,
        'content',
      )
    : '.'
  const r = rarest[0]
  const rc = r ? ctx.df.get(r) ?? 1 : 0
  const rarity = !r
    ? ''
    : rc <= 1
      ? ` It is the only photo in ${collPhrase} tagged “${r}”.`
      : ` Only ${rc} of the ${ctx.n} puzzles in ${collPhrase} are tagged “${r}”.`
  const about = `${lead}${content}${rarity}`

  // ── photographer ─────────────────────────────────────────────────────────
  const author = im.author || ''
  const others = (ctx.byAuthor.get(author) ?? []).filter((j) => j !== i)
  const otherNames = others.slice(0, 2).map((j) => ctx.names[j])
  let photographer = ''
  if (author) {
    photographer = pick(
      [
        `The ${name} photograph was taken by ${author} and shared on Pixabay.`,
        `${author} took the ${name} photo and published it on Pixabay.`,
        `Credit for the ${name} image goes to ${author}, via Pixabay.`,
      ],
      seed,
      'by',
    )
    photographer +=
      others.length === 0
        ? ` It is the only ${label ? `${label} ` : ''}photo by ${author} on JigsawJam.`
        : others.length <= 2
          ? ` You can also play ${list(otherNames)}, ${others.length === 1 ? 'another photo' : 'two more photos'} by ${author} in ${collPhrase}.`
          : ` ${author} has ${others.length} more photos in ${collPhrase}, including ${list(otherNames)}.`
  }

  // ── sizes: real grid per difficulty, from the game's own fitGrid ──────────
  const mp = (im.w * im.h) / 1e6
  const ratio = im.w / im.h
  const shape =
    ratio > 1.9 ? 'a wide panorama' : ratio > 1.15 ? 'a landscape-format' : ratio < 0.87 ? 'a portrait-format' : 'a near-square'
  const grids = DIFFS.map((d) => ({ ...d, ...fitGrid(d.pieces, im.w, im.h) }))
  const g = (d) => `${d.cols} × ${d.rows} (${d.cols * d.rows} pieces)`
  const sizes =
    `The ${name} original is ${shape} image of ${im.w.toLocaleString('en-US')} × ${im.h.toLocaleString('en-US')} pixels ` +
    `(${mp.toFixed(1)} megapixels), so it stays sharp even at 300 pieces. ` +
    pick(
      [
        `Easy cuts it ${g(grids[0])}, Medium ${g(grids[1])}, Hard ${g(grids[2])} and Expert ${g(grids[3])}.`,
        `Pick Easy for a ${g(grids[0])} grid, Medium for ${g(grids[1])}, Hard for ${g(grids[2])}, or Expert for ${g(grids[3])}.`,
        `At Expert the board is ${g(grids[3])}; Hard is ${g(grids[2])}, Medium ${g(grids[1])} and Easy just ${g(grids[0])}.`,
      ],
      seed,
      'sizes',
    )

  // ── tips: subject-specific first, then one generic ───────────────────────
  const tagText = ` ${tags.join(' , ')} `
  const tips = []
  for (const [re, fn] of TIP_RULES) {
    if (tips.length >= 2) break
    const m = tagText.match(re)
    if (m) tips.push(fn(m[1]))
  }
  tips.push(pick(GENERIC_TIPS, seed, 'tip'))

  const facts = [
    { k: 'Photographer', v: author || 'Unknown' },
    { k: 'Collection', v: label || 'Curated' },
    { k: 'Resolution', v: `${im.w.toLocaleString('en-US')} × ${im.h.toLocaleString('en-US')} px` },
    { k: 'Shape', v: titleCase(shape.replace(/^an? /, '').replace(/-format$/, '')) },
    { k: 'Piece counts', v: grids.map((d) => d.cols * d.rows).join(' · ') },
  ]

  return {
    about,
    photographer,
    sizes,
    tips,
    facts,
    tags: tags.slice(0, 12),
    similar: similarIndices(ctx, i),
    headings: {
      about: `About the ${name} photo`,
      sizes: `${name} puzzle sizes`,
      tips: `Tips for solving ${aOrAn(name)} ${name} jigsaw`,
      similar: label ? `More ${label.toLowerCase()} puzzles like ${name}` : `More puzzles like ${name}`,
    },
  }
}
