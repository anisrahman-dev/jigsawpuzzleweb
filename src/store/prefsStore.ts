import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Accessibility / comfort preferences, persisted to localStorage.
// Tuned for an older audience: larger text, higher contrast, calmer motion,
// and an optional no-pressure (timer-free) mode.

export type TextSize = 'normal' | 'large' | 'xlarge'

const TEXT_ORDER: TextSize[] = ['normal', 'large', 'xlarge']

interface PrefsState {
  textSize: TextSize
  highContrast: boolean
  reduceMotion: boolean
  /** Hide the elapsed-time clock for a relaxed, pressure-free game. */
  hideTimer: boolean

  setTextSize: (t: TextSize) => void
  cycleTextSize: () => void
  toggleHighContrast: () => void
  toggleReduceMotion: () => void
  toggleHideTimer: () => void
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set, get) => ({
      textSize: 'normal',
      highContrast: false,
      reduceMotion: false,
      hideTimer: false,

      setTextSize: (textSize) => set({ textSize }),
      cycleTextSize: () => {
        const i = TEXT_ORDER.indexOf(get().textSize)
        set({ textSize: TEXT_ORDER[(i + 1) % TEXT_ORDER.length] })
      },
      toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
      toggleReduceMotion: () => set((s) => ({ reduceMotion: !s.reduceMotion })),
      toggleHideTimer: () => set((s) => ({ hideTimer: !s.hideTimer })),
    }),
    { name: 'jigsaw.prefs' },
  ),
)

export const TEXT_SIZE_LABEL: Record<TextSize, string> = {
  normal: 'Normal',
  large: 'Large',
  xlarge: 'Extra large',
}
