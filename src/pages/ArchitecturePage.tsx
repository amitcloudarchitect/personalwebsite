import { useMemo, useState } from 'react'
import { ArchitectureCard } from '@/components/ArchitectureCard'
import { PageIntro } from '@/components/PageIntro'
import { Seo } from '@/components/Seo'
import { architecture } from '@/data/architecture'

export default function ArchitecturePage() {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return architecture
    return architecture.filter((item) =>
      [item.title, item.topic, item.summary, ...item.components].join(' ').toLowerCase().includes(needle),
    )
  }, [query])

  return (
    <>
      <Seo
        title="Architecture gallery"
        description="Architecture diagrams and explanations for hybrid cloud, multi-cloud, AI platforms, RAG, landing zones, migration, disaster recovery, AKS, networking, identity, data, and operations."
        path="/architecture"
      />
      <PageIntro
        eyebrow="Architecture"
        title="Architecture Gallery"
        lede="Reference diagrams for recurring enterprise patterns. Open a diagram to read the design. Customer networks are not shown."
      >
        <label className="block max-w-md text-sm text-muted" htmlFor="architecture-filter">
          Filter diagrams
          <input
            id="architecture-filter"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mt-2 w-full border border-line bg-surface px-3 py-2 text-ink"
            placeholder="RAG, AKS, disaster recovery"
          />
        </label>
      </PageIntro>
      <div className="mx-auto grid max-w-6xl gap-4 px-5 py-12 md:grid-cols-2">
        {filtered.map((item) => (
          <ArchitectureCard key={item.id} item={item} />
        ))}
      </div>
    </>
  )
}
