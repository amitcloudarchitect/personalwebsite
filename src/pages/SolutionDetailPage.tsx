import { Link, useParams } from 'react-router-dom'
import { Breadcrumb } from '@/components/Breadcrumb'
import { BulletList } from '@/components/BulletList'
import { DefinitionBlock } from '@/components/DefinitionBlock'
import { DiagramFrame } from '@/components/DiagramFrame'
import { Notice } from '@/components/Notice'
import { Seo } from '@/components/Seo'
import { TechnologyBadge } from '@/components/TechnologyBadge'
import { architecture } from '@/data/architecture'
import { projects } from '@/data/projects'
import { solutions } from '@/data/solutions'
import { useConfig } from '@/hooks/useConfig'
import NotFoundPage from '@/pages/NotFoundPage'
import { breadcrumbJsonLd } from '@/utils/seo'

export default function SolutionDetailPage() {
  const { slug } = useParams()
  const solution = solutions.find((item) => item.slug === slug)
  const { siteUrl } = useConfig()

  if (!solution) return <NotFoundPage />

  const relatedArchitecture = architecture.find((item) => item.slug === solution.relatedArchitecture)
  const relatedProject = projects.find((item) => item.slug === solution.relatedProject)

  return (
    <>
      <Seo
        title={solution.title}
        description={solution.summary}
        path={`/solutions/${solution.slug}`}
        jsonLd={[
          breadcrumbJsonLd(siteUrl, [
            { name: 'Home', path: '/' },
            { name: 'Solutions', path: '/solutions' },
            { name: solution.title, path: `/solutions/${solution.slug}` },
          ]),
        ]}
      />
      <article className="mx-auto max-w-6xl px-5 py-14">
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Solutions', to: '/solutions' },
            { label: solution.title },
          ]}
        />
        <p className="kicker">{solution.category}</p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink">{solution.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{solution.summary}</p>
        <div className="mt-6">
          <Notice>Reusable architecture pattern. It omits customer identities, addresses, and implementation secrets.</Notice>
        </div>
        <ul className="mt-6 flex flex-wrap gap-2">
          {solution.technologies.map((technology) => (
            <li key={technology}>
              <TechnologyBadge>{technology}</TechnologyBadge>
            </li>
          ))}
        </ul>
        {relatedArchitecture ? (
          <div className="mt-8">
            <DiagramFrame title={relatedArchitecture.title} spec={relatedArchitecture.diagram} image={solution.image ?? relatedArchitecture.image} />
            <p className="mt-2 text-sm text-muted">
              Diagram from the{' '}
              <Link to={`/architecture/${relatedArchitecture.slug}`} className="text-accent">
                {relatedArchitecture.title}
              </Link>{' '}
              gallery entry.
            </p>
          </div>
        ) : null}
        <DefinitionBlock title="Problem statement">
          <p>{solution.problem}</p>
        </DefinitionBlock>
        <DefinitionBlock title="Business requirement">
          <p>{solution.businessRequirement}</p>
        </DefinitionBlock>
        <DefinitionBlock title="Architecture">
          <p>{solution.architecture}</p>
        </DefinitionBlock>
        <DefinitionBlock title="Technology components">
          <BulletList items={solution.components} />
        </DefinitionBlock>
        <DefinitionBlock title="Design decisions">
          <BulletList items={solution.designDecisions} />
        </DefinitionBlock>
        <DefinitionBlock title="Security considerations">
          <BulletList items={solution.security} />
        </DefinitionBlock>
        <DefinitionBlock title="Availability">
          <p>{solution.availability}</p>
        </DefinitionBlock>
        <DefinitionBlock title="DR considerations">
          <p>{solution.dr}</p>
        </DefinitionBlock>
        <DefinitionBlock title="Cost considerations">
          <p>{solution.cost}</p>
        </DefinitionBlock>
        <DefinitionBlock title="Lessons learned">
          <BulletList items={solution.lessons} />
        </DefinitionBlock>
        {relatedProject ? (
          <DefinitionBlock title="Related project">
            <Link to={`/projects/${relatedProject.slug}`} className="text-accent">
              {relatedProject.name}
            </Link>
          </DefinitionBlock>
        ) : null}
      </article>
    </>
  )
}
