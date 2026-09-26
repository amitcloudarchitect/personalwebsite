import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FilterBar } from '@/components/FilterBar'
import { PageIntro } from '@/components/PageIntro'
import { Seo } from '@/components/Seo'
import { solutions } from '@/data/solutions'

export default function SolutionsPage() {
  const domains = ['All', ...Array.from(new Set(solutions.map((solution) => solution.domain)))]
  const [domain, setDomain] = useState('All')
  const filtered = useMemo(
    () => (domain === 'All' ? solutions : solutions.filter((solution) => solution.domain === domain)),
    [domain],
  )

  return (
    <>
      <Seo
        title="Solutions and architecture patterns"
        description="Reusable enterprise architecture patterns for cloud migration, disaster recovery, hybrid connectivity, identity, FinOps, SecOps, Kubernetes, and AI."
        path="/solutions"
      />
      <PageIntro
        eyebrow="Solutions"
        title="Solutions & Architecture Patterns"
        lede="Reference patterns for problems that show up repeatedly in enterprise cloud and AI work. They are not customer case studies."
      >
        <FilterBar label="Filter by domain" options={domains} value={domain} onChange={setDomain} />
      </PageIntro>
      <div className="mx-auto grid max-w-6xl gap-4 px-5 py-12 md:grid-cols-2">
        {filtered.map((solution) => (
          <Link key={solution.id} to={`/solutions/${solution.slug}`} className="border border-line bg-surface p-5 transition-colors hover:border-accent">
            <p className="kicker">{solution.domain}</p>
            <h2 className="mt-2 text-xl text-ink">{solution.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{solution.summary}</p>
          </Link>
        ))}
      </div>
    </>
  )
}
