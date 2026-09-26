import { Mail } from 'lucide-react'
import { Button } from '@/components/Button'
import { GitHubIcon, LinkedInIcon, YouTubeIcon } from '@/components/SocialIcons'
import { PageIntro } from '@/components/PageIntro'
import { Seo } from '@/components/Seo'
import { connectTopics } from '@/data/site'
import { useConfig } from '@/hooks/useConfig'
import { safeHttpUrl, safeMailto } from '@/utils/urls'

export default function ContactPage() {
  const config = useConfig()
  const channels = [
    { label: 'LinkedIn', href: safeHttpUrl(config.linkedin), icon: <LinkedInIcon className="h-4 w-4" /> },
    { label: 'GitHub', href: safeHttpUrl(config.github), icon: <GitHubIcon className="h-4 w-4" /> },
    { label: 'YouTube', href: safeHttpUrl(config.youtube), icon: <YouTubeIcon className="h-4 w-4" /> },
    { label: 'Email', href: safeMailto(config.email), icon: <Mail className="h-4 w-4" aria-hidden="true" /> },
  ].filter((item) => item.href)
  const resume = safeHttpUrl(config.resumeUrl)

  return (
    <>
      <Seo
        title="Connect"
        description="Connect with Amit Kumar on enterprise architecture, cloud transformation, AI architecture, technology strategy, speaking, and knowledge sharing."
        path="/contact"
      />
      <PageIntro
        eyebrow="Contact"
        title="Let's Connect"
        lede="I welcome conversations on enterprise architecture, cloud transformation, AI architecture, technology strategy, speaking, and knowledge sharing."
      />
      <div className="mx-auto max-w-6xl px-5 py-14">
        <ul className="flex flex-wrap gap-2">
          {connectTopics.map((topic) => (
            <li key={topic} className="border border-line bg-surface px-3 py-2 text-sm text-ink">
              {topic}
            </li>
          ))}
        </ul>
        {channels.length > 0 ? (
          <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {channels.map((channel) => (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  className="inline-flex items-center gap-2 border border-line bg-surface px-4 py-3 text-sm text-ink"
                  {...(channel.href?.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  {channel.icon}
                  {channel.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 max-w-xl text-muted">
            Direct links are added through environment variables or `public/config.json`. Until then, this page stays free of placeholder profile URLs.
          </p>
        )}
        {resume ? (
          <div className="mt-8">
            <Button href={resume} variant="secondary">
              Download resume
            </Button>
          </div>
        ) : null}
      </div>
    </>
  )
}
