import { useUiStore } from '@/store/uiStore'
import { usePrefsStore, TEXT_SIZE_LABEL } from '@/store/prefsStore'
import { useScoreStore } from '@/store/scoreStore'
import { useProfileStore, AVATAR_COLORS, initialsFor } from '@/store/profileStore'
import { BrandMark } from './BrandMark'
import { Icon } from '@/components/Icon'
import './Header.css'

/**
 * Header - sticky top bar on translucent paper. Brand at left (→ home). At
 * right, a points stat then the actions, separated by hairline dividers:
 * Categories, a compact text-size toggle, and a profile button at the far end.
 * Labels collapse to icons on narrow viewports.
 */
export function Header() {
  const points = useScoreStore((s) => s.points)
  const textSize = usePrefsStore((s) => s.textSize)
  const name = useProfileStore((s) => s.name)
  const avatarId = useProfileStore((s) => s.avatarId)

  const goHome = (): void => useUiStore.getState().goHome()
  const showCategories = (): void => useUiStore.getState().showCategories()
  const openProfile = (): void => useUiStore.getState().openProfile()
  const cycleTextSize = (): void => usePrefsStore.getState().cycleTextSize()

  const initials = initialsFor(name)
  const avatarColor = AVATAR_COLORS[avatarId] ?? AVATAR_COLORS[0]

  return (
    <header className="header-bar">
      <div className="header-inner wrap">
        <button
          type="button"
          className="header-brand"
          onClick={goHome}
          aria-label="Jigsaw Studio - home"
        >
          <BrandMark size={30} />
        </button>

        <nav className="header-actions" aria-label="Primary">
          <span className="header-points" title={`${points.toLocaleString()} points`}>
            <Icon name="trophy" size={16} />
            <span className="header-points-num">{points.toLocaleString()}</span>
          </span>

          <span className="header-divider" aria-hidden="true" />

          <button
            type="button"
            className="btn btn--ghost header-action"
            onClick={showCategories}
            aria-label="Categories"
          >
            <Icon name="grid" size={18} />
            <span className="header-action-label">Categories</span>
          </button>

          <button
            type="button"
            className="btn btn--ghost header-action header-icon-only header-textsize"
            onClick={cycleTextSize}
            aria-label={`Text size: ${TEXT_SIZE_LABEL[textSize]}. Click to change.`}
            title="Text size"
          >
            <span className="header-textsize-glyph" aria-hidden="true">A</span>
          </button>

          <span className="header-divider" aria-hidden="true" />

          <button
            type="button"
            className={'header-profile' + (initials ? ' header-profile--avatar' : '')}
            onClick={openProfile}
            aria-label={name.trim() ? `Profile: ${name.trim()}` : 'Profile'}
            title={name.trim() || 'Profile'}
            style={initials ? { background: avatarColor } : undefined}
          >
            {initials ? (
              <span className="header-profile-initials">{initials}</span>
            ) : (
              <Icon name="user" size={20} />
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}
