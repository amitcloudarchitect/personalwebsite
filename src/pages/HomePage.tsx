import { ArchitectureCard } from '@/components/ArchitectureCard'
import { ArticleCard } from '@/components/ArticleCard'
import { Button } from '@/components/Button'
import { CertificationCard } from '@/components/CertificationCard'
import { Hero } from '@/components/Hero'
import { Icon } from '@/components/Icon'
import { LabCard } from '@/components/LabCard'
import { ProjectCard } from '@/components/ProjectCard'
import { Reveal } from '@/components/Reveal'
import { SectionHeader } from '@/components/SectionHeader'
import { Seo } from '@/components/Seo'
import { Timeline } from '@/components/Timeline'
import { achievements } from '@/data/achievements'
import { aiLab } from '@/data/aiLab'
import { architecture } from '@/data/architecture'
import { articles } from '@/data/articles'
import { certifications } from '@/data/certifications'
import { connectTopics } from '@/data/site'
import { focusAreas } from '@/data/focus'
import { profile } from '@/data/profile'
import { projects } from '@/data/projects'
import { timeline } from '@/data/timeline'
import { personJsonLd, websiteJsonLd } from '@/utils/seo'
import { useConfig } from '@/hooks/useConfig'

export default function HomePage() {
  const config = useConfig()
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 3)
  const featuredArchitecture = architecture.filter((item) => item.featured).slice(0, 4)
  const knownCertification = certifications.find((item) => !item.placeholder)

  return (
    <>
      <Seo
        title={profile.name}
        description="Amit Kumar is an Enterprise Architect and technology strategist working across cloud, AI, automation, and enterprise platforms."
        path="/"
        jsonLd={[personJsonLd(config), websiteJsonLd(config)]}
      />
      <Hero />

      <section className="border-b border-line" aria-labelledby="focus-heading">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <SectionHeader
              id="focus-heading"
              eyebrow="Technology focus"
              title="What I specialize in"
              description="Architecture and operating concerns across cloud, AI, and enterprise platforms."
              to="/about"
              action="View the technology radar"
            />
            <ul className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {focusAreas.map((area) => (
                <li key={area.name} className="bg-surface p-5">
                  <Icon name={area.icon} className="h-5 w-5 text-accent" />
                  <h3 className="mt-3 text-base text-ink">{area.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{area.summary}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <SectionHeader eyebrow="Profile" title="Who I am" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
              {profile.about.slice(0, 2).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Button to="/about" variant="secondary" className="mt-6">
              Read the profile
            </Button>
          </Reveal>
          <Reveal>
            <p className="kicker">Recorded so far</p>
            <ul className="mt-4 space-y-5">
              {achievements.map((item) => (
                <li key={item.id}>
                  <h2 className="text-xl text-ink">{item.title}</h2>
                  <p className="mt-2 leading-relaxed text-muted">{item.description}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <SectionHeader
              eyebrow="Architecture and projects"
              title="What I have designed"
              description="Selected platform and architecture work. Customer-specific details are omitted."
              to="/projects"
              action="All projects"
            />
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <SectionHeader
              eyebrow="AI and innovation"
              title="AI & Innovation Lab"
              description="Concepts and prototypes. Status labels describe design maturity, not production claims."
              to="/ai-lab"
              action="Open the lab"
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {aiLab.slice(0, 4).map((item) => (
                <LabCard key={item.id} item={item} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <SectionHeader
              eyebrow="Featured architecture"
              title="Reference patterns"
              description="Sanitized diagrams for hybrid cloud, AI, recovery, and operations."
              to="/architecture"
              action="Architecture gallery"
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {featuredArchitecture.map((item) => (
                <ArchitectureCard key={item.id} item={item} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <SectionHeader
              eyebrow="Articles and knowledge"
              title="Writing"
              description="Placeholder cards mark entries that are not yet published."
              to="/articles"
              action="All articles"
            />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {articles.slice(0, 3).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2">
          <Reveal>
            <SectionHeader eyebrow="Certifications" title="Credentials" to="/certifications" action="Certification gallery" />
            <div className="mt-6">{knownCertification ? <CertificationCard certification={knownCertification} /> : null}</div>
          </Reveal>
          <Reveal>
            <SectionHeader eyebrow="Community" title="Speaking and knowledge sharing" to="/speaking" action="Speaking and events" />
            <p className="mt-4 leading-relaxed text-muted">
              Architecture sessions, customer workshops, and technical briefings are part of the work. Confirmed talks and events will be listed as they are ready to publish.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <SectionHeader eyebrow="Professional journey" title="Timeline" to="/experience" action="Full experience" />
            <div className="mt-8">
              <Timeline
                items={timeline.slice(0, 4).map((entry) => ({
                  id: entry.id,
                  label: entry.label,
                  title: entry.title,
                  description: entry.description,
                  href: entry.href,
                }))}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-accent text-accent-fg">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker">Connect</p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight">Let&apos;s Connect</h2>
            <p className="mt-3 max-w-xl leading-relaxed opacity-90">
              Conversations on {connectTopics.slice(0, -1).join(', ')}, and {connectTopics[connectTopics.length - 1].toLowerCase()}.
            </p>
          </div>
          <Button to="/contact" variant="inverted">
            Connect
          </Button>
        </div>
      </section>
    </>
  )
}
