import { useCallback, useRef } from 'react'
import { usePuzzleStore } from '@/store/puzzleStore'
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

  const scaleX = img.naturalWidth / boardW
  const scaleY = img.naturalHeight / boardH

  const drag = useRef<{ groupId: number; startX: number; startY: number; baseDx: number; baseDy: number } | null>(null)

  const onMove = useCallback((e: PointerEvent) => {
    const d = drag.current
    if (!d) return
    const { moveGroup } = usePuzzleStore.getState()
    moveGroup(d.groupId, d.baseDx + (e.clientX - d.startX), d.baseDy + (e.clientY - d.startY))
  }, [])

  const onUp = useCallback(() => {
    const d = drag.current
    if (d) usePuzzleStore.getState().dropGroup(d.groupId)
    drag.current = null
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
  }, [onMove])

  const onGrab = useCallback(
    (e: React.PointerEvent, groupId: number) => {
      const store = usePuzzleStore.getState()
      const g = store.groups[groupId]
      if (!g || g.locked) return
      store.bringToFront(groupId)
      drag.current = { groupId, startX: e.clientX, startY: e.clientY, baseDx: g.dx, baseDy: g.dy }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [onMove, onUp],
  )

  return (
    <div
      className="surface"
      style={{ position: 'relative', width: surfaceW, height: surfaceH, margin: '0 auto' }}
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
              objectFit: 'fill',
              opacity: 0.22,
              borderRadius: 6,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Pieces */}
      {pieces.map((p) => (
        <Piece key={p.id} id={p.id} img={img} scaleX={scaleX} scaleY={scaleY} onGrab={onGrab} />
      ))}
    </div>
  )
}
