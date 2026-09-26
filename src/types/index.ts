export type IconName =
  | 'cloud'
  | 'brain'
  | 'spark'
  | 'layers'
  | 'refresh'
  | 'boxes'
  | 'workflow'
  | 'coins'
  | 'shield'
  | 'git'
  | 'server'
  | 'network'
  | 'database'
  | 'bot'
  | 'search'
  | 'lock'
  | 'container'
  | 'cpu'
  | 'book'
  | 'radar'

export type DiagramNode = {
  id: string
  label: string
  x: number
  y: number
  tone?: 'default' | 'accent'
}

export type DiagramEdge = {
  from: string
  to: string
}

export type DiagramSpec = {
  nodes: DiagramNode[]
  edges: DiagramEdge[]
}

export type Profile = {
  name: string
  monogram: string
  role: string
  positioning: string
  disciplines: string[]
  supportingStatement: string
  heroMessage: string
  about: string[]
  domains: string[]
  approach: { title: string; text: string }[]
  photo: { src: string; alt: string }
}

export type FocusArea = {
  name: string
  icon: IconName
  summary: string
}

export type ExperienceItem = {
  id: string
  role: string
  organization: string
  periodLabel: string
  current: boolean
  summary: string
  focusAreas: string[]
  placeholder: boolean
  note?: string
}

export type Project = {
  id: string
  slug: string
  name: string
  summary: string
  problem: string
  architecture: string
  technologies: string[]
  role: string
  businessImpact: string
  learnings: string[]
  featured: boolean
  kind: 'personal' | 'experience'
  notice: string
  diagram: DiagramSpec
  image?: string
  relatedSolutions: string[]
}

export type Solution = {
  id: string
  slug: string
  title: string
  category: string
  domain: string
  summary: string
  problem: string
  businessRequirement: string
  architecture: string
  components: string[]
  designDecisions: string[]
  security: string[]
  availability: string
  dr: string
  cost: string
  lessons: string[]
  technologies: string[]
  image?: string
  relatedArchitecture?: string
  relatedProject?: string
}

export type ArticleCategory =
  | 'Cloud'
  | 'Azure'
  | 'AWS'
  | 'AI'
  | 'GenAI'
  | 'Architecture'
  | 'FinOps'
  | 'Security'
  | 'DevOps'
  | 'Cloud Operations'

export type Article = {
  id: string
  slug: string
  title: string
  description: string
  category: ArticleCategory
  date?: string
  readingTime?: string
  source: 'internal' | 'external'
  externalUrl?: string
  thumbnail?: string
  tags: string[]
  placeholder: boolean
}

export type VideoItem = {
  id: string
  title: string
  description: string
  thumbnail?: string
  platform: 'youtube' | 'linkedin' | 'external'
  url?: string
  youtubeId?: string
  date?: string
  tags: string[]
  placeholder: boolean
}

export type Certification = {
  id: string
  name: string
  issuer: string
  issueDate?: string
  credentialUrl?: string
  badge?: string
  category: string
  placeholder: boolean
  note?: string
}

export type EventItem = {
  id: string
  event: string
  topic: string
  date?: string
  location?: string
  role: string
  description: string
  presentationUrl?: string
  videoUrl?: string
  photos?: string[]
  type: string
  placeholder: boolean
}

export type Achievement = {
  id: string
  title: string
  description: string
  label: string
}

export type LabStatus = 'Concept' | 'Prototype' | 'In Development' | 'Completed'

export type LabItem = {
  id: string
  slug: string
  title: string
  summary: string
  status: LabStatus
  technologies: string[]
  description: string
  intent: string
  boundaries: string
}

export type TechnologyGroup = {
  id: string
  label: string
  description: string
  items: string[]
}

export type ArchitectureItem = {
  id: string
  slug: string
  title: string
  topic: string
  summary: string
  context: string
  approach: string
  components: string[]
  considerations: string[]
  diagram: DiagramSpec
  image?: string
  featured: boolean
}

export type TimelineEntry = {
  id: string
  label: string
  title: string
  description: string
  type: 'career' | 'certification' | 'project' | 'milestone' | 'speaking' | 'publication'
  href?: string
}

export type NavItem = {
  label: string
  to: string
}

export type SiteConfig = {
  siteUrl: string
  linkedin: string
  github: string
  email: string
  youtube: string
  resumeUrl: string
}

export type SearchKind =
  | 'Project'
  | 'Article'
  | 'Solution'
  | 'Video'
  | 'Certification'
  | 'Architecture'
  | 'AI Lab'

export type SearchRecord = {
  id: string
  kind: SearchKind
  title: string
  description: string
  href: string
  tags: string[]
  text: string
  placeholder: boolean
}
