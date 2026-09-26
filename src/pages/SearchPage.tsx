import { Link, useSearchParams } from 'react-router-dom'
import { PageIntro } from '@/components/PageIntro'
import { Seo } from '@/components/Seo'
import { StatusPill } from '@/components/StatusPill'
import { searchPortfolio } from '@/utils/search'

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const results = searchPortfolio(query)

  return (
    <>
      <Seo title="Search" description="Search Amit Kumar's projects, articles, solutions, videos, certifications, and architecture patterns." path="/search" noindex />
      <PageIntro eyebrow="Search" title="Search the portfolio" lede="Look across projects, articles, solutions, videos, certifications, and architecture patterns.">
        <label className="block max-w-xl text-sm text-muted" htmlFor="search-page-query">
          Query
          <input
            id="search-page-query"
            value={query}
            onChange={(event) => {
              const next = event.target.value
              setParams(next ? { q: next } : {}, { replace: true })
            }}
            className="mt-2 w-full border border-line bg-surface px-3 py-2 text-base text-ink"
            placeholder="Azure, AWS, AI, RAG, DR, Kubernetes, FinOps"
          />
        </label>
      </PageIntro>
      <div className="mx-auto max-w-6xl px-5 py-10">
        {query.trim().length < 2 ? <p className="text-muted">Enter at least two characters.</p> : null}
        {query.trim().length >= 2 && results.length === 0 ? <p className="text-muted">No matching work for that search.</p> : null}
        <ul className="divide-y divide-line border-y border-line">
          {results.map((result) => (
            <li key={`${result.kind}-${result.id}`}>
              <Link to={result.href} className="block py-5">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="kicker">{result.kind}</span>
                  {result.placeholder ? <StatusPill dashed>Placeholder</StatusPill> : null}
                </span>
                <span className="mt-1 block text-lg text-ink">{result.title}</span>
                <span className="mt-1 block text-sm text-muted">{result.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
