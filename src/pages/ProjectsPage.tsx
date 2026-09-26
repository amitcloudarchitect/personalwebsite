import { useMemo, useState } from 'react'
import { PageIntro } from '@/components/PageIntro'
import { ProjectCard } from '@/components/ProjectCard'
import { Seo } from '@/components/Seo'
import { projects } from '@/data/projects'

export default function ProjectsPage() {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return projects
    return projects.filter((project) =>
      [project.name, project.summary, project.problem, ...project.technologies].join(' ').toLowerCase().includes(needle),
    )
  }, [query])

  return (
    <>
      <Seo
        title="Architecture and projects"
        description="Architecture and platform projects by Amit Kumar, including AI cloud operations, multi-cloud management, Azure Files, disaster recovery, and hybrid connectivity."
        path="/projects"
      />
      <PageIntro
        eyebrow="Projects"
        title="Architecture & Projects"
        lede="Platform designs and architecture work. Personal projects are labeled as such. Customer identifiers are not included."
      >
        <label className="block max-w-md text-sm text-muted" htmlFor="project-filter">
          Filter projects
          <input
            id="project-filter"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mt-2 w-full border border-line bg-surface px-3 py-2 text-ink"
            placeholder="Azure, RAG, disaster recovery"
          />
        </label>
      </PageIntro>
      <div className="mx-auto max-w-6xl px-5 py-12">
        {filtered.length === 0 ? <p className="text-muted">No projects match that filter.</p> : null}
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </>
  )
}
