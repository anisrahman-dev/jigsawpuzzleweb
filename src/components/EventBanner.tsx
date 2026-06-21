// Featured-event hero - "soft modern depth" on a clean white home page.
// One rounded-2xl split card: a layered warm gradient surface plus a faint top
// vignette gives genuine elevation, never a flat scrim. A calm copy column
// (pill eyebrow, large serif title, friendly sub, raised depth-chip countdown,
// an elevated glowing CTA + quiet trophy note) sits beside a framed cover photo
// lifted on a warm marigold->terracotta glow. The themed photo stays the star.
import { useUiStore } from '@/store/uiStore'
import { useCountdown } from '@/hooks/useCountdown'
import { eventWindow, type PuzzleEvent } from '@/data/events'
import { Icon } from '@/components/Icon'
import './EventBanner.css'

const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0')

export function EventBanner({ event }: { event: PuzzleEvent }) {
  // The home only features an event while it's LIVE, so the countdown shows the
  // time left in its window ("Ends in"), not "Begins in".
  const c = useCountdown(eventWindow(event).end)
  const open = () => useUiStore.getState().browseEvent(event)

  const units: { label: string; value: string }[] = [
    { label: 'Days', value: pad(c.days) },
    { label: 'Hrs', value: pad(c.hours) },
    { label: 'Min', value: pad(c.minutes) },
    { label: 'Sec', value: pad(c.seconds) },
  ]

  return (
    <section className="evbanner" aria-label="Featured event">
      <span className="evbanner-vignette" aria-hidden="true" />

      <div className="evbanner-grid">
        <div className="evbanner-copy">
          <span className="evbanner-eyebrow">
            <Icon name="sparkle" size={13} />
            Featured event
          </span>

          <h2 className="evbanner-title">
            <span className="evbanner-emoji" aria-hidden="true">
              {event.emoji}
            </span>
            {event.name}
          </h2>

          <p className="evbanner-sub">
            A themed collection for a slow afternoon. Solve event puzzles and earn{' '}
            <strong>3&times; points</strong> while it runs.
          </p>

          <div className="evbanner-status" aria-live="polite">
            {c.done ? (
              <span className="evbanner-live">
                <span className="evbanner-live-dot" aria-hidden="true" />
                Live now
                <span className="evbanner-live-note">The event is open</span>
              </span>
            ) : (
              <>
                <span className="evbanner-count-label">
                  <Icon name="clock" size={14} />
                  Ends in
                </span>
                <div
                  className="evbanner-tiles"
                  role="timer"
                  aria-label={`Ends in ${c.days} days, ${c.hours} hours, ${c.minutes} minutes`}
                >
                  {units.map((u, i) => (
                    <div className="evbanner-tile" key={u.label}>
                      {i > 0 && (
                        <span className="evbanner-tile-sep" aria-hidden="true">
                          :
                        </span>
                      )}
                      <span className="evbanner-tile-num">{u.value}</span>
                      <span className="evbanner-tile-label">{u.label}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="evbanner-actions">
            <button type="button" className="evbanner-cta" onClick={open}>
              <Icon name="play" size={17} />
              Play event puzzles
              <Icon name="arrow-right" size={17} />
            </button>
            <span className="evbanner-actions-note">
              <Icon name="trophy" size={15} />
              Bonus points all event long
            </span>
          </div>
        </div>

        <div className="evbanner-media">
          <span className="evbanner-glow" aria-hidden="true" />
          <div
            className="evbanner-photo"
            style={{ ['--evbg' as string]: `url("${event.cover}")` }}
            role="img"
            aria-label={`${event.name} cover art`}
          >
            <span className="evbanner-photo-bg" aria-hidden="true" />
            <span className="evbanner-photo-sheen" aria-hidden="true" />
            <span className="evbanner-chip">
              <span className="evbanner-chip-emoji" aria-hidden="true">
                {event.emoji}
              </span>
              Now featured
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
