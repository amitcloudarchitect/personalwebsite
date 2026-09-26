import { useState } from 'react'
import { PageIntro } from '@/components/PageIntro'
import { Seo } from '@/components/Seo'
import { VideoCard } from '@/components/VideoCard'
import { videos } from '@/data/videos'

function isYoutubeId(value?: string) {
  return Boolean(value && /^[\w-]{6,}$/.test(value))
}

export default function VideosPage() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = videos.find((video) => video.id === activeId && isYoutubeId(video.youtubeId))

  return (
    <>
      <Seo
        title="Videos"
        description="Talks and technical videos by Amit Kumar. Placeholder entries are shown until real YouTube, LinkedIn, or external links are added."
        path="/videos"
      />
      <PageIntro
        eyebrow="Videos"
        title="Talks and walkthroughs"
        lede="YouTube, LinkedIn, and other video links are configured in the video data. Playback appears only after a real video ID or URL is added."
      />
      {active?.youtubeId ? (
        <div className="mx-auto max-w-6xl px-5 pt-8">
          <div className="aspect-video border border-line bg-ink">
            <iframe
              title={active.title}
              src={`https://www.youtube-nocookie.com/embed/${active.youtubeId}`}
              className="h-full w-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}
      <div className="mx-auto grid max-w-6xl gap-4 px-5 py-12 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onPlay={() => setActiveId(video.id)} />
        ))}
      </div>
    </>
  )
}
