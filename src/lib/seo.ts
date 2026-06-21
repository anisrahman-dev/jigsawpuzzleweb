// Small head/SEO helpers shared across pages. They mutate <head> directly
// (this is a client-rendered SPA) so each view can set a unique title, meta
// description, canonical, pagination links and JSON-LD structured data - the
// signals Google and AI answer engines read.

export const SITE = 'Jigsaw Studio'
export const DEFAULT_TITLE = `${SITE} - Free Online Jigsaw Puzzles`
export const DEFAULT_DESC =
  'Play free online jigsaw puzzles - no login required. Choose any image, pick your difficulty, and start solving.'

function origin(): string {
  return typeof window !== 'undefined' ? window.location.origin : ''
}

/** Absolute URL for a site-relative path. */
export function absUrl(path: string): string {
  return origin() + path
}

export function setMeta(name: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string | null): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (href === null) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** Self-referencing canonical (pass a site-relative path incl. any ?query). */
export function setCanonical(path: string | null): void {
  upsertLink('canonical', path === null ? null : absUrl(path))
}

/** rel="prev"/"next" pagination hints (pass null to clear). */
export function setPrevNext(prevPath: string | null, nextPath: string | null): void {
  upsertLink('prev', prevPath ? absUrl(prevPath) : null)
  upsertLink('next', nextPath ? absUrl(nextPath) : null)
}

/** Add/replace a JSON-LD <script> identified by `id`. */
export function setJsonLd(id: string, data: unknown): void {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

export function removeJsonLd(...ids: string[]): void {
  for (const id of ids) document.getElementById(id)?.remove()
}

/** Restore the site-default title + description (call on view unmount). */
export function resetHead(): void {
  document.title = DEFAULT_TITLE
  setMeta('description', DEFAULT_DESC)
  setCanonical(null)
  setPrevNext(null, null)
}
