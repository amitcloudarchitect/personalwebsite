import { technologyGroups } from '@/data/technologies'
import { TechnologyBadge } from '@/components/TechnologyBadge'

export function TechnologyRadar() {
  return (
    <div className="grid gap-px border border-line bg-line md:grid-cols-2">
      {technologyGroups.map((group) => (
        <section key={group.id} className="bg-surface p-6" aria-labelledby={`radar-${group.id}`}>
          <h3 id={`radar-${group.id}`} className="kicker">
            {group.label}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{group.description}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li key={item}>
                <TechnologyBadge>{item}</TechnologyBadge>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
