import { Link } from 'react-router-dom'
import { StatusPill } from '@/components/StatusPill'
import { TechnologyBadge } from '@/components/TechnologyBadge'
import type { Article } from '@/types'
import { safeHttpUrl } from '@/utils/urls'

export function ArticleCard({ article }: { article: Article }) {
  const external = article.source === 'external' ? safeHttpUrl(article.externalUrl) : undefined
  const className = 'flex h-full flex-col border border-line bg-surface p-5 transition-colors hover:border-accent'
  const body = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <TechnologyBadge>{article.category}</TechnologyBadge>
        {article.placeholder ? <StatusPill dashed>Placeholder</StatusPill> : null}
        <StatusPill>{article.source === 'external' ? 'External' : 'Internal'}</StatusPill>
      </div>
      <h3 className="mt-4 text-xl text-ink">{article.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{article.description}</p>
      <p className="mt-4 kicker">
        {article.date ?? 'Date to be added'}
        {article.readingTime ? ` · ${article.readingTime}` : ''}
      </p>
    </>
  )

  if (external) {
    return (
      <a href={external} className={className} target="_blank" rel="noreferrer">
        {body}
      </a>
    )
  }

  if (article.source === 'external') {
    return <article className={`${className} border-dashed`}>{body}</article>
  }

  return (
    <Link to={`/articles/${article.slug}`} className={article.placeholder ? `${className} border-dashed` : className}>
      {body}
    </Link>
  )
}
