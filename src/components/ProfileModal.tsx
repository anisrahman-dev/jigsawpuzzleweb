import { Modal } from './Modal'
import { Icon } from '@/components/Icon'
import { useUiStore } from '@/store/uiStore'
import { useScoreStore } from '@/store/scoreStore'
import { useProfileStore, AVATAR_COLORS, initialsFor } from '@/store/profileStore'
import './ProfileModal.css'

/**
 * ProfileModal - a lightweight, no-login player profile. Name and avatar colour
 * are saved to this device (localStorage) the moment they change; no account is
 * required. Also surfaces the player's points and solves.
 */
export function ProfileModal() {
  const open = useUiStore((s) => s.showProfile)
  const name = useProfileStore((s) => s.name)
  const avatarId = useProfileStore((s) => s.avatarId)
  const points = useScoreStore((s) => s.points)
  const solves = useScoreStore((s) => s.solves)

  const close = () => useUiStore.getState().closeProfile()
  const initials = initialsFor(name)
  const color = AVATAR_COLORS[avatarId] ?? AVATAR_COLORS[0]

  return (
    <Modal open={open} onClose={close} title="Your profile" maxWidth={480}>
      <div className="profile-hero">
        <span className="profile-avatar profile-avatar--lg" style={{ background: color }}>
          {initials ? (
            <span className="profile-avatar-initials">{initials}</span>
          ) : (
            <Icon name="user" size={34} />
          )}
        </span>
        <div className="profile-hero-text">
          <p className="profile-hero-name">{name.trim() || 'Guest player'}</p>
          <p className="profile-hero-note">
            <Icon name="lock" size={14} />
            Saved on this device - no account needed
          </p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <span className="profile-stat-icon" aria-hidden="true">
            <Icon name="trophy" size={18} />
          </span>
          <span className="profile-stat-num">{points.toLocaleString()}</span>
          <span className="profile-stat-label">Points</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-icon" aria-hidden="true">
            <Icon name="check" size={18} />
          </span>
          <span className="profile-stat-num">{solves.toLocaleString()}</span>
          <span className="profile-stat-label">Puzzles solved</span>
        </div>
      </div>

      <label className="profile-field">
        <span className="profile-field-label">Display name</span>
        <input
          type="text"
          className="input"
          value={name}
          placeholder="Enter your name"
          maxLength={30}
          autoComplete="nickname"
          onChange={(e) => useProfileStore.getState().setName(e.target.value)}
        />
      </label>

      <div className="profile-field">
        <span className="profile-field-label">Avatar colour</span>
        <div className="profile-swatches" role="radiogroup" aria-label="Avatar colour">
          {AVATAR_COLORS.map((c, i) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={avatarId === i}
              aria-label={`Colour ${i + 1}`}
              className={'profile-swatch' + (avatarId === i ? ' is-active' : '')}
              style={{ background: c }}
              onClick={() => useProfileStore.getState().setAvatarId(i)}
            >
              {avatarId === i && <Icon name="check" size={16} />}
            </button>
          ))}
        </div>
      </div>

      <div className="profile-actions">
        <button
          type="button"
          className="btn btn--ghost profile-reset"
          onClick={() => {
            if (window.confirm('Clear your name and avatar? Your points are kept.')) {
              useProfileStore.getState().reset()
            }
          }}
        >
          Reset profile
        </button>
        <button type="button" className="btn btn--primary" onClick={close}>
          Done
        </button>
      </div>
    </Modal>
  )
}
