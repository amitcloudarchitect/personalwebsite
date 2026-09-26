import type { TechnologyGroup } from '@/types'

/**
 * Areas of practice. This is not a skill-score chart.
 */
export const technologyGroups: TechnologyGroup[] = [
  {
    id: 'architect',
    label: 'Architect',
    description: 'Domains used to shape enterprise platforms and transformation.',
    items: ['Azure', 'AWS', 'Hybrid Cloud', 'Networking', 'Security', 'Identity', 'DR', 'Cloud Migration'],
  },
  {
    id: 'build',
    label: 'Build',
    description: 'Implementation technologies used while designing and building platforms.',
    items: ['Python', 'FastAPI', 'Flask', 'React', 'Docker', 'Kubernetes', 'AKS', 'APIs', 'SQL'],
  },
  {
    id: 'ai',
    label: 'AI',
    description: 'Applied AI and retrieval patterns explored in architecture work and the lab.',
    items: ['Azure AI Foundry', 'Azure OpenAI', 'RAG', 'AI Search', 'LangChain', 'LangGraph', 'MCP', 'AI Agents'],
  },
  {
    id: 'operate',
    label: 'Operate',
    description: 'How platforms are run, secured, costed, and recovered.',
    items: [
      'Cloud Operations',
      'FinOps',
      'SecOps',
      'DevOps',
      'Monitoring',
      'Automation',
      'Backup',
      'Disaster Recovery',
    ],
  },
]
