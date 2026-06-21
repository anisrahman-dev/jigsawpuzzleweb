import { memo, useEffect, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { usePuzzleStore } from '@/store/puzzleStore'
import { playPickup } from '@/lib/sound'

interface PieceProps {
  id: number
  img: HTMLImageElement
  /** Source-image pixels per board pixel. */
  scaleX: number
  scaleY: number
  onGrab: (e: React.PointerEvent, groupId: number) => void
  /** Push a message to the board's polite live region (keyboard play). */
  announce: (msg: string) => void
}

/**
 * One puzzle piece: an absolutely-positioned canvas that paints the clipped
 * region of the source image behind its jigsaw outline. Subscribes only to its
 * own group's transform, so dragging one group never re-renders the others.
 * Pointer-draggable and fully keyboard-operable (Enter to lift, arrows to move,
 * Enter/Escape to drop). Memoized so a moving group doesn't reconcile the rest.
 */
function PieceImpl({ id, img, scaleX, scaleY, onGrab, announce }: PieceProps) {
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
  // True only while THIS group is the one being dragged/lifted.
  const isActive = usePuzzleStore((s) => s.draggingGroupId === s.pieces[id].groupId)
  // Non-zero only on the tick our group successfully snapped (drives the pulse).
  const snapAt = usePuzzleStore((s) => {
    const gid = s.pieces[id].groupId
    return s.lastSnap && s.lastSnap.groupId === gid ? s.lastSnap.at : 0
  })

  // Keyboard "lifted" (picked-up) state for this piece's group.
  const [lifted, setLifted] = useState(false)
  const [pulse, setPulse] = useState(false)

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

  // Brief pulse whenever this group connects (home-lock or merge).
  useEffect(() => {
    if (!snapAt) return
    setPulse(true)
    const t = setTimeout(() => setPulse(false), 420)
    return () => clearTimeout(t)
  }, [snapAt])

  // A drop ended this group's keyboard move - reflect it locally.
  useEffect(() => {
    if (!isActive && lifted) setLifted(false)
  }, [isActive, lifted])

  const onKeyDown = (e: React.KeyboardEvent): void => {
    if (locked) return
    const store = usePuzzleStore.getState()

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!lifted) {
        store.bringToFront(groupId)
        store.setDragging(groupId)
        setLifted(true)
        playPickup()
        announce('Lifted piece. Use the arrow keys to move it, then Enter to drop.')
      } else {
        store.setDragging(null)
        setLifted(false)
        store.dropGroup(groupId)
        const st = usePuzzleStore.getState()
        if (st.status === 'solved') announce('Puzzle complete. Well done!')
        else announce(st.groups[st.pieces[id].groupId]?.locked ? 'Piece locked into place.' : 'Piece dropped.')
      }
      return
    }

    if (e.key === 'Escape' && lifted) {
      e.preventDefault()
      store.setDragging(null)
      setLifted(false)
      store.dropGroup(groupId)
      announce('Piece dropped.')
      return
    }

    if (!lifted) return
    const step = { ArrowLeft: [-cellW, 0], ArrowRight: [cellW, 0], ArrowUp: [0, -cellH], ArrowDown: [0, cellH] }[
      e.key
    ]
    if (step) {
      e.preventDefault()
      store.moveGroup(groupId, dx + step[0], dy + step[1])
    }
  }

  const left = boardX + col * cellW + dx - over
  const top = boardY + row * cellH + dy - over

  const className =
    'piece' + (isActive || lifted ? ' piece--active' : '') + (pulse ? ' piece--snapped' : '')

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="button"
      tabIndex={locked ? -1 : 0}
      aria-label={`Puzzle piece row ${row + 1}, column ${col + 1}${locked ? ', placed' : ''}`}
      aria-pressed={lifted}
      onPointerDown={(e) => {
        // Left button / touch grabs the piece; right button is reserved for
        // panning the board (handled at the stage level).
        if (e.button === 0 && !locked) onGrab(e, groupId)
      }}
      onKeyDown={onKeyDown}
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
          : isActive
            ? 'drop-shadow(0 16px 30px rgba(40,26,12,0.5))'
            : 'drop-shadow(0 3px 6px rgba(0,0,0,0.45))',
        touchAction: 'none',
        // Promote to its own layer only while moving, to avoid exhausting GPU
        // layer memory with 100-300 permanently-promoted pieces.
        willChange: isActive ? 'transform' : 'auto',
      }}
    />
  )
}

export const Piece = memo(PieceImpl)
