import type { ReactNode } from 'react'

export function Notice({ children }: { children: ReactNode }) {
  return <p className="border border-line bg-accent-soft px-4 py-3 text-sm leading-relaxed text-ink">{children}</p>
}
