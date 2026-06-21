// Tiny synthesized sound effects via the Web Audio API - no audio files, no
// network, CSP-safe. Gentle, short tones tuned for a calm puzzle. All playback
// is gated on the user's soundEnabled preference and fails silently if Web
// Audio is unavailable or blocked. The AudioContext is created lazily inside a
// user gesture (pickup/drop), which browsers require.
import { usePrefsStore } from '@/store/prefsStore'

let ctx: AudioContext | null = null

function audioContext(): AudioContext | null {
  try {
    const Ctor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    if (!ctx) ctx = new Ctor()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

/** A single soft tone with a quick attack and exponential decay. */
function tone(freq: number, duration: number, gain = 0.05, when = 0): void {
  const c = audioContext()
  if (!c) return
  const t = c.currentTime + when
  const osc = c.createOscillator()
  const env = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, t)
  env.gain.setValueAtTime(0.0001, t)
  env.gain.exponentialRampToValueAtTime(gain, t + 0.012)
  env.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(env)
  env.connect(c.destination)
  osc.start(t)
  osc.stop(t + duration + 0.02)
}

function enabled(): boolean {
  try {
    return usePrefsStore.getState().soundEnabled
  } catch {
    return false
  }
}

/** Soft low blip when a piece is picked up. */
export function playPickup(): void {
  if (!enabled()) return
  tone(320, 0.07, 0.035)
}

/** Bright two-note click when pieces connect / lock into place. */
export function playSnap(): void {
  if (!enabled()) return
  tone(540, 0.06, 0.05)
  tone(720, 0.08, 0.05, 0.05)
}

/** A small rising arpeggio on completion. */
export function playWin(): void {
  if (!enabled()) return
  tone(523, 0.16, 0.06, 0)
  tone(659, 0.16, 0.06, 0.13)
  tone(784, 0.28, 0.07, 0.26)
}

/** Play a short confirmation when the user toggles sound on (so it's audible). */
export function playToggle(): void {
  // Bypass the enabled() gate: this is called right after enabling.
  tone(660, 0.08, 0.05)
}
