import { useCallback, useEffect, useRef, useState } from 'react'
import { usePuzzleStore } from '@/store/puzzleStore'
import { playPickup, playSnap, playWin } from '@/lib/sound'
import { Piece } from './Piece'

interface PuzzleBoardProps {
  img: HTMLImageElement
}

/** The play surface: felt board, optional ghost preview, and draggable pieces. */
export function PuzzleBoard({ img }: PuzzleBoardProps) {
  const surfaceW = usePuzzleStore((s) => s.surfaceW)
  const surfaceH = usePuzzleStore((s) => s.surfaceH)
  const boardX = usePuzzleStore((s) => s.boardX)
  const boardY = usePuzzleStore((s) => s.boardY)
  const boardW = usePuzzleStore((s) => s.boardW)
  const boardH = usePuzzleStore((s) => s.boardH)
  const pieces = usePuzzleStore((s) => s.pieces)
  const showGhost = usePuzzleStore((s) => s.showGhost)
  const image = usePuzzleStore((s) => s.image)
  const zoom = usePuzzleStore((s) => s.zoom)
  const panX = usePuzzleStore((s) => s.panX)
  const panY = usePuzzleStore((s) => s.panY)
  const lastSnap = usePuzzleStore((s) => s.lastSnap)
  const status = usePuzzleStore((s) => s.status)

  const scaleX = img.naturalWidth / boardW
  const scaleY = img.naturalHeight / boardH

  // Single polite live region for keyboard play + placement feedback.
  const [srMsg, setSrMsg] = useState('')
  const announce = useCallback((m: string) => setSrMsg(m), [])

  // Sound: a soft click whenever a placement connects, a flourish on solve.
  useEffect(() => {
    if (lastSnap) playSnap()
  }, [lastSnap])
  useEffect(() => {
    if (status === 'solved') playWin()
  }, [status])

  const drag = useRef<
    | {
        groupId: number
        startX: number
        startY: number
        baseDx: number
        baseDy: number
        pointerId: number
        el: Element
      }
    | null
  >(null)

  const onMove = useCallback((e: PointerEvent) => {
    const d = drag.current
    if (!d) return
    // Screen pixels → surface pixels: the surface is rendered at `zoom` scale.
    const z = usePuzzleStore.getState().zoom || 1
    usePuzzleStore
      .getState()
      .moveGroup(d.groupId, d.baseDx + (e.clientX - d.startX) / z, d.baseDy + (e.clientY - d.startY) / z)
  }, [])

  // One path ends every drag - pointerup, pointercancel, or lostpointercapture
  // (system interruption, off-viewport release). Always drops, clears state,
  // releases capture and detaches listeners, so a stale grab can never persist.
  const endDrag = useCallback(() => {
    const d = drag.current
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', endDrag)
    window.removeEventListener('pointercancel', endDrag)
    drag.current = null
    usePuzzleStore.getState().setDragging(null)
    if (!d) return
    try {
      d.el.releasePointerCapture(d.pointerId)
    } catch {
      /* capture may already be gone */
    }
    usePuzzleStore.getState().dropGroup(d.groupId)
  }, [onMove])

  const onGrab = useCallback(
    (e: React.PointerEvent, groupId: number) => {
      const store = usePuzzleStore.getState()
      const g = store.groups[groupId]
      if (!g || g.locked) return
      // Abandon any previous (stale) drag before starting a new one.
      if (drag.current) endDrag()
      store.bringToFront(groupId)
      store.setDragging(groupId)
      playPickup()
      const el = e.currentTarget as Element
      try {
        el.setPointerCapture(e.pointerId)
      } catch {
        /* capture unsupported - window listeners still track the move */
      }
      drag.current = {
        groupId,
        startX: e.clientX,
        startY: e.clientY,
        baseDx: g.dx,
        baseDy: g.dy,
        pointerId: e.pointerId,
        el,
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', endDrag)
      window.addEventListener('pointercancel', endDrag)
    },
    [onMove, endDrag],
  )

  // Safety net: tear down a drag if the board unmounts mid-gesture.
  useEffect(() => endDrag, [endDrag])

  return (
    // The surface is freely translated + scaled (pan & zoom) from its top-left;
    // the stage clips it. Pan is unbounded so the board moves in any direction.
    <div className="surface-layer">
      <div
        className="surface"
        style={{
          position: 'relative',
          width: surfaceW,
          height: surfaceH,
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: '0 0',
          touchAction: 'none',
        }}
      >
      {/* Board frame / felt - warm cork mat in a walnut rim */}
      <div
        className="board-felt"
        style={{
          position: 'absolute',
          left: boardX,
          top: boardY,
          width: boardW,
          height: boardH,
          borderRadius: 10,
          background:
            'radial-gradient(120% 120% at 30% 20%, var(--board-felt) 0%, var(--board-felt-2) 100%)',
          boxShadow:
            '0 0 0 6px var(--board-rim), 0 0 0 7px rgba(0,0,0,0.25), inset 0 0 70px rgba(58,40,20,0.45), var(--shadow-lg)',
        }}
      >
        {showGhost && image && (
          <img
            src={image.thumbUrl}
            alt=""
            aria-hidden
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.22,
              borderRadius: 6,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

        {/* Pieces */}
        {pieces.map((p) => (
          <Piece
            key={p.id}
            id={p.id}
            img={img}
            scaleX={scaleX}
            scaleY={scaleY}
            onGrab={onGrab}
            announce={announce}
          />
        ))}
      </div>

      {/* Polite, on-demand status for assistive tech (keyboard play + snaps). */}
      <div className="sr-only" role="status" aria-live="polite">
        {srMsg}
      </div>
    </div>
  )
}
