import { useEffect, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { usePuzzleStore } from '@/store/puzzleStore'

interface PieceProps {
  id: number
  img: HTMLImageElement
  /** Source-image pixels per board pixel. */
  scaleX: number
  scaleY: number
  onGrab: (e: React.PointerEvent, groupId: number) => void
}

/**
 * One puzzle piece: an absolutely-positioned canvas that paints the clipped
 * region of the source image behind its jigsaw outline. Subscribes only to its
 * own group's transform, so dragging one group never re-renders the others.
 */
export function Piece({ id, img, scaleX, scaleY, onGrab }: PieceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { dx, dy, z, locked, groupId, col, row } = usePuzzleStore(
    useShallow((s) => {
      const p = s.pieces[id]
      const g = s.groups[p.groupId]
      return { dx: g.dx, dy: g.dy, z: g.z, locked: g.locked, groupId: p.groupId, col: p.col, row: p.row }
    }),
  )

  const boardX = usePuzzleStore((s) => s.boardX)
  const boardY = usePuzzleStore((s) => s.boardY)
  const cellW = usePuzzleStore((s) => s.cellW)
  const cellH = usePuzzleStore((s) => s.cellH)
  const geom = usePuzzleStore((s) => s.shapes!.geometry[id])
  const over = usePuzzleStore((s) => s.shapes!.over)

  // Paint once (geometry/image are stable for a given puzzle).
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.ceil(geom.width * dpr)
    canvas.height = Math.ceil(geom.height * dpr)
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, geom.width, geom.height)

    const path = new Path2D(geom.path)
    ctx.save()
    ctx.clip(path)
    // Board-space top-left of this canvas:
    const srcX = (col * cellW - over) * scaleX
    const srcY = (row * cellH - over) * scaleY
    ctx.drawImage(
      img,
      srcX,
      srcY,
      geom.width * scaleX,
      geom.height * scaleY,
      0,
      0,
      geom.width,
      geom.height,
    )
    ctx.restore()

    // Edge definition: light catch on top-left, soft shadow on bottom-right.
    ctx.lineJoin = 'round'
    ctx.strokeStyle = 'rgba(0,0,0,0.30)'
    ctx.lineWidth = 1.4
    ctx.stroke(path)
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'
    ctx.lineWidth = 0.8
    ctx.stroke(path)
  }, [geom, img, scaleX, scaleY, col, row, cellW, cellH, over])

  const left = boardX + col * cellW + dx - over
  const top = boardY + row * cellH + dy - over

  return (
    <canvas
      ref={canvasRef}
      className="piece"
      onPointerDown={(e) => !locked && onGrab(e, groupId)}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: geom.width,
        height: geom.height,
        transform: `translate3d(${left}px, ${top}px, 0)`,
        zIndex: z,
        cursor: locked ? 'default' : 'grab',
        filter: locked
          ? 'none'
          : 'drop-shadow(0 3px 6px rgba(0,0,0,0.45))',
        touchAction: 'none',
        willChange: 'transform',
      }}
    />
  )
}
