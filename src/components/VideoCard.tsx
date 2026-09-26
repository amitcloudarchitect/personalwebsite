import { StatusPill } from '@/components/StatusPill'
import { TechnologyBadge } from '@/components/TechnologyBadge'
import type { VideoItem } from '@/types'
import { safeHttpUrl } from '@/utils/urls'

const platformLabel = {
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  external: 'External',
}

type VideoCardProps = {
  video: VideoItem
  onPlay?: () => void
}

export function VideoCard({ video, onPlay }: VideoCardProps) {
  const url = safeHttpUrl(video.url)
  const thumbnail = safeHttpUrl(video.thumbnail)
  const canPlay = Boolean(video.youtubeId) && !video.placeholder

  return (
    <article className={`flex h-full flex-col border bg-surface p-5 ${video.placeholder ? 'border-dashed border-line' : 'border-line'}`}>
      <div className="flex aspect-video items-center justify-center border border-line bg-canvas">
        {thumbnail ? (
          <img src={thumbnail} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
        ) : (
          <p className="kicker">{platformLabel[video.platform]}</p>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <TechnologyBadge>{platformLabel[video.platform]}</TechnologyBadge>
        {video.placeholder ? <StatusPill dashed>Placeholder</StatusPill> : null}
      </div>
      <h3 className="mt-3 text-xl text-ink">{video.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{video.description}</p>
      <p className="mt-3 kicker">{video.date ?? 'Date to be added'}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {video.tags.map((tag) => (
          <li key={tag}>
            <TechnologyBadge>{tag}</TechnologyBadge>
          </li>
        ))}
      </ul>
      {canPlay && onPlay ? (
        <button type="button" onClick={onPlay} className="mt-4 text-left text-sm text-accent">
          Play video
        </button>
      ) : null}
      {url && !video.placeholder ? (
        <a href={url} className="mt-4 text-sm text-accent" target="_blank" rel="noreferrer">
          Open video
        </a>
      ) : null}
    </article>
  )
}
