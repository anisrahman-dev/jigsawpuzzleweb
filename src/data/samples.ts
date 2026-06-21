// ───────────────────────────────────────────────────────────────────────────
// Zero-config fallback puzzles.
//
// These 8 ready-to-play images let the app work out of the box WITHOUT any
// Pixabay API key. They are served by Lorem Picsum (https://picsum.photos),
// which requires no auth and no key - each `seed` always resolves to the same
// photo, so puzzles stay stable across reloads. All are landscape (1200x800)
// to fit the puzzle board.
// ───────────────────────────────────────────────────────────────────────────

import type { PuzzleImage } from '@/types'

interface SampleSeed {
  seed: string
  tags: string
}

const SEEDS: SampleSeed[] = [
  { seed: 'mountains', tags: 'mountains, peaks, alpine landscape' },
  { seed: 'forest', tags: 'forest, trees, woodland' },
  { seed: 'ocean', tags: 'ocean, sea, waves' },
  { seed: 'city', tags: 'city, skyline, urban' },
  { seed: 'desert', tags: 'desert, dunes, sand' },
  { seed: 'autumn', tags: 'autumn, fall foliage, leaves' },
  { seed: 'flowers', tags: 'flowers, blossoms, garden' },
  { seed: 'aurora', tags: 'aurora, northern lights, night sky' },
]

export const SAMPLE_IMAGES: PuzzleImage[] = SEEDS.map(({ seed, tags }) => ({
  id: `sample-${seed}`,
  url: `https://picsum.photos/seed/${seed}/1200/800`,
  thumbUrl: `https://picsum.photos/seed/${seed}/400/267`,
  width: 1200,
  height: 800,
  credit: 'Photo via Lorem Picsum',
  tags,
}))
