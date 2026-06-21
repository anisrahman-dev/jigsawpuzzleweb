import type { PieceEdges, PieceGeometry } from '@/types'

// ───────────────────────────────────────────────────────────────────────────
// Jigsaw piece geometry.
//
// Strategy that GUARANTEES pieces fit: every internal boundary between two
// neighbouring cells is generated exactly once as a shared cubic-bézier curve
// in board (world) coordinates. Both neighbours trace that identical curve as
// part of their own outline, so the tab of one piece is, by construction, the
// negative of the blank of the other. No per-edge matching logic required.
// ───────────────────────────────────────────────────────────────────────────

interface Pt {
  x: number
  y: number
}
interface Seg {
  c1: Pt
  c2: Pt
  p: Pt
}
interface Curve {
  start: Pt
  segs: Seg[]
}

/** Tiny seeded RNG so a puzzle can be reproduced from a seed. */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Build a tab curve in a local frame: the edge runs along +X from (0,0) to
 * (length,0); the knob bulges toward +Y when `sign > 0`. The neck is narrower
 * than the head, giving the classic interlocking shape. `jit` adds gentle,
 * organic asymmetry. Returns control points in local coordinates.
 */
function tabLocal(length: number, sign: number, jit: number): Seg[] {
  const L = length
  const d = 0.27 * L * sign // knob depth
  const j = jit * L
  // Normalised anchors (along x in [0,1]); y handled via depth `d`.
  // Shoulders at ~0.42/0.58, head spans ~0.34..0.66 → head wider than neck.
  const seg = (
    c1x: number, c1y: number,
    c2x: number, c2y: number,
    px: number, py: number,
  ): Seg => ({
    c1: { x: c1x * L, y: c1y * d },
    c2: { x: c2x * L, y: c2y * d },
    p: { x: px * L, y: py * d },
  })
  return [
    seg(0.25, 0.0, 0.4 + j / L, 0.0, 0.42 + j / L, 0.18),
    seg(0.36, 0.5, 0.32, 0.9, 0.5, 1.0),
    seg(0.68, 0.9, 0.64, 0.5, 0.58 - j / L, 0.18),
    seg(0.6 - j / L, 0.0, 0.75, 0.0, 1.0, 0.0),
  ]
}

/** A flat edge: a single straight segment from (0,0) to (length,0). */
function flatLocal(length: number): Seg[] {
  return [{ c1: { x: length / 3, y: 0 }, c2: { x: (2 * length) / 3, y: 0 }, p: { x: length, y: 0 } }]
}

/** Map a local-frame curve into world coords for a HORIZONTAL boundary. */
function placeH(a: Pt, segs: Seg[]): Curve {
  const m = (lx: number, ly: number): Pt => ({ x: a.x + lx, y: a.y + ly })
  return { start: { x: a.x, y: a.y }, segs: segs.map((s) => ({ c1: m(s.c1.x, s.c1.y), c2: m(s.c2.x, s.c2.y), p: m(s.p.x, s.p.y) })) }
}

/** Map a local-frame curve into world coords for a VERTICAL boundary. */
function placeV(a: Pt, segs: Seg[]): Curve {
  // local along (x) → world down (y); local perp (y) → world (x).
  const m = (lx: number, ly: number): Pt => ({ x: a.x + ly, y: a.y + lx })
  return { start: { x: a.x, y: a.y }, segs: segs.map((s) => ({ c1: m(s.c1.x, s.c1.y), c2: m(s.c2.x, s.c2.y), p: m(s.p.x, s.p.y) })) }
}

/** Reverse a bézier chain (swap control points, reverse order). */
function reverse(curve: Curve): Curve {
  const pts: Pt[] = [curve.start, ...curve.segs.map((s) => s.p)]
  const segs: Seg[] = []
  for (let i = curve.segs.length - 1; i >= 0; i--) {
    const s = curve.segs[i]
    segs.push({ c1: s.c2, c2: s.c1, p: pts[i] })
  }
  return { start: pts[pts.length - 1], segs }
}

export interface PuzzleShapes {
  cols: number
  rows: number
  cellW: number
  cellH: number
  /** Uniform overhang margin (px) added around every piece's bounding box. */
  over: number
  geometry: PieceGeometry[] // indexed by id = row * cols + col
  edges: PieceEdges[]
}

export function buildPuzzleShapes(
  cols: number,
  rows: number,
  cellW: number,
  cellH: number,
  seed = 1,
): PuzzleShapes {
  const rng = mulberry32(seed)
  const over = Math.round(0.34 * Math.min(cellW, cellH))

  // Sign + jitter for every internal boundary.
  // hSign[r][c]: boundary BELOW row r (r in 0..rows-2). +1 bulges down.
  // vSign[r][c]: boundary RIGHT of col c (c in 0..cols-2). +1 bulges right.
  const hSign: number[][] = []
  const hJit: number[][] = []
  for (let r = 0; r < rows - 1; r++) {
    hSign[r] = []
    hJit[r] = []
    for (let c = 0; c < cols; c++) {
      hSign[r][c] = rng() < 0.5 ? 1 : -1
      hJit[r][c] = (rng() - 0.5) * 0.12
    }
  }
  const vSign: number[][] = []
  const vJit: number[][] = []
  for (let r = 0; r < rows; r++) {
    vSign[r] = []
    vJit[r] = []
    for (let c = 0; c < cols - 1; c++) {
      vSign[r][c] = rng() < 0.5 ? 1 : -1
      vJit[r][c] = (rng() - 0.5) * 0.12
    }
  }

  const hCurve = (r: number, c: number): Curve => {
    const a = { x: c * cellW, y: (r + 1) * cellH }
    return placeH(a, tabLocal(cellW, hSign[r][c], hJit[r][c]))
  }
  const vCurve = (r: number, c: number): Curve => {
    const a = { x: (c + 1) * cellW, y: r * cellH }
    return placeV(a, tabLocal(cellH, vSign[r][c], vJit[r][c]))
  }

  const geometry: PieceGeometry[] = []
  const edges: PieceEdges[] = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = r * cols + c
      const TL = { x: c * cellW, y: r * cellH }

      // Build the four world-space boundary curves, oriented clockwise.
      const top: Curve =
        r === 0
          ? placeH(TL, flatLocal(cellW))
          : hCurve(r - 1, c)
      const right: Curve =
        c === cols - 1
          ? placeV({ x: (c + 1) * cellW, y: r * cellH }, flatLocal(cellH))
          : vCurve(r, c)
      const bottom: Curve =
        r === rows - 1
          ? reverse(placeH({ x: c * cellW, y: (r + 1) * cellH }, flatLocal(cellW)))
          : reverse(hCurve(r, c))
      const left: Curve =
        c === 0
          ? reverse(placeV({ x: c * cellW, y: r * cellH }, flatLocal(cellH)))
          : reverse(vCurve(r, c - 1))

      // Assemble clockwise outline: top → right → bottom → left.
      const originX = TL.x - over
      const originY = TL.y - over
      const tx = (p: Pt) => `${(p.x - originX).toFixed(2)},${(p.y - originY).toFixed(2)}`
      const emit = (cv: Curve) => cv.segs.map((s) => `C ${tx(s.c1)} ${tx(s.c2)} ${tx(s.p)}`).join(' ')

      const d = [
        `M ${tx(top.start)}`,
        emit(top),
        emit(right),
        emit(bottom),
        emit(left),
        'Z',
      ].join(' ')

      geometry[id] = {
        path: d,
        width: cellW + 2 * over,
        height: cellH + 2 * over,
        offsetX: over,
        offsetY: over,
      }

      edges[id] = {
        top: r === 0 ? 'flat' : hSign[r - 1][c] > 0 ? 'blank' : 'tab',
        bottom: r === rows - 1 ? 'flat' : hSign[r][c] > 0 ? 'tab' : 'blank',
        right: c === cols - 1 ? 'flat' : vSign[r][c] > 0 ? 'tab' : 'blank',
        left: c === 0 ? 'flat' : vSign[r][c - 1] > 0 ? 'blank' : 'tab',
      }
    }
  }

  return { cols, rows, cellW, cellH, over, geometry, edges }
}
