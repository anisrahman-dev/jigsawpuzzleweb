import { useEffect, useLayoutEffect, useRef } from 'react'
import { usePuzzleStore, ZOOM_MIN, ZOOM_MAX } from '@/store/puzzleStore'

const WHEEL_STEP = 0.1

/**
 * Wire mouse-wheel zoom (anchored to the cursor) and drag-to-pan onto the play
 * stage (the scroll container that holds the zoomable surface).
 * - Wheel up/down zooms in/out, keeping the point under the cursor fixed.
 * - Press-and-drag on empty board area pans the view (mouse only; touch keeps
 *   the browser's native panning so it never fights piece dragging).
 */
export function usePanZoom(stageRef: React.RefObject<HTMLElement | null>): void {
  const zoom = usePuzzleStore((s) => s.zoom)
  // Cursor anchor carried across the zoom-driven re-layout.
  const pending = useRef<{
    contentX: number
    contentY: number
    offsetX: number
    offsetY: number
    ratio: number
  } | null>(null)

  // After a wheel-zoom resizes the surface, restore scroll so the cursor stays
  // over the same content point (runs post-layout, pre-paint = no flicker).
  useLayoutEffect(() => {
    const el = stageRef.current
    const p = pending.current
    if (!el || !p) return
    pending.current = null
    el.scrollLeft = p.contentX * p.ratio - p.offsetX
    el.scrollTop = p.contentY * p.ratio - p.offsetY
  }, [zoom, stageRef])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return

    const onWheel = (e: WheelEvent): void => {
      e.preventDefault()
      const store = usePuzzleStore.getState()
      const old = store.zoom
      const dir = e.deltaY < 0 ? 1 : -1
      const next = Math.round(Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, old + dir * WHEEL_STEP)) * 100) / 100
      if (next === old) return
      const rect = el.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      const offsetY = e.clientY - rect.top
      pending.current = {
        contentX: el.scrollLeft + offsetX,
        contentY: el.scrollTop + offsetY,
        offsetX,
        offsetY,
        ratio: next / old,
      }
      store.setZoom(next)
    }

    // Drag-to-pan (mouse only). Touch relies on native pan-x/pan-y scrolling.
    let pan: { x: number; y: number; sl: number; st: number; id: number } | null = null
    const onPointerDown = (e: PointerEvent): void => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      const t = e.target as Element | null
      if (t?.closest('.piece')) return // a piece drag owns this gesture
      pan = { x: e.clientX, y: e.clientY, sl: el.scrollLeft, st: el.scrollTop, id: e.pointerId }
      try {
        el.setPointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
      el.classList.add('is-panning')
    }
    const onPointerMove = (e: PointerEvent): void => {
      if (!pan) return
      el.scrollLeft = pan.sl - (e.clientX - pan.x)
      el.scrollTop = pan.st - (e.clientY - pan.y)
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

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', endPan)
    el.addEventListener('pointercancel', endPan)
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', endPan)
      el.removeEventListener('pointercancel', endPan)
    }
  }, [stageRef])
}
