import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

type SearchDialogValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const SearchDialogContext = createContext<SearchDialogValue | null>(null)

export function SearchDialogProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [path, setPath] = useState(location.pathname)

  if (location.pathname !== path) {
    setPath(location.pathname)
    setOpen(false)
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return <SearchDialogContext.Provider value={{ open, setOpen }}>{children}</SearchDialogContext.Provider>
}

export function useSearchDialog() {
  const value = useContext(SearchDialogContext)
  if (!value) throw new Error('Search is unavailable outside the site layout')
  return value
}
