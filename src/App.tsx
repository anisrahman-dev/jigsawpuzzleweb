import { useEffect } from 'react'
import { useUiStore } from '@/store/uiStore'
import { usePrefsStore } from '@/store/prefsStore'
import { parseRoute, urlForRoute, currentUrl } from '@/router'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { GalleryHome } from '@/components/GalleryHome'
import { CategoriesPage } from '@/components/CategoriesPage'
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

  // Reset scroll to the top when navigating to a new view/category/event/puzzle,
  // so a page never opens scrolled partway down (e.g. landing at the bottom of a
  // category after scrolling the previous list). Pagination handles its own
  // smooth scroll, so categoryPage is intentionally excluded here.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view, selectedCategory, selectedEvent, puzzleRoute])

  return (
    <>
      <Header />
      <main className="app-main">
        {view === 'home' && <GalleryHome />}
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
