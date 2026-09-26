import type { ReactNode } from 'react'

type PageIntroProps = {
  eyebrow: string
  title: string
  lede: string
  children?: ReactNode
}

export function PageIntro({ eyebrow, title, lede, children }: PageIntroProps) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
        <p className="kicker">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{lede}</p>
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </header>
  )
}
