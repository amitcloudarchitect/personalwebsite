import { Link } from 'react-router-dom'
import { StatusPill } from '@/components/StatusPill'
import { TechnologyBadge } from '@/components/TechnologyBadge'
import type { Project } from '@/types'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to={`/projects/${project.slug}`} className="flex h-full flex-col border border-line bg-surface p-5 transition-colors hover:border-accent">
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill dashed={project.kind === 'personal'}>{project.kind === 'personal' ? 'Personal architecture' : 'Experience'}</StatusPill>
      </div>
      <h3 className="mt-4 text-xl text-ink">{project.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{project.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.technologies.slice(0, 4).map((technology) => (
          <li key={technology}>
            <TechnologyBadge>{technology}</TechnologyBadge>
          </li>
        ))}
      </ul>
    </Link>
  )
}
