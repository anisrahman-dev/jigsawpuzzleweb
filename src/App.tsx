import { useEffect } from 'react'
import { useUiStore } from '@/store/uiStore'
import { usePrefsStore } from '@/store/prefsStore'
import { parseRoute, urlForRoute, currentUrl } from '@/router'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { GalleryHome } from '@/components/GalleryHome'
import { CategoriesPage } from '@/components/CategoriesPage'
import { DailyPage } from '@/components/DailyPage'
import { CategoryPage } from '@/components/CategoryPage'
import { PuzzlePage } from '@/components/PuzzlePage'
import { EventPage } from '@/components/EventPage'
import { Game } from '@/components/Game'
import { PreviewModal } from '@/components/PreviewModal'
import { SettingsModal } from '@/components/SettingsModal'
import { HowToModal } from '@/components/HowToModal'
import { ProfileModal } from '@/components/ProfileModal'

export function App() {
  const view = useUiStore((s) => s.view)
  const selectedCategory = useUiStore((s) => s.selectedCategory)
  const selectedEvent = useUiStore((s) => s.selectedEvent)
  const categoryPage = useUiStore((s) => s.categoryPage)
  const puzzleRoute = useUiStore((s) => s.puzzleRoute)
  const textSize = usePrefsStore((s) => s.textSize)
  const highContrast = usePrefsStore((s) => s.highContrast)
  const reduceMotion = usePrefsStore((s) => s.reduceMotion)

  // Reflect comfort preferences onto <html> so the design system can react.
  useEffect(() => {
    const el = document.documentElement
    el.dataset.textSize = textSize
    el.dataset.contrast = highContrast ? 'high' : 'normal'
    el.dataset.motion = reduceMotion ? 'reduce' : 'auto'
  }, [textSize, highContrast, reduceMotion])

  // ── URL routing (History API) ──────────────────────────────────────────────
  // Back/forward & deep links → store.
  useEffect(() => {
    const onPop = () => {
      const r = parseRoute()
      useUiStore.getState().applyRoute(r.view, r.category, r.event, r.page, r.puzzle)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Store changes → URL (push a new history entry when it actually changes).
  useEffect(() => {
    const url = urlForRoute(view, selectedCategory, selectedEvent, categoryPage, puzzleRoute)
    if (url !== currentUrl()) window.history.pushState(null, '', url)
  }, [view, selectedCategory, selectedEvent, categoryPage, puzzleRoute])

  // Always open a new page at the top: reset scroll on any navigation - a new
  // view, category, event, puzzle, or page of results - so nothing ever opens
  // scrolled partway down. Because html/body have overflow-x:hidden + height
  // 100%, the BODY is the scroll container (not the window), so reset all three.
  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [view, selectedCategory, selectedEvent, puzzleRoute, categoryPage])

  return (
    <>
      <Header />
      <main className="app-main">
        {view === 'home' && <GalleryHome />}
        {view === 'daily' && <DailyPage />}
        {view === 'categories' && <CategoriesPage />}
        {view === 'category' && <CategoryPage />}
        {view === 'puzzle' && <PuzzlePage />}
        {view === 'event' && <EventPage />}
        {view === 'play' && <Game />}
      </main>
      {view !== 'play' && <Footer />}
      <PreviewModal />
      <SettingsModal />
      <HowToModal />
      <ProfileModal />
    </>
  )
}
