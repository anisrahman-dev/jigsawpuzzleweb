import { create } from 'zustand'
import type { Difficulty, GameStatus, Group, Piece, PuzzleImage } from '@/types'
import { buildPuzzleShapes, type PuzzleShapes } from '@/engine/pieceGeometry'
import { fitBoard, fitGrid, presetFor } from '@/engine/grid'

export interface SetupArgs {
  image: PuzzleImage
  difficulty: Difficulty
  /** Available play-surface size in px. */
  surfaceW: number
  surfaceH: number
}

interface PuzzleState {
  status: GameStatus
  image: PuzzleImage | null
  difficulty: Difficulty

  cols: number
  rows: number
  cellW: number
  cellH: number
  /** Board top-left within the play surface. */
  boardX: number
  boardY: number
  boardW: number
  boardH: number
  surfaceW: number
  surfaceH: number

  shapes: PuzzleShapes | null
  pieces: Piece[]
  groups: Record<number, Group>
  zCounter: number

  moves: number
  startedAt: number | null
  solvedAt: number | null
  showGhost: boolean

  setup: (args: SetupArgs) => void
  bringToFront: (groupId: number) => number
  moveGroup: (groupId: number, dx: number, dy: number) => void
  dropGroup: (groupId: number) => void
  scatter: () => void
  toggleGhost: () => void
  autoSolve: () => void
  reset: () => void
}

const initial = {
  status: 'idle' as GameStatus,
  image: null,
  difficulty: 'medium' as Difficulty,
  cols: 0,
  rows: 0,
  cellW: 0,
  cellH: 0,
  boardX: 0,
  boardY: 0,
  boardW: 0,
  boardH: 0,
  surfaceW: 0,
  surfaceH: 0,
  shapes: null,
  pieces: [] as Piece[],
  groups: {} as Record<number, Group>,
  zCounter: 1,
  moves: 0,
  startedAt: null as number | null,
  solvedAt: null as number | null,
  showGhost: false,
}

function adjacent(a: Piece, b: Piece): boolean {
  return Math.abs(a.col - b.col) + Math.abs(a.row - b.row) === 1
}

export const usePuzzleStore = create<PuzzleState>((set, get) => ({
  ...initial,

  setup: ({ image, difficulty, surfaceW, surfaceH }) => {
    const preset = presetFor(difficulty)
    const { cols, rows } = fitGrid(preset.pieces, image.width, image.height)

    // Reserve the centre of the surface for the assembled board.
    const maxBoardW = Math.min(surfaceW * 0.62, 980)
    const maxBoardH = Math.min(surfaceH * 0.7, 760)
    const { width: boardW, height: boardH } = fitBoard(image.width, image.height, maxBoardW, maxBoardH)

    const cellW = boardW / cols
    const cellH = boardH / rows
    const boardX = Math.round((surfaceW - boardW) / 2)
    const boardY = Math.round((surfaceH - boardH) / 2)

    const shapes = buildPuzzleShapes(cols, rows, cellW, cellH, (image.id.length || 1) * 2654435761)

    const pieces: Piece[] = []
    const groups: Record<number, Group> = {}
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const id = r * cols + c
        pieces.push({ id, col: c, row: r, groupId: id, edges: shapes.edges[id] })
        groups[id] = { id, pieceIds: [id], dx: 0, dy: 0, locked: false, z: 1 }
      }
    }

    set({
      ...initial,
      status: 'playing',
      image,
      difficulty,
      cols,
      rows,
      cellW,
      cellH,
      boardX,
      boardY,
      boardW,
      boardH,
      surfaceW,
      surfaceH,
      shapes,
      pieces,
      groups,
      zCounter: 1,
      startedAt: Date.now(),
    })
    get().scatter()
  },

  scatter: () => {
    const { pieces, groups, cols, cellW, cellH, boardX, boardY, boardW, boardH, surfaceW, surfaceH, shapes } = get()
    if (!shapes) return
    const next: Record<number, Group> = {}
    const over = shapes.over
    const pad = 8
    // Two scatter bands: left/right gutters and top/bottom strips around the board.
    const leftW = Math.max(0, boardX - pad)
    const rightX = boardX + boardW + pad
    const rightW = Math.max(0, surfaceW - rightX - pad)
    let z = 1
    for (const p of pieces) {
      const homeX = boardX + p.col * cellW
      const homeY = boardY + p.row * cellH
      // pick a scatter target somewhere in the gutters / strips
      const region = Math.random()
      let tx: number
      let ty: number
      const pw = cellW + 2 * over
      const ph = cellH + 2 * over
      if (region < 0.4 && leftW > pw) {
        tx = pad + Math.random() * Math.max(1, leftW - pw)
        ty = pad + Math.random() * Math.max(1, surfaceH - ph - 2 * pad)
      } else if (region < 0.8 && rightW > pw) {
        tx = rightX + Math.random() * Math.max(1, rightW - pw)
        ty = pad + Math.random() * Math.max(1, surfaceH - ph - 2 * pad)
      } else {
        // top or bottom strip
        tx = pad + Math.random() * Math.max(1, surfaceW - pw - 2 * pad)
        ty = Math.random() < 0.5
          ? pad + Math.random() * Math.max(1, boardY - ph - pad)
          : boardY + boardH + pad + Math.random() * Math.max(1, surfaceH - (boardY + boardH) - ph - pad)
      }
      next[p.id] = {
        ...groups[p.id],
        pieceIds: [p.id],
        dx: tx - homeX,
        dy: ty - homeY,
        locked: false,
        z: z++,
      }
      // ensure each piece is its own group again on (re)scatter
    }
    // rebuild groups to singletons
    const resetPieces = pieces.map((p) => ({ ...p, groupId: p.id }))
    set({ pieces: resetPieces, groups: next, zCounter: z, moves: 0, status: 'playing', solvedAt: null })
    void cols
  },

  bringToFront: (groupId) => {
    const z = get().zCounter + 1
    set((s) => ({
      zCounter: z,
      groups: { ...s.groups, [groupId]: { ...s.groups[groupId], z } },
    }))
    return z
  },

  moveGroup: (groupId, dx, dy) => {
    set((s) => {
      const g = s.groups[groupId]
      if (!g || g.locked) return {}
      return { groups: { ...s.groups, [groupId]: { ...g, dx, dy } } }
    })
  },

  dropGroup: (groupId) => {
    const state = get()
    // Forgiving snap radius - easier for less precise mouse/touch control.
    const tol = 0.36 * Math.min(state.cellW, state.cellH)
    const groups = { ...state.groups }
    let pieces = state.pieces
    const pieceById = (id: number) => pieces.find((p) => p.id === id)!

    let g = groups[groupId]
    if (!g || g.locked) return

    // Board (home) snap.
    if (Math.abs(g.dx) <= tol && Math.abs(g.dy) <= tol) {
      g = { ...g, dx: 0, dy: 0, locked: true }
      groups[groupId] = g
    }

    // Merge with any neighbouring group whose offset matches.
    let merged = true
    while (merged) {
      merged = false
      for (const other of Object.values(groups)) {
        if (other.id === g.id) continue
        if (Math.abs(g.dx - other.dx) > tol || Math.abs(g.dy - other.dy) > tol) continue
        // do the two groups contain an adjacent pair?
        const touch = g.pieceIds.some((pa) =>
          other.pieceIds.some((pb) => adjacent(pieceById(pa), pieceById(pb))),
        )
        if (!touch) continue

        // Snap g onto other and combine into the lower id.
        const keep = other.locked || g.locked ? { dx: 0, dy: 0, locked: true } : { dx: other.dx, dy: other.dy, locked: false }
        const targetId = Math.min(g.id, other.id)
        const goneId = Math.max(g.id, other.id)
        const combinedIds = [...groups[targetId].pieceIds, ...groups[goneId].pieceIds]
        const z = Math.max(g.z, other.z, state.zCounter) + 1
        const newGroup: Group = { id: targetId, pieceIds: combinedIds, ...keep, z }
        groups[targetId] = newGroup
        delete groups[goneId]
        pieces = pieces.map((p) => (combinedIds.includes(p.id) ? { ...p, groupId: targetId } : p))
        g = newGroup
        merged = true
        break
      }
    }

    // Win when a single group holds every piece and it is at home.
    const ids = Object.keys(groups)
    const solved = ids.length === 1 && groups[Number(ids[0])].dx === 0 && groups[Number(ids[0])].dy === 0
    set({
      groups,
      pieces,
      moves: state.moves + 1,
      zCounter: Math.max(state.zCounter, ...Object.values(groups).map((x) => x.z)),
      status: solved ? 'solved' : 'playing',
      solvedAt: solved ? Date.now() : state.solvedAt,
    })
  },

  toggleGhost: () => set((s) => ({ showGhost: !s.showGhost })),

  autoSolve: () => {
    set((s) => {
      if (!s.pieces.length) return {}
      const allIds = s.pieces.map((p) => p.id)
      const groups: Record<number, Group> = {
        0: { id: 0, pieceIds: allIds, dx: 0, dy: 0, locked: true, z: 1 },
      }
      const pieces = s.pieces.map((p) => ({ ...p, groupId: 0 }))
      return { groups, pieces, status: 'solved', solvedAt: Date.now() }
    })
  },

  reset: () => set({ ...initial }),
}))
