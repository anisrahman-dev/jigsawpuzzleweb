import { useCallback, useEffect, useState } from 'react'

// Minimal cross-browser shims (Safari still uses webkit-prefixed names).
interface FsElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void
}
interface FsDocument extends Document {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
  webkitFullscreenEnabled?: boolean
}

function fsElement(): Element | null {
  const d = document as FsDocument
  return document.fullscreenElement ?? d.webkitFullscreenElement ?? null
}

/**
 * Toggle the browser Fullscreen API on a given element. Returns whether that
 * element is currently fullscreen, a toggle, and whether the API is supported
 * at all (iOS Safari doesn't support element fullscreen, so callers can hide
 * the control there).
 */
export function useFullscreen(ref: React.RefObject<HTMLElement | null>): {
  isFullscreen: boolean
  toggle: () => void
  supported: boolean
} {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const onChange = (): void => setIsFullscreen(!!ref.current && fsElement() === ref.current)
    document.addEventListener('fullscreenchange', onChange)
    document.addEventListener('webkitfullscreenchange', onChange)
    return () => {
      document.removeEventListener('fullscreenchange', onChange)
      document.removeEventListener('webkitfullscreenchange', onChange)
    }
  }, [ref])

  const toggle = useCallback(() => {
    const el = ref.current as FsElement | null
    if (!el) return
    const d = document as FsDocument
    if (fsElement()) {
      ;(d.exitFullscreen ?? d.webkitExitFullscreen)?.call(d)
    } else {
      const req = el.requestFullscreen ?? el.webkitRequestFullscreen
      try {
        const r = req?.call(el)
        if (r && typeof (r as Promise<void>).catch === 'function') (r as Promise<void>).catch(() => {})
      } catch {
        /* user gesture / permission issue - ignore */
      }
    }
  }, [ref])

  const d = document as FsDocument
  const supported = !!(d.fullscreenEnabled ?? d.webkitFullscreenEnabled)

  return { isFullscreen, toggle, supported }
}
