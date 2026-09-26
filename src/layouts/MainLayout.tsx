import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { SearchDialog } from '@/components/Search'
import { SearchDialogProvider } from '@/hooks/useSearchDialog'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function PageFallback() {
  return <p className="mx-auto max-w-6xl px-5 py-24 text-muted">Loading…</p>
}

export function MainLayout() {
  return (
    <SearchDialogProvider>
      <div className="flex min-h-screen flex-col bg-canvas text-ink">
        <div className="h-1 bg-rule" aria-hidden="true" />
        <ScrollToTop />
        <Navbar />
        <main id="content" className="flex-1">
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
        <SearchDialog />
      </div>
    </SearchDialogProvider>
  )
}
