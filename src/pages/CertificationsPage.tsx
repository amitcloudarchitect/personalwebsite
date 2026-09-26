import { useMemo, useState } from 'react'
import { CertificationCard } from '@/components/CertificationCard'
import { FilterBar } from '@/components/FilterBar'
import { PageIntro } from '@/components/PageIntro'
import { Seo } from '@/components/Seo'
import { certifications } from '@/data/certifications'

export default function CertificationsPage() {
  const categories = ['All', ...Array.from(new Set(certifications.map((item) => item.category)))]
  const [category, setCategory] = useState('All')
  const filtered = useMemo(
    () => (category === 'All' ? certifications : certifications.filter((item) => item.category === category)),
    [category],
  )

  return (
    <>
      <Seo
        title="Certifications"
        description="Certifications held by Amit Kumar, including Claude Certified Architect – Foundations. Other cards are placeholders for credentials not yet added."
        path="/certifications"
      />
      <PageIntro
        eyebrow="Certifications"
        title="Certification gallery"
        lede="Only credentials that have been recorded are shown as held. Dashed cards are empty slots for Microsoft, AWS, AI, architecture, and Kubernetes certifications."
      >
        <FilterBar label="Filter certifications" options={categories} value={category} onChange={setCategory} />
      </PageIntro>
      <div className="mx-auto grid max-w-6xl gap-4 px-5 py-12 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((certification) => (
          <CertificationCard key={certification.id} certification={certification} />
        ))}
      </div>
    </>
  )
}
