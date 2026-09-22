export declare const CATEGORY_SEO: Record<string, { kw: string; hook: string }>
export declare function categoryKeyword(key: string, label: string): string
export declare function jigsawTitle(subject: string, opts?: { site?: string }): string
export declare function eventTitle(name: string, opts?: { site?: string }): string
export declare function eventDescription(
  name: string,
  opts?: { count?: number; multiplier?: number },
): string
export declare function categoryHook(key: string): string
export declare function categoryKeywordInline(key: string, label: string): string
export declare function categoryTitle(
  key: string,
  label: string,
  opts?: { page?: number; site?: string },
): string
export declare function categoryH1(key: string, label: string): string
export declare function categoryDescription(
  key: string,
  label: string,
  facts?: { count: number },
): string
