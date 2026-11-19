// Hand-written editorial content for individual category pages.
//
// Imported by BOTH the React app (src/components/CategoryPage.tsx) and the
// prerender step (scripts/seo-build.mjs), so the static HTML and the hydrated
// page stay identical. Plain ESM; types in categoryEditorial.d.mts.
//
// Why this exists: the templated copy in categoryCopy.mjs gives every category
// page the same sentences with the subject swapped in. Google treats pages like
// that as near-duplicates and declines to index most of them. A category listed
// here gets copy written for that subject alone - its own title, description,
// intro, sections, FAQ, a hand-picked set of featured puzzles shown first, and
// links to related pages. Categories not listed here fall back to the template.
//
// Each entry is chosen from real Search Console queries; see the comment on it.

export const CATEGORY_EDITORIAL = {
  // Queries: "christmas jigsaw puzzles free", "xmas puzzles online".
  // Seasonal - searches peak through December.
  christmas: {
    title: 'Free Christmas Jigsaw Puzzles - Play 450 Online | JigsawJam',
    description:
      'Free Christmas jigsaw puzzles to play online: Christmas markets, gingerbread houses, nutcrackers, snowmen and tree lights. 12 to 300 pieces, no download.',
    lead:
      'Play 450 free Christmas jigsaw puzzles online - lit-up Christmas markets, gingerbread houses, nutcrackers, snowmen, poinsettias and trees full of lights. Pick a picture, choose 12, 48, 108 or 300 pieces, and start in your browser. No login, no app and nothing to download.',
    // Shown first in the grid, in this order. Raw catalogue image ids.
    featured: [
      '4705885', // carousel at a Christmas market at night
      '6796079', // gingerbread house between snowy fir trees
      '3584366', // nutcracker king with coloured lights behind
      '1882635', // little snowman in the snow with cinnamon sticks
      '4664313', // paper star lanterns
      '648430', // town street strung with Christmas lights
      '7590151', // Santa snow globe with candles and baubles
      '4727586', // red poinsettias
      '2991174', // cinnamon star cookies, walnuts and pine cones
      '7631785', // knitted snowman in a decorated tree
      '5019272', // pine cone and dried orange wreath
      '1934945', // box of glass ornaments
      '4678018', // pile of wrapped red presents
      '2961073', // reindeer and teddy bear figurines in snow
      '5767159', // toy-soldier nutcracker
    ],
    sections: [
      {
        heading: "What's in the Christmas puzzle collection",
        paras: [
          'The 450 pictures cover most of what people picture when they think of Christmas. There are night scenes of Christmas markets and town streets strung with lights; close-ups of decorations - glass baubles, paper star lanterns, snow globes and wooden nutcrackers; snowy scenes with snowmen and a gingerbread house; festive food such as cinnamon star cookies; and seasonal plants, from red poinsettias to pine cone wreaths.',
          "Mixed in are gift-wrap patterns and close-ups of blurred lights. They're festive, but they make much harder puzzles than they look, so if you want a gentle game, start with one of the featured pictures above.",
        ],
      },
      {
        heading: 'Which Christmas puzzles are easiest?',
        paras: [
          'Go for pictures with one clear subject and big blocks of colour: a snowman against white snow, the gingerbread house against a blue sky, or a single nutcracker. These work well at 12 or 48 pieces and are a good choice for children, for older players, or for a short break.',
          'Busy scenes such as the Christmas market carousel or a lit-up street are best at 108 pieces - plenty to sort, but every part of the picture looks different, so pieces are easy to place once you get going.',
          'Save gift-wrap patterns and close-ups of blurred lights for 300 pieces. Their colours repeat across the whole picture, so you have to fit pieces by shape rather than by what they show.',
        ],
      },
      {
        heading: 'Tips for solving Christmas jigsaw puzzles',
        paras: [
          "Red, green and gold turn up all over a Christmas picture, so sorting by colour alone gets you less far than usual. Sort by texture instead: fir needles, shiny glass, wrapping paper and snow each look different even when they're the same colour.",
          'In night scenes, build the brightest lights first. Strings of lights and shop windows are easy to spot and give you a frame to fill the dark areas in around them.',
          "If you get stuck, turn on the preview to see a faint copy of the finished picture under the pieces. It's especially useful on the patterned puzzles.",
        ],
      },
      {
        heading: 'Make a Christmas puzzle from your own photo',
        paras: [
          'Have a favourite photo from a family Christmas? Upload it to the custom puzzle maker and it turns into a jigsaw you can play right away, at any of the same piece counts.',
        ],
      },
    ],
    related: [
      { href: '/event/christmas', label: 'Christmas puzzle event', note: 'themed pictures with bonus points while it runs' },
      { href: '/create-a-custom-jigsaw-puzzle', label: 'Make your own Christmas puzzle', note: 'from a photo of your own' },
      { href: '/daily-jigsaw-puzzle', label: 'Daily jigsaw puzzle', note: 'a new picture every day' },
      { href: '/jigsaw-puzzles-for-seniors', label: 'Jigsaw puzzles for seniors', note: 'easy, large-piece games' },
      { href: '/300-piece-jigsaw-puzzles', label: '300 piece jigsaw puzzles', note: 'for a longer challenge' },
      { href: '/thanksgiving-online-free-jigsaw-puzzles', label: 'Thanksgiving jigsaw puzzles', note: 'harvest tables and autumn scenes' },
    ],
    faq: [
      {
        q: 'Are these Christmas jigsaw puzzles free?',
        a: 'Yes. All 450 Christmas jigsaw puzzles are free to play online. There is no login, no app to install and nothing to download - pick a picture and start.',
      },
      {
        q: 'How many pieces can I choose?',
        a: 'Every Christmas puzzle can be played at 12, 48, 108 or 300 pieces. You can replay the same picture at a different size whenever you like.',
      },
      {
        q: 'Which Christmas puzzles are good for seniors or children?',
        a: 'Pictures with one clear subject and large areas of colour - snowmen, the gingerbread house, a single nutcracker or a poinsettia - are the easiest, especially at 12 or 48 pieces.',
      },
      {
        q: 'Can I play Christmas jigsaw puzzles on a phone or tablet?',
        a: 'Yes. The puzzles run in the web browser, so they work on phones, tablets and computers without installing anything.',
      },
      {
        q: 'Can I make a Christmas jigsaw puzzle from my own photo?',
        a: 'Yes. Use the custom puzzle maker to turn any photo - a family Christmas, your tree, a snowy garden - into a free online jigsaw puzzle.',
      },
    ],
  },
}

/** Hand-written content for a category, or undefined to use the template. */
export function categoryEditorial(key) {
  return CATEGORY_EDITORIAL[key]
}

/**
 * Put an editorial's featured images first, in the editorial's order, and keep
 * the rest in their original order. Items whose id isn't featured are left
 * where they were relative to each other.
 * @template T
 * @param {T[]} items
 * @param {string[] | undefined} featured raw catalogue ids
 * @param {(item: T) => string} idOf raw catalogue id of an item
 * @returns {T[]}
 */
export function featuredFirst(items, featured, idOf) {
  if (!featured || featured.length === 0) return items
  const rank = new Map(featured.map((id, i) => [id, i]))
  const top = items.filter((it) => rank.has(idOf(it)))
  top.sort((a, b) => rank.get(idOf(a)) - rank.get(idOf(b)))
  return [...top, ...items.filter((it) => !rank.has(idOf(it)))]
}
