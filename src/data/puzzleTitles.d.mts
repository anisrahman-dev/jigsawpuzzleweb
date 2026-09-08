export declare function slugName(tagStr: string | undefined): string
export declare function displayNames(
  images: { id: string; tags?: string; author?: string }[],
): string[]
export declare function extraTags(
  tags: string | undefined,
  name: string,
  limit: number,
): string[]
export declare function puzzleDescription(
  name: string,
  tags: string | undefined,
  author: string | undefined,
): string
