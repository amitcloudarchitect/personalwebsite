import { Link, useParams } from 'react-router-dom'
import { Breadcrumb } from '@/components/Breadcrumb'
import { DefinitionBlock } from '@/components/DefinitionBlock'
import { Notice } from '@/components/Notice'
import { Seo } from '@/components/Seo'
import { StatusPill } from '@/components/StatusPill'
import { TechnologyBadge } from '@/components/TechnologyBadge'
import { aiLab } from '@/data/aiLab'
import { projects } from '@/data/projects'
import { useConfig } from '@/hooks/useConfig'
import NotFoundPage from '@/pages/NotFoundPage'
import { breadcrumbJsonLd } from '@/utils/seo'

export default function AiLabDetailPage() {
  const { slug } = useParams()
  const item = aiLab.find((entry) => entry.slug === slug)
  const { siteUrl } = useConfig()
  if (!item) return <NotFoundPage />

  const relatedProject = projects.find((project) => project.slug === item.slug)

  return (
    <>
      <Seo
        title={item.title}
        description={item.summary}
        path={`/ai-lab/${item.slug}`}
        jsonLd={[
          breadcrumbJsonLd(siteUrl, [
            { name: 'Home', path: '/' },
            { name: 'AI Lab', path: '/ai-lab' },
            { name: item.title, path: `/ai-lab/${item.slug}` },
          ]),
        ]}
      />
      <article className="mx-auto max-w-6xl px-5 py-14">
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'AI Lab', to: '/ai-lab' },
            { label: item.title },
          ]}
        />
        <StatusPill>{item.status}</StatusPill>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-ink">{item.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{item.summary}</p>
        <div className="mt-6">
          <Notice>{item.boundaries}</Notice>
        </div>
        <ul className="mt-6 flex flex-wrap gap-2">
          {item.technologies.map((technology) => (
            <li key={technology}>
              <TechnologyBadge>{technology}</TechnologyBadge>
            </li>
          ))}
        </ul>
        <DefinitionBlock title="Description">
          <p>{item.description}</p>
        </DefinitionBlock>
        <DefinitionBlock title="Intent">
          <p>{item.intent}</p>
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
