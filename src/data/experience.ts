import type { ExperienceItem } from '@/types'

/**
 * Update roles here. Do not add dates, employers, or metrics that are not verified.
 */
export const experience: ExperienceItem[] = [
  {
    id: 'getronics',
    role: 'Enterprise Architect',
    organization: 'Getronics',
    periodLabel: 'Current',
    current: true,
    summary:
      'Enterprise architecture for cloud platforms, transformation, and customer solutioning across AWS and Microsoft Azure.',
    focusAreas: [
      'Enterprise cloud architecture',
      'AWS and Azure',
      'Cloud transformation',
      'Migration architecture',
      'Disaster recovery',
      'Security architecture',
      'DevOps',
      'Cloud management platforms',
      'AI-enabled cloud operations',
      'Architecture governance',
      'Customer solutioning',
      'Technical workshops',
      'Pre-sales architecture',
    ],
    placeholder: false,
  },
  {
    id: 'tekrosta',
    role: 'CTO / Technology Head',
    organization: 'Tekrosta Cloud',
    periodLabel: 'Previous',
    current: false,
    summary:
      'Technology leadership role. Replace this summary with a factual description of scope and responsibilities.',
    focusAreas: [],
    placeholder: false,
    note: 'Add dates, location, and verified responsibilities in this entry when they are ready to publish.',
  },
  {
    id: 'previous-role',
    role: 'Previous role',
    organization: 'Organization name',
    periodLabel: 'Earlier',
    current: false,
    summary:
      'Placeholder for an additional previous organization. Replace or remove this entry.',
    focusAreas: [],
    placeholder: true,
    note: 'Placeholder only. This is not a real engagement.',
  },
]
