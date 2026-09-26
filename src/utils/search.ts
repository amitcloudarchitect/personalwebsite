import { aiLab } from '@/data/aiLab'
import { architecture } from '@/data/architecture'
import { articles } from '@/data/articles'
import { certifications } from '@/data/certifications'
import { projects } from '@/data/projects'
import { solutions } from '@/data/solutions'
import { videos } from '@/data/videos'
import type { SearchRecord } from '@/types'

function buildIndex(): SearchRecord[] {
  const records: SearchRecord[] = []

  for (const project of projects) {
    records.push({
      id: project.id,
      kind: 'Project',
      title: project.name,
      description: project.summary,
      href: `/projects/${project.slug}`,
      tags: project.technologies,
      placeholder: false,
      text: [project.problem, project.architecture, project.role, project.businessImpact, ...project.learnings, ...project.technologies].join(' '),
    })
  }

  for (const article of articles) {
    records.push({
      id: article.id,
      kind: 'Article',
      title: article.title,
      description: article.description,
      href: article.source === 'external' ? '/articles' : `/articles/${article.slug}`,
      tags: article.tags,
      placeholder: article.placeholder,
      text: [article.description, article.category, ...article.tags].join(' '),
    })
  }

  for (const solution of solutions) {
    records.push({
      id: solution.id,
      kind: 'Solution',
      title: solution.title,
      description: solution.summary,
      href: `/solutions/${solution.slug}`,
      tags: solution.technologies,
      placeholder: false,
      text: [
        solution.problem,
        solution.architecture,
        solution.domain,
        solution.category,
        ...solution.components,
        ...solution.technologies,
      ].join(' '),
    })
  }

  for (const video of videos) {
    records.push({
      id: video.id,
      kind: 'Video',
      title: video.title,
      description: video.description,
      href: '/videos',
      tags: video.tags,
      placeholder: video.placeholder,
      text: [video.description, video.platform, ...video.tags].join(' '),
    })
  }

  for (const certification of certifications) {
    records.push({
      id: certification.id,
      kind: 'Certification',
      title: certification.name,
      description: certification.note ?? certification.issuer,
      href: '/certifications',
      tags: [certification.category, certification.issuer],
      placeholder: certification.placeholder,
      text: [certification.issuer, certification.category, certification.note ?? ''].join(' '),
    })
  }

  for (const item of architecture) {
    records.push({
      id: item.id,
      kind: 'Architecture',
      title: item.title,
      description: item.summary,
      href: `/architecture/${item.slug}`,
      tags: [item.topic, ...item.components],
      placeholder: false,
      text: [item.context, item.approach, item.topic, ...item.components, ...item.considerations].join(' '),
    })
  }

  for (const item of aiLab) {
    records.push({
      id: item.id,
      kind: 'AI Lab',
      title: item.title,
      description: item.summary,
      href: `/ai-lab/${item.slug}`,
      tags: item.technologies,
      placeholder: false,
      text: [item.description, item.intent, item.status, ...item.technologies].join(' '),
    })
  }

  return records
}

const index = buildIndex()

function scoreRecord(record: SearchRecord, query: string, terms: string[]) {
  const title = record.title.toLowerCase()
  const tags = record.tags.join(' ').toLowerCase()
  const text = record.text.toLowerCase()
  const haystack = `${title} ${tags} ${text}`
  let score = 0

  if (title === query) score += 120
  else if (title.includes(query)) score += 80
  if (tags.includes(query)) score += 48
  if (text.includes(query)) score += 28

  if (score === 0) {
    const hits = terms.filter((term) => haystack.includes(term)).length
    if (hits === 0) return 0
    score += hits * 8
  }

  if (record.placeholder) score -= 10
  return score
}

export function searchPortfolio(query: string) {
  const normalized = query.trim().toLowerCase()
  if (normalized.length < 2) return []
  const terms = normalized.split(/\s+/).filter(Boolean)

  return index
    .map((record) => ({ record, score: scoreRecord(record, normalized, terms) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.record.title.localeCompare(b.record.title))
    .slice(0, 30)
    .map((item) => item.record)
}
