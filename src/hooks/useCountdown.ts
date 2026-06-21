import { useEffect, useState } from 'react'

/** Live countdown to a target date. Ticks once per second. */
export function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])
  const ms = Math.max(0, target.getTime() - now)
  const total = Math.floor(ms / 1000)
  return {
    ms,
    done: ms <= 0,
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}
