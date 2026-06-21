import type { PuzzleImage } from '@/types'

const ENDPOINT = 'https://pixabay.com/api/'
const LS_KEY = 'jigsaw.pixabayKey'

/** Resolve the Pixabay key: build-time env first, then the user's saved key. */
export function getApiKey(): string {
  const env = (import.meta.env.VITE_PIXABAY_API_KEY as string | undefined)?.trim()
  if (env) return env
  try {
    return (localStorage.getItem(LS_KEY) ?? '').trim()
  } catch {
    return ''
  }
}

/** The user's own saved key (localStorage only) - never the site's build-time
 *  env key. Use this for the Settings field so the env key is never displayed. */
export function getUserKey(): string {
  try {
    return (localStorage.getItem(LS_KEY) ?? '').trim()
  } catch {
    return ''
  }
}

export function setApiKey(key: string): void {
  try {
    localStorage.setItem(LS_KEY, key.trim())
  } catch {
    /* storage may be unavailable (private mode) */
  }
}

export function hasApiKey(): boolean {
  return getApiKey().length > 0
}

export class PixabayError extends Error {
  constructor(message: string, readonly kind: 'no-key' | 'http' | 'empty' | 'network' = 'http') {
    super(message)
    this.name = 'PixabayError'
  }
}

interface PixabayHit {
  id: number
  webformatURL: string
  largeImageURL: string
  previewURL: string
  imageWidth: number
  imageHeight: number
  webformatWidth: number
  webformatHeight: number
  tags: string
  user: string
}

export interface SearchOptions {
  /** 'horizontal' fits the landscape board best; default 'all'. */
  orientation?: 'all' | 'horizontal' | 'vertical'
  perPage?: number
  page?: number
  /** Pixabay category, e.g. "nature", "animals". */
  category?: string
}

/** Curated browse categories surfaced in the picker. */
export const CATEGORIES: { key: string; label: string; query: string }[] = [
  { key: 'nature', label: 'Nature', query: 'landscape nature' },
  { key: 'animals', label: 'Animals', query: 'animals wildlife' },
  { key: 'flowers', label: 'Flowers', query: 'flowers garden' },
  { key: 'cities', label: 'Cities', query: 'city skyline architecture' },
  { key: 'food', label: 'Food', query: 'food colorful' },
  { key: 'space', label: 'Space', query: 'space galaxy stars' },
  { key: 'travel', label: 'Travel', query: 'travel scenic' },
  { key: 'art', label: 'Art', query: 'abstract art pattern' },
]

function toPuzzleImage(hit: PixabayHit): PuzzleImage {
  return {
    id: String(hit.id),
    url: hit.largeImageURL || hit.webformatURL,
    thumbUrl: hit.webformatURL || hit.previewURL,
    width: hit.imageWidth,
    height: hit.imageHeight,
    credit: `Image by ${hit.user} on Pixabay`,
    tags: hit.tags,
  }
}

export async function searchImages(query: string, opts: SearchOptions = {}): Promise<PuzzleImage[]> {
  const key = getApiKey()
  if (!key) throw new PixabayError('No Pixabay API key set.', 'no-key')

  const params = new URLSearchParams({
    key,
    q: query.trim(),
    image_type: 'photo',
    safesearch: 'true',
    per_page: String(opts.perPage ?? 24),
    page: String(opts.page ?? 1),
    orientation: opts.orientation ?? 'all',
    order: 'popular',
  })
  if (opts.category) params.set('category', opts.category)

  let res: Response
  try {
    res = await fetch(`${ENDPOINT}?${params.toString()}`)
  } catch {
    throw new PixabayError('Network error reaching Pixabay.', 'network')
  }
  if (!res.ok) {
    if (res.status === 400 || res.status === 401) {
      throw new PixabayError('Pixabay rejected the request - check your API key.', 'http')
    }
    if (res.status === 429) {
      throw new PixabayError('Rate limit reached. Wait a moment and try again.', 'http')
    }
    throw new PixabayError(`Pixabay request failed (${res.status}).`, 'http')
  }
  const data = (await res.json()) as { hits?: PixabayHit[] }
  const hits = data.hits ?? []
  if (hits.length === 0) throw new PixabayError('No images found for that search.', 'empty')
  // Only keep images large enough to make a decent puzzle.
  return hits.filter((h) => h.imageWidth >= 640).map(toPuzzleImage)
}

/**
 * Load an image element for canvas rendering. We request CORS but never read
 * pixels back (only drawImage to on-screen canvases), so this works for
 * Pixabay regardless of CORS headers.
 */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => {
      // Retry without crossOrigin in case the header is absent.
      const img2 = new Image()
      img2.onload = () => resolve(img2)
      img2.onerror = () => reject(new PixabayError('Failed to load image.', 'network'))
      img2.src = url
    }
    img.src = url
  })
}
