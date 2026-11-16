export interface CopyImage {
  id: string
  tags?: string
  author?: string
  w: number
  h: number
}
export interface CategoryContext {
  images: CopyImage[]
  names: string[]
  n: number
}
export interface PuzzleCopy {
  about: string
  photographer: string
  sizes: string
  tips: string[]
  facts: { k: string; v: string }[]
  tags: string[]
  similar: number[]
  headings: { about: string; sizes: string; tips: string; similar: string }
}
export declare function categoryContext(images: CopyImage[], names: string[]): CategoryContext
export declare function similarIndices(ctx: CategoryContext, i: number, limit?: number): number[]
export declare function puzzleCopy(ctx: CategoryContext, i: number, label: string | null): PuzzleCopy
