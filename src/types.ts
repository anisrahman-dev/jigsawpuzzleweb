// ───────────────────────────────────────────────────────────────────────────
// Shared type contracts for JigsawJam.
// Every module builds against these. Keep them stable.
// ───────────────────────────────────────────────────────────────────────────

/** An edge of a piece is flat (border), a protruding tab, or a recessed blank. */
export type EdgeType = 'flat' | 'tab' | 'blank'

/** The four edges of a piece, in reading order. */
export interface PieceEdges {
  top: EdgeType
  right: EdgeType
  bottom: EdgeType
  left: EdgeType
}

/** A single puzzle piece. */
export interface Piece {
  id: number
  /** Grid column (0-indexed). */
  col: number
  /** Grid row (0-indexed). */
  row: number
  /** Which group this piece currently belongs to (joined pieces share a group). */
  groupId: number
  edges: PieceEdges
}

/**
 * A group of one or more connected pieces. A group is positioned by a single
 * (dx, dy) offset applied to every member's "home" cell position. Two groups
 * are correctly joined when their offsets match and they contain adjacent
 * pieces - this keeps the geometry model simple and exact.
 */
export interface Group {
  id: number
  pieceIds: number[]
  /** Offset from the solved/home layout, in board pixels. */
  dx: number
  dy: number
  /** Locked groups are snapped into the solved board and can no longer move. */
  locked: boolean
  /** Stacking order; higher renders on top. */
  z: number
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

export interface DifficultyPreset {
  key: Difficulty
  label: string
  /** Approximate target piece count; actual grid is fit to image aspect ratio. */
  pieces: number
}

export type GameStatus = 'idle' | 'loading' | 'playing' | 'solved'

/** A selectable source image (from Pixabay or a built-in sample). */
export interface PuzzleImage {
  id: string
  /** Full-resolution-ish URL used to render the puzzle. */
  url: string
  /** Small URL used for thumbnails/previews. */
  thumbUrl: string
  width: number
  height: number
  /** Human attribution string, e.g. "Photo by Jane on Pixabay". */
  credit?: string
  tags?: string
}

/** Geometry produced by the piece-shape engine for one piece. */
export interface PieceGeometry {
  /** SVG path data ("M ... Z") for the piece outline, in piece-local coords. */
  path: string
  /** Width of the piece's bounding box including tab overhang. */
  width: number
  /** Height of the piece's bounding box including tab overhang. */
  height: number
  /** Offset of the piece's top-left cell corner inside the bounding box. */
  offsetX: number
  offsetY: number
}
