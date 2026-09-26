import { Helmet } from 'react-helmet-async'
import { profile } from '@/data/profile'
import { useConfig } from '@/hooks/useConfig'
import { absoluteUrl } from '@/utils/urls'

type SeoProps = {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  noindex?: boolean
  jsonLd?: Array<Record<string, unknown> | undefined>
}

export function Seo({ title, description, path, type = 'website', noindex = false, jsonLd = [] }: SeoProps) {
  const { siteUrl } = useConfig()
  const fullTitle = path === '/' ? `${profile.name} · Enterprise Architect` : `${title} · ${profile.name}`
  const url = absoluteUrl(siteUrl, path)
  const image = absoluteUrl(siteUrl, '/og.svg')
  const schemas = jsonLd.filter((item): item is Record<string, unknown> => Boolean(item))

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex ? <meta name="robots" content="noindex" /> : <meta name="robots" content="index,follow" />}
      {url ? <link rel="canonical" href={url} /> : null}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {url ? <meta property="og:url" content={url} /> : null}
      {image ? <meta property="og:image" content={image} /> : null}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image ? <meta name="twitter:image" content={image} /> : null}
      {schemas.map((schema) => (
        <script key={JSON.stringify(schema).slice(0, 80)} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
