import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Player profile, persisted to localStorage. No account / login - the profile
// lives on this device only. Name + a chosen avatar colour; initials are
// derived from the name (the UI uses no emoji, so the avatar is initials on a
// colour, falling back to a person glyph when no name is set yet).

/** Selectable avatar colours (index = avatarId). Tuned to the warm/blue theme. */
export const AVATAR_COLORS = [
  '#2f7de0', // blue (accent)
  '#6f9a86', // sage
  '#cf7a3a', // terracotta
  '#9b6dd6', // plum
  '#4a8fc0', // sky
  '#c75a7a', // rose
] as const

export interface ProfileState {
  /** Display name. Empty string = not set yet. */
  name: string
  /** Index into AVATAR_COLORS. */
  avatarId: number

  setName: (name: string) => void
  setAvatarId: (id: number) => void
  reset: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: '',
      avatarId: 0,

      setName: (name) => set({ name: name.slice(0, 30) }),
      setAvatarId: (avatarId) => set({ avatarId }),
      reset: () => set({ name: '', avatarId: 0 }),
    }),
    { name: 'jigsaw.profile' },
  ),
)

/** First letters of the (up to two) name words, uppercased. '' when no name. */
export function initialsFor(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}
