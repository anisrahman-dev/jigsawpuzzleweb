// Labeled radiogroup of difficulty cards bound to the UI store's difficulty.
// Lives inside the PreviewModal on a warm paper card; each option is a
// chip-like card showing the difficulty label and an approximate piece count.
import { useUiStore } from '@/store/uiStore'
import { DIFFICULTIES } from '@/engine/grid'
import type { Difficulty } from '@/types'
import './DifficultyPicker.css'

export function DifficultyPicker() {
  const difficulty = useUiStore((s) => s.difficulty)

  const select = (key: Difficulty): void => {
    useUiStore.getState().setDifficulty(key)
  }

  const focusKey = (key: Difficulty, group: HTMLElement | null): void => {
    group?.querySelector<HTMLButtonElement>(`[data-key="${key}"]`)?.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number): void => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault()
      select(DIFFICULTIES[index].key)
      return
    }

    let next = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      next = (index + 1) % DIFFICULTIES.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      next = (index - 1 + DIFFICULTIES.length) % DIFFICULTIES.length
    } else if (e.key === 'Home') {
      next = 0
    } else if (e.key === 'End') {
      next = DIFFICULTIES.length - 1
    }

    if (next >= 0) {
      e.preventDefault()
      const target = DIFFICULTIES[next]
      select(target.key)
      focusKey(target.key, e.currentTarget.parentElement)
    }
  }

  return (
    <div className="diffpick">
      <div className="diffpick-label" id="diffpick-label">
        Difficulty
      </div>
      <div className="diffpick-grid" role="radiogroup" aria-labelledby="diffpick-label">
        {DIFFICULTIES.map((preset, index) => {
          const checked = preset.key === difficulty
          return (
            <button
              key={preset.key}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              data-key={preset.key}
              className="diffpick-option"
              onClick={() => select(preset.key)}
              onKeyDown={(e) => onKeyDown(e, index)}
            >
              <span className="diffpick-tick" aria-hidden="true">
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
                  <path
                    d="M3.5 8.5l3 3 6-7"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="diffpick-name">{preset.label}</span>
              <span className="diffpick-count">~{preset.pieces} pieces</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
