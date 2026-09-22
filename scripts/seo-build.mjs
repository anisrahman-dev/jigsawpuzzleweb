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
// Copy + naming shared with the React app so the prerendered HTML and the
// hydrated page are never two different pages in Google's eyes.
import { slugName, displayNames, puzzleDescription } from '../src/data/puzzleTitles.mjs'
import { categoryCopy } from '../src/data/categoryCopy.mjs'
import {
  categoryKeyword,
  categoryKeywordInline,
  categoryTitle,
  categoryH1,
  categoryDescription,
  eventTitle,
  eventDescription,
} from '../src/data/categorySeo.mjs'
import { CATEGORY_FACTS } from '../src/data/categoryFacts.mjs'
import { HOME_TITLE, HOME_DESC, HOME_FAQ, HOME_COUNTS } from '../src/data/homeCopy.mjs'

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
// The ~33k puzzle pages stay live, playable and internally linked, but carry
// noindex: Search Console showed the whole set sitting in "Discovered -
// currently not indexed" while soaking up the crawl budget that the ~130 pages
// which can actually rank (categories, landings, events, daily) needed. Set
// NOINDEX_PUZZLES=0 to make them indexable again once the domain has the
// authority to support 33k thin pages.
const NOINDEX_PUZZLES = process.env.NOINDEX_PUZZLES !== '0'
/** Robots directive for pages we want fully indexed with big image previews. */
const RICH_ROBOTS = 'index,follow,max-image-preview:large,max-snippet:-1'

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
const abs = (p) => SITE_URL + p
// URL slugs stay built from the bare first tag, exactly as they always have
// been. Display names are now distinct per puzzle, but the URLs must not move
// or every page Google has already crawled turns into a 404.
const puzzlePath = (catKey, im) =>
  `/puzzle/${catKey}/${im.id}/${puzzleSlug(slugName(im.tags), im.author)}`


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
// The prerendered body is REAL, VISIBLE content. It used to sit inside a
// clip:rect(0,0,0,0) box to hide the flash of unstyled markup before React
// mounts - but that meant serving CSS-hidden text to precisely the crawlers
// this whole step exists to serve, and Google discounts hidden text. It is now
// styled just enough to read as a plain page for the moment before React
// replaces #root (which also disposes of this <style>).
const PRERENDER_CSS = [
  '[data-prerender]{max-width:1100px;margin:0 auto;padding:24px 20px;line-height:1.6;color:#1f2328;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}',
  '[data-prerender] h1{font-size:1.9rem;line-height:1.2;margin:.4em 0}',
  '[data-prerender] h2{font-size:1.3rem;margin:1.4em 0 .4em}',
  '[data-prerender] h3{font-size:1rem;margin:1em 0 .2em}',
  '[data-prerender] a{color:#1f63c4}',
  '[data-prerender] nav{font-size:.9rem;color:#5b6470;margin-bottom:.6em}',
  '[data-prerender] ul.grid,[data-prerender] ul.landing-gallery{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px}',
  '[data-prerender] ul.grid img,[data-prerender] ul.landing-gallery img{width:100%;height:auto;aspect-ratio:3/2;object-fit:cover;border-radius:10px;display:block}',
  '[data-prerender] ul.grid a{display:block;text-decoration:none}',
  '[data-prerender] ul.grid span{display:block;font-size:.9rem;margin-top:.35em}',
  '[data-prerender] .all-index{display:block;margin:1.6em 0;font-size:.82rem;line-height:1.9;color:#5b6470}',
  '[data-prerender] .all-index a{color:#5b6470}',
  '[data-prerender] > main > img{max-width:100%;height:auto;border-radius:12px}',
].join('')

// Escape hatch: HIDE_PRERENDER=1 restores the old off-screen wrapper. Visible
// markup is replaced when React mounts, which can register as a layout shift -
// so if the Core Web Vitals report shows CLS regressing, flip this back on and
// accept the weaker crawler signal instead.
const HIDE_PRERENDER = process.env.HIDE_PRERENDER === '1'

function prerenderWrap(body) {
  if (HIDE_PRERENDER) {
    return (
      `<div data-prerender style="position:absolute;width:1px;height:1px;` +
      `padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">` +
      `${body}</div>`
    )
  }
  return `<style>${PRERENDER_CSS}</style><div data-prerender>${body}</div>`
}

function buildHtml(template, { title, description, canonicalPath, prev, next, jsonld, body, robots }) {
  const head = [
    `    <title>${escHtml(title)}</title>`,
    `    <meta name="description" content="${escAttr(description)}" />`,
    `    <link rel="canonical" href="${escAttr(abs(canonicalPath))}" />`,
    robots ? `    <meta name="robots" content="${escAttr(robots)}" />` : '',
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

function categoryBody(key, label, images, names, copy) {
  // Body prose uses the keyword ("dog"), not the label ("Dogs"), so the page
  // text reinforces the exact phrase the title targets.
  const kw = categoryKeyword(key, label)
  const l = categoryKeywordInline(key, label)
  const cards = images
    .slice(0, PAGE_SIZE)
    .map(
      (im, i) =>
        `<li><a href="${escAttr(puzzlePath(key, im))}"><img src="${escAttr(im.thumb)}" width="${im.w}" height="${im.h}" alt="${escAttr(names[i])} jigsaw puzzle" loading="lazy" /><span>${escHtml(names[i])} Jigsaw Puzzle</span></a></li>`,
    )
    .join('')
  // A flat link index of every puzzle in the category (internal-link depth for crawlers).
  const allLinks = images
    .map((im, i) => `<a href="${escAttr(puzzlePath(key, im))}">${escHtml(names[i])}</a>`)
    .join(' · ')
  const paras = copy.paras.map((t) => `<p>${escHtml(t)}</p>`).join('')
  const faq = copy.faq
    .map((f) => `<div class="faq-item"><h3>${escHtml(f.q)}</h3><p>${escHtml(f.a)}</p></div>`)
    .join('')
  return (
    `<main><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/categories">Categories</a> / <span>${escHtml(label)}</span></nav>` +
    `<h1>${escHtml(categoryH1(key, label))}</h1>` +
    `<p>${escHtml(copy.lead)}</p>` +
    paras +
    `<p><strong>${images.length}</strong> free ${escHtml(l)} jigsaw puzzles · play any from 12 to 300 pieces.</p>` +
    `<ul class="grid">${cards}</ul>` +
    `<section aria-label="All ${escHtml(label)} puzzles" class="all-index">${allLinks}</section>` +
    `<section aria-labelledby="faq"><h2 id="faq">${escHtml(kw)} jigsaw puzzles - frequently asked questions</h2>${faq}</section>` +
    `</main>`
  )
}

function categoryJsonLd(key, label, slug, images, names, copy) {
  const url = `/${slug}`
  const items = images.slice(0, PAGE_SIZE).map((im, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: `${names[i]} Jigsaw Puzzle`,
    image: im.thumb,
    url: abs(puzzlePath(key, im)),
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
      name: categoryH1(key, label),
      url: abs(url),
      isPartOf: { '@type': 'WebSite', name: SITE, url: abs('/') },
      mainEntity: { '@type': 'ItemList', numberOfItems: items.length, itemListElement: items },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: copy.faq.map((f) => ({
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
function eventBody(name, images, names) {
  const title = `${name} Jigsaw Puzzles`
  const tiles = images
    .slice(0, PAGE_SIZE)
    .map(
      (im, i) =>
        `<li><img src="${escAttr(im.thumb)}" width="${im.w}" height="${im.h}" alt="${escAttr(names[i])} ${escHtml(name.toLowerCase())} jigsaw puzzle" loading="lazy" /><span>${escHtml(names[i])}</span></li>`,
    )
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

function eventJsonLd(name, key, images, names) {
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
          name: `${names[i]} Jigsaw Puzzle`,
          image: im.thumb,
        })),
      },
    },
  ]
}

function puzzleBody(label, catKey, im, name) {
  return (
    `<main><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/${categorySlug(label)}">${escHtml(label)}</a> / <span>${escHtml(name)}</span></nav>` +
    `<h1>${escHtml(name)} Jigsaw Puzzle</h1>` +
    `<img src="${escAttr(im.url)}" width="${im.w}" height="${im.h}" alt="${escAttr(name)} - free online jigsaw puzzle photo" />` +
    `<p>Photo by ${escHtml(im.author)} on Pixabay.</p>` +
    `<p>${escHtml(puzzleDescription(name, im.tags, im.author))}</p>` +
    `<p><a href="${escAttr(puzzlePath(catKey, im))}">Play this puzzle</a> · <a href="/${categorySlug(label)}">More ${escHtml(label)} puzzles</a></p>` +
    `</main>`
  )
}

function puzzleJsonLd(label, catKey, im, name, canonical) {
  const url = canonical ?? puzzlePath(catKey, im)
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
    await Promise.all(items.slice(i, i + size).map((item, k) => fn(item, i + k)))
  }
}

// ── main ───────────────────────────────────────────────────────────────────
// Routes the SPA owns that have no prerenderable content. They get a noindex
// shell on disk purely so `cleanUrls` resolves them instead of 404ing - see the
// SPA_ROUTES loop in main(). Keep in sync with parseRoute() in src/router.ts.
const SPA_ROUTES = [
  { path: '/play', title: 'Play a Jigsaw Puzzle', description: 'Play a free online jigsaw puzzle in your browser.' },
  { path: '/search', title: 'Search Jigsaw Puzzles', description: 'Search free online jigsaw puzzles by keyword.' },
]

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
        mainEntity: HOME_FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
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
    .map((f) => `<div class="faq-item"><h3>${escHtml(f.q)}</h3><p>${escHtml(f.a)}</p></div>`)
    .join('')
  const body =
    `<main><h1>Free Online Jigsaw Puzzles</h1>` +
    `<p>JigsawJam is a collection of free online jigsaw puzzles to play right in your browser - no login, no app, and no downloads. Choose from ${HOME_COUNTS.puzzles} puzzles across ${HOME_COUNTS.categories} categories, set any puzzle from 12 to 300 pieces, and play on desktop or mobile.</p>` +
    `<p>Every picture here is free. These are jigsaw puzzles online free of charge, with no sign-up and nothing to install - free jigsaw puzzles online that you can start in one click and come back to any day.</p>` +
    `<p>Prefer to simply play jigsaw online without hunting through menus? Open the <a href="/daily-jigsaw-puzzle">Puzzle of the Day</a> for a fresh jigsaw puzzle free online every morning, and during seasonal events such as Halloween, Christmas and the Summer Solstice your solves earn 3x points. Browse <a href="/categories">all ${HOME_COUNTS.categories} categories</a> or jump into a popular one:</p>` +
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
    `<p>Want more than the daily puzzle? Browse <a href="/categories">all ${HOME_COUNTS.categories} categories</a> of free online jigsaw puzzles, or jump into a popular one:</p>` +
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
    robots: RICH_ROBOTS,
    jsonld,
    body,
  })
  await writePretty(DAILY_PATH, html)
}

// ── SEO landing pages (custom maker, piece-count, audience) ─────────────────
// Driven by src/data/landings.json - the same file the React app imports.
async function buildLandings(template, labels, sitemap, ownerOf) {
  const raw = JSON.parse(await fs.readFile(path.join(ROOT, 'src', 'data', 'landings.json'), 'utf8'))
  for (const [key, l] of Object.entries(raw)) {
    const catLinks = (l.categoryKeys || [])
      .map((k) => {
        const label = labels.get(k) || titleCase(k)
        return `<li><a href="/${escAttr(categorySlug(label))}">${escHtml(label)} puzzles</a></li>`
      })
      .join('')

    // Optional curated puzzle grid: public/catalog/<key>.json. When present,
    // surface the real thumbnails (crawlable) and prerender each puzzle page,
    // with breadcrumbs back to this landing rather than a category.
    let images = []
    try {
      images = JSON.parse(await fs.readFile(path.join(CATALOG, `${key}.json`), 'utf8')).images || []
    } catch {
      /* no curated catalogue for this landing */
    }
    const names = displayNames(images)
    const gallery = images.length
      ? `<section aria-label="Puzzles"><ul class="landing-gallery">` +
        images
          .map((im, i) => {
            const name = names[i]
            return (
              `<li><a href="${escAttr(puzzlePath(key, im))}">` +
              `<img src="${escAttr(im.thumb)}" width="${im.w}" height="${im.h}" loading="lazy" ` +
              `alt="${escAttr(name)} - free online jigsaw puzzle" /></a></li>`
            )
          })
          .join('') +
        `</ul></section>`
      : ''

    const paras = (l.paras || []).map((p) => `<p>${escHtml(p)}</p>`).join('')
    const faq = (l.faq || [])
      .map(([q, a]) => `<div class="faq-item"><h3>${escHtml(q)}</h3><p>${escHtml(a)}</p></div>`)
      .join('')
    const body =
      `<main><nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>${escHtml(l.h1)}</span></nav>` +
      `<h1>${escHtml(l.h1)}</h1>` +
      `<p>${escHtml(l.lead)}</p>` +
      paras +
      gallery +
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
      robots: RICH_ROBOTS,
      jsonld,
      body,
    })
    await writePretty(`/${key}`, html)
    sitemap.push({ loc: abs(`/${key}`), priority: l.kind === 'custom' ? '0.8' : '0.7' })

    // Prerender each curated puzzle page (breadcrumb → this landing).
    if (images.length) {
      if (PRERENDER_PUZZLES) {
        await runBatched(images, 200, async (im, i) => {
          const name = names[i]
          const route = puzzlePath(key, im)
          // Curated landing photos are usually also in a category - canonicalise
          // onto that copy rather than publishing the picture twice. The title
          // matches what the React app renders when the category is unknown.
          const owner = ownerOf.get(im.id)
          const canonical = owner ? puzzlePath(owner, im) : route
          const pHtml = buildHtml(template, {
            title: `${name} Jigsaw Puzzle - Free Puzzle Online | ${SITE}`,
            description: puzzleDescription(name, im.tags, im.author),
            canonicalPath: canonical,
            prev: null,
            next: null,
            robots: NOINDEX_PUZZLES ? 'noindex,follow' : null,
            jsonld: [
              breadcrumbLd([
                { name: 'Home', path: '/' },
                { name: l.h1, path: `/${key}` },
                { name, path: route },
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
                isPartOf: { '@type': 'WebPage', url: abs(route) },
              },
            ],
            body:
              `<main><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/${escAttr(key)}">${escHtml(l.h1)}</a> / <span>${escHtml(name)}</span></nav>` +
              `<h1>${escHtml(name)} Jigsaw Puzzle</h1>` +
              `<img src="${escAttr(im.url)}" width="${im.w}" height="${im.h}" alt="${escAttr(name)} - free online jigsaw puzzle photo" />` +
              `<p>Photo by ${escHtml(im.author)} on Pixabay.</p>` +
              `<p>${escHtml(puzzleDescription(name, im.tags, im.author))}</p>` +
              `<p><a href="${escAttr(route)}">Play this puzzle</a> · <a href="/${escAttr(key)}">${escHtml(l.h1)}</a></p>` +
              `</main>`,
          })
          await writePretty(route, pHtml)
        })
      }
      // Curated landing puzzle pages stay live/crawlable but are kept out of the
      // sitemap for the same crawl-budget reason as category puzzle pages above.
    }
  }
}

/**
 * Strip anything a previous run injected, so the template is the bare Vite
 * shell again. Without this, running `npm run seo` on its own (rather than a
 * full build) reads the already-prerendered home page back in as the template
 * and emits a second canonical, a second JSON-LD block, and so on.
 */
function pristineTemplate(html) {
  let out = html
    .replace(/[ \t]*<link rel="canonical"[^>]*>\n?/g, '')
    .replace(/[ \t]*<link rel="(?:prev|next)"[^>]*>\n?/g, '')
    .replace(/[ \t]*<meta name="robots"[^>]*>\n?/g, '')
    .replace(/[ \t]*<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, '')
  const start = out.indexOf('<div id="root">')
  if (start !== -1) {
    const bodyEnd = out.indexOf('</body>', start)
    const end = out.lastIndexOf('</div>', bodyEnd === -1 ? out.length : bodyEnd)
    if (end > start) out = out.slice(0, start) + '<div id="root"></div>' + out.slice(end + '</div>'.length)
  }
  return out
}

async function main() {
  if (SITE_URL === DEFAULT_DOMAIN) {
    console.info(`ℹ  SITE_URL not set - using default "${DEFAULT_DOMAIN}".`)
    console.info(`   Override with:  SITE_URL=https://example.com npm run build`)
  }
  const template = pristineTemplate(await fs.readFile(path.join(DIST, 'index.html'), 'utf8'))
  const labels = await categoryLabels()
  // Landing pages own catalogues named after their slug (e.g.
  // jigsaw-puzzles-for-seniors.json). Those are curated puzzle grids for the
  // landing, not browsable categories, so keep them out of category/sitemap
  // enumeration (buildLandings handles the landing pages themselves).
  const landingKeys = new Set(
    Object.keys(JSON.parse(await fs.readFile(path.join(ROOT, 'src', 'data', 'landings.json'), 'utf8'))),
  )
  // Skip runtime-only catalogues that aren't standalone categories:
  // event-*.json (event pages), daily*.json (Puzzle of the Day set),
  // home-*.json (home showcase) and landing-page catalogues.
  const files = (await fs.readdir(CATALOG)).filter(
    (f) =>
      f.endsWith('.json') &&
      f !== 'index.json' &&
      !f.startsWith('event-') &&
      !f.startsWith('daily') &&
      !f.startsWith('home-') &&
      !landingKeys.has(f.replace(/\.json$/, '')),
  )

  // A photo can sit in several catalogues - 4,031 of them do, which would
  // publish 6,149 pages that are exact duplicates of another page. Give every
  // image one owning category (alphabetically first, so it is stable from build
  // to build) and point the other copies' canonical at it. The duplicate pages
  // stay live and linked for people browsing that category; only Google is told
  // which one is the original.
  files.sort()
  const catalogs = new Map()
  const ownerOf = new Map()
  for (const file of files) {
    const key = file.replace(/\.json$/, '')
    const images = JSON.parse(await fs.readFile(path.join(CATALOG, file), 'utf8')).images || []
    catalogs.set(key, images)
    for (const im of images) if (!ownerOf.has(im.id)) ownerOf.set(im.id, key)
  }

  const sitemap = [] // {loc, priority}
  sitemap.push({ loc: abs('/'), priority: '1.0' })
  sitemap.push({ loc: abs('/categories'), priority: '0.7' })

  let catCount = 0
  let puzCount = 0
  let dupCount = 0
  const categoryIndex = [] // {label, slug, cover, count} for the /categories page

  for (const file of files) {
    const key = file.replace(/\.json$/, '')
    const label = labels.get(key) || titleCase(key.replace(/-/g, ' '))
    const images = catalogs.get(key)
    const slug = categorySlug(label)
    // Distinct per-puzzle names + per-category copy, from the same modules the
    // React app uses - static HTML and hydrated page stay identical.
    const names = displayNames(images)
    const copy = categoryCopy(key, label, CATEGORY_FACTS[key])
    categoryIndex.push({ label, slug, cover: images[0]?.thumb || '', count: images.length })

    // Category landing page (page 1, canonical).
    const totalPages = Math.max(1, Math.ceil(images.length / PAGE_SIZE))
    const catHtml = buildHtml(template, {
      title: categoryTitle(key, label, { site: SITE }),
      description: categoryDescription(key, label, CATEGORY_FACTS[key]),
      canonicalPath: `/${slug}`,
      prev: null,
      next: totalPages > 1 ? `/${slug}?page=2` : null,
      robots: RICH_ROBOTS,
      jsonld: categoryJsonLd(key, label, slug, images, names, copy),
      body: categoryBody(key, label, images, names, copy),
    })
    await writePretty(slug, catHtml)
    sitemap.push({ loc: abs(`/${slug}`), priority: '0.8' })
    catCount++

    // Every puzzle in the category.
    if (PRERENDER_PUZZLES) {
      await runBatched(images, 200, async (im, i) => {
        const route = puzzlePath(key, im)
        const name = names[i]
        // A copy of a photo owned by another category canonicalises onto it.
        const owner = ownerOf.get(im.id)
        const canonical = owner && owner !== key ? puzzlePath(owner, im) : route
        if (canonical !== route) dupCount++
        const html = buildHtml(template, {
          title: `${name} Jigsaw Puzzle - Free ${categoryKeyword(key, label)} Puzzle Online | ${SITE}`,
          description: puzzleDescription(name, im.tags, im.author),
          canonicalPath: canonical,
          prev: null,
          next: null,
          robots: NOINDEX_PUZZLES ? 'noindex,follow' : null,
          jsonld: puzzleJsonLd(label, key, im, name, canonical),
          body: puzzleBody(label, key, im, name),
        })
        await writePretty(route, html)
      })
      puzCount += images.length
    }
    // NOTE: individual puzzle pages are intentionally NOT added to the sitemap.
    // At ~30K near-identical thin pages, listing them all made Google defer the
    // entire set as "Discovered - currently not indexed" (crawl-budget triage on
    // a young domain). They stay live and crawlable via category internal links,
    // so they index gradually as authority grows - while the sitemap points
    // Google at the ~250 high-value pages (categories, landings, events, daily).
    process.stdout.write(`\r  ${catCount}/${files.length} categories, ${puzCount} puzzle pages…   `)
  }
  process.stdout.write('\n')

  // Prerender the /categories index (was an empty SPA shell to crawlers).
  categoryIndex.sort((a, b) => a.label.localeCompare(b.label))
  const categoriesHtml = buildHtml(template, {
    // Deliberately NOT "free online jigsaw puzzles" - that is the home page's
    // term, and two pages chasing it would just split the signal.
    title: `Jigsaw Puzzle Categories - ${categoryIndex.length} Free Themes | ${SITE}`,
    description: `Browse all ${categoryIndex.length} free online jigsaw puzzle categories - dogs, cats, flowers, landscapes, castles, space and more. ${HOME_COUNTS.puzzles} puzzles, 12 to 300 pieces.`,
    canonicalPath: '/categories',
    prev: null,
    next: null,
    robots: RICH_ROBOTS,
    jsonld: categoriesJsonLd(categoryIndex),
    body: categoriesBody(categoryIndex),
  })
  await writePretty('/categories', categoriesHtml)

  // Client-only routes (/play, /search) have no prerenderable content, but they
  // still need a real file on disk: with `cleanUrls` the host resolves an
  // extensionless path against the filesystem, and a miss is a hard 404 rather
  // than falling through to the SPA rewrite. Emit a noindex shell for each so a
  // direct hit, refresh or shared link boots the app - while genuinely unknown
  // URLs keep returning a true 404 instead of a soft-404 copy of the home page.
  for (const r of SPA_ROUTES) {
    await writePretty(
      r.path,
      buildHtml(template, {
        title: `${r.title} | ${SITE}`,
        description: r.description,
        canonicalPath: r.path,
        prev: null,
        next: null,
        robots: 'noindex,follow',
        jsonld: [],
        body: `<main><h1>${escHtml(r.title)}</h1><p>${escHtml(r.description)}</p></main>`,
      }),
    )
  }

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
    const evNamesList = displayNames(images)
    const html = buildHtml(template, {
      title: eventTitle(name, { site: SITE }),
      description: eventDescription(name, { count: images.length }),
      canonicalPath: `/event/${key}`,
      prev: null,
      next: null,
      robots: RICH_ROBOTS,
      jsonld: eventJsonLd(name, key, images, evNamesList),
      body: eventBody(name, images, evNamesList),
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
  await buildLandings(template, labels, sitemap, ownerOf)

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
    `✓ SEO build: ${catCount} category pages, ${puzCount} puzzle pages` +
      `${NOINDEX_PUZZLES ? ' (noindex)' : ''} (${dupCount} canonicalised onto another category), ` +
      `${sitemap.length} sitemap URLs in ${chunks.length} chunk(s).`,
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
