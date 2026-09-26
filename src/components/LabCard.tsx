import { Link } from 'react-router-dom'
import { StatusPill } from '@/components/StatusPill'
import { TechnologyBadge } from '@/components/TechnologyBadge'
import type { LabItem } from '@/types'

export function LabCard({ item }: { item: LabItem }) {
  return (
    <Link to={`/ai-lab/${item.slug}`} className="flex h-full flex-col border border-line bg-surface p-5 transition-colors hover:border-accent">
      <StatusPill>{item.status}</StatusPill>
      <h3 className="mt-4 text-xl text-ink">{item.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{item.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {item.technologies.slice(0, 3).map((technology) => (
          <li key={technology}>
            <TechnologyBadge>{technology}</TechnologyBadge>
          </li>
        ))}
      </ul>
    </Link>
  )
}
