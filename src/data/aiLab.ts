import type { LabItem } from '@/types'

/**
 * Experiments and architecture explorations. Status reflects design maturity, not a production claim.
 */
export const aiLab: LabItem[] = [
  {
    id: 'ai-cloud-ops',
    slug: 'ai-cloud-operations-engineer',
    title: 'AI Cloud Operations Engineer',
    summary: 'An assistant architecture that reads operational context and drafts analysis, not unsupervised changes.',
    status: 'Prototype',
    technologies: ['Azure AI Foundry', 'Azure OpenAI', 'Azure AI Search', 'RAG', 'FastAPI', 'AKS'],
    description:
      'A personal prototype architecture for bringing cloud signals, service records, and knowledge into one retrieval layer. The assistant can outline incident context, point at relevant knowledge, and draft operational notes.',
    intent:
      'Shorten the time spent gathering context during cloud operations, while keeping a human responsible for any change.',
    boundaries:
      'Prototype architecture. Capabilities describe the design direction and are not validated production behavior.',
  },
  {
    id: 'enterprise-rag',
    slug: 'enterprise-rag-architecture',
    title: 'Enterprise RAG Architecture',
    summary: 'A pattern for grounding answers in enterprise documents with filters, citations, and access control.',
    status: 'Concept',
    technologies: ['RAG', 'Azure AI Search', 'Azure OpenAI', 'SharePoint', 'Entra ID'],
    description:
      'Explores how documents move from a source system into an index, how queries are filtered by identity, and how answers cite the passages they used. The design assumes content has owners and that not every user should see every document.',
    intent: 'Make generative answers usable in an enterprise setting without treating the model as the source of truth.',
    boundaries: 'Concept architecture. It is not a deployed enterprise search product.',
  },
  {
    id: 'runbook-assistant',
    slug: 'ai-runbook-assistant',
    title: 'AI Runbook Assistant',
    summary: 'Drafts and retrieves operational runbooks from existing procedures and incident history.',
    status: 'Concept',
    technologies: ['RAG', 'Azure OpenAI', 'Automation', 'ServiceNow'],
    description:
      'A concept for turning known procedures into a form an operator can query during an incident, and for drafting a runbook from a resolved incident so the next one starts from a better note.',
    intent: 'Keep operational knowledge closer to the moment it is needed.',
    boundaries: 'Concept only. Generated steps would require review before anyone follows them.',
  },
  {
    id: 'incident-analysis',
    slug: 'ai-incident-analysis',
    title: 'AI Incident Analysis',
    summary: 'Summarizes incidents from tickets, alerts, and recent changes without closing the incident itself.',
    status: 'Concept',
    technologies: ['Azure OpenAI', 'ServiceNow', 'Monitoring', 'RAG'],
    description:
      'Explores an analysis flow that clusters symptoms, lists recent changes, and produces a timeline an engineer can correct. The output is a briefing, not a root-cause verdict.',
    intent: 'Give the person on the incident a faster first picture.',
    boundaries: 'Concept. It does not claim accurate root-cause detection.',
  },
  {
    id: 'architecture-assistant',
    slug: 'ai-architecture-assistant',
    title: 'AI Architecture Assistant',
    summary: 'A constrained assistant for comparing options against documented standards and reference patterns.',
    status: 'Concept',
    technologies: ['RAG', 'MCP', 'Azure OpenAI', 'Architecture'],
    description:
      'The idea is a question interface over approved patterns: landing zones, connectivity, recovery, and platform standards. Answers should point back to the pattern, and decline when the corpus does not cover the question.',
    intent: 'Help architects and engineers find the agreed pattern before drawing a new one.',
    boundaries: 'Concept. It is not a substitute for architecture review.',
  },
  {
    id: 'finops-ai',
    slug: 'cloud-finops-ai',
    title: 'Cloud FinOps AI',
    summary: 'Reads cost and utilization context and suggests where a human should look first.',
    status: 'Concept',
    technologies: ['FinOps', 'Azure', 'AWS', 'Azure OpenAI', 'Power BI'],
    description:
      'A concept for explaining cost movements in plain language: which subscriptions or accounts moved, which services contributed, and which tags are missing. Recommendations stay advisory.',
    intent: 'Make cost conversations faster for architects and operations leads.',
    boundaries: 'Concept. It does not execute resizing, purchasing, or deletion.',
  },
  {
    id: 'security-ai',
    slug: 'cloud-security-ai',
    title: 'Cloud Security AI',
    summary: 'Helps triage security findings by tying them to exposure, ownership, and existing exceptions.',
    status: 'Concept',
    technologies: ['SecOps', 'Azure', 'AWS', 'RAG', 'Defender'],
    description:
      'Explores summarising a queue of findings, grouping duplicates, and asking whether a resource is actually reachable. The design assumes the security tool remains the system of record.',
    intent: 'Reduce time spent re-reading similar findings.',
    boundaries: 'Concept. It does not close findings or change security policy.',
  },
  {
    id: 'mcp-experiments',
    slug: 'mcp-experiments',
    title: 'MCP Experiments',
    summary: 'Trials of Model Context Protocol tools that expose selected professional knowledge to an assistant.',
    status: 'Concept',
    technologies: ['MCP', 'AI Agents', 'LangChain', 'LangGraph'],
    description:
      'Experiments with narrow tools: search a pattern library, fetch a sanitized architecture note, or list technologies in a solution. The point is a small, explicit tool surface rather than a general agent with broad credentials.',
    intent: 'Learn how an assistant should call structured professional content.',
    boundaries: 'Experiments only. No tool in this lab is permitted to hold cloud credentials or customer data.',
  },
]
