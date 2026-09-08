// Shared puzzle-title generator - imported by BOTH the React app
// (src/data/gallery.ts) and the prerender step (scripts/seo-build.mjs), so a
// puzzle's <title>/<h1> is byte-identical whether Google sees the static HTML
// or the hydrated app. Plain ESM (no TS) precisely so node can import it too;
// types live in puzzleTitles.d.mts.
//
// Why this exists: Pixabay's first tag is usually a bare noun, so naming a page
// after it produced 289 pages called "Cat", 252 called "Frog" - 73% of the 33k
// puzzle pages shared a title with a sibling. Instead we name each puzzle after
// its most DISTINCTIVE tags (rarest within its own category), which is both
// unique and a better description of the actual photo.

/** Upper-case the first letter of each word. */
const titleCase = (s) => String(s).replace(/\b\w/g, (m) => m.toUpperCase())

/** Longest display name we'll build before the uniquifier kicks in. */
const MAX_LEN = 48

/** Lower-cased, whitespace-collapsed, de-duplicated tag list. */
function normalizeTags(tagStr) {
  const seen = new Set()
  const out = []
  for (const raw of String(tagStr ?? '').split(',')) {
    const t = raw.trim().toLowerCase().replace(/\s+/g, ' ')
    if (!t || seen.has(t)) continue
    seen.add(t)
    out.push(t)
  }
  return out
}

/** Trim to `max` chars on a word boundary (never mid-word). */
function clamp(s, max) {
  if (s.length <= max) return s
  const cut = s.slice(0, max)
  const sp = cut.lastIndexOf(' ')
  return (sp > 12 ? cut.slice(0, sp) : cut).trim()
}

/**
 * The URL slug name for a puzzle: the bare first tag, exactly as it has always
 * been. Kept deliberately stable - changing it would move all ~33k puzzle URLs
 * and throw away everything Google has already crawled.
 */
export function slugName(tagStr) {
  const first = String(tagStr ?? '').split(',')[0] ?? ''
  return titleCase(first.trim()) || 'Puzzle'
}

/**
 * Display names for a whole category's image list, in the same order.
 * Needs the full list because "distinctive" is defined relative to the other
 * photos in the category (a tag on 300 of 450 dog photos tells you nothing).
 *
 * @param {{id:string,tags?:string,author?:string}[]} images
 * @returns {string[]} one display name per image
 */
export function displayNames(images) {
  const tokens = images.map((im) => normalizeTags(im.tags))

  // Document frequency of each tag within this category.
  const df = new Map()
  for (const tags of tokens) {
    for (const t of new Set(tags)) df.set(t, (df.get(t) ?? 0) + 1)
  }

  const used = new Set()
  return images.map((im, i) => {
    const tags = tokens[i]
    if (tags.length === 0) return 'Puzzle'

    const head = tags[0]
    // Rarest tag first; ties broken by the photographer's own tag order.
    const ranked = [...tags].sort(
      (a, b) => (df.get(a) ?? 0) - (df.get(b) ?? 0) || tags.indexOf(a) - tags.indexOf(b),
    )

    // Lead with the most distinctive tag, folding in the head noun for context
    // when the distinctive tag doesn't already imply it ("chubu mountain
    // national park" stands alone; "attentive" becomes "Attentive Dog").
    const lead = ranked[0]
    let base = lead.includes(head) || head.includes(lead) ? lead : `${lead} ${head}`
    base = clamp(base, MAX_LEN)

    // Disambiguate against earlier pages in this same category by pulling in
    // the next-rarest tag, then finally the photographer.
    let name = titleCase(base)
    for (let k = 1; k < ranked.length && used.has(name.toLowerCase()); k++) {
      const extra = ranked[k]
      if (base.includes(extra) || extra.includes(base)) continue
      name = titleCase(`${base} ${extra}`)
    }
    if (used.has(name.toLowerCase()) && im.author) name = `${name} by ${im.author}`
    // Same tags AND same photographer: nothing left to tell them apart but a
    // number. Rare (~0.2%), but it guarantees no two pages share a title.
    if (used.has(name.toLowerCase())) {
      const stem = name
      for (let dup = 2; used.has(name.toLowerCase()); dup++) name = `${stem} (${dup})`
    }

    used.add(name.toLowerCase())
    return name
  })
}

/** Distinct descriptive tags not already implied by `name`, title-cased. */
export function extraTags(tags, name, limit) {
  const seen = String(name ?? '').toLowerCase()
  const out = []
  for (const raw of String(tags ?? '').split(',')) {
    const t = raw.trim()
    if (!t || seen.includes(t.toLowerCase()) || out.some((o) => o.toLowerCase() === t.toLowerCase()))
      continue
    out.push(titleCase(t))
    if (out.length >= limit) break
  }
  return out
}

/**
 * Meta description for a single puzzle page. Shared so the prerendered HTML and
 * the hydrated app emit the same string. Leads with the bits that differ per
 * page (subject, its own tags, photographer) so the unique part survives
 * Google's ~160-character snippet cut.
 */
export function puzzleDescription(name, tags, author) {
  const extra = extraTags(tags, name, 2)
  const feature = extra.length ? ` featuring ${extra.join(' and ').toLowerCase()}` : ''
  const by = author ? ` Photo by ${author}.` : ''
  return `Free ${name} jigsaw puzzle${feature} - play online at 12 to 300 pieces, no login.${by}`
}
