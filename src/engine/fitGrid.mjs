// Shared by the game (src/engine/grid.ts re-exports it) and the prerender
// (src/data/puzzleCopy.mjs), so a puzzle page's "Expert is cut 21 × 14" text
// always matches the board the player actually gets. Plain ESM so node can
// import it; types in fitGrid.d.mts.

/**
 * Choose a cols×rows grid whose total is close to `targetPieces` while keeping
 * piece cells as square as possible for the given image aspect ratio.
 *
 * @param {number} targetPieces
 * @param {number} imgWidth
 * @param {number} imgHeight
 * @returns {{cols:number, rows:number}}
 */
export function fitGrid(targetPieces, imgWidth, imgHeight) {
  const aspect = imgWidth / imgHeight
  // cols/rows ≈ aspect, cols*rows ≈ target  →  cols ≈ sqrt(target*aspect)
  let cols = Math.max(2, Math.round(Math.sqrt(targetPieces * aspect)))
  let rows = Math.max(2, Math.round(targetPieces / cols))
  // nudge toward target
  while (cols * rows < targetPieces * 0.8) {
    if (cols / rows < aspect) cols++
    else rows++
  }
  return { cols, rows }
}
