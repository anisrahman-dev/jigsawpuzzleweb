// Curated, zero-config puzzle catalogue for the gallery-first home.
// Images are STABLE real photos (Picsum photo IDs → fixed Unsplash photographs)
// so titles & credits match the picture - no API key needed. With a Pixabay key,
// `searchGallery()` returns live results in the same shape.
import type { PuzzleImage } from '@/types'
import { searchImages } from '@/api/pixabay'

export type PuzzleTag = 'new' | 'hot' | 'staff' | null

export interface GalleryPuzzle extends PuzzleImage {
  title: string
  category: string
  pieces: number
  author: string
  plays: number
  likes: number
  bestSec: number
  tag: PuzzleTag
}

export interface GallerySection {
  key: string
  title: string
  puzzles: GalleryPuzzle[]
}

export interface GalleryCategory {
  key: string
  label: string
  query: string
  /** True when the curated catalogue has puzzles in this category. Search-only
   *  categories (local:false) need a Pixabay key to populate with live photos. */
  local: boolean
  /** Picsum photo id used as the category-tile cover (mainly for search-only). */
  coverId?: number
}

// Senior- & USA-friendly category set (broad, familiar, calming themes).
// The first block is backed by the curated catalogue (works with no key); the
// second block fetches live Pixabay photos when a key is configured.
export const GALLERY_CATEGORIES: GalleryCategory[] = [
  { key: 'nature', label: 'Nature', query: 'landscape mountains lake scenic', local: true },
  { key: 'wildlife', label: 'Wildlife', query: 'wildlife animals', local: true },
  { key: 'pets', label: 'Cats & Dogs', query: 'dog cat pet', local: true },
  { key: 'flowers', label: 'Flowers', query: 'flowers blossom garden', local: true },
  { key: 'autumn', label: 'Autumn', query: 'autumn fall foliage', local: true },
  { key: 'winter', label: 'Winter', query: 'winter snow', local: true },
  { key: 'countryside', label: 'Countryside', query: 'countryside farm rural barn', local: true },
  { key: 'cities', label: 'Cities', query: 'city architecture street', local: true },
  { key: 'travel', label: 'Travel', query: 'travel landmark journey', local: true },
  { key: 'food', label: 'Food & Coffee', query: 'food coffee delicious', local: true },
  { key: 'art', label: 'Still Life', query: 'still life vintage objects', local: true },
  // ── More categories (live Pixabay search) ────────────────────────────────
  { key: 'beaches', label: 'Beaches & Coast', query: 'beach ocean coast', local: false, coverId: 1036 },
  { key: 'birds', label: 'Birds', query: 'birds', local: false, coverId: 1024 },
  { key: 'sunsets', label: 'Sunsets', query: 'sunset golden sky', local: false, coverId: 695 },
  { key: 'lighthouses', label: 'Lighthouses', query: 'lighthouse coast', local: false, coverId: 866 },
  { key: 'national-parks', label: 'National Parks', query: 'national park usa landscape', local: false, coverId: 1018 },
  { key: 'gardens', label: 'Gardens', query: 'garden flowers landscaping', local: false, coverId: 301 },
  { key: 'trains', label: 'Trains', query: 'train railway locomotive', local: false, coverId: 76 },
  { key: 'classic-cars', label: 'Classic Cars', query: 'classic vintage car', local: false, coverId: 96 },
  { key: 'farms', label: 'Farms & Barns', query: 'farm barn countryside', local: false, coverId: 200 },
  { key: 'holidays', label: 'Holidays', query: 'christmas holiday festive', local: false, coverId: 1060 },
  { key: 'space', label: 'Space & Sky', query: 'space galaxy stars night sky', local: false, coverId: 901 },
  { key: 'patriotic', label: 'Americana', query: 'american flag patriotic usa', local: false, coverId: 580 },
  { key: 'castles', label: 'Castles', query: 'castle palace medieval', local: false, coverId: 106 },
  { key: 'horses', label: 'Horses', query: 'horse equine meadow', local: false, coverId: 484 },
]

const img = (id: number) => `https://picsum.photos/id/${id}/1200/800`
const thumb = (id: number) => `https://picsum.photos/id/${id}/600/400`
const plays = (id: number) => 240 + ((id * 7919) % 9600)
const likes = (id: number) => 6 + ((id * 131) % 540)
const bestSec = (id: number) => 95 + ((id * 53) % 1450)

function p(
  id: number,
  title: string,
  category: string,
  pieces: number,
  author: string,
  tag: PuzzleTag = null,
): GalleryPuzzle {
  return {
    id: `g-${id}`,
    url: img(id),
    thumbUrl: thumb(id),
    width: 1200,
    height: 800,
    credit: `Photo by ${author}`,
    tags: title.toLowerCase(),
    title,
    category,
    pieces,
    author,
    plays: plays(id),
    likes: likes(id),
    bestSec: bestSec(id),
    tag,
  }
}

export const GALLERY_PUZZLES: GalleryPuzzle[] = [
  // ── Nature ────────────────────────────────────────────────────────────────
  p(10, 'Misty Mountain Lake', 'nature', 100, 'Paul Jarvis', 'hot'),
  p(29, 'The Summit', 'nature', 300, 'Go Wild', 'staff'),
  p(68, 'Golden Hour Meadow', 'nature', 48, 'Cristian Moscoso'),
  p(116, 'Amber Hills', 'nature', 108, 'Anton Sulsky'),
  p(684, 'Alpine Heights', 'nature', 150, 'Lee Roylland'),
  p(737, 'Forest Waterfall', 'nature', 100, 'Anthony Indraus', 'hot'),
  p(827, 'Turquoise Lake', 'nature', 300, 'kazuend'),
  p(1000, 'Above the Clouds', 'nature', 300, 'Lukas Budimaier'),
  p(1015, 'River Through the Canyon', 'nature', 150, 'Alexey Topolyanskiy'),
  p(1018, 'Clouds Over the Range', 'nature', 100, 'Andrew Ridley'),
  p(466, 'Cathedral Pines', 'nature', 108, 'Caleb George'),
  p(502, 'Deep Forest', 'nature', 150, 'Sven Schlager'),
  p(650, 'Green Highlands', 'nature', 100, 'Lou Levit'),
  p(866, 'Emerald Fjord', 'nature', 150, 'Samuel Zeller'),
  p(901, 'Northern Lights', 'nature', 100, 'Marcelo Quinan', 'staff'),
  p(548, 'Campfire Glow', 'nature', 48, 'Joshua Earle'),
  // ── Wildlife ────────────────────────────────────────────────────────────
  p(169, 'Brown Bear', 'wildlife', 150, 'Noel Lopez', 'hot'),
  p(423, 'Bear in the Wild', 'wildlife', 108, 'Gabriel Santiago'),
  p(564, 'Mountain Gorilla', 'wildlife', 100, 'Sebastian Boguszewicz'),
  p(577, 'Wolf in Winter', 'wildlife', 150, 'Thomas Lefebvre'),
  p(593, 'On the Prowl', 'wildlife', 300, 'Paula Borowska', 'staff'),
  p(718, 'Lone Wolf', 'wildlife', 108, 'Josh Felise'),
  p(1024, 'Eagle in Flight', 'wildlife', 150, 'Niko Virtanen', 'new'),
  p(1056, 'Deer in the Meadow', 'wildlife', 100, 'Susanne Feldt'),
  p(1003, 'Red Fox', 'wildlife', 48, 'E+N Photographies', 'new'),
  p(1084, 'Walrus on the Shore', 'wildlife', 100, 'Jay Ruzesky'),
  // ── Cats & Dogs ───────────────────────────────────────────────────────────
  p(237, 'Black Lab Pup', 'pets', 48, 'André Spieker', 'hot'),
  p(659, 'Curious Cat', 'pets', 100, 'Alexander Dimitrov'),
  p(1025, 'Sleepy Pug', 'pets', 48, 'Matthew Wiebe', 'hot'),
  p(1074, 'Bulldog Nap', 'pets', 48, 'Samuel Scrimshaw'),
  // ── Flowers ─────────────────────────────────────────────────────────────
  p(87, 'Cherry Blossom', 'flowers', 108, 'Barcelona', 'staff'),
  p(103, 'Purple Petals', 'flowers', 100, 'Ilham Rahmansyah'),
  p(152, 'Violet in Bloom', 'flowers', 48, 'Steven Spassov'),
  p(306, 'White Daisy', 'flowers', 48, 'Schicka'),
  p(360, 'Crimson Bloom', 'flowers', 100, 'Cas Cornelissen', 'new'),
  p(82, 'Blossom Branch', 'flowers', 108, 'Rula Sibai'),
  p(301, 'Garden Pinks', 'flowers', 100, 'Tirza van Dijk'),
  p(248, 'Desert Bloom', 'flowers', 48, 'Oliver Pacas'),
  // ── Autumn ──────────────────────────────────────────────────────────────
  p(883, 'Autumn Ablaze', 'autumn', 108, 'Joshua Earle', 'new'),
  p(783, 'Autumn Trail', 'autumn', 150, 'Damir Kotoric', 'hot'),
  p(37, 'Autumn Park Path', 'autumn', 100, 'Austin Neill'),
  p(93, 'Bench in the Leaves', 'autumn', 48, 'Caroline Sada'),
  // ── Winter ──────────────────────────────────────────────────────────────
  p(28, 'Snowbound Peaks', 'winter', 150, 'Jerry Adney'),
  p(256, 'First Snow', 'winter', 100, 'Sylwia Bartyzel'),
  p(730, 'Frosted Field', 'winter', 48, 'Ryan Pohanic'),
  p(218, 'Winter Silence', 'winter', 108, 'Monika Majkowska'),
  p(991, 'The Matterhorn', 'winter', 300, 'Fritz Bielmeier', 'staff'),
  p(678, 'Snowy Summit', 'winter', 150, 'Samuel Zeller'),
  // ── Countryside ───────────────────────────────────────────────────────────
  p(17, 'Country Road', 'countryside', 100, 'Paul Jarvis'),
  p(271, 'Wheat Fields', 'countryside', 108, 'Fré Sonneveld', 'hot'),
  p(484, 'Rolling Green Hills', 'countryside', 150, 'David Marcu'),
  p(206, 'The Old Cabin', 'countryside', 48, 'Philipp Reiner'),
  p(200, 'In the Pasture', 'countryside', 100, 'Elias Carlsson'),
  // ── Cities ──────────────────────────────────────────────────────────────
  p(392, 'The Golden Gate', 'cities', 150, 'Chris Brignola', 'staff'),
  p(106, 'Old Town Colours', 'cities', 150, 'Arvee Marie'),
  p(164, 'Painted Houses', 'cities', 108, 'Linh Nguyen', 'hot'),
  p(419, 'City Tram', 'cities', 100, 'POR7O'),
  p(437, 'Harbour Houses', 'cities', 300, 'Bonnie Meisels'),
  p(515, 'Stadium Lights', 'cities', 108, 'Jeff Sheldon'),
  p(195, 'Corner Café', 'cities', 48, 'Matthew Skinner'),
  p(358, 'Iron Bridge', 'cities', 100, 'Levi Saunders'),
  // ── Travel ────────────────────────────────────────────────────────────────
  p(580, 'Stars & Stripes', 'travel', 100, 'Christopher Skor', 'staff'),
  p(1011, 'Kayak at Dawn', 'travel', 300, 'Roberto Nickson'),
  p(96, 'Yellow Roadster', 'travel', 100, 'Pawel Kadysz', 'hot'),
  p(133, 'Vintage Roadsters', 'travel', 150, 'Dietmar Becker'),
  p(314, 'The Open Road', 'travel', 100, 'Fré Sonneveld'),
  p(401, 'Mountain Pass', 'travel', 108, 'Austin Ban'),
  p(667, 'Valley Highway', 'travel', 150, 'Joshua Sortino'),
  p(1036, 'Coastal Drive', 'travel', 100, 'Wolfgang Lutz'),
  p(13, 'The Long Jetty', 'travel', 150, 'Paul Jarvis'),
  p(76, 'Down the Line', 'travel', 108, 'Alexander Shustov'),
  // ── Food & Coffee ───────────────────────────────────────────────────────
  p(431, 'Coffee & a Good Book', 'food', 100, 'Carli Jean', 'hot'),
  p(63, 'Coffee on Red', 'food', 48, 'Justin Leibow'),
  p(674, 'Fresh Blueberries', 'food', 108, 'Maja Petric'),
  p(766, 'Roasted Beans', 'food', 150, 'Padurariu Alexandru'),
  p(1060, 'Sweet Cupcakes', 'food', 48, 'Karl Fredrickson', 'new'),
  p(225, 'Morning Espresso', 'food', 48, 'Vee O'),
  p(230, 'Garden Salad', 'food', 100, 'Wes Carr'),
  p(292, 'Farm Vegetables', 'food', 108, 'Webvilla'),
  p(371, 'The Coffee Bar', 'food', 100, 'Kim Daniel'),
  p(1080, 'Fresh Berries', 'food', 48, 'veeterzy', 'new'),
  // ── Still Life ────────────────────────────────────────────────────────────
  p(110, 'Antique Clock', 'art', 108, 'Kenneth Thewissen'),
  p(175, 'Station Clock', 'art', 100, 'petradr'),
  p(513, "The Writer's Desk", 'art', 48, 'Jeff Sheldon'),
  p(1069, 'Liquid Amber', 'art', 100, 'Marat Gilyadzinov', 'new'),
  p(24, 'Quiet Reading', 'art', 48, 'Alejandro Escamilla'),
  p(128, 'Vintage Camera', 'art', 100, 'Matteo Minelli'),
  p(1077, 'Camera Collection', 'art', 108, 'Maico Amorim'),
]

const byCat = (c: string) => GALLERY_PUZZLES.filter((x) => x.category === c)
const pick = (...ids: number[]) =>
  ids.map((id) => GALLERY_PUZZLES.find((x) => x.id === `g-${id}`)).filter((x): x is GalleryPuzzle => !!x)

export const GALLERY_SECTIONS: GallerySection[] = [
  { key: 'featured', title: 'Featured Puzzles', puzzles: pick(827, 87, 593, 392, 883, 1025, 674, 1018) },
  { key: 'popular', title: 'Popular This Week', puzzles: pick(10, 169, 737, 96, 164, 431, 237, 991) },
  { key: 'nature', title: 'Nature & Landscapes', puzzles: byCat('nature') },
  { key: 'wildlife', title: 'Animals & Wildlife', puzzles: byCat('wildlife') },
  { key: 'pets', title: 'Cats & Dogs', puzzles: byCat('pets') },
  { key: 'autumn', title: 'Autumn Colours', puzzles: byCat('autumn') },
  { key: 'flowers', title: 'Flowers & Gardens', puzzles: byCat('flowers') },
  { key: 'cities', title: 'Cities & Landmarks', puzzles: byCat('cities') },
  { key: 'food', title: 'Food & Coffee', puzzles: byCat('food') },
  { key: 'travel', title: 'Travel & Roads', puzzles: byCat('travel') },
]

export const HERO_PUZZLE: GalleryPuzzle = GALLERY_PUZZLES.find((x) => x.id === 'g-827')!

export function categoryCount(key: string): number {
  return byCat(key).length
}

/** A representative cover thumbnail for a category tile. */
export function categoryCover(key: string): string {
  const cat = GALLERY_CATEGORIES.find((c) => c.key === key)
  const first = byCat(key)[0]
  if (first) return first.thumbUrl
  if (cat?.coverId) return thumb(cat.coverId)
  return GALLERY_PUZZLES[0].thumbUrl
}

function guessPieces(i: number): number {
  return [48, 100, 150, 108, 300][i % 5]
}

interface CatalogImage {
  id: string
  url: string
  thumb: string
  w: number
  h: number
  tags: string
  author: string
}

const catalogCache = new Map<string, Promise<GalleryPuzzle[]>>()

/**
 * Load a category's pre-fetched static catalogue (≈450 curated, human-free,
 * jigsaw-friendly photos) from `public/catalog/<key>.json`. Works with no API
 * key. Memoized per category. Throws if the category has no catalogue file.
 */
export function loadCategoryCatalog(key: string): Promise<GalleryPuzzle[]> {
  const cached = catalogCache.get(key)
  if (cached) return cached
  const p = fetchCatalog(key)
  catalogCache.set(key, p)
  p.catch(() => catalogCache.delete(key)) // don't cache failures
  return p
}

/**
 * Resolve a single puzzle by category + raw image id (for `/puzzle/...` deep
 * links). Falls back to the curated catalogue for non-catalogue ids.
 */
export async function findPuzzle(category: string, rawId: string): Promise<GalleryPuzzle | null> {
  try {
    const list = await loadCategoryCatalog(category)
    const hit = list.find((p) => p.id === `c-${rawId}`)
    if (hit) return hit
  } catch {
    /* no catalogue for this category - fall through */
  }
  return GALLERY_PUZZLES.find((p) => p.id === `g-${rawId}` || p.id === `c-${rawId}`) ?? null
}

/** Map a raw catalogue image to a playable GalleryPuzzle in category `cat`. */
function catalogImageToPuzzle(im: CatalogImage, i: number, cat: string): GalleryPuzzle {
  const id = Number(im.id) || i + 1
  const title = (im.tags?.split(',')[0] ?? 'Puzzle').replace(/\b\w/g, (m) => m.toUpperCase()).trim()
  return {
    id: `c-${im.id}`,
    url: im.url,
    thumbUrl: im.thumb,
    width: im.w,
    height: im.h,
    credit: `Image by ${im.author} on Pixabay`,
    tags: im.tags,
    title,
    category: cat,
    pieces: guessPieces(i),
    author: im.author,
    plays: plays(id),
    likes: likes(id),
    bestSec: bestSec(id),
    tag: null as PuzzleTag,
  }
}

async function fetchCatalog(key: string): Promise<GalleryPuzzle[]> {
  const res = await fetch(`${import.meta.env.BASE_URL}catalog/${key}.json`)
  if (!res.ok) throw new Error(`No catalogue for "${key}" (${res.status})`)
  const data = (await res.json()) as { key: string; images: CatalogImage[] }
  return data.images.map((im, i) => catalogImageToPuzzle(im, i, key))
}

/** Curated scenic sections for the home page (houses, architecture, boats,
 *  mountains, castles, lighthouses) - one small file, all human-free. */
export async function loadShowcase(): Promise<GallerySection[]> {
  const res = await fetch(`${import.meta.env.BASE_URL}catalog/home-showcase.json`)
  if (!res.ok) throw new Error(`No home showcase (${res.status})`)
  const data = (await res.json()) as {
    sections: { key: string; title: string; images: CatalogImage[] }[]
  }
  return data.sections.map((s) => ({
    key: s.key,
    title: s.title,
    puzzles: s.images.map((im, i) => catalogImageToPuzzle(im, i, s.key)),
  }))
}

export async function searchGallery(query: string): Promise<GalleryPuzzle[]> {
  const imgs = await searchImages(query, { perPage: 24, orientation: 'horizontal' })
  return imgs.map((im, i) => {
    const id = Number(im.id) || i + 1
    const author = im.credit?.replace(/^Image by\s+/, '').replace(/\s+on Pixabay$/, '') ?? 'Pixabay'
    return {
      ...im,
      title: (im.tags?.split(',')[0] ?? 'Puzzle').replace(/\b\w/g, (m) => m.toUpperCase()).trim(),
      category: 'search',
      pieces: guessPieces(i),
      author,
      plays: plays(id),
      likes: likes(id),
      bestSec: bestSec(id),
      tag: null as PuzzleTag,
    }
  })
}
