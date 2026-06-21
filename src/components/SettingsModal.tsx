import { Modal } from './Modal'
import { Icon } from '@/components/Icon'
import { useUiStore } from '@/store/uiStore'
import { usePrefsStore, TEXT_SIZE_LABEL, type TextSize } from '@/store/prefsStore'
import './SettingsModal.css'

export function SettingsModal() {
  const open = useUiStore((s) => s.showSettings)

  const textSize = usePrefsStore((s) => s.textSize)
  const highContrast = usePrefsStore((s) => s.highContrast)
  const reduceMotion = usePrefsStore((s) => s.reduceMotion)
  const hideTimer = usePrefsStore((s) => s.hideTimer)
  const soundEnabled = usePrefsStore((s) => s.soundEnabled)

  const close = () => useUiStore.getState().closeSettings()

  return (
    <Modal open={open} onClose={close} title="Settings" maxWidth={520}>
      <section className="settings-section">
        <div className="settings-head">
          <span className="settings-badge" aria-hidden="true">
            <Icon name="eye" size={20} />
          </span>
          <div>
            <h3 className="settings-title">Comfort &amp; accessibility</h3>
            <p className="settings-subtitle">Make puzzles easy on the eyes and hands.</p>
          </div>
        </div>

        <div className="settings-row">
          <span className="settings-row-label">Text size</span>
          <div className="settings-seg" role="group" aria-label="Text size">
            {(['normal', 'large', 'xlarge'] as TextSize[]).map((t) => (
              <button
                key={t}
                type="button"
                className={'settings-seg-btn' + (textSize === t ? ' is-active' : '')}
                aria-pressed={textSize === t}
                onClick={() => usePrefsStore.getState().setTextSize(t)}
              >
                {TEXT_SIZE_LABEL[t]}
              </button>
            ))}
          </div>
        </div>

        <ToggleRow
          label="High contrast"
          desc="Darker text and stronger outlines."
          on={highContrast}
          onToggle={() => usePrefsStore.getState().toggleHighContrast()}
        />
        <ToggleRow
          label="Reduce motion"
          desc="Calm the animations and transitions."
          on={reduceMotion}
          onToggle={() => usePrefsStore.getState().toggleReduceMotion()}
        />
        <ToggleRow
          label="Relaxed mode"
          desc="Hide the timer - play with no pressure."
          on={hideTimer}
          onToggle={() => usePrefsStore.getState().toggleHideTimer()}
        />
        <ToggleRow
          label="Sound effects"
          desc="Gentle clicks when pieces connect."
          on={soundEnabled}
          onToggle={() => usePrefsStore.getState().toggleSound()}
        />
      </section>
    </Modal>
  )
}

function ToggleRow(props: { label: string; desc: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="settings-row">
      <span className="settings-row-text">
        <span className="settings-row-label">{props.label}</span>
        <span className="settings-row-desc">{props.desc}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={props.on}
        aria-label={props.label}
        className={'settings-switch' + (props.on ? ' is-on' : '')}
        onClick={props.onToggle}
      >
        <span className="settings-switch-knob" aria-hidden="true" />
      </button>
    </div>
  )
}
