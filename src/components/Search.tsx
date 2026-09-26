import { Search as SearchIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatusPill } from '@/components/StatusPill'
import { useSearchDialog } from '@/hooks/useSearchDialog'
import { searchPortfolio } from '@/utils/search'

function shortcutLabel() {
  if (typeof navigator === 'undefined') return 'Ctrl K'
  return /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘K' : 'Ctrl K'
}

export function SearchButton() {
  const { setOpen } = useSearchDialog()
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="inline-flex h-10 items-center gap-3 border border-line bg-surface px-3 text-sm text-muted"
      aria-label="Search the site"
    >
      <SearchIcon className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">Search</span>
      <span className="hidden font-mono text-[10px] uppercase tracking-wider md:inline">{shortcutLabel()}</span>
    </button>
  )
}

export function SearchDialog() {
  const { open, setOpen } = useSearchDialog()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const results = searchPortfolio(query).slice(0, 8)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    inputRef.current?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [open, setOpen])

  if (!open) return null

  const submit = () => {
    const next = query.trim()
    if (next.length < 2) return
    navigate(`/search?q=${encodeURIComponent(next)}`)
    setOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 p-4" role="presentation" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="mx-auto mt-16 w-full max-w-2xl border border-line bg-surface"
        onClick={(event) => event.stopPropagation()}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault()
            submit()
          }}
        >
          <label htmlFor="site-search" className="sr-only">
            Search projects, articles, solutions, videos, certifications, and architecture
          </label>
          <input
            ref={inputRef}
            id="site-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Azure, AWS, AI, RAG, DR, Kubernetes, FinOps"
            className="w-full border-b border-line bg-transparent px-4 py-4 text-base text-ink outline-none"
          />
        </form>
        <ul className="max-h-96 overflow-auto">
          {query.trim().length >= 2 && results.length === 0 ? (
            <li className="px-4 py-6 text-sm text-muted">No matching work for that search.</li>
          ) : null}
          {results.map((result) => (
            <li key={`${result.kind}-${result.id}`} className="border-t border-line">
              <button
                type="button"
                className="block w-full px-4 py-3 text-left hover:bg-canvas"
                onClick={() => {
                  navigate(result.href)
                  setOpen(false)
                }}
              >
                <span className="flex flex-wrap items-center gap-2">
                  <span className="kicker">{result.kind}</span>
                  {result.placeholder ? <StatusPill dashed>Placeholder</StatusPill> : null}
                </span>
                <span className="mt-1 block text-sm text-ink">{result.title}</span>
                <span className="mt-1 block text-sm text-muted">{result.description}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
