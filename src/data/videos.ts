import type { VideoItem } from '@/types'

/**
 * Add a real url or youtubeId before expecting playback.
 * YouTube embeds are used only when youtubeId is set.
 */
export const videos: VideoItem[] = [
  {
    id: 'placeholder-youtube',
    title: 'Placeholder: YouTube video',
    description:
      'Template for a YouTube talk or walkthrough. Add the video ID to enable the embedded player.',
    platform: 'youtube',
    tags: ['Cloud', 'Architecture'],
    placeholder: true,
  },
  {
    id: 'placeholder-linkedin',
    title: 'Placeholder: LinkedIn video',
    description: 'Template for a LinkedIn video. Add the public URL when the video is ready.',
    platform: 'linkedin',
    tags: ['AI', 'Cloud Operations'],
    placeholder: true,
  },
  {
    id: 'placeholder-external',
    title: 'Placeholder: external video',
    description: 'Template for a video hosted on another platform. Add the URL when it is public.',
    platform: 'external',
    tags: ['Azure', 'AWS'],
    placeholder: true,
  },
]
