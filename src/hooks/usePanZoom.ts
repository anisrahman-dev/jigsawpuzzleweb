import { useEffect } from 'react'
import { usePuzzleStore } from '@/store/puzzleStore'

const WHEEL_STEP = 0.1

/**
 * Pan & zoom gestures for the play stage (the surface is translated+scaled via
 * the store; the stage clips it). Pan is unbounded so the board moves freely.
 * - Desktop: wheel zooms at the cursor; right-drag pans anywhere; left-drag
 *   pans on empty board area only (pieces own their own drag).
 * - Touch: one finger on empty area pans; two fingers pinch-to-zoom, anchored
 *   between the fingers and panning as the midpoint moves.
 */
export function usePanZoom(stageRef: React.RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const el = stageRef.current
    if (!el) return

    const stageXY = (cx: number, cy: number): { x: number; y: number } => {
      const r = el.getBoundingClientRect()
      return { x: cx - r.left, y: cy - r.top }
    }

    // ── Desktop wheel zoom (anchored at the cursor) ──────────────────────────
    const onWheel = (e: WheelEvent): void => {
      e.preventDefault()
      const store = usePuzzleStore.getState()
      const dir = e.deltaY < 0 ? 1 : -1
      const p = stageXY(e.clientX, e.clientY)
      store.zoomAt(store.zoom + dir * WHEEL_STEP, p.x, p.y)
    }

    // ── Pointer state ────────────────────────────────────────────────────────
    // Active TOUCH pointers on empty board area (pieces are excluded so they
    // keep their own drag). Mouse uses the separate `mousePan` path.
    const touches = new Map<number, { cx: number; cy: number }>()
    let mousePan: { x: number; y: number; id: number } | null = null
    let touchPan: { x: number; y: number } | null = null
    let pinch: { dist0: number; zoom0: number; surfX: number; surfY: number } | null = null

    const beginPinch = (): void => {
      const pts = [...touches.values()]
      if (pts.length < 2) return
      const [a, b] = pts
      const dist0 = Math.hypot(a.cx - b.cx, a.cy - b.cy) || 1
      const mid = stageXY((a.cx + b.cx) / 2, (a.cy + b.cy) / 2)
      const s = usePuzzleStore.getState()
      pinch = {
        dist0,
        zoom0: s.zoom,
        surfX: (mid.x - s.panX) / s.zoom, // surface point under the midpoint
        surfY: (mid.y - s.panY) / s.zoom,
      }
      touchPan = null
      el.classList.remove('is-panning')
    }

    const onPointerDown = (e: PointerEvent): void => {
      if (e.pointerType === 'mouse') {
        const t = e.target as Element | null
        const overPiece = !!t?.closest('.piece')
        const rightDrag = e.button === 2
        const leftOnEmpty = e.button === 0 && !overPiece
        if (!rightDrag && !leftOnEmpty) return
        mousePan = { x: e.clientX, y: e.clientY, id: e.pointerId }
        try {
          el.setPointerCapture(e.pointerId)
        } catch {
          /* ignore */
        }
        el.classList.add('is-panning')
        return
      }
      // Touch: ignore fingers that land on a piece (those drag the piece).
      const t = e.target as Element | null
      if (t?.closest('.piece')) return
      touches.set(e.pointerId, { cx: e.clientX, cy: e.clientY })
      if (touches.size >= 2) {
        beginPinch()
      } else {
        touchPan = { x: e.clientX, y: e.clientY }
      }
    }

    const onPointerMove = (e: PointerEvent): void => {
      if (e.pointerType === 'mouse') {
        if (!mousePan) return
        usePuzzleStore.getState().panBy(e.clientX - mousePan.x, e.clientY - mousePan.y)
        mousePan.x = e.clientX
        mousePan.y = e.clientY
        return
      }
      if (!touches.has(e.pointerId)) return
      touches.set(e.pointerId, { cx: e.clientX, cy: e.clientY })

      if (pinch && touches.size >= 2) {
        const [a, b] = [...touches.values()]
        const dist = Math.hypot(a.cx - b.cx, a.cy - b.cy) || 1
        const mid = stageXY((a.cx + b.cx) / 2, (a.cy + b.cy) / 2)
        const z = pinch.zoom0 * (dist / pinch.dist0)
        usePuzzleStore.getState().setTransform(z, mid.x - pinch.surfX * z, mid.y - pinch.surfY * z)
      } else if (touchPan && touches.size === 1) {
        usePuzzleStore.getState().panBy(e.clientX - touchPan.x, e.clientY - touchPan.y)
        touchPan = { x: e.clientX, y: e.clientY }
      }
    }

    const onPointerEnd = (e: PointerEvent): void => {
      if (e.pointerType === 'mouse') {
        if (!mousePan) return
        el.classList.remove('is-panning')
        try {
          el.releasePointerCapture(mousePan.id)
        } catch {
          /* ignore */
        }
        mousePan = null
        return
      }
      touches.delete(e.pointerId)
      if (touches.size < 2) pinch = null
      if (touches.size === 1) {
        // Resume single-finger pan from the remaining finger (no jump).
        const [only] = [...touches.values()]
        touchPan = { x: only.cx, y: only.cy }
      } else if (touches.size === 0) {
        touchPan = null
      }
    }

    const onContextMenu = (e: MouseEvent): void => e.preventDefault()

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerEnd)
    el.addEventListener('pointercancel', onPointerEnd)
    el.addEventListener('contextmenu', onContextMenu)
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerEnd)
      el.removeEventListener('pointercancel', onPointerEnd)
      el.removeEventListener('contextmenu', onContextMenu)
    }
  }, [stageRef])
}
