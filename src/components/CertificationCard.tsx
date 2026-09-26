import { StatusPill } from '@/components/StatusPill'
import { TechnologyBadge } from '@/components/TechnologyBadge'
import type { Certification } from '@/types'
import { safeHttpUrl } from '@/utils/urls'

function initials(value: string) {
  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function CertificationCard({ certification }: { certification: Certification }) {
  const badge = safeHttpUrl(certification.badge)
  const credential = safeHttpUrl(certification.credentialUrl)

  return (
    <article className={`flex h-full flex-col border bg-surface p-5 ${certification.placeholder ? 'border-dashed border-line' : 'border-line'}`}>
      <div className="flex items-start gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center border border-line bg-canvas">
          {badge ? (
            <img src={badge} alt="" className="h-full w-full object-contain" loading="lazy" decoding="async" />
          ) : (
            <span className="font-medium tracking-wide text-ink" aria-hidden="true">
              {initials(certification.issuer)}
            </span>
          )}
        </div>
        <div>
          <TechnologyBadge>{certification.category}</TechnologyBadge>
          {certification.placeholder ? (
            <div className="mt-2">
              <StatusPill dashed>Placeholder</StatusPill>
            </div>
          ) : null}
        </div>
      </div>
      <h3 className="mt-4 text-lg text-ink">{certification.name}</h3>
      <p className="mt-1 text-sm text-muted">{certification.issuer}</p>
      <p className="mt-3 kicker">
        {certification.issueDate ?? 'Issue date to be added'}
      </p>
      {certification.note ? <p className="mt-3 text-sm leading-relaxed text-muted">{certification.note}</p> : null}
      {credential ? (
        <a href={credential} className="mt-4 text-sm text-accent" target="_blank" rel="noreferrer">
          View credential
        </a>
      ) : null}
    </article>
  )
}
