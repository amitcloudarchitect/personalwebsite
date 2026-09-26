import { Button } from '@/components/Button'
import { Portrait } from '@/components/Portrait'
import { experience } from '@/data/experience'
import { profile } from '@/data/profile'

export function Hero() {
  const current = experience.find((item) => item.current && !item.placeholder)

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 grid-fade lg:block" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:py-28">
        <div>
          <p className="kicker">{profile.role}</p>
          <h1 className="mt-3 font-display text-6xl font-medium tracking-tight text-ink sm:text-7xl">{profile.name}</h1>
          <div className="mt-6 h-px w-16 bg-rule" aria-hidden="true" />
          <p className="mt-4 text-lg text-ink">{profile.disciplines.join(' · ')}</p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">{profile.heroMessage}</p>
          {current ? (
            <p className="mt-4 text-sm text-ink">
              {current.role} · {current.organization}
            </p>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button to="/projects">Explore My Work</Button>
            <Button to="/architecture" variant="secondary">
              View Architecture Projects
            </Button>
            <Button to="/articles" variant="secondary">
              Read Articles
            </Button>
            <Button to="/contact" variant="secondary">
              Connect
            </Button>
          </div>
        </div>
        <Portrait />
      </div>
    </section>
  )
}
