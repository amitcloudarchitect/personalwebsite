import { LabCard } from '@/components/LabCard'
import { PageIntro } from '@/components/PageIntro'
import { Seo } from '@/components/Seo'
import { aiLab } from '@/data/aiLab'

export default function AiLabPage() {
  return (
    <>
      <Seo
        title="AI and Innovation Lab"
        description="Experiments and architecture work on generative AI, RAG, agents, MCP, and AI-assisted cloud operations."
        path="/ai-lab"
      />
      <PageIntro
        eyebrow="Lab"
        title="AI & Innovation Lab"
        lede="Experiments, prototypes, and architecture sketches. Each card carries a status so a concept is not mistaken for a finished platform."
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-5 py-12 md:grid-cols-2">
        {aiLab.map((item) => (
          <LabCard key={item.id} item={item} />
        ))}
      </div>
    </>
  )
}
