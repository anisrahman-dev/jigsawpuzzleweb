// Per-category search keyword map and <title>/<meta> builders.
//
// Imported by BOTH the React app (src/components/CategoryPage.tsx) and the
// prerender step (scripts/seo-build.mjs), so the static HTML and the hydrated
// page never disagree. Plain ESM so node can import it; types in
// categorySeo.d.mts.
//
// ── Why this exists ────────────────────────────────────────────────────────
// Titles used to read "<Label> Online Free Jigsaw Puzzles", which splits the
// head term apart: nobody searches "dogs online free jigsaw puzzles". Every
// competitor that actually ranks for these terms (JSPuzzles, Puzzle Factory,
// jigsaw.game, freejigsawpuzzles.org) puts the subject IMMEDIATELY before the
// words "jigsaw puzzles", and uses the SINGULAR subject, because that is the
// phrase people type:
//
//   Dog Jigsaw Puzzles Online | JSPuzzles
//   Flower Jigsaw Puzzles: Free Online Puzzles of Flowers
//   Landscape Jigsaw Puzzles Online | JSPuzzles
//
// The one part of this site already shaped that way - the /jigsaw-puzzles-for-
// seniors landing page - is also the only non-home page turning up in results.
// So `kw` below is the exact-match phrase each category is aiming at, and it
// leads the title, where truncation can't reach it.
//
// `hook` is a hand-written description of what is genuinely IN that catalogue.
// It replaces the auto-generated tag list, which produced meta descriptions
// like "havanese dog, bench dog, expression bulldog and more" - real tags, but
// nonsense to a human deciding whether to click.
//
// NOTE: `kw` deliberately does NOT drive the URL slug. Slugs stay exactly as
// they are (categorySlug() in src/data/categories.ts); moving them would 404
// every page Google has already crawled.

/** key -> { kw: exact-match subject for the title, hook: what's in the set } */
export const CATEGORY_SEO = {
  abstract: { kw: 'Abstract', hook: 'colourful patterns, shapes and digital artwork' },
  ads: { kw: 'Vintage Ad', hook: 'retro advertising, old packaging and print ads' },
  airplanes: { kw: 'Airplane', hook: 'vintage aircraft, jets and biplanes in flight' },
  amusement: { kw: 'Amusement Park', hook: 'Ferris wheels, carnival rides and fairgrounds' },
  barns: { kw: 'Barn', hook: 'red barns, hay lofts and old farm buildings' },
  beaches: { kw: 'Beach', hook: 'tropical shores, turquoise water and golden sand' },
  bible: { kw: 'Bible', hook: 'churches, stained glass and religious scenes' },
  birds: { kw: 'Bird', hook: 'songbirds, owls, eagles and colourful parrots' },
  bridges: { kw: 'Bridge', hook: 'stone arches, suspension spans and river crossings' },
  buildings: { kw: 'Building', hook: 'glass towers, old facades and city architecture' },
  cars: { kw: 'Car', hook: 'classic cars, muscle cars and vintage roadsters' },
  castles: { kw: 'Castle', hook: 'medieval fortresses, palaces and hilltop keeps' },
  cats: { kw: 'Cat', hook: 'kittens, tabbies and curious house cats' },
  christmas: { kw: 'Christmas', hook: 'trees, lights, ornaments and snowy village scenes' },
  churches: { kw: 'Church', hook: 'cathedrals, chapels, altars and stained glass' },
  'classic-paintings': { kw: 'Classic Painting', hook: 'renaissance art, old masters and gallery classics' },
  collages: { kw: 'Collage', hook: 'photo mosaics, mixed media and layered artwork' },
  collections: { kw: 'Collection', hook: 'curios, antiques and collected objects' },
  costumes: { kw: 'Costume', hook: 'carnival masks, festival dress and disguises' },
  cows: { kw: 'Cow', hook: 'dairy herds, highland cattle and pasture scenes' },
  creative: { kw: 'Creative Art', hook: 'imaginative artwork, design and digital pieces' },
  dogs: { kw: 'Dog', hook: 'puppies, retrievers, bulldogs and happy mutts' },
  'doors-windows': { kw: 'Door and Window', hook: 'painted doors, shutters and old window frames' },
  events: { kw: 'Festival', hook: 'celebrations, festivals, parades and fireworks' },
  farms: { kw: 'Farm', hook: 'wheat fields, tractors, barns and country life' },
  fish: { kw: 'Fish', hook: 'coral reefs, tropical fish and underwater scenes' },
  flowers: { kw: 'Flower', hook: 'roses, tulips, sunflowers and garden blooms' },
  food: { kw: 'Food', hook: 'fresh fruit, baking, coffee and colourful dishes' },
  frogs: { kw: 'Frog', hook: 'tree frogs, bright poison frogs and pond life' },
  funny: { kw: 'Funny', hook: 'silly animals, cute mishaps and playful photos' },
  halloween: { kw: 'Halloween', hook: "pumpkins, jack-o'-lanterns and spooky scenes" },
  horses: { kw: 'Horse', hook: 'wild horses, foals and horses in open meadows' },
  houses: { kw: 'House', hook: 'cottages, cabins and pretty homes' },
  illustrations: { kw: 'Illustration', hook: 'drawings, sketches and illustrated artwork' },
  insects: { kw: 'Insect', hook: 'butterflies, dragonflies, bees and beetles' },
  lakes: { kw: 'Lake', hook: 'mountain lakes, still water and mirror reflections' },
  landscapes: { kw: 'Landscape', hook: 'mountains, valleys, forests and open country' },
  'lawn-garden': { kw: 'Garden', hook: 'flower beds, greenhouses and garden paths' },
  lighthouses: { kw: 'Lighthouse', hook: 'clifftop beacons, harbour lights and rocky coasts' },
  machines: { kw: 'Machine', hook: 'engines, gears, machinery and mechanical detail' },
  mills: { kw: 'Windmill', hook: 'windmills, watermills and old grinding mills' },
  misc: { kw: 'Miscellaneous', hook: 'everyday objects, colour and curiosities' },
  mural: { kw: 'Mural', hook: 'painted walls, large murals and public art' },
  mystery: { kw: 'Mystery', hook: 'misty forests, fog and atmospheric scenes' },
  mythical: { kw: 'Fantasy', hook: 'dragons, castles in the clouds and fantasy art' },
  'other-animals': { kw: 'Animal', hook: 'wildlife, foxes, deer, bears and more' },
  'other-nature': { kw: 'Nature', hook: 'forests, rivers, rock formations and open sky' },
  'other-structures': { kw: 'Architecture', hook: 'towers, monuments and unusual structures' },
  'other-transportation': { kw: 'Transportation', hook: 'boats, bikes, oldtimers and working vehicles' },
  paintings: { kw: 'Painting', hook: 'oil paintings, canvases and painted scenes' },
  patterns: { kw: 'Pattern', hook: 'repeating shapes, textures and geometric design' },
  posters: { kw: 'Poster', hook: 'retro posters, typography and print design' },
  primates: { kw: 'Monkey', hook: 'monkeys, apes, gorillas and chimpanzees' },
  reptiles: { kw: 'Reptile', hook: 'lizards, snakes, turtles and chameleons' },
  scenic: { kw: 'Scenic', hook: 'viewpoints, coastlines and beautiful outlooks' },
  sculpture: { kw: 'Sculpture', hook: 'statues, carvings and stone figures' },
  seasons: { kw: 'Seasonal', hook: 'spring blossom, summer, autumn leaves and snow' },
  ships: { kw: 'Ship', hook: 'sailing boats, tall ships and harbour scenes' },
  signs: { kw: 'Sign', hook: 'vintage signs, neon lettering and road signs' },
  skylines: { kw: 'City Skyline', hook: 'city skylines, night lights and river views' },
  space: { kw: 'Space', hook: 'galaxies, nebulas, planets and the night sky' },
  sports: { kw: 'Sports', hook: 'stadiums, courts, gear and the game itself' },
  'stamps-coins': { kw: 'Stamp and Coin', hook: 'old stamps, coins, currency and collections' },
  'still-life': { kw: 'Still Life', hook: 'books, clocks, cameras and arranged objects' },
  'street-art': { kw: 'Street Art', hook: 'graffiti, spray art and painted city walls' },
  streetcars: { kw: 'Streetcar', hook: 'trams, trolleys and city streetcars' },
  sunsets: { kw: 'Sunset', hook: 'golden skies, sunset beaches and evening light' },
  technology: { kw: 'Technology', hook: 'gadgets, circuits, screens and machines' },
  thanksgiving: { kw: 'Thanksgiving', hook: 'harvest tables, turkey, pumpkins and autumn' },
  trains: { kw: 'Train', hook: 'steam engines, railways and mountain lines' },
  trucks: { kw: 'Truck', hook: 'big rigs, pickups and vintage delivery trucks' },
  'water-buffalo': { kw: 'Water Buffalo', hook: 'buffalo in rivers, rice fields and pasture' },
  waterfalls: { kw: 'Waterfall', hook: 'cascades, forest falls and mountain streams' },
  'writing-print': { kw: 'Vintage Book', hook: 'old books, handwriting, type and printed pages' },
}

/** Plural labels that have no sensible singular - left exactly as they are. */
const NO_SINGULAR = /^(sports|miscellaneous|still life|technology|space|food|scenic|funny)$/i

/** Crude singulariser, only used for a category with no hand-written entry. */
function singularize(label) {
  if (NO_SINGULAR.test(label)) return label
  if (/ies$/i.test(label)) return label.replace(/ies$/i, 'y')
  if (/(ch|sh|ss|x|z)es$/i.test(label)) return label.replace(/es$/i, '')
  if (/[^s]s$/i.test(label)) return label.replace(/s$/i, '')
  return label
}

/** The exact-match subject phrase this category's title leads with. */
export function categoryKeyword(key, label) {
  return CATEGORY_SEO[key]?.kw ?? singularize(label)
}

/** Hand-written summary of what the catalogue actually contains. */
export function categoryHook(key) {
  return CATEGORY_SEO[key]?.hook ?? ''
}

/** Keywords that are proper nouns and must keep their capital mid-sentence. */
const PROPER_NOUN = new Set(['Christmas', 'Halloween', 'Thanksgiving', 'Bible'])

/**
 * The keyword as it should read inside a sentence: lower-cased, except for
 * proper nouns ("free dog jigsaw puzzles" but "free Christmas jigsaw puzzles").
 */
export function categoryKeywordInline(key, label) {
  const kw = categoryKeyword(key, label)
  return PROPER_NOUN.has(kw) ? kw : kw.toLowerCase()
}

// Title suffixes, longest first. The first one that keeps the whole title
// within MAX_TITLE wins, so the keyword at the front is never what gets cut.
const MAX_TITLE = 62
const SUFFIXES = [
  ' Jigsaw Puzzles - Free Online, No Download',
  ' Jigsaw Puzzles - Free Online',
  ' Jigsaw Puzzles - Free',
  ' Jigsaw Puzzles',
]

/**
 * "<Subject> Jigsaw Puzzles - Free Online, No Download | Brand", degrading to
 * a shorter suffix so the subject at the front is never the part that gets
 * truncated. Shared by category and event pages.
 * @param {string} subject e.g. "Dog", "Halloween"
 * @param {{site?: string}=} opts
 */
export function jigsawTitle(subject, opts = {}) {
  const { site = 'JigsawJam' } = opts
  const brand = site ? ` | ${site}` : ''
  for (const suffix of SUFFIXES) {
    const t = `${subject}${suffix}${brand}`
    if (t.length <= MAX_TITLE) return t
  }
  return `${subject} Jigsaw Puzzles${brand}`
}

/** Every subject a category page already targets, e.g. "Dog", "Christmas". */
const CATEGORY_KEYWORDS = new Set(Object.values(CATEGORY_SEO).map((c) => c.kw))

/**
 * <title> for an event page (/event/<key>).
 *
 * Christmas, Halloween and Thanksgiving exist as BOTH a category (450
 * evergreen photos) and an event (60 themed photos, 3x points). Given the same
 * formula they would ship identical titles and compete with each other for one
 * term. The category is the stronger evergreen page, so it keeps the head term
 * and the event page pivots to the event-specific intent.
 *
 * Lives here, not in the prerender script, so the hydrated React page produces
 * the same title the static HTML shipped.
 * @param {string} name event display name, e.g. "Halloween"
 * @param {{site?: string}=} opts
 */
export function eventTitle(name, opts = {}) {
  const { site = 'JigsawJam' } = opts
  if (CATEGORY_KEYWORDS.has(name)) {
    return `${name} Puzzle Event - Play for 3x Points${site ? ` | ${site}` : ''}`
  }
  return jigsawTitle(name, opts)
}

/**
 * Meta description for an event page, matching eventTitle()'s split.
 * @param {string} name
 * @param {{count?: number, multiplier?: number}=} opts
 */
export function eventDescription(name, opts = {}) {
  const { count = 0, multiplier = 3 } = opts
  const n = count > 0 ? `${count} ` : ''
  if (CATEGORY_KEYWORDS.has(name)) {
    return `The ${name} jigsaw puzzle event is live - solve any of ${n}themed pictures from 12 to 300 pieces and earn ${multiplier}x points while it runs.`
  }
  return `Free ${name} jigsaw puzzles online - ${n}themed pictures to play from 12 to 300 pieces, with ${multiplier}x points during the event. No login or download.`
}

/**
 * <title> for a category page.
 * @param {string} key    category key, e.g. "dogs"
 * @param {string} label  display label, e.g. "Dogs"
 * @param {{page?: number, site?: string}=} opts
 */
export function categoryTitle(key, label, opts = {}) {
  const { page = 1, site = 'JigsawJam' } = opts
  const kw = categoryKeyword(key, label)
  // Paginated pages get a short, plainly-distinct title - they are not trying
  // to rank for the head term, the canonical page 1 is.
  if (page > 1) return `${kw} Jigsaw Puzzles - Page ${page}${site ? ` | ${site}` : ''}`
  return jigsawTitle(kw, opts)
}

/** <h1> for a category page - same phrase as the title, natural word order. */
export function categoryH1(key, label) {
  return `Free ${categoryKeyword(key, label)} Jigsaw Puzzles Online`
}

const MAX_DESC = 158

// Closing sentences, longest first. A long `hook` buys a shorter tail rather
// than losing the hook altogether - the hook is the only part of the sentence
// that differs between categories, so it is the part worth keeping.
const DESC_TAILS = [
  '. Play any puzzle from 12 to 300 pieces, no login or download.',
  '. Play any from 12 to 300 pieces, no download.',
  '. 12 to 300 pieces, no download.',
]

/**
 * Meta description for a category page. Leads with the exact keyword phrase,
 * then says what is actually in the set, then the piece range and the
 * no-login promise.
 * @param {string} key
 * @param {string} label
 * @param {{count?: number}=} facts  from src/data/categoryFacts.mjs
 */
export function categoryDescription(key, label, facts) {
  const kw = categoryKeywordInline(key, label)
  const hook = categoryHook(key)
  const count = facts?.count ?? 0
  const n = count > 0 ? `${count.toLocaleString('en-US')} ` : ''
  if (hook) {
    const head = `Free ${kw} jigsaw puzzles online - ${n}photos of ${hook}`
    for (const tail of DESC_TAILS) {
      if (head.length + tail.length <= MAX_DESC) return head + tail
    }
  }
  // No hand-written hook (or an unusually long one): still lead with the term.
  return `Free ${kw} jigsaw puzzles online - ${n}hand-picked photos to play from 12 to 300 pieces. No login, no app and no download.`
}
