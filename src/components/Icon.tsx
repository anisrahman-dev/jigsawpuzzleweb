// A small, consistent line-icon set (no emoji anywhere in the UI).
// 24×24 viewBox, stroke = currentColor, 1.8 stroke width, round caps/joins.
// Usage: <Icon name="shuffle" size={18} />  - color follows `currentColor`.

export type IconName =
  | 'play'
  | 'shuffle'
  | 'eye'
  | 'eye-off'
  | 'check'
  | 'arrow-left'
  | 'arrow-right'
  | 'chevron-left'
  | 'chevron-right'
  | 'search'
  | 'settings'
  | 'help'
  | 'plus'
  | 'grid'
  | 'clock'
  | 'trophy'
  | 'heart'
  | 'flame'
  | 'sparkle'
  | 'puzzle'
  | 'close'
  | 'image'
  | 'users'
  | 'user'
  | 'lock'
  | 'zoom-in'
  | 'zoom-out'
  | 'sound-on'
  | 'sound-off'
  | 'expand'
  | 'compress'

/** Icons that read better as a solid fill than an outline. */
const FILLED = new Set<IconName>(['play', 'flame', 'sparkle', 'heart', 'puzzle'])

const PATHS: Record<IconName, string> = {
  play: 'M8 5l12 7-12 7z',
  shuffle: 'M16 3h5v5 M21 3L4 20 M21 16v5h-5 M15 15l6 6 M4 4l5 5',
  eye: 'M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  'eye-off': 'M3 3l18 18 M10.6 6.2A10 10 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3 3.6 M6.3 7.3A16 16 0 0 0 2.5 12S6 18 12 18a9.7 9.7 0 0 0 3.4-.6 M9.5 10.6a3 3 0 0 0 4 4',
  check: 'M20 6L9 17l-5-5',
  'arrow-left': 'M19 12H5 M12 19l-7-7 7-7',
  'arrow-right': 'M5 12h14 M12 5l7 7-7 7',
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-right': 'M9 18l6-6-6-6',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M21 21l-4.35-4.35',
  settings: 'M4 21v-7 M4 10V3 M12 21v-9 M12 8V3 M20 21v-5 M20 12V3 M1.5 14h5 M9.5 8h5 M17.5 16h5',
  help: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9.2 9a3 3 0 1 1 4 2.8c-1 .6-1.7 1.2-1.7 2.4 M12 17.5h.01',
  plus: 'M12 5v14 M5 12h14',
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7.5V12l3 2',
  trophy: 'M8 21h8 M12 17v4 M7 4h10v5a5 5 0 0 1-10 0V4z M7 6H4v1.5a3 3 0 0 0 3 3 M17 6h3v1.5a3 3 0 0 1-3 3',
  heart: 'M12 20.5C5.5 16 3 12.4 3 9a4.2 4.2 0 0 1 8-1.6A4.2 4.2 0 0 1 21 9c0 3.4-2.5 7-9 11.5z',
  flame: 'M12 2.5c1 3 4 4.2 4 7.8a4 4 0 0 1-8 0c0-1.2.4-2 .9-2.6.4 1 .9 1.4 1.6 1.6-.2-2.4.5-5 1.5-6.8z',
  sparkle: 'M12 3l1.9 5.6L20 10l-6.1 1.4L12 17l-1.9-5.6L4 10l6.1-1.4z',
  puzzle:
    'M11 3c-1.5 0-2.5 1.1-2.5 2.5 0 .4.1.8.3 1.1.2.4-.1.9-.6.9H6c-.6 0-1 .4-1 1v2.4c0 .5.5.8.9.6.3-.2.7-.3 1.1-.3 1.4 0 2.5 1 2.5 2.5S8.4 16.2 7 16.2c-.4 0-.8-.1-1.1-.3-.4-.2-.9.1-.9.6V19c0 .6.4 1 1 1h2.4c.5 0 .8-.5.6-.9a2.6 2.6 0 0 1-.3-1.1c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5c0 .4-.1.8-.3 1.1-.2.4.1.9.6.9H18c.6 0 1-.4 1-1v-2.6c0-.5-.5-.8-.9-.6-.3.2-.7.3-1.1.3-1.5 0-2.5-1-2.5-2.5s1-2.5 2.5-2.5c.4 0 .8.1 1.1.3.4.2.9-.1.9-.6V7c0-.6-.4-1-1-1h-2.6c-.5 0-.8-.5-.6-.9.2-.3.3-.7.3-1.1C14.5 4.1 13.5 3 12 3z',
  close: 'M6 6l12 12 M18 6L6 18',
  image: 'M3 5h18v14H3z M8.5 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M21 16l-5-5L5 21',
  users:
    'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 20v-2a4 4 0 0 0-3-3.9 M16 3.1a4 4 0 0 1 0 7.8',
  user: 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M5.5 20a6.5 6.5 0 0 1 13 0',
  'zoom-in': 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M21 21l-5.4-5.4 M10 7v6 M7 10h6',
  'zoom-out': 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M21 21l-5.4-5.4 M7 10h6',
  'sound-on':
    'M11 5L6 9H3v6h3l5 4V5z M15.5 8.5a5 5 0 0 1 0 7 M18.5 5.5a9 9 0 0 1 0 13',
  'sound-off': 'M11 5L6 9H3v6h3l5 4V5z M22 9l-6 6 M16 9l6 6',
  expand: 'M8 3H5a2 2 0 0 0-2 2v3 M16 3h3a2 2 0 0 1 2 2v3 M21 16v3a2 2 0 0 1-2 2h-3 M8 21H5a2 2 0 0 1-2-2v-3',
  compress: 'M8 3v3a2 2 0 0 1-2 2H3 M16 3v3a2 2 0 0 0 2 2h3 M21 16h-3a2 2 0 0 0-2 2v3 M3 16h3a2 2 0 0 1 2 2v3',
  lock: 'M5 11h14v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z M8 11V7a4 4 0 0 1 8 0v4',
}

export interface IconProps {
  name: IconName
  size?: number
  /** Extra class for sizing/colour overrides. */
  className?: string
  /** Decorative by default; pass a label to expose it to assistive tech. */
  label?: string
}

export function Icon({ name, size = 20, className, label }: IconProps) {
  const filled = FILLED.has(name)
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      focusable="false"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
