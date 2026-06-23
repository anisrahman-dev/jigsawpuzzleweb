#!/usr/bin/env node
// Post-build SEO/AI step. Runs AFTER `vite build` against dist/.
// For every category and every puzzle it writes a STATIC HTML file containing
// the right <title>, meta description, canonical, JSON-LD and real, crawlable
// body content - so non-JS crawlers (many AI answer engines, social bots) see
// the page. When the SPA's JS loads it re-renders into #root and takes over.
// Also emits sitemap.xml (chunked + index) and robots.txt.
//
// Configure your domain:  SITE_URL=https://jigsawjam.com npm run build
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const CATALOG = path.join(ROOT, 'public', 'catalog')
const SITE = 'JigsawJam'
const PAGE_SIZE = 24
// Canonical host is www (the apex 308-redirects to www), so default there - the
// deployed sitemap, canonicals and OG URLs should point at the final host.
const DEFAULT_DOMAIN = 'https://www.jigsawjam.com'
const OG_IMAGE = '/logo.png' // 512x512 brand logo used for social previews
const SITE_URL = (process.env.SITE_URL || DEFAULT_DOMAIN).replace(/\/+$/, '')
const PRERENDER_PUZZLES = process.env.PRERENDER_PUZZLES !== '0'

// ── helpers ──────────────────────────────────────────────────────────────
const escAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const ldSafe = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c')

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
const categorySlug = (label) => `${slugify(label)}-online-free-jigsaw-puzzles`
const puzzleSlug = (title, author) => {
  const t = slugify(title) || 'puzzle'
  const a = slugify(author)
  return a ? `${t}-by-${a}` : t
}
const titleCase = (s) => s.replace(/\b\w/g, (m) => m.toUpperCase())
const subjectName = (tags) => titleCase((tags?.split(',')[0] ?? 'Puzzle').trim())
const abs = (p) => SITE_URL + p
const puzzlePath = (catKey, im) =>
  `/puzzle/${catKey}/${im.id}/${puzzleSlug(subjectName(im.tags), im.author)}`

function extraTags(tags, name, limit) {
  const seen = name.toLowerCase()
  const out = []
  for (const raw of (tags ?? '').split(',')) {
    const t = raw.trim()
    if (!t || seen.includes(t.toLowerCase()) || out.some((o) => o.toLowerCase() === t.toLowerCase()))
      continue
    out.push(titleCase(t))
    if (out.length >= limit) break
  }
  return out
}

function faqFor(label) {
  const l = label.toLowerCase()
  return [
    {
      q: `Are the ${l} jigsaw puzzles free?`,
      a: `Yes. Every ${l} jigsaw puzzle on ${SITE} is free to play online - no login, no app, and no downloads.`,
    },
    {
      q: `How many pieces can I choose?`,
      a: `Each ${l} puzzle can be played from 12 pieces up to 300 pieces, so it suits a quick break or a longer, relaxing session.`,
    },
    {
      q: `Do I need an account to play ${l} puzzles?`,
      a: `No account is needed. Pick any ${l} picture and start solving instantly in your browser, on desktop or mobile.`,
    },
  ]
}

// Parse key -> label from src/data/categories.ts (n('key','label','query') + standalone groups).
async function categoryLabels() {
  const src = await fs.readFile(path.join(ROOT, 'src', 'data', 'categories.ts'), 'utf8')
  const map = new Map()
  let m
  const reN = /n\('([^']+)',\s*'([^']*)',\s*'([^']+)'\)/g
  while ((m = reN.exec(src))) map.set(m[1], m[2].replace(/\\/g, ''))
  const reG = /\{\s*key:\s*'([^']+)',\s*label:\s*'([^']*)',\s*query:\s*'([^']+)',\s*children:\s*\[\]\s*\}/g
  while ((m = reG.exec(src))) if (!map.has(m[1])) map.set(m[1], m[2])
  return map
}

// Parse event key -> display name from src/data/events.ts (ev('key','Name',...)).
async function eventNames() {
  const src = await fs.readFile(path.join(ROOT, 'src', 'data', 'events.ts'), 'utf8')
  const map = new Map()
  let m
  const reSingle = /ev\('([^']+)',\s*'([^']*)'/g
  while ((m = reSingle.exec(src))) map.set(m[1], m[2])
  const reDouble = /ev\('([^']+)',\s*"([^"]*)"/g
  while ((m = reDouble.exec(src))) map.set(m[1], m[2])
  return map
}

// ── HTML assembly ──────────────────────────────────────────────────────────
// Wrap the prerendered SEO body so it stays in the DOM for crawlers but is
// visually hidden (off-screen) - this avoids the brief flash of unstyled
// fallback markup before React mounts and replaces #root.
function prerenderWrap(body) {
  return (
    `<div data-prerender style="position:absolute;width:1px;height:1px;` +
    `padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">` +
    `${body}</div>`
  )
}

function buildHtml(template, { title, description, canonicalPath, prev, next, jsonld, body }) {
  const head = [
    `    <title>${escHtml(title)}</title>`,
    `    <meta name="description" content="${escAttr(description)}" />`,
    `    <link rel="canonical" href="${escAttr(abs(canonicalPath))}" />`,
    prev ? `    <link rel="prev" href="${escAttr(abs(prev))}" />` : '',
    next ? `    <link rel="next" href="${escAttr(abs(next))}" />` : '',
    `    <meta property="og:title" content="${escAttr(title)}" />`,
    `    <meta property="og:description" content="${escAttr(description)}" />`,
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:url" content="${escAttr(abs(canonicalPath))}" />`,
    `    <meta property="og:image" content="${escAttr(abs(OG_IMAGE))}" />`,
    `    <meta name="twitter:card" content="summary" />`,
    `    <meta name="twitter:image" content="${escAttr(abs(OG_IMAGE))}" />`,
    ...jsonld.map((o) => `    <script type="application/ld+json">${ldSafe(o)}</script>`),
  ]
    .filter(Boolean)
    .join('\n')

  return template
    .replace(/    <meta name="description"[^>]*\/>\n/, '')
    // Strip any social tags from the template so we don't emit duplicates.
    .replace(/    <meta property="og:[^>]*\/>\n/g, '')
    .replace(/    <meta name="twitter:[^>]*\/>\n/g, '')
    .replace(/    <title>[\s\S]*?<\/title>/, head)
    .replace('<div id="root"></div>', `<div id="root">${prerenderWrap(body)}</div>`)
}

function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  }
}

function categoryBody(label, slug, images) {
  const l = escHtml(label.toLowerCase())
  const cards = images
    .slice(0, PAGE_SIZE)
    .map((im) => {
      const name = subjectName(im.tags)
      return `<li><a href="${escAttr(puzzlePath(slugKeyByLabel.get(label), im))}"><img src="${escAttr(im.thumb)}" width="${im.w}" height="${im.h}" alt="${escAttr(name)} jigsaw puzzle" loading="lazy" /><span>${escHtml(name)} Jigsaw Puzzle</span></a></li>`
    })
    .join('')
  // A flat link index of every puzzle in the category (internal-link depth for crawlers).
  const allLinks = images
    .map((im) => `<a href="${escAttr(puzzlePath(slugKeyByLabel.get(label), im))}">${escHtml(subjectName(im.tags))}</a>`)
    .join(' · ')
  const faq = faqFor(label)
    .map((f) => `<div class="faq-item"><h3>${escHtml(f.q)}</h3><p>${escHtml(f.a)}</p></div>`)
    .join('')
  return (
    `<main><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/categories">Categories</a> / <span>${escHtml(label)}</span></nav>` +
    `<h1>${escHtml(label)} Online Free Jigsaw Puzzles</h1>` +
    `<p>Play free online ${l} jigsaw puzzles - no login, no downloads, ever. Browse ${images.length} hand-picked ${l} pictures and solve any of them from 12 to 300 pieces.</p>` +
    `<p><strong>${images.length}</strong> free ${l} puzzles · play any from 12 to 300 pieces.</p>` +
    `<ul class="grid">${cards}</ul>` +
    `<section aria-label="All ${escHtml(label)} puzzles" class="all-index">${allLinks}</section>` +
    `<section aria-labelledby="faq"><h2 id="faq">${escHtml(label)} jigsaw puzzles - frequently asked questions</h2>${faq}</section>` +
    `</main>`
  )
}

function categoryJsonLd(label, slug, images) {
  const url = `/${slug}`
  const items = images.slice(0, PAGE_SIZE).map((im, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: `${subjectName(im.tags)} Jigsaw Puzzle`,
    image: im.thumb,
    url: abs(puzzlePath(slugKeyByLabel.get(label), im)),
  }))
  return [
    breadcrumbLd([
      { name: 'Home', path: '/' },
      { name: 'Categories', path: '/categories' },
      { name: label, path: url },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${label} Online Free Jigsaw Puzzles`,
      url: abs(url),
      isPartOf: { '@type': 'WebSite', name: SITE, url: abs('/') },
      mainEntity: { '@type': 'ItemList', numberOfItems: items.length, itemListElement: items },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqFor(label).map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]
}

// ── Categories index (/categories) ──────────────────────────────────────────
function categoriesBody(index) {
  const tiles = index
    .map(
      (c) =>
        `<li><a href="/${escAttr(c.slug)}">` +
        (c.cover
          ? `<img src="${escAttr(c.cover)}" alt="${escAttr(c.label)} jigsaw puzzles" loading="lazy" />`
          : '') +
        `<span>${escHtml(c.label)} Jigsaw Puzzles</span></a></li>`,
    )
    .join('')
  // Flat keyword-rich link index for crawl depth.
  const allLinks = index
    .map((c) => `<a href="/${escAttr(c.slug)}">${escHtml(c.label)}</a>`)
    .join(' · ')
  return (
    `<main><nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>Categories</span></nav>` +
    `<h1>Free Online Jigsaw Puzzle Categories</h1>` +
    `<p>Browse all ${index.length} free online jigsaw puzzle categories on ${escHtml(SITE)} - from nature, wildlife and flowers to cities, food and travel. Pick a category, choose a picture, and play free from 12 to 300 pieces. No login, no downloads.</p>` +
    `<ul class="grid">${tiles}</ul>` +
    `<section aria-label="All categories" class="all-index">${allLinks}</section>` +
    `</main>`
  )
}

function categoriesJsonLd(index) {
  return [
    breadcrumbLd([
      { name: 'Home', path: '/' },
      { name: 'Categories', path: '/categories' },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Free Online Jigsaw Puzzle Categories',
      url: abs('/categories'),
      isPartOf: { '@type': 'WebSite', name: SITE, url: abs('/') },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: index.length,
        itemListElement: index.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${c.label} Jigsaw Puzzles`,
          url: abs(`/${c.slug}`),
        })),
      },
    },
  ]
}

// ── Event pages (/event/<key>) ───────────────────────────────────────────────
function eventBody(name, images) {
  const title = `${name} Jigsaw Puzzles`
  const tiles = images
    .slice(0, PAGE_SIZE)
    .map((im) => {
      const subj = subjectName(im.tags)
      return `<li><img src="${escAttr(im.thumb)}" width="${im.w}" height="${im.h}" alt="${escAttr(subj)} ${escHtml(name.toLowerCase())} jigsaw puzzle" loading="lazy" /><span>${escHtml(subj)}</span></li>`
    })
    .join('')
  return (
    `<main><nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>${escHtml(title)}</span></nav>` +
    `<h1>${escHtml(title)}</h1>` +
    `<p>Play free ${escHtml(name.toLowerCase())} jigsaw puzzles online - a themed collection of ${images.length} hand-picked pictures you can solve from 12 to 300 pieces. Every solve during the event earns triple (3x) points. No login, no downloads.</p>` +
    `<ul class="grid">${tiles}</ul>` +
    `<p><a href="/categories">Browse all jigsaw puzzle categories</a> · <a href="/">Home</a></p>` +
    `</main>`
  )
}

function eventJsonLd(name, key, images) {
  const url = `/event/${key}`
  return [
    breadcrumbLd([
      { name: 'Home', path: '/' },
      { name: `${name} Jigsaw Puzzles`, path: url },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${name} Jigsaw Puzzles`,
      url: abs(url),
      isPartOf: { '@type': 'WebSite', name: SITE, url: abs('/') },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: Math.min(images.length, PAGE_SIZE),
        itemListElement: images.slice(0, PAGE_SIZE).map((im, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${subjectName(im.tags)} Jigsaw Puzzle`,
          image: im.thumb,
        })),
      },
    },
  ]
}

function puzzleBody(label, catKey, im) {
  const name = subjectName(im.tags)
  const tags = extraTags(im.tags, name, 2)
  const feature = tags.length ? ` featuring ${tags.join(' and ').toLowerCase()}` : ''
  return (
    `<main><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/${categorySlug(label)}">${escHtml(label)}</a> / <span>${escHtml(name)}</span></nav>` +
    `<h1>${escHtml(name)} Jigsaw Puzzle</h1>` +
    `<img src="${escAttr(im.url)}" width="${im.w}" height="${im.h}" alt="${escAttr(name)} - free online jigsaw puzzle photo" />` +
    `<p>Photo by ${escHtml(im.author)} on Pixabay.</p>` +
    `<p>Free ${escHtml(name)} jigsaw puzzle${escHtml(feature)} - play online with 12 to 300 pieces, no login.</p>` +
    `<p><a href="${escAttr(puzzlePath(catKey, im))}">Play this puzzle</a> · <a href="/${categorySlug(label)}">More ${escHtml(label)} puzzles</a></p>` +
    `</main>`
  )
}

function puzzleJsonLd(label, catKey, im) {
  const name = subjectName(im.tags)
  const url = puzzlePath(catKey, im)
  return [
    breadcrumbLd([
      { name: 'Home', path: '/' },
      { name: label, path: `/${categorySlug(label)}` },
      { name, path: url },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      name: `${name} Jigsaw Puzzle`,
      contentUrl: im.url,
      thumbnailUrl: im.thumb,
      width: im.w,
      height: im.h,
      creditText: `${im.author} on Pixabay`,
      creator: { '@type': 'Person', name: im.author },
      isPartOf: { '@type': 'WebPage', url: abs(url) },
    },
  ]
}

// ── write helpers ────────────────────────────────────────────────────────
async function writePretty(routePath, html) {
  // /a/b -> dist/a/b.html - static hosts (Netlify/Vercel/Pages) and `vite
  // preview` resolve the extensionless clean URL to this file.
  const file = path.join(DIST, `${routePath.replace(/^\/+/, '')}.html`)
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, html)
}

async function runBatched(items, size, fn) {
  for (let i = 0; i < items.length; i += size) {
    await Promise.all(items.slice(i, i + size).map(fn))
  }
}

// Resolve label -> category key for URL building inside body builders.
const slugKeyByLabel = new Map()

// ── main ───────────────────────────────────────────────────────────────────
const HOME_FAQ = [
  ['Is JigsawJam free?', 'Yes. Every jigsaw puzzle on JigsawJam is free to play online. There is no account, no subscription, and no app or download required - you play directly in your web browser.'],
  ['Do I need an account or login to play?', 'No. You can start any puzzle straight away in your browser without signing up or logging in, on desktop or mobile.'],
  ['How many pieces can a puzzle have?', 'Every puzzle can be played from 12 pieces up to 300 pieces. Pick fewer pieces for a quick game or more for a longer, relaxing challenge.'],
  ['How many puzzles and categories are there?', 'JigsawJam has 32,850 puzzles organized into 73 categories, including Dogs, Cats, Birds, Flowers, Beaches, Landscapes, Space, Food, Castles and Trains.'],
  ['What is the Puzzle of the Day?', 'A new featured puzzle is published every day. During seasonal events such as Halloween and Christmas, solving puzzles earns triple (3x) points while the event is running.'],
]
const HOME_TITLE = `Free Online Jigsaw Puzzles - No Login | ${SITE}`
const HOME_DESC =
  'Free online jigsaw puzzles you play in your browser - no login, no downloads. 32,850 puzzles in 73 categories, 12 to 300 pieces. New puzzle daily.'

/** Prerender the home page: full head (canonical, OG/Twitter, robots, @graph)
 *  + crawlable body so non-JS crawlers and AI engines see real content. */
async function buildHome(template, labels) {
  const topKeys = ['dogs', 'cats', 'birds', 'flowers', 'beaches', 'landscapes', 'space', 'food', 'castles', 'trains']
  const top = topKeys.map((k) => {
    const label = labels.get(k) || titleCase(k)
    return { label, path: `/${categorySlug(label)}` }
  })

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite', '@id': abs('/#website'), url: abs('/'), name: SITE,
        description: HOME_DESC, inLanguage: 'en', publisher: { '@id': abs('/#organization') },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: abs('/search?q={search_term_string}') },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization', '@id': abs('/#organization'), name: SITE, url: abs('/'),
        logo: { '@type': 'ImageObject', url: abs('/logo.png') },
      },
      {
        '@type': 'WebPage', '@id': abs('/#webpage'), url: abs('/'), name: 'Free Online Jigsaw Puzzles',
        isPartOf: { '@id': abs('/#website') }, about: { '@id': abs('/#organization') },
        inLanguage: 'en', mainEntity: { '@id': abs('/#top-categories') },
      },
      {
        '@type': 'ItemList', '@id': abs('/#top-categories'), name: 'Popular jigsaw puzzle categories',
        itemListOrder: 'https://schema.org/ItemListUnordered', numberOfItems: top.length,
        itemListElement: top.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, url: abs(c.path) })),
      },
      {
        '@type': 'FAQPage', '@id': abs('/#faq'),
        mainEntity: HOME_FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
    ],
  }

  const head = [
    `    <title>${escHtml(HOME_TITLE)}</title>`,
    `    <meta name="description" content="${escAttr(HOME_DESC)}" />`,
    `    <link rel="canonical" href="${escAttr(abs('/'))}" />`,
    `    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />`,
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:site_name" content="${escAttr(SITE)}" />`,
    `    <meta property="og:title" content="${escAttr(HOME_TITLE)}" />`,
    `    <meta property="og:description" content="${escAttr(HOME_DESC)}" />`,
    `    <meta property="og:url" content="${escAttr(abs('/'))}" />`,
    `    <meta property="og:locale" content="en_US" />`,
    `    <meta property="og:image" content="${escAttr(abs(OG_IMAGE))}" />`,
    `    <meta name="twitter:card" content="summary" />`,
    `    <meta name="twitter:title" content="${escAttr(HOME_TITLE)}" />`,
    `    <meta name="twitter:description" content="${escAttr(HOME_DESC)}" />`,
    `    <meta name="twitter:image" content="${escAttr(abs(OG_IMAGE))}" />`,
    `    <script type="application/ld+json">${ldSafe(graph)}</script>`,
  ].join('\n')

  const catLinks = top
    .map((c) => `<li><a href="${escAttr(c.path)}">${escHtml(c.label)} puzzles</a></li>`)
    .join('')
  const faq = HOME_FAQ
    .map(([q, a]) => `<div class="faq-item"><h3>${escHtml(q)}</h3><p>${escHtml(a)}</p></div>`)
    .join('')
  const body =
    `<main><h1>Free Online Jigsaw Puzzles</h1>` +
    `<p>JigsawJam is a free online jigsaw puzzle site you play right in your browser - no login, no app, and no downloads. Choose from 32,850 puzzles across 73 categories, set any puzzle from 12 to 300 pieces, and play on desktop or mobile.</p>` +
    `<p>A new <a href="/daily-jigsaw-puzzle">Puzzle of the Day</a> is featured every day, and during seasonal events such as Halloween, Christmas and the Summer Solstice your solves earn 3x points. Browse <a href="/categories">all 73 categories</a> or jump into a popular one:</p>` +
    `<ul>${catLinks}</ul>` +
    `<h2>More ways to play</h2>` +
    `<ul>` +
    `<li><a href="/daily-jigsaw-puzzle">Daily jigsaw puzzle</a></li>` +
    `<li><a href="/create-a-custom-jigsaw-puzzle">Create a custom puzzle from a photo</a></li>` +
    `<li><a href="/300-piece-jigsaw-puzzles">300 piece jigsaw puzzles</a></li>` +
    `<li><a href="/jigsaw-puzzles-for-adults">Jigsaw puzzles for adults</a></li>` +
    `<li><a href="/jigsaw-puzzles-for-kids">Jigsaw puzzles for kids</a></li>` +
    `<li><a href="/jigsaw-puzzles-for-seniors">Jigsaw puzzles for seniors</a></li>` +
    `</ul>` +
    `<section aria-labelledby="home-faq"><h2 id="home-faq">Frequently asked questions</h2>${faq}</section>` +
    `</main>`

  const html = template
    .replace(/    <meta name="description"[^>]*\/>\n/, '')
    .replace(/    <meta property="og:[^>]*\/>\n/g, '')
    .replace(/    <meta name="twitter:[^>]*\/>\n/g, '')
    .replace(/    <title>[\s\S]*?<\/title>/, head)
    .replace('<div id="root"></div>', `<div id="root">${prerenderWrap(body)}</div>`)
  await fs.writeFile(path.join(DIST, 'index.html'), html)
}

// ── Daily Jigsaw Puzzle / Puzzle of the Day (/daily-jigsaw-puzzle) ────────────
// A dedicated landing page that owns the high-volume "daily jigsaw puzzle" /
// "puzzle of the day" search cluster (rivals rank #1 with a page like this).
const DAILY_PATH = '/daily-jigsaw-puzzle'
const DAILY_TITLE = `Daily Jigsaw Puzzle - Free Puzzle of the Day | ${SITE}`
const DAILY_DESC =
  "Play today's free daily jigsaw puzzle online - a new Puzzle of the Day every day, solvable from 12 to 300 pieces. No login, no app, no downloads."
const DAILY_FAQ = [
  ['What is the daily jigsaw puzzle?', `A new featured jigsaw puzzle - the Puzzle of the Day - is published on ${SITE} every day. Everyone sees the same puzzle each calendar day, and it is free to play with no login or download.`],
  ['Is the daily puzzle of the day free?', `Yes. Today's daily jigsaw puzzle, and every puzzle on ${SITE}, is completely free to play online in your browser - no account, no subscription and no app required.`],
  ['How many pieces does the daily puzzle have?', 'You choose. Every daily jigsaw puzzle can be played from 12 pieces up to 300 pieces, so you can do a quick break or a longer, relaxing challenge.'],
  ['When does a new daily puzzle appear?', 'A fresh Puzzle of the Day rotates in each calendar day. Come back tomorrow for a new free daily jigsaw puzzle.'],
]

async function buildDaily(template, labels) {
  const topKeys = ['dogs', 'cats', 'birds', 'flowers', 'beaches', 'landscapes', 'space', 'food', 'castles', 'trains']
  const top = topKeys.map((k) => {
    const label = labels.get(k) || titleCase(k)
    return { label, path: `/${categorySlug(label)}` }
  })
  const catLinks = top
    .map((c) => `<li><a href="${escAttr(c.path)}">${escHtml(c.label)} puzzles</a></li>`)
    .join('')
  const faq = DAILY_FAQ
    .map(([q, a]) => `<div class="faq-item"><h3>${escHtml(q)}</h3><p>${escHtml(a)}</p></div>`)
    .join('')
  const body =
    `<main><nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>Daily Jigsaw Puzzle</span></nav>` +
    `<h1>Daily Jigsaw Puzzle - Puzzle of the Day</h1>` +
    `<p>A brand-new Puzzle of the Day is featured every day on ${escHtml(SITE)} - free to play right in your browser with no login, no app and no downloads. Solve today's daily jigsaw puzzle from 12 to 300 pieces on desktop or mobile, then come back tomorrow for a fresh one.</p>` +
    `<p>Want more than the daily puzzle? Browse <a href="/categories">all 73 categories</a> of free online jigsaw puzzles, or jump into a popular one:</p>` +
    `<ul>${catLinks}</ul>` +
    `<section aria-labelledby="daily-faq"><h2 id="daily-faq">Daily jigsaw puzzle - frequently asked questions</h2>${faq}</section>` +
    `</main>`

  const jsonld = [
    breadcrumbLd([
      { name: 'Home', path: '/' },
      { name: 'Daily Jigsaw Puzzle', path: DAILY_PATH },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': abs(`${DAILY_PATH}#webpage`),
      url: abs(DAILY_PATH),
      name: 'Daily Jigsaw Puzzle - Puzzle of the Day',
      description: DAILY_DESC,
      isPartOf: { '@type': 'WebSite', name: SITE, url: abs('/') },
      inLanguage: 'en',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: DAILY_FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ]

  const html = buildHtml(template, {
    title: DAILY_TITLE,
    description: DAILY_DESC,
    canonicalPath: DAILY_PATH,
    prev: null,
    next: null,
    jsonld,
    body,
  })
  await writePretty(DAILY_PATH, html)
}

// ── SEO landing pages (custom maker, piece-count, audience) ─────────────────
// Driven by src/data/landings.json - the same file the React app imports.
async function buildLandings(template, labels, sitemap) {
  const raw = JSON.parse(await fs.readFile(path.join(ROOT, 'src', 'data', 'landings.json'), 'utf8'))
  for (const [key, l] of Object.entries(raw)) {
    const catLinks = (l.categoryKeys || [])
      .map((k) => {
        const label = labels.get(k) || titleCase(k)
        return `<li><a href="/${escAttr(categorySlug(label))}">${escHtml(label)} puzzles</a></li>`
      })
      .join('')
    const paras = (l.paras || []).map((p) => `<p>${escHtml(p)}</p>`).join('')
    const faq = (l.faq || [])
      .map(([q, a]) => `<div class="faq-item"><h3>${escHtml(q)}</h3><p>${escHtml(a)}</p></div>`)
      .join('')
    const body =
      `<main><nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>${escHtml(l.h1)}</span></nav>` +
      `<h1>${escHtml(l.h1)}</h1>` +
      `<p>${escHtml(l.lead)}</p>` +
      paras +
      `<ul>${catLinks}<li><a href="/categories">All categories</a></li></ul>` +
      `<section aria-labelledby="landing-faq"><h2 id="landing-faq">Frequently asked questions</h2>${faq}</section>` +
      `</main>`

    const jsonld = [
      breadcrumbLd([
        { name: 'Home', path: '/' },
        { name: l.h1, path: `/${key}` },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': abs(`/${key}#webpage`),
        url: abs(`/${key}`),
        name: l.h1,
        description: l.description,
        isPartOf: { '@type': 'WebSite', name: SITE, url: abs('/') },
        inLanguage: 'en',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: (l.faq || []).map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
    ]

    const title = l.title.includes(SITE) ? l.title : `${l.title} | ${SITE}`
    const html = buildHtml(template, {
      title,
      description: l.description,
      canonicalPath: `/${key}`,
      prev: null,
      next: null,
      jsonld,
      body,
    })
    await writePretty(`/${key}`, html)
    sitemap.push({ loc: abs(`/${key}`), priority: l.kind === 'custom' ? '0.8' : '0.7' })
  }
}

async function main() {
  if (SITE_URL === DEFAULT_DOMAIN) {
    console.info(`ℹ  SITE_URL not set - using default "${DEFAULT_DOMAIN}".`)
    console.info(`   Override with:  SITE_URL=https://example.com npm run build`)
  }
  const template = await fs.readFile(path.join(DIST, 'index.html'), 'utf8')
  const labels = await categoryLabels()
  // Skip runtime-only catalogues that aren't standalone categories:
  // event-*.json (event pages) and daily*.json (Puzzle of the Day set).
  const files = (await fs.readdir(CATALOG)).filter(
    (f) =>
      f.endsWith('.json') &&
      f !== 'index.json' &&
      !f.startsWith('event-') &&
      !f.startsWith('daily') &&
      !f.startsWith('home-'),
  )

  const sitemap = [] // {loc, priority}
  sitemap.push({ loc: abs('/'), priority: '1.0' })
  sitemap.push({ loc: abs('/categories'), priority: '0.7' })

  let catCount = 0
  let puzCount = 0
  const categoryIndex = [] // {label, slug, cover, count} for the /categories page

  for (const file of files) {
    const key = file.replace(/\.json$/, '')
    const label = labels.get(key) || titleCase(key.replace(/-/g, ' '))
    slugKeyByLabel.set(label, key)
    const data = JSON.parse(await fs.readFile(path.join(CATALOG, file), 'utf8'))
    const images = data.images || []
    const slug = categorySlug(label)
    categoryIndex.push({ label, slug, cover: images[0]?.thumb || '', count: images.length })

    // Category landing page (page 1, canonical).
    const totalPages = Math.max(1, Math.ceil(images.length / PAGE_SIZE))
    const catHtml = buildHtml(template, {
      title: `${label} Online Free Jigsaw Puzzles | ${SITE}`,
      description: `Play free online ${label.toLowerCase()} jigsaw puzzles - browse ${images.length} hand-picked ${label.toLowerCase()} pictures and solve any of them in 12 to 300 pieces. No login, no downloads.`,
      canonicalPath: `/${slug}`,
      prev: null,
      next: totalPages > 1 ? `/${slug}?page=2` : null,
      jsonld: categoryJsonLd(label, slug, images),
      body: categoryBody(label, slug, images),
    })
    await writePretty(slug, catHtml)
    sitemap.push({ loc: abs(`/${slug}`), priority: '0.8' })
    catCount++

    // Every puzzle in the category.
    if (PRERENDER_PUZZLES) {
      await runBatched(images, 200, async (im) => {
        const route = puzzlePath(key, im)
        const name = subjectName(im.tags)
        const html = buildHtml(template, {
          title: `${name} Jigsaw Puzzle - Free ${label} Puzzle Online | ${SITE}`,
          description: `Free ${name} jigsaw puzzle - play online with 12 to 300 pieces, no login.`,
          canonicalPath: route,
          prev: null,
          next: null,
          jsonld: puzzleJsonLd(label, key, im),
          body: puzzleBody(label, key, im),
        })
        await writePretty(route, html)
      })
      puzCount += images.length
    }
    for (const im of images) sitemap.push({ loc: abs(puzzlePath(key, im)), priority: '0.6' })
    process.stdout.write(`\r  ${catCount}/${files.length} categories, ${puzCount} puzzle pages…   `)
  }
  process.stdout.write('\n')

  // Prerender the /categories index (was an empty SPA shell to crawlers).
  categoryIndex.sort((a, b) => a.label.localeCompare(b.label))
  const categoriesHtml = buildHtml(template, {
    title: `Free Online Jigsaw Puzzle Categories - ${categoryIndex.length} Themes | ${SITE}`,
    description: `Browse all ${categoryIndex.length} free online jigsaw puzzle categories on ${SITE} - nature, wildlife, flowers, cities, food, travel and more. Pick a category and play from 12 to 300 pieces. No login, no downloads.`,
    canonicalPath: '/categories',
    prev: null,
    next: null,
    jsonld: categoriesJsonLd(categoryIndex),
    body: categoriesBody(categoryIndex),
  })
  await writePretty('/categories', categoriesHtml)

  // Prerender each event page (/event/<key>) - themed evergreen collections.
  const evNames = await eventNames()
  const eventFiles = (await fs.readdir(CATALOG)).filter((f) => f.startsWith('event-') && f.endsWith('.json'))
  let evCount = 0
  for (const file of eventFiles) {
    const key = file.replace(/^event-/, '').replace(/\.json$/, '')
    const name = evNames.get(key) || titleCase(key.replace(/-/g, ' '))
    const data = JSON.parse(await fs.readFile(path.join(CATALOG, file), 'utf8'))
    const images = data.images || []
    if (!images.length) continue
    const html = buildHtml(template, {
      title: `${name} Jigsaw Puzzles - Free Online | ${SITE}`,
      description: `Play free ${name.toLowerCase()} jigsaw puzzles online - a themed collection you can solve from 12 to 300 pieces, earning 3x points during the event. No login, no downloads.`,
      canonicalPath: `/event/${key}`,
      prev: null,
      next: null,
      jsonld: eventJsonLd(name, key, images),
      body: eventBody(name, images),
    })
    await writePretty(`/event/${key}`, html)
    sitemap.push({ loc: abs(`/event/${key}`), priority: '0.6' })
    evCount++
  }
  console.log(`  ${evCount} event pages`)

  // Prerender the Daily Jigsaw Puzzle / Puzzle of the Day landing page.
  await buildDaily(template, labels)
  sitemap.push({ loc: abs(DAILY_PATH), priority: '0.9' })

  // Prerender the SEO landing pages (custom maker, piece-count, audience).
  await buildLandings(template, labels, sitemap)

  // Prerender the home page LAST (overwrites the bare shell template).
  await buildHome(template, labels)

  // ── sitemap (chunked) + index + robots ──────────────────────────────────
  const CHUNK = 25000
  await fs.mkdir(path.join(DIST, 'sitemaps'), { recursive: true })
  const chunks = []
  for (let i = 0; i < sitemap.length; i += CHUNK) chunks.push(sitemap.slice(i, i + CHUNK))
  await Promise.all(
    chunks.map((chunk, i) => {
      const urls = chunk
        .map((u) => `  <url><loc>${escHtml(u.loc)}</loc><priority>${u.priority}</priority></url>`)
        .join('\n')
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
      return fs.writeFile(path.join(DIST, 'sitemaps', `sitemap-${i + 1}.xml`), xml)
    }),
  )
  const indexXml =
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    chunks.map((_, i) => `  <sitemap><loc>${abs(`/sitemaps/sitemap-${i + 1}.xml`)}</loc></sitemap>`).join('\n') +
    `\n</sitemapindex>\n`
  await fs.writeFile(path.join(DIST, 'sitemap.xml'), indexXml)
  await fs.writeFile(
    path.join(DIST, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`,
  )

  console.log(
    `✓ SEO build: ${catCount} category pages, ${puzCount} puzzle pages, ` +
      `${sitemap.length} sitemap URLs in ${chunks.length} chunk(s).`,
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
