export interface CategoryEditorial {
  title: string
  description: string
  lead: string
  featured: string[]
  sections: { heading: string; paras: string[] }[]
  related: { href: string; label: string; note: string }[]
  faq: { q: string; a: string }[]
}
export declare const CATEGORY_EDITORIAL: Record<string, CategoryEditorial>
export declare function categoryEditorial(key: string): CategoryEditorial | undefined
export declare function featuredFirst<T>(
  items: T[],
  featured: string[] | undefined,
  idOf: (item: T) => string,
): T[]
