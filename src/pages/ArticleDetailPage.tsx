import { useParams } from 'react-router-dom'
import { Breadcrumb } from '@/components/Breadcrumb'
import { CommentSection } from '@/components/CommentSection'
import { NewsletterForm } from '@/components/NewsletterForm'
import { MarkdownBody } from '@/components/MarkdownBody'
import { Notice } from '@/components/Notice'
import { Seo } from '@/components/Seo'
import { StatusPill } from '@/components/StatusPill'
import { TechnologyBadge } from '@/components/TechnologyBadge'
import { articles } from '@/data/articles'
import { useConfig } from '@/hooks/useConfig'
import NotFoundPage from '@/pages/NotFoundPage'
import { getArticleBody } from '@/utils/articles'
import { breadcrumbJsonLd } from '@/utils/seo'

export default function ArticleDetailPage() {
  const { slug } = useParams()
  const article = articles.find((item) => item.slug === slug && item.source === 'internal')
  const { siteUrl } = useConfig()
  if (!article) return <NotFoundPage />

  const body = getArticleBody(article.slug)

  return (
    <>
      <Seo
        title={article.title}
        description={article.description}
        path={`/articles/${article.slug}`}
        type="article"
        noindex={article.placeholder}
        jsonLd={[
          breadcrumbJsonLd(siteUrl, [
            { name: 'Home', path: '/' },
            { name: 'Articles', path: '/articles' },
            { name: article.title, path: `/articles/${article.slug}` },
          ]),
        ]}
      />
      <article className="mx-auto max-w-3xl px-5 py-14">
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Articles', to: '/articles' },
            { label: article.title },
          ]}
        />
        <div className="flex flex-wrap gap-2">
          <TechnologyBadge>{article.category}</TechnologyBadge>
          {article.placeholder ? <StatusPill dashed>Placeholder</StatusPill> : null}
        </div>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-ink">{article.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{article.description}</p>
        <p className="mt-3 text-sm text-muted">
          {article.date ?? 'Date to be added'}
          {article.readingTime ? ` · ${article.readingTime}` : ''}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <li key={tag}>
              <TechnologyBadge>{tag}</TechnologyBadge>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          {body ? <MarkdownBody content={body} /> : <Notice>Article content has not been added yet.</Notice>}
        </div>
        <CommentSection slug={article.slug} />
        <div className="mt-16 border-t border-line pt-10">
          <NewsletterForm compact />
        </div>
      </article>
    </>
  )
}
