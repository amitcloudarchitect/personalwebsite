import { Link } from 'react-router-dom'
import { StatusPill } from '@/components/StatusPill'
import { TechnologyBadge } from '@/components/TechnologyBadge'

export type TimelineView = {
  id: string
  label: string
  title: string
  subtitle?: string
  description: string
  href?: string
  tags?: string[]
  current?: boolean
  placeholder?: boolean
}

export function Timeline({ items }: { items: TimelineView[] }) {
  return (
    <ol className="space-y-0">
      {items.map((item) => (
        <li key={item.id} className="relative border-l border-line pb-8 pl-8">
          <span
            className="absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full border border-accent bg-canvas"
            aria-hidden="true"
          />
          <div className="flex flex-wrap items-center gap-2">
            <p className="kicker">{item.label}</p>
            {item.current ? <StatusPill>Current</StatusPill> : null}
            {item.placeholder ? <StatusPill dashed>Placeholder</StatusPill> : null}
          </div>
          <h3 className="mt-2 text-xl text-ink">{item.title}</h3>
          {item.subtitle ? <p className="mt-1 text-sm text-muted">{item.subtitle}</p> : null}
          <p className="mt-2 max-w-3xl leading-relaxed text-muted">{item.description}</p>
          {item.tags && item.tags.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <li key={tag}>
                  <TechnologyBadge>{tag}</TechnologyBadge>
                </li>
              ))}
            </ul>
          ) : null}
          {item.href ? (
            <Link to={item.href} className="mt-3 inline-flex text-sm text-accent">
              View
            </Link>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
