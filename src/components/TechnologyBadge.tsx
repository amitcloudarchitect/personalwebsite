import type { ReactNode } from 'react'

export function TechnologyBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-line bg-surface px-2 py-1 text-xs text-muted">
      {children}
    </span>
  )
}
