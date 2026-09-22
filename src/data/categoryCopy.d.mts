export interface CategoryFacts {
  count: number
  subjects: string[]
}
export interface CategoryCopy {
  lead: string
  paras: string[]
  faq: { q: string; a: string }[]
}
export declare function categoryCopy(
  key: string,
  label: string,
  facts?: CategoryFacts,
): CategoryCopy
