import type { ReactNode } from 'react'

export function DefinitionBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line py-8">
      <h2 className="kicker">{title}</h2>
      <div className="mt-3 max-w-3xl text-base leading-7 text-ink">{children}</div>
    </section>
  )
}
