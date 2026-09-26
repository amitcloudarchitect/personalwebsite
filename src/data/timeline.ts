import type { TimelineEntry } from '@/types'

/**
 * Professional timeline. Add entries here; the page layout does not need to change.
 * Leave dates out until they are confirmed. Use the label field instead.
 */
export const timeline: TimelineEntry[] = [
  {
    id: 'career-getronics',
    label: 'Current',
    type: 'career',
    title: 'Enterprise Architect, Getronics',
    description:
      'Cloud architecture, transformation, disaster recovery, security, operations, and customer solutioning.',
    href: '/experience',
  },
  {
    id: 'career-tekrosta',
    label: 'Previous',
    type: 'career',
    title: 'CTO / Technology Head, Tekrosta Cloud',
    description: 'Technology leadership role. Add a verified summary in the experience file.',
    href: '/experience',
  },
  {
    id: 'cert-claude',
    label: 'Certification',
    type: 'certification',
    title: 'Claude Certified Architect – Foundations',
    description: 'Certification in the Claude architect foundations track.',
    href: '/certifications',
  },
  {
    id: 'project-ai-ops',
    label: 'Project',
    type: 'project',
    title: 'AI Cloud Operations Engineer',
    description: 'Personal architecture project for AI-assisted cloud operations.',
    href: '/projects/ai-cloud-operations-engineer',
  },
  {
    id: 'project-cmp',
    label: 'Project',
    type: 'project',
    title: 'Cloud Management Platform',
    description: 'Multi-cloud management platform across AWS and Azure.',
    href: '/projects/cloud-management-platform',
  },
  {
    id: 'milestone-aks',
    label: 'Milestone',
    type: 'milestone',
    title: 'Kubernetes on Azure architecture activities',
    description:
      'Technical walkthrough and architecture activities related to Microsoft Kubernetes on Azure specialization and audit work.',
    href: '/about',
  },
]
