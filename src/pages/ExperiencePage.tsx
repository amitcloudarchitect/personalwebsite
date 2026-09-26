import { PageIntro } from '@/components/PageIntro'
import { Seo } from '@/components/Seo'
import { Timeline } from '@/components/Timeline'
import { experience } from '@/data/experience'
import { timeline } from '@/data/timeline'

export default function ExperiencePage() {
  return (
    <>
      <Seo
        title="Experience"
        description="Professional experience of Amit Kumar, Enterprise Architect at Getronics, with previous technology leadership at Tekrosta Cloud."
        path="/experience"
      />
      <PageIntro
        eyebrow="Experience"
        title="Professional journey"
        lede="Roles are listed from the portfolio data. Dates and metrics are shown only when they have been added."
      />
      <div className="mx-auto max-w-6xl space-y-16 px-5 py-14">
        <section>
          <h2 className="font-display text-3xl font-medium tracking-tight text-ink">Roles</h2>
          <div className="mt-8">
            <Timeline
              items={experience.map((item) => ({
                id: item.id,
                label: item.periodLabel,
                title: item.role,
                subtitle: item.organization,
                description: item.note ? `${item.summary} ${item.note}` : item.summary,
                tags: item.focusAreas,
                current: item.current,
                placeholder: item.placeholder,
              }))}
            />
          </div>
        </section>
        <section>
          <h2 className="font-display text-3xl font-medium tracking-tight text-ink">Timeline</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Career, certification, project, and milestone entries from the timeline data file.
          </p>
          <div className="mt-8">
            <Timeline
              items={timeline.map((item) => ({
                id: item.id,
                label: item.label,
                title: item.title,
                description: item.description,
                href: item.href,
              }))}
            />
          </div>
        </section>
      </div>
    </>
  )
}
