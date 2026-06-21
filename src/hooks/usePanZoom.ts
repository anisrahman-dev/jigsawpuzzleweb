import { useEffect } from 'react'
import { usePuzzleStore } from '@/store/puzzleStore'

const WHEEL_STEP = 0.1

/**
 * Wire mouse-wheel zoom (anchored to the cursor) and free drag-to-pan onto the
 * play stage. Pan is applied as an unbounded CSS translate (see puzzleStore),
 * so the board moves in any direction - not limited to a scroll range.
 * - Wheel up/down zooms in/out, keeping the point under the cursor fixed.
 * - Right-button drag pans anywhere (even over a piece). Left-button / single
 *   finger pans on empty board area only, so it never steals piece dragging.
 */
export function usePanZoom(stageRef: React.RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const el = stageRef.current
    if (!el) return

    const onWheel = (e: WheelEvent): void => {
      e.preventDefault()
      const store = usePuzzleStore.getState()
      const dir = e.deltaY < 0 ? 1 : -1
      const rect = el.getBoundingClientRect()
      store.zoomAt(store.zoom + dir * WHEEL_STEP, e.clientX - rect.left, e.clientY - rect.top)
    }

    // Free drag-to-pan. Tracks the last pointer position and feeds deltas to
    // panBy, so the board follows the pointer in any direction.
    let pan: { x: number; y: number; id: number } | null = null
    const onPointerDown = (e: PointerEvent): void => {
      const t = e.target as Element | null
      const overPiece = !!t?.closest('.piece')
      const rightDrag = e.button === 2
      // Left mouse / single-finger pan only on empty area (pieces own their drag).
      const emptyDrag = !overPiece && (e.button === 0 || e.pointerType === 'touch')
      if (!rightDrag && !emptyDrag) return
      pan = { x: e.clientX, y: e.clientY, id: e.pointerId }
      try {
        el.setPointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
      el.classList.add('is-panning')
    }
    const onPointerMove = (e: PointerEvent): void => {
      if (!pan) return
      usePuzzleStore.getState().panBy(e.clientX - pan.x, e.clientY - pan.y)
      pan.x = e.clientX
      pan.y = e.clientY
    }
    const endPan = (): void => {
      if (!pan) return
      el.classList.remove('is-panning')
      try {
        el.releasePointerCapture(pan.id)
      } catch {
        /* ignore */
      }
      pan = null
    }
    // Right-drag pans, so never pop the browser context menu over the stage.
    const onContextMenu = (e: MouseEvent): void => e.preventDefault()

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', endPan)
    el.addEventListener('pointercancel', endPan)
    el.addEventListener('contextmenu', onContextMenu)
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', endPan)
      el.removeEventListener('pointercancel', endPan)
      el.removeEventListener('contextmenu', onContextMenu)
    }
  }, [stageRef])
}
