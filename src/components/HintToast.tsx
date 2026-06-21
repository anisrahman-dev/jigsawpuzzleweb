import { useEffect, useState } from 'react'
import { Icon } from '@/components/Icon'
import './HintToast.css'

const KEY = 'jigsaw.hintSeen'

/**
 * One-time, self-dismissing hint shown on a player's first puzzle: explains the
 * core drag-and-snap mechanic, which the board otherwise presents with no words.
 * Remembers dismissal in localStorage so it never nags returning players.
 */
export function HintToast() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let seen = false
    try {
      seen = localStorage.getItem(KEY) === '1'
    } catch {
      /* storage unavailable - just show it this session */
    }
    if (seen) return
    setShow(true)
    const t = setTimeout(() => setShow(false), 9000)
    return () => clearTimeout(t)
  }, [])

  const dismiss = (): void => {
    setShow(false)
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* ignore */
    }
  }

  if (!show) return null
  return (
    <div className="hint-toast" role="status">
      <Icon name="sparkle" size={16} className="hint-toast-icon" />
      <span>Drag pieces onto the board — they snap together when they’re close.</span>
      <button type="button" className="hint-toast-x" aria-label="Dismiss hint" onClick={dismiss}>
        <Icon name="close" size={14} />
      </button>
    </div>
  )
}
