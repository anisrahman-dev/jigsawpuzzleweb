export interface FeaturedPuzzle {
  category: string
  id: string
  slug: string
  image: string
  thumb: string
  width: number
  height: number
  published: string
  updated: string
  title: string
  description: string
  h1: string
  alt: string
  lead: string
  recommended: { pieces: number; why: string }
  sections: { heading: string; paras?: string[]; items?: string[] }[]
  faq: { q: string; a: string }[]
}
export declare const FEATURED_PUZZLES: FeaturedPuzzle[]
export declare const FEATURED_LINKS: { href: string; label: string }[]
export declare function featuredBlurb(f: FeaturedPuzzle): string
export declare function featuredPath(f: FeaturedPuzzle): string
export declare function featuredByPath(path: string): FeaturedPuzzle | undefined
export declare function featuredFor(category: string, id: string): FeaturedPuzzle | undefined
