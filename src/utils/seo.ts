import { profile } from '@/data/profile'
import type { SiteConfig } from '@/types'
import { safeHttpUrl } from '@/utils/urls'

export function personJsonLd(config: SiteConfig) {
  const sameAs = [config.linkedin, config.github, config.youtube].map((value) => safeHttpUrl(value)).filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    description: profile.supportingStatement,
    knowsAbout: [
      'Enterprise architecture',
      'Cloud architecture',
      'Microsoft Azure',
      'Amazon Web Services',
      'Artificial intelligence',
      'Generative AI',
      'Cloud operations',
      'FinOps',
      'Platform engineering',
    ],
    ...(config.siteUrl ? { url: config.siteUrl } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  }
}

export function websiteJsonLd(config: SiteConfig) {
  if (!config.siteUrl) return undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${profile.name} · Enterprise Architect`,
    url: config.siteUrl,
    description: profile.supportingStatement,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${config.siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbJsonLd(siteUrl: string, items: { name: string; path: string }[]) {
  if (!siteUrl) return undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  }
}
