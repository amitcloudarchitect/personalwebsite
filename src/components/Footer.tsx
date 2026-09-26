import { Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NewsletterForm } from '@/components/NewsletterForm'
import { GitHubIcon, LinkedInIcon, MediumIcon, YouTubeIcon } from '@/components/SocialIcons'
import { profile } from '@/data/profile'
import { navigation } from '@/data/site'
import { useConfig } from '@/hooks/useConfig'
import { safeHttpUrl, safeMailto } from '@/utils/urls'

export function Footer() {
  const config = useConfig()
  const links = [
    { label: 'LinkedIn', href: safeHttpUrl(config.linkedin), icon: <LinkedInIcon className="h-4 w-4" /> },
    { label: 'GitHub', href: safeHttpUrl(config.github), icon: <GitHubIcon className="h-4 w-4" /> },
    { label: 'YouTube', href: safeHttpUrl(config.youtube), icon: <YouTubeIcon className="h-4 w-4" /> },
    { label: 'Medium', href: safeHttpUrl(config.medium), icon: <MediumIcon className="h-4 w-4" /> },
    { label: 'Email', href: safeMailto(config.email), icon: <Mail className="h-4 w-4" aria-hidden="true" /> },
  ].filter((item) => item.href)
  const pending = [config.youtube ? '' : 'YouTube', config.medium ? '' : 'Medium'].filter(Boolean)

  const explore = navigation.slice(0, 6)
  const knowledge = navigation.slice(6)

  return (
    <footer className="border-t border-line">
      <div className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <NewsletterForm />
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-sm font-medium text-ink">{profile.name}</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{profile.positioning}</p>
          {links.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-3">
              {links.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="inline-flex items-center gap-2 text-sm text-ink"
                    {...(item.href?.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    {item.icon}
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted">Professional links can be added in the site configuration.</p>
          )}
          {pending.length > 0 ? (
            <p className="mt-3 text-sm text-muted">{pending.join(' and ')} will be linked when those channels are ready.</p>
          ) : null}
        </div>
        <nav aria-label="Footer explore">
          <p className="font-display text-lg text-ink">Explore</p>
          <ul className="mt-3 space-y-2">
            {explore.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-sm text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Footer knowledge">
          <p className="font-display text-lg text-ink">Knowledge</p>
          <ul className="mt-3 space-y-2">
            {knowledge.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-sm text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-5 py-4 text-sm text-muted">© {new Date().getFullYear()} {profile.name}</p>
      </div>
    </footer>
  )
}
