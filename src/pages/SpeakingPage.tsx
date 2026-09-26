import { PageIntro } from '@/components/PageIntro'
import { Seo } from '@/components/Seo'
import { StatusPill } from '@/components/StatusPill'
import { events } from '@/data/events'
import { safeHttpUrl } from '@/utils/urls'

export default function SpeakingPage() {
  return (
    <>
      <Seo
        title="Speaking and events"
        description="Speaking, workshops, and community sessions. Placeholder entries show the format until real events are added."
        path="/speaking"
      />
      <PageIntro
        eyebrow="Speaking"
        title="Speaking & Events"
        lede="Conference talks, customer workshops, architecture sessions, webinars, panels, and training can be listed here. Nothing on this page is a confirmed event until the placeholder flag is removed."
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-5 py-12">
        {events.map((event) => {
          const presentation = safeHttpUrl(event.presentationUrl)
          const video = safeHttpUrl(event.videoUrl)
          return (
            <article key={event.id} className={`border bg-surface p-5 ${event.placeholder ? 'border-dashed border-line' : 'border-line'}`}>
              <div className="flex flex-wrap gap-2">
                <StatusPill>{event.type}</StatusPill>
                {event.placeholder ? <StatusPill dashed>Placeholder</StatusPill> : null}
              </div>
              <h2 className="mt-4 text-2xl text-ink">{event.event}</h2>
              <p className="mt-1 text-muted">{event.topic}</p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="kicker">Role</dt>
                  <dd className="mt-1 text-ink">{event.role}</dd>
                </div>
                <div>
                  <dt className="kicker">Date</dt>
                  <dd className="mt-1 text-ink">{event.date ?? 'Date to be added'}</dd>
                </div>
                <div>
                  <dt className="kicker">Location</dt>
                  <dd className="mt-1 text-ink">{event.location ?? 'Location to be added'}</dd>
                </div>
              </dl>
              <p className="mt-4 max-w-3xl leading-relaxed text-muted">{event.description}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                {presentation ? (
                  <a href={presentation} className="text-accent" target="_blank" rel="noreferrer">
                    Presentation
                  </a>
                ) : null}
                {video ? (
                  <a href={video} className="text-accent" target="_blank" rel="noreferrer">
                    Video
                  </a>
                ) : null}
              </div>
              {event.photos && event.photos.length > 0 ? (
                <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                  {event.photos.map((photo) => {
                    const src = safeHttpUrl(photo)
                    if (!src) return null
                    return (
                      <li key={src}>
                        <img src={src} alt="" className="aspect-video w-full border border-line object-cover" loading="lazy" decoding="async" />
                      </li>
                    )
                  })}
                </ul>
              ) : null}
            </article>
          )
        })}
      </div>
    </>
  )
}
