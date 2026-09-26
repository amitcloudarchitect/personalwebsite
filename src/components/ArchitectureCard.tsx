import { Link } from 'react-router-dom'
import { DiagramFrame } from '@/components/DiagramFrame'
import type { ArchitectureItem } from '@/types'

export function ArchitectureCard({ item }: { item: ArchitectureItem }) {
  return (
    <article className="flex h-full flex-col border border-line bg-surface">
      <Link to={`/architecture/${item.slug}`} aria-label={`Open ${item.title} architecture`}>
        <DiagramFrame title={item.title} spec={item.diagram} image={item.image} />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="kicker">{item.topic}</p>
        <h3 className="mt-2 text-xl text-ink">
          <Link to={`/architecture/${item.slug}`}>{item.title}</Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{item.summary}</p>
        <Link to={`/architecture/${item.slug}`} className="mt-4 text-sm text-accent">
          View architecture
        </Link>
      </div>
    </article>
  )
}
