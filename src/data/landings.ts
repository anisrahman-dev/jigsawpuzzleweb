// SEO landing pages (custom puzzle maker, piece-count, audience) - a single
// source of truth shared by the React app and the prerender step
// (scripts/seo-build.mjs reads the same landings.json).
import data from './landings.json'
import type { Difficulty } from '@/types'

export type LandingKind = 'custom' | 'pieces' | 'audience'

export interface Landing {
  /** URL path key (also the slug): `/<key>`. */
  key: string
  kind: LandingKind
  /** Difficulty preset to pre-select on visit (pieces/audience pages). */
  difficulty?: Difficulty
  title: string
  h1: string
  description: string
  lead: string
  paras: string[]
  /** Category keys surfaced as internal links. */
  categoryKeys: string[]
  faq: [string, string][]
}

const RAW = data as unknown as Record<string, Omit<Landing, 'key'>>

export const LANDINGS: Landing[] = Object.entries(RAW).map(([key, v]) => ({ key, ...v }))
export const LANDING_KEYS = new Set(LANDINGS.map((l) => l.key))

export function landingByKey(key: string): Landing | null {
  return LANDINGS.find((l) => l.key === key) ?? null
}
