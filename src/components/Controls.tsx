import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { usePuzzleStore } from '@/store/puzzleStore'
import { usePrefsStore } from '@/store/prefsStore'
import { useUiStore } from '@/store/uiStore'
import { playToggle } from '@/lib/sound'
import './Controls.css'

interface ControlsProps {
  /** Whether the Fullscreen API is available (hide the control if not). */
  canFullscreen?: boolean
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
}

export function Controls({ canFullscreen, isFullscreen, onToggleFullscreen }: ControlsProps = {}) {
  const showGhost = usePuzzleStore((s) => s.showGhost)
  const hideTimer = usePrefsStore((s) => s.hideTimer)
  const soundEnabled = usePrefsStore((s) => s.soundEnabled)

  // Two-step shuffle: a mis-tap shouldn't destroy a half-solved board.
  const [confirmingShuffle, setConfirmingShuffle] = useState(false)

  const goHome = (): void => useUiStore.getState().goHome()
  const togglePreview = (): void => usePuzzleStore.getState().toggleGhost()
  const toggleHideTimer = (): void => usePrefsStore.getState().toggleHideTimer()
  const toggleSound = (): void => {
    const willEnable = !usePrefsStore.getState().soundEnabled
    usePrefsStore.getState().toggleSound()
    if (willEnable) playToggle() // audible confirmation when turning sound on
  }

  const onShuffle = (): void => {
    if (!confirmingShuffle) {
      setConfirmingShuffle(true)
      window.setTimeout(() => setConfirmingShuffle(false), 3500)
      return
    }
    setConfirmingShuffle(false)
    usePuzzleStore.getState().scatter()
  }

  return (
    <div className="controls-bar">
      <div className="controls-inner">
        <div className="controls-left">
          <button type="button" className="btn btn--ghost btn--sm controls-back" onClick={goHome}>
            <Icon name="arrow-left" size={18} />
            <span className="controls-label">Gallery</span>
          </button>
        </div>

        <div className="controls-right">
          <button
            type="button"
            className={'btn btn--sm controls-tool' + (confirmingShuffle ? ' controls-tool--warn' : '')}
            onClick={onShuffle}
            aria-label={confirmingShuffle ? 'Confirm shuffle - this clears your progress' : 'Shuffle pieces'}
          >
            <Icon name="shuffle" size={18} />
            <span className="controls-label">{confirmingShuffle ? 'Confirm?' : 'Shuffle'}</span>
          </button>
          <button
            type="button"
            className="btn btn--sm controls-tool controls-tool--toggle"
            aria-pressed={showGhost}
            onClick={togglePreview}
          >
            <Icon name={showGhost ? 'eye-off' : 'eye'} size={18} />
            <span className="controls-label">Preview</span>
          </button>
          <button
            type="button"
            className="btn btn--sm controls-tool controls-tool--toggle"
            aria-pressed={hideTimer}
            onClick={toggleHideTimer}
            title={hideTimer ? 'Timer hidden (relaxed mode)' : 'Hide the timer'}
          >
            <Icon name="clock" size={18} />
            <span className="controls-label">{hideTimer ? 'Timer off' : 'Timer'}</span>
          </button>
          <button
            type="button"
            className="btn btn--sm controls-tool controls-tool--toggle"
            aria-pressed={soundEnabled}
            onClick={toggleSound}
            title={soundEnabled ? 'Mute sound' : 'Turn sound on'}
          >
            <Icon name={soundEnabled ? 'sound-on' : 'sound-off'} size={18} />
            <span className="controls-label">{soundEnabled ? 'Sound' : 'Muted'}</span>
          </button>
          {canFullscreen && (
            <button
              type="button"
              className="btn btn--sm controls-tool controls-tool--toggle"
              aria-pressed={isFullscreen}
              onClick={onToggleFullscreen}
              title={isFullscreen ? 'Exit full screen' : 'Full screen'}
            >
              <Icon name={isFullscreen ? 'compress' : 'expand'} size={18} />
              <span className="controls-label">{isFullscreen ? 'Exit' : 'Full screen'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
