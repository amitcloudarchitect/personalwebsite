import { Link } from 'react-router-dom'

type SectionHeaderProps = {
  id?: string
  eyebrow: string
  title: string
  description?: string
  to?: string
  action?: string
}

export function SectionHeader({ id, eyebrow, title, description, to, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div className="max-w-2xl">
        <p className="kicker">{eyebrow}</p>
        <h2 id={id} className="mt-2 font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">{title}</h2>
        {description ? <p className="mt-3 text-base leading-relaxed text-muted">{description}</p> : null}
      </div>
      {to && action ? (
        <Link to={to} className="shrink-0 text-sm text-accent">
          {action}
        </Link>
      ) : null}
    </div>
  )
}
