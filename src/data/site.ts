import type { NavItem, SiteConfig } from '@/types'

function envString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export const navigation: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Experience', to: '/experience' },
  { label: 'Projects', to: '/projects' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'AI Lab', to: '/ai-lab' },
  { label: 'Articles', to: '/articles' },
  { label: 'Videos', to: '/videos' },
  { label: 'Certifications', to: '/certifications' },
  { label: 'Speaking', to: '/speaking' },
  { label: 'Architecture', to: '/architecture' },
  { label: 'Contact', to: '/contact' },
]

export const defaultConfig: SiteConfig = {
  siteUrl: envString(import.meta.env.VITE_SITE_URL).replace(/\/$/, '') || 'https://amitkumarportfolio.com',
  linkedin: envString(import.meta.env.VITE_LINKEDIN_URL) || 'https://www.linkedin.com/in/amitusit/',
  github: envString(import.meta.env.VITE_GITHUB_URL) || 'https://github.com/amitcloudarchitect',
  email: envString(import.meta.env.VITE_EMAIL),
  youtube: envString(import.meta.env.VITE_YOUTUBE_URL),
  medium: envString(import.meta.env.VITE_MEDIUM_URL),
  resumeUrl: envString(import.meta.env.VITE_RESUME_URL),
}

export const connectTopics = [
  'Enterprise Architecture',
  'Cloud Transformation',
  'AI Architecture',
  'Technology Strategy',
  'Speaking',
  'Knowledge Sharing',
]
