import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumb } from '@/components/Breadcrumb'
import { BulletList } from '@/components/BulletList'
import { DefinitionBlock } from '@/components/DefinitionBlock'
import { DiagramFrame } from '@/components/DiagramFrame'
import { Lightbox } from '@/components/Lightbox'
import { Notice } from '@/components/Notice'
import { Seo } from '@/components/Seo'
import { TechnologyBadge } from '@/components/TechnologyBadge'
import { projects } from '@/data/projects'
import { solutions } from '@/data/solutions'
import { breadcrumbJsonLd } from '@/utils/seo'
import { useConfig } from '@/hooks/useConfig'
import NotFoundPage from '@/pages/NotFoundPage'

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)
  const { siteUrl } = useConfig()
  const [open, setOpen] = useState(false)

  if (!project) return <NotFoundPage />

  const related = solutions.filter((solution) => project.relatedSolutions.includes(solution.slug))

  return (
    <>
      <Seo
        title={project.name}
        description={project.summary}
        path={`/projects/${project.slug}`}
        jsonLd={[
          breadcrumbJsonLd(siteUrl, [
            { name: 'Home', path: '/' },
            { name: 'Projects', path: '/projects' },
            { name: project.name, path: `/projects/${project.slug}` },
          ]),
        ]}
      />
      <article className="mx-auto max-w-6xl px-5 py-14">
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Projects', to: '/projects' },
            { label: project.name },
          ]}
        />
        <p className="kicker">
          {project.kind === 'personal' ? 'Personal architecture project' : 'Professional experience'}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-medium tracking-tight text-ink">{project.name}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{project.summary}</p>
        <div className="mt-6">
          <Notice>{project.notice}</Notice>
        </div>
        <ul className="mt-6 flex flex-wrap gap-2">
          {project.technologies.map((technology) => (
            <li key={technology}>
              <TechnologyBadge>{technology}</TechnologyBadge>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <DiagramFrame title={`${project.name} diagram`} spec={project.diagram} image={project.image} onExpand={() => setOpen(true)} />
          <p className="mt-2 text-sm text-muted">Reference diagram. Select it to open the full-screen view.</p>
        </div>
        <DefinitionBlock title="Problem">
          <p>{project.problem}</p>
        </DefinitionBlock>
        <DefinitionBlock title="Architecture">
          <p>{project.architecture}</p>
        </DefinitionBlock>
        <DefinitionBlock title="My role">
          <p>{project.role}</p>
        </DefinitionBlock>
        <DefinitionBlock title="Business impact">
          <p>{project.businessImpact}</p>
        </DefinitionBlock>
        <DefinitionBlock title="Key learnings">
          <BulletList items={project.learnings} />
        </DefinitionBlock>
        {related.length > 0 ? (
          <DefinitionBlock title="Related patterns">
            <ul className="space-y-2">
              {related.map((solution) => (
                <li key={solution.id}>
                  <Link to={`/solutions/${solution.slug}`} className="text-accent">
                    {solution.title}
                  </Link>
                </li>
              ))}
            </ul>
          </DefinitionBlock>
        ) : null}
      </article>
      <Lightbox open={open} title={project.name} onClose={() => setOpen(false)}>
        <DiagramFrame title={`${project.name} diagram`} spec={project.diagram} image={project.image} />
      </Lightbox>
    </>
  )
}
