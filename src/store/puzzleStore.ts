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
  /** Group currently being dragged (pointer or keyboard), else null. Lets
   *  pieces opt into GPU promotion + the heavier drag shadow only while moving. */
  draggingGroupId: number | null
  /** Most recent successful snap (home-lock or merge); drives the snap pulse. */
  lastSnap: { groupId: number; at: number } | null
  /** View zoom factor for the play surface (1 = fit). */
  zoom: number
  /** Free pan offset of the surface, in screen px (translate before scale). */
  panX: number
  panY: number

  setup: (args: SetupArgs) => void
  bringToFront: (groupId: number) => number
  setDragging: (groupId: number | null) => void
  /** Zoom to `z`, keeping the stage point (cx, cy) fixed under the cursor. */
  zoomAt: (z: number, cx: number, cy: number) => void
  zoomIn: () => void
  zoomOut: () => void
  /** Move the view by a screen-pixel delta (free, unbounded - 360° pan). */
  panBy: (dx: number, dy: number) => void
  /** Set zoom and pan together (used by pinch-zoom). */
  setTransform: (zoom: number, panX: number, panY: number) => void
  /** Centre the surface within a stage of the given size (used on fullscreen). */
  centerView: (stageW: number, stageH: number) => void
  /** Reset zoom to 1 and recentre the board. */
  resetView: () => void
  moveGroup: (groupId: number, dx: number, dy: number) => void
  dropGroup: (groupId: number) => void
  scatter: () => void
  toggleGhost: () => void
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
  draggingGroupId: null as number | null,
  lastSnap: null as { groupId: number; at: number } | null,
  zoom: 1,
  panX: 0,
  panY: 0,
}

export const ZOOM_MIN = 0.5
export const ZOOM_MAX = 2
const ZOOM_STEP = 0.25
const clampZoom = (z: number): number =>
  Math.round(Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z)) * 100) / 100

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
    const { pieces, groups, cellW, cellH, boardX, boardY, boardW, boardH, surfaceW, surfaceH, shapes } = get()
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
    set({ pieces: resetPieces, groups: next, zCounter: z, moves: 0, status: 'playing', solvedAt: null, lastSnap: null })
  },

  bringToFront: (groupId) => {
    const z = get().zCounter + 1
    set((s) => ({
      zCounter: z,
      groups: { ...s.groups, [groupId]: { ...s.groups[groupId], z } },
    }))
    return z
  },

  setDragging: (groupId) => set({ draggingGroupId: groupId }),

  zoomAt: (z, cx, cy) =>
    set((s) => {
      const zoom = clampZoom(z)
      if (zoom === s.zoom) return {}
      // Keep the surface point under (cx, cy) fixed: screen = surf*zoom + pan.
      const surfX = (cx - s.panX) / s.zoom
      const surfY = (cy - s.panY) / s.zoom
      return { zoom, panX: cx - surfX * zoom, panY: cy - surfY * zoom }
    }),
  zoomIn: () => get().zoomAt(get().zoom + ZOOM_STEP, get().surfaceW / 2, get().surfaceH / 2),
  zoomOut: () => get().zoomAt(get().zoom - ZOOM_STEP, get().surfaceW / 2, get().surfaceH / 2),
  panBy: (dx, dy) => set((s) => ({ panX: s.panX + dx, panY: s.panY + dy })),
  setTransform: (zoom, panX, panY) => set({ zoom: clampZoom(zoom), panX, panY }),
  centerView: (stageW, stageH) =>
    set((s) => {
      if (!s.surfaceW || !s.surfaceH) return {}
      return {
        panX: Math.round((stageW - s.surfaceW * s.zoom) / 2),
        panY: Math.round((stageH - s.surfaceH * s.zoom) / 2),
      }
    }),
  resetView: () => set({ zoom: 1, panX: 0, panY: 0 }),

  moveGroup: (groupId, dx, dy) => {
    set((s) => {
      const g = s.groups[groupId]
      if (!g || g.locked) return {}
      return { groups: { ...s.groups, [groupId]: { ...g, dx, dy } } }
    })
  },

  dropGroup: (groupId) => {
    const state = get()
    // Size-aware snap radius: clamped to [12px, 30px] so easy boards aren't
    // over-magnetic and hard/expert cells stay reachable for imprecise touch.
    const tol = Math.max(12, Math.min(0.36 * Math.min(state.cellW, state.cellH), 30))
    const groups = { ...state.groups }
    let pieces = state.pieces
    const pieceById = (id: number) => pieces.find((p) => p.id === id)!
    let didSnap = false

    let g = groups[groupId]
    if (!g || g.locked) return

    // Board (home) snap.
    if (Math.abs(g.dx) <= tol && Math.abs(g.dy) <= tol) {
      g = { ...g, dx: 0, dy: 0, locked: true }
      groups[groupId] = g
      didSnap = true
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
        didSnap = true
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
      // Pulse the (possibly merged) group when a placement actually connected.
      lastSnap: didSnap ? { groupId: g.id, at: Date.now() } : state.lastSnap,
    })
  },

  toggleGhost: () => set((s) => ({ showGhost: !s.showGhost })),

  reset: () => set({ ...initial }),
}))
