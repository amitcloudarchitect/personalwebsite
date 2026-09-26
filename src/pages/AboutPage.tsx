import { PageIntro } from '@/components/PageIntro'
import { Seo } from '@/components/Seo'
import { TechnologyBadge } from '@/components/TechnologyBadge'
import { TechnologyRadar } from '@/components/TechnologyRadar'
import { achievements } from '@/data/achievements'
import { profile } from '@/data/profile'

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About"
        description="Amit Kumar is an Enterprise Architect focused on cloud architecture, AI, modernization, FinOps, SecOps, and platform engineering."
        path="/about"
      />
      <PageIntro
        eyebrow="Profile"
        title="Enterprise architecture, practiced close to the platform"
        lede={profile.supportingStatement}
      />
      <div className="mx-auto max-w-6xl space-y-16 px-5 py-14">
        <div className="max-w-3xl space-y-4 text-base leading-relaxed text-muted">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <section>
          <h2 className="font-display text-3xl font-medium tracking-tight text-ink">How the work is approached</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {profile.approach.map((item) => (
              <article key={item.title} className="border border-line bg-surface p-5">
                <h3 className="text-lg text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-3xl font-medium tracking-tight text-ink">Domains</h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {profile.domains.map((domain) => (
              <li key={domain}>
                <TechnologyBadge>{domain}</TechnologyBadge>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-3xl font-medium tracking-tight text-ink">Technology radar</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Areas of practice across architecture, build, AI, and operations. These are not numeric skill ratings.
          </p>
          <div className="mt-6">
            <TechnologyRadar />
          </div>
        </section>

        <section>
          <h2 className="font-display text-3xl font-medium tracking-tight text-ink">Achievements</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {achievements.map((item) => (
              <article key={item.id} className="border border-line bg-surface p-5">
                <p className="kicker">{item.label}</p>
                <h3 className="mt-2 text-lg text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
