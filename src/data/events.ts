// Automatic 2026 event calendar. Each event has a date window; when "today"
// falls inside a window the home shows that event (instead of the hero). Tier
// breaks overlaps (A > B > C > D). Solving an event puzzle earns 3× points.
// Everything is date-driven - no manual switching needed.

export type EventTier = 'A' | 'B' | 'C' | 'D'

export interface PuzzleEvent {
  key: string
  name: string
  emoji: string
  tier: EventTier
  /** Anchor day (A/B/D) - window derived from the tier. */
  date?: string
  /** Explicit range (C / multi-day) - overrides the tier window. */
  start?: string
  end?: string
  /** Pixabay search for the themed puzzles & banner. */
  query: string
  cover: string
}

/** Points multiplier for solving a puzzle reached through an event. */
export const EVENT_POINTS_MULTIPLIER = 3

const C = 'https://cdn.pixabay.com/photo/'
const ev = (
  key: string,
  name: string,
  emoji: string,
  tier: EventTier,
  when: { date?: string; start?: string; end?: string },
  query: string,
  cover: string,
): PuzzleEvent => ({ key, name, emoji, tier, ...when, query, cover })

export const EVENTS: PuzzleEvent[] = [
  // ── Tier A - blockbuster (≈12-day window) ────────────────────────────────
  ev('new-year', "New Year's Day", '🎉', 'A', { date: '2026-01-01' }, 'fireworks new year celebration', `${C}2017/12/27/13/10/celebration-3042641_1280.jpg`),
  ev('independence-day', 'Independence Day', '🎆', 'A', { date: '2026-07-04' }, 'fireworks american flag fourth july', `${C}2019/10/04/22/49/july-4th-4526664_1280.jpg`),
  ev('halloween', 'Halloween', '🎃', 'A', { date: '2026-10-31' }, 'halloween pumpkin jack o lantern', `${C}2023/09/10/11/01/pumpkins-8244657_1280.jpg`),
  ev('thanksgiving', 'Thanksgiving', '🦃', 'A', { date: '2026-11-26' }, 'thanksgiving turkey harvest', `${C}2016/12/23/07/58/holiday-table-1926946_1280.jpg`),
  ev('christmas', 'Christmas', '🎄', 'A', { date: '2026-12-25' }, 'christmas tree lights ornaments', `${C}2020/12/26/16/47/christmas-5861895_1280.jpg`),

  // ── Tier B - major holiday (≈7-day window) ───────────────────────────────
  ev('lunar-new-year', 'Lunar New Year', '🐉', 'B', { date: '2026-02-17' }, 'chinese new year lantern dragon', `${C}2022/01/15/06/00/chinese-lanterns-6938763_1280.jpg`),
  ev('valentines', "Valentine's Day", '❤️', 'B', { date: '2026-02-14' }, 'hearts roses valentine', `${C}2016/02/29/20/17/roses-1229148_1280.jpg`),
  ev('mardi-gras', 'Mardi Gras', '🎭', 'B', { date: '2026-02-17' }, 'mardi gras mask beads', `${C}2016/02/21/21/50/mardi-gras-1214385_1280.jpg`),
  ev('st-patricks', "St. Patrick's Day", '☘️', 'B', { date: '2026-03-17' }, 'shamrock clover green', `${C}2023/08/06/19/01/colvers-8173610_1280.jpg`),
  ev('easter', 'Easter', '🐰', 'B', { date: '2026-04-05' }, 'easter eggs bunny', `${C}2017/03/23/14/54/easter-2168521_1280.jpg`),
  ev('cinco-de-mayo', 'Cinco de Mayo', '🎊', 'B', { date: '2026-05-05' }, 'mexican fiesta colorful', `${C}2014/01/30/13/43/carnival-254914_1280.jpg`),
  ev('mothers-day', "Mother's Day", '💐', 'B', { date: '2026-05-10' }, 'bouquet flowers', `${C}2020/07/02/06/58/tulips-5361990_1280.jpg`),
  ev('memorial-day', 'Memorial Day', '🇺🇸', 'B', { date: '2026-05-25' }, 'american flag patriotic', `${C}2023/06/03/19/57/memorial-day-8038425_1280.jpg`),
  ev('labor-day', 'Labor Day', '⛱️', 'B', { date: '2026-09-07' }, 'summer barbecue beach', `${C}2019/07/30/19/09/bbq-4373644_1280.jpg`),
  ev('veterans-day', 'Veterans Day', '🎖️', 'B', { date: '2026-11-11' }, 'veterans american flag tribute', `${C}2019/11/05/18/10/remembrance-day-4604155_1280.jpg`),
  ev('hanukkah', 'Hanukkah', '🕎', 'B', { start: '2026-12-04', end: '2026-12-12' }, 'hanukkah menorah candles', `${C}2022/12/17/17/19/menorah-7662079_1280.jpg`),

  // ── Tier C - seasonal / range (2-4 weeks) ────────────────────────────────
  ev('winter-season', 'Winter Season', '❄️', 'C', { start: '2026-01-02', end: '2026-01-31' }, 'snow winter cabin landscape', `${C}2016/11/19/14/30/aurora-borealis-1839582_1280.jpg`),
  ev('spring-equinox', 'Spring', '🌱', 'C', { start: '2026-03-15', end: '2026-04-04' }, 'spring blossom green sprout', `${C}2016/05/20/16/43/tulips-1405413_1280.jpg`),
  ev('march-madness', 'March Madness', '🏀', 'C', { start: '2026-03-17', end: '2026-04-06' }, 'basketball court arena', `${C}2014/07/11/17/03/basketball-390008_1280.jpg`),
  ev('cherry-blossom', 'Cherry Blossom', '🌸', 'C', { start: '2026-03-25', end: '2026-04-15' }, 'cherry blossom sakura', `${C}2017/03/23/16/48/japanese-cherry-blossom-2168858_1280.jpg`),
  ev('coachella', 'Music Festival', '🎵', 'C', { start: '2026-04-10', end: '2026-04-19' }, 'music festival stage lights', `${C}2014/09/26/03/37/laser-light-461515_1280.jpg`),
  ev('summer-solstice', 'Summer Solstice', '☀️', 'C', { start: '2026-06-15', end: '2026-07-02' }, 'summer beach sunshine', `${C}2016/11/29/03/46/beach-1867137_1280.jpg`),
  ev('road-trip', 'Great American Road Trip', '🚗', 'C', { start: '2026-08-01', end: '2026-08-18' }, 'route 66 desert highway', `${C}2018/12/14/14/32/route66-3875170_1280.jpg`),
  ev('back-to-school', 'Back to School', '🎒', 'C', { start: '2026-08-12', end: '2026-09-05' }, 'school supplies backpack', `${C}2018/02/09/12/37/colored-pencils-3141508_1280.jpg`),
  ev('autumn-equinox', 'Autumn', '🍁', 'C', { start: '2026-09-18', end: '2026-10-04' }, 'autumn golden field', `${C}2018/10/09/22/26/autumn-3736055_1280.jpg`),
  ev('oktoberfest', 'Oktoberfest', '🍺', 'C', { start: '2026-09-19', end: '2026-10-04' }, 'beer pretzel oktoberfest', `${C}2016/09/23/18/16/pretzel-1690191_1280.jpg`),
  ev('fall-foliage', 'Fall Foliage', '🍂', 'C', { start: '2026-10-05', end: '2026-10-27' }, 'autumn leaves forest', `${C}2022/11/09/14/13/forest-7580700_1280.jpg`),

  // ── Tier D - fun "national day" (3-day window) ───────────────────────────
  ev('mlk-day', 'MLK Day', '🕊️', 'D', { date: '2026-01-19' }, 'memorial peace dove', `${C}2022/06/23/00/04/hd-wallpaper-7278925_1280.jpg`),
  ev('groundhog-day', 'Groundhog Day', '🦫', 'D', { date: '2026-02-02' }, 'groundhog marmot', `${C}2022/08/15/14/38/groundhog-7388077_1280.jpg`),
  ev('super-bowl', 'Super Bowl Sunday', '🏈', 'D', { date: '2026-02-08' }, 'american football stadium', `${C}2013/02/06/05/45/football-78394_1280.jpg`),
  ev('presidents-day', "Presidents' Day", '🏛️', 'D', { date: '2026-02-16' }, 'mount rushmore monument', `${C}2018/08/15/17/17/mount-rushmore-3608620_1280.jpg`),
  ev('pi-day', 'Pi Day', '🥧', 'D', { date: '2026-03-14' }, 'apple pie slice', `${C}2016/02/17/17/39/apple-1205471_1280.jpg`),
  ev('earth-day', 'Earth Day', '🌍', 'D', { date: '2026-04-22' }, 'earth planet from space', `${C}2016/05/12/16/35/earth-1388003_1280.jpg`),
  ev('arbor-day', 'Arbor Day', '🌳', 'D', { date: '2026-04-24' }, 'tree forest', `${C}2018/04/06/00/25/trees-3294681_1280.jpg`),
  ev('star-wars-day', 'Star Wars Day', '⭐', 'D', { date: '2026-05-04' }, 'galaxy space stars', `${C}2022/07/06/16/25/beautiful-7305542_1280.jpg`),
  ev('kentucky-derby', 'Kentucky Derby', '🐎', 'D', { date: '2026-05-02' }, 'horse racing', `${C}2017/07/20/18/45/horses-2523299_1280.jpg`),
  ev('donut-day', 'National Donut Day', '🍩', 'D', { date: '2026-06-05' }, 'donuts colorful glazed', `${C}2017/06/01/00/20/donuts-2362113_1280.jpg`),
  ev('flag-day', 'Flag Day', '🇺🇸', 'D', { date: '2026-06-14' }, 'american flag waving', `${C}2021/09/29/03/23/flag-6666102_1280.jpg`),
  ev('juneteenth', 'Juneteenth', '✊', 'D', { date: '2026-06-19' }, 'celebration freedom', `${C}2015/08/07/15/47/fireworks-879461_1280.jpg`),
  ev('hot-dog-day', 'National Hot Dog Day', '🌭', 'D', { date: '2026-07-15' }, 'hot dog grill', `${C}2017/08/10/05/41/hot-dogs-2618696_1280.jpg`),
  ev('ice-cream-day', 'National Ice Cream Day', '🍦', 'D', { date: '2026-07-19' }, 'ice cream sundae', `${C}2020/03/22/11/46/ice-cream-4956840_1280.jpg`),
  ev('dog-day', 'National Dog Day', '🐶', 'D', { date: '2026-08-26' }, 'dog puppy', `${C}2019/08/07/14/11/dog-4390885_1280.jpg`),
  ev('beach-day', 'National Beach Day', '🏖️', 'D', { date: '2026-08-30' }, 'beach ocean sand', `${C}2016/06/10/22/19/beach-1449008_1280.jpg`),
  ev('coffee-day', 'National Coffee Day', '☕', 'D', { date: '2026-09-29' }, 'coffee latte art', `${C}2017/08/07/22/57/coffee-2608864_1280.jpg`),
  ev('balloon-fiesta', 'Balloon Fiesta', '🎈', 'D', { date: '2026-10-04' }, 'hot air balloon', `${C}2016/11/29/04/18/hot-air-balloons-1867279_1280.jpg`),
  ev('cat-day', 'National Cat Day', '🐱', 'D', { date: '2026-10-29' }, 'cat kitten', `${C}2016/11/18/13/15/animal-1834409_1280.jpg`),
  ev('day-of-dead', 'Day of the Dead', '💀', 'D', { date: '2026-11-01' }, 'day of the dead marigold skull', `${C}2019/12/09/22/27/skull-4684545_1280.jpg`),
  ev('diwali', 'Diwali', '🪔', 'D', { date: '2026-11-08' }, 'diwali oil lamp lights', `${C}2015/12/25/08/54/lamps-1107447_1280.jpg`),
  ev('black-friday', 'Black Friday', '🛍️', 'D', { date: '2026-11-27' }, 'shopping gifts sale', `${C}2014/12/01/19/23/pink-553149_1280.jpg`),
  ev('nye', 'Times Square NYE', '🪩', 'D', { date: '2026-12-31' }, 'new year fireworks city lights', `${C}2023/07/11/08/50/fireworks-8119898_1280.jpg`),
]

const TIER_RANK: Record<EventTier, number> = { A: 4, B: 3, C: 2, D: 1 }
const TIER_WINDOW: Record<EventTier, [number, number]> = { A: [10, 1], B: [5, 1], C: [0, 0], D: [1, 1] }

function dayStart(iso: string): Date {
  return new Date(`${iso}T00:00:00`)
}

/** [start, end] Date window for an event. */
export function eventWindow(e: PuzzleEvent): { start: Date; end: Date } {
  if (e.start && e.end) {
    const end = dayStart(e.end)
    end.setHours(23, 59, 59, 999)
    return { start: dayStart(e.start), end }
  }
  const [before, after] = TIER_WINDOW[e.tier]
  const anchor = dayStart(e.date!)
  const start = new Date(anchor)
  start.setDate(start.getDate() - before)
  const end = new Date(anchor)
  end.setDate(end.getDate() + after)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

/** Day the countdown targets (the headline day of the event). */
export function eventTarget(e: PuzzleEvent): Date {
  return dayStart(e.date ?? e.end ?? e.start!)
}

/** The event to feature right now, or null (→ show the default hero). */
export function activeEvent(now: Date = new Date()): PuzzleEvent | null {
  const live = EVENTS.filter((e) => {
    const w = eventWindow(e)
    return now >= w.start && now <= w.end
  })
  if (live.length === 0) return null
  live.sort((a, b) => {
    const r = TIER_RANK[b.tier] - TIER_RANK[a.tier]
    if (r !== 0) return r
    return eventWindow(a).end.getTime() - eventWindow(b).end.getTime() // soonest to end first
  })
  return live[0]
}

/** The next upcoming event (soonest future window start). */
export function upcomingEvent(now: Date = new Date()): PuzzleEvent | null {
  const future = EVENTS.map((e) => ({ e, start: eventWindow(e).start }))
    .filter((x) => x.start > now)
    .sort((a, b) => a.start.getTime() - b.start.getTime())
  return future[0]?.e ?? null
}

export function eventByKey(key: string): PuzzleEvent | undefined {
  return EVENTS.find((e) => e.key === key)
}
