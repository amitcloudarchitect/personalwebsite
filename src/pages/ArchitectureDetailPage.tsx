import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Breadcrumb } from '@/components/Breadcrumb'
import { BulletList } from '@/components/BulletList'
import { DefinitionBlock } from '@/components/DefinitionBlock'
import { DiagramFrame } from '@/components/DiagramFrame'
import { Lightbox } from '@/components/Lightbox'
import { Notice } from '@/components/Notice'
import { Seo } from '@/components/Seo'
import { architecture } from '@/data/architecture'
import { useConfig } from '@/hooks/useConfig'
import NotFoundPage from '@/pages/NotFoundPage'
import { breadcrumbJsonLd } from '@/utils/seo'

export default function ArchitectureDetailPage() {
  const { slug } = useParams()
  const item = architecture.find((entry) => entry.slug === slug)
  const { siteUrl } = useConfig()
  const [open, setOpen] = useState(false)
  if (!item) return <NotFoundPage />

  return (
    <>
      <Seo
        title={item.title}
        description={item.summary}
        path={`/architecture/${item.slug}`}
        jsonLd={[
          breadcrumbJsonLd(siteUrl, [
            { name: 'Home', path: '/' },
            { name: 'Architecture', path: '/architecture' },
            { name: item.title, path: `/architecture/${item.slug}` },
          ]),
        ]}
      />
      <article className="mx-auto max-w-6xl px-5 py-14">
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Architecture', to: '/architecture' },
            { label: item.title },
          ]}
        />
        <p className="kicker">{item.topic}</p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink">{item.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{item.summary}</p>
        <div className="mt-6">
          <Notice>Generic reference architecture. It does not describe a customer network or a confidential design.</Notice>
        </div>
        <div className="mt-8">
          <DiagramFrame title={item.title} spec={item.diagram} image={item.image} onExpand={() => setOpen(true)} />
          <p className="mt-2 text-sm text-muted">Select the diagram to open it full screen. Replace it later by setting an image path in the architecture data.</p>
        </div>
        <DefinitionBlock title="Context">
          <p>{item.context}</p>
        </DefinitionBlock>
        <DefinitionBlock title="Approach">
          <p>{item.approach}</p>
        </DefinitionBlock>
        <DefinitionBlock title="Components">
          <BulletList items={item.components} />
        </DefinitionBlock>
        <DefinitionBlock title="Considerations">
          <BulletList items={item.considerations} />
        </DefinitionBlock>
      </article>
      <Lightbox open={open} title={item.title} onClose={() => setOpen(false)}>
        <DiagramFrame title={item.title} spec={item.diagram} image={item.image} />
      </Lightbox>
    </>
  )
}
