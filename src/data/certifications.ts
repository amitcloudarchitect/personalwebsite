import type { Certification } from '@/types'

/**
 * Add only credentials you hold. Placeholder entries are slots, not claims.
 */
export const certifications: Certification[] = [
  {
    id: 'claude-architect-foundations',
    name: 'Claude Certified Architect – Foundations',
    issuer: 'Anthropic',
    category: 'AI',
    placeholder: false,
    note: 'Add the issue date, badge, and credential URL when you want them displayed.',
  },
  {
    id: 'placeholder-microsoft',
    name: 'Microsoft certification',
    issuer: 'Microsoft',
    category: 'Microsoft',
    placeholder: true,
    note: 'Replace with the credential name, issue date, and verification URL.',
  },
  {
    id: 'placeholder-aws',
    name: 'AWS certification',
    issuer: 'Amazon Web Services',
    category: 'AWS',
    placeholder: true,
    note: 'Replace with the credential name, issue date, and verification URL.',
  },
  {
    id: 'placeholder-ai',
    name: 'Additional AI certification',
    issuer: 'Issuer',
    category: 'AI',
    placeholder: true,
    note: 'Replace or remove this slot.',
  },
  {
    id: 'placeholder-architecture',
    name: 'Architecture certification',
    issuer: 'Issuer',
    category: 'Architecture',
    placeholder: true,
    note: 'Replace or remove this slot.',
  },
  {
    id: 'placeholder-kubernetes',
    name: 'Kubernetes certification',
    issuer: 'Issuer',
    category: 'Kubernetes',
    placeholder: true,
    note: 'Replace or remove this slot.',
  },
]
