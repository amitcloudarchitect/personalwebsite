import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SearchButton } from '@/components/Search'
import { ThemeToggle } from '@/components/ThemeToggle'
import { profile } from '@/data/profile'
import { navigation } from '@/data/site'
import { cx } from '@/utils/classNames'

function isActive(pathname: string, to: string) {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function Navbar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPath, setMenuPath] = useState(pathname)

  if (pathname !== menuPath) {
    setMenuPath(pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    if (!menuOpen) return
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-sm bg-accent font-display text-sm text-accent-fg" aria-hidden="true">
            {profile.monogram}
          </span>
          <span>
            <span className="block font-display text-lg leading-none">{profile.name}</span>
            <span className="mt-1 block font-display text-sm italic text-rule">{profile.role}</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <SearchButton />
          <ThemeToggle />
          <button
            type="button"
            className="grid h-10 w-10 place-items-center border border-line bg-surface xl:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>
      <nav aria-label="Primary" className="mx-auto hidden max-w-6xl px-5 pb-3 xl:block">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {navigation.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                aria-current={isActive(pathname, item.to) ? 'page' : undefined}
                className={cx(
                  'text-sm',
                  isActive(pathname, item.to) ? 'text-ink underline decoration-accent underline-offset-8' : 'text-muted hover:text-ink',
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <nav id="mobile-navigation" aria-label="Mobile" className={menuOpen ? 'border-t border-line xl:hidden' : 'hidden'}>
        <ul className="mx-auto max-h-[70vh] max-w-6xl overflow-auto px-5 py-3">
          {navigation.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                aria-current={isActive(pathname, item.to) ? 'page' : undefined}
                className="block py-3 text-base text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
