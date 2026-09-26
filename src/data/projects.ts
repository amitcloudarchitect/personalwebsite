import type { Project } from '@/types'

/**
 * Architecture and project narratives. Keep customer identifiers, addresses, and secrets out of this file.
 */
export const projects: Project[] = [
  {
    id: 'ai-cloud-ops',
    slug: 'ai-cloud-operations-engineer',
    name: 'AI Cloud Operations Engineer Platform',
    summary:
      'A personal architecture for an AI-assisted cloud operations platform that gathers operational context and supports analysis, retrieval, and recommendations.',
    problem:
      'Cloud operations work is spread across portals, service management, knowledge bases, email, collaboration tools, and documentation. Incident analysis, reporting, and recommendations often start without that context in one place.',
    architecture:
      'The design puts a retrieval and reasoning layer over selected operational sources. Content is ingested into searchable storage. A model grounded with retrieval can assist with incident summaries, knowledge lookup, runbook drafts, architecture questions, and operational reporting. Recommended actions stay separated from privileged change paths. Azure AI Foundry, Azure OpenAI, and Azure AI Search are the intended AI core, with FastAPI and Azure Functions for application and event handling, Service Bus for decoupling, API Management and Key Vault at the edge and for secrets, and AKS with ACR for container hosting. SQL and Azure Storage hold structured and unstructured operational data. Power BI or Fabric is the reporting path. ServiceNow, Microsoft Teams, and SharePoint are integration surfaces. AWS and Azure are both in scope as sources of cloud resource context, including FinOps and SecOps signals.',
    technologies: [
      'Azure AI Foundry',
      'Azure OpenAI',
      'Azure AI Search',
      'SQL',
      'Azure Storage',
      'FastAPI',
      'Azure Functions',
      'Service Bus',
      'API Management',
      'Key Vault',
      'AKS',
      'ACR',
      'Power BI',
      'Microsoft Fabric',
      'ServiceNow',
      'Microsoft Teams',
      'SharePoint',
      'AWS',
      'Azure',
      'RAG',
    ],
    role: 'Architecture and solution design for a personal platform project.',
    businessImpact:
      'The intended outcome is faster access to operational context and clearer assistance for incident analysis, FinOps, SecOps, and day-to-day cloud operations. No production impact figures are stated. The platform is not presented as a validated production deployment.',
    learnings: [
      'Operational AI is only as useful as the sources it is allowed to see, and those sources need an owner and a retention rule.',
      'Retrieval should be designed before prompt wording. Grounding, filters, and citations matter more than a larger model.',
      'Assistance and execution should stay separate. A recommendation is not the same as permission to change a cloud resource.',
    ],
    featured: true,
    kind: 'personal',
    notice:
      'Personal architecture project. This page describes the intended design. It is not a statement of production validation or a customer deployment.',
    diagram: {
      nodes: [
        { id: 'signals', label: 'Cloud signals', x: 16, y: 32 },
        { id: 'knowledge', label: 'Knowledge', x: 16, y: 72 },
        { id: 'index', label: 'AI Search', x: 46, y: 50, tone: 'accent' },
        { id: 'assist', label: 'Assistants', x: 76, y: 28 },
        { id: 'actions', label: 'Guardrails', x: 76, y: 74 },
      ],
      edges: [
        { from: 'signals', to: 'index' },
        { from: 'knowledge', to: 'index' },
        { from: 'index', to: 'assist' },
        { from: 'index', to: 'actions' },
      ],
    },
    relatedSolutions: ['rag', 'ai-operations', 'finops', 'secops', 'ai-platforms'],
  },
  {
    id: 'cmp',
    slug: 'cloud-management-platform',
    name: 'Cloud Management Platform',
    summary:
      'A multi-cloud management platform for provisioning, inventory, utilization, security, cost, and operations across AWS and Azure.',
    problem:
      'Teams working in more than one cloud need a consistent way to request resources, see what is running, and keep ownership, security, and cost visible without living only inside each cloud portal.',
    architecture:
      'A React control plane sits on a Python and Flask API. Provisioning and resource management call AWS and Azure APIs. Inventory and application state are stored in Azure Cosmos DB. ServiceNow is the workflow integration for requests and operational tickets. The platform surface includes utilization monitoring, security and cost views, analytics, user management, automation hooks, and a chatbot for common operational questions. Each cloud remains the system of record for its own resources. The platform orchestrates and observes rather than replacing native identity, network, or billing systems.',
    technologies: [
      'React',
      'Python',
      'Flask',
      'Azure Cosmos DB',
      'AWS APIs',
      'Azure APIs',
      'ServiceNow',
      'Automation',
      'Chatbot',
    ],
    role: 'Designed and built the multi-cloud management platform.',
    businessImpact:
      'The platform gives a single place to provision and review resources across AWS and Azure, with user management and hooks for automation, security review, and cost visibility. Specific savings or adoption figures are not published here.',
    learnings: [
      'A management platform should sit beside native cloud controls, not hide them. Operators still need a path to the provider when the abstraction is wrong.',
      'Inventory quality decides whether cost, security, and utilization views are trustworthy.',
      'Workflow integration matters as much as the API. If requests do not land in the existing service process, the portal becomes optional.',
    ],
    featured: true,
    kind: 'experience',
    notice:
      'Sanitized description of platform work. Customer names, account identifiers, and environment-specific details are omitted.',
    diagram: {
      nodes: [
        { id: 'users', label: 'Operators', x: 16, y: 50 },
        { id: 'plane', label: 'Control plane', x: 44, y: 40, tone: 'accent' },
        { id: 'aws', label: 'AWS', x: 74, y: 26 },
        { id: 'azure', label: 'Azure', x: 74, y: 62 },
        { id: 'snow', label: 'ServiceNow', x: 44, y: 78 },
      ],
      edges: [
        { from: 'users', to: 'plane' },
        { from: 'plane', to: 'aws' },
        { from: 'plane', to: 'azure' },
        { from: 'plane', to: 'snow' },
      ],
    },
    relatedSolutions: ['platform-engineering', 'finops', 'cloud-security', 'devops', 'multi-cloud-connectivity'],
  },
  {
    id: 'azure-files',
    slug: 'enterprise-azure-file-services',
    name: 'Enterprise Azure File Services Architecture',
    summary:
      'Architecture for Azure Files integrated with enterprise identity, private connectivity, access control, and disaster recovery.',
    problem:
      'File workloads moving toward Azure still need to behave like an enterprise file service: domain identity, existing access paths, predictable permissions, and a recovery position if the region or the share is unavailable.',
    architecture:
      'The pattern uses Azure Files with Active Directory integration and Kerberos authentication so users and applications keep an identity-based access model. DFS namespace considerations are part of how shares are presented to clients. Private connectivity is provided through ExpressRoute or VPN rather than open public access. ACL design follows group-based identity, not individual exceptions. Disaster recovery covers the file tier and the identity dependency it relies on, because a recovered share that clients cannot authenticate to is not a recovery. Names, domains, addresses, and customer topology are intentionally not described.',
    technologies: [
      'Azure Files',
      'Active Directory',
      'Kerberos',
      'DFS',
      'ExpressRoute',
      'VPN',
      'Identity',
      'ACL',
      'Disaster Recovery',
    ],
    role: 'Architecture for identity-aware Azure file services, access design, connectivity, and recovery.',
    businessImpact:
      'The design gives file consumers a private, identity-backed path to Azure Files and makes access control and recovery explicit design inputs. Customer-specific outcomes are not listed.',
    learnings: [
      'File migration is an identity project as much as a storage project. Kerberos, groups, and ACL inheritance need a design before data is copied.',
      'DFS and share layout should be decided with the people who support the current namespaces.',
      'Recovery has to include identity and name resolution, not only the file data.',
    ],
    featured: true,
    kind: 'experience',
    notice:
      'Sanitized architecture pattern based on this class of work. No customer names, domain names, addresses, or share layouts are included.',
    diagram: {
      nodes: [
        { id: 'clients', label: 'Clients', x: 14, y: 50 },
        { id: 'identity', label: 'Identity', x: 40, y: 26 },
        { id: 'files', label: 'Azure Files', x: 64, y: 50, tone: 'accent' },
        { id: 'network', label: 'Private path', x: 40, y: 76 },
        { id: 'dr', label: 'DR copy', x: 88, y: 50 },
      ],
      edges: [
        { from: 'clients', to: 'network' },
        { from: 'network', to: 'files' },
        { from: 'identity', to: 'files' },
        { from: 'files', to: 'dr' },
      ],
    },
    relatedSolutions: ['azure-files', 'identity', 'disaster-recovery', 'azure-networking'],
  },
  {
    id: 'azure-dr',
    slug: 'azure-disaster-recovery',
    name: 'Azure Disaster Recovery Architecture',
    summary:
      'Cross-region disaster recovery architecture using Azure Site Recovery and Azure Backup, with network and application dependencies included.',
    problem:
      'A backup copy or a replicated virtual machine is not a recovery plan. Applications fail over only if identity, network paths, data, and dependencies are recovered in an order the business can accept.',
    architecture:
      'The pattern treats RPO and RTO as design inputs, not as a slogan. Azure Site Recovery is used for workload replication to a paired region. Azure Backup covers restore points that replication alone does not replace, including data that needs longer retention. The recovery region has address space, DNS, and access paths designed in advance. Application dependencies are mapped so the failover order is known. Network recovery is part of the same design: a replicated server that cannot reach its database or its identity provider is still down. Runbooks state who decides to fail over and how failback is considered. No customer topology or timing commitments are published here.',
    technologies: [
      'Azure Site Recovery',
      'Azure Backup',
      'Cross-region',
      'RPO',
      'RTO',
      'Networking',
      'DNS',
      'Runbooks',
    ],
    role: 'Disaster recovery architecture across replication, backup, network recovery, and application dependencies.',
    businessImpact:
      'The architecture makes recovery objectives, dependencies, and the failover path discussable before an incident. Measured customer RPO and RTO results are not claimed on this page.',
    learnings: [
      'Replication frequency and backup retention answer different questions. Both belong in the design.',
      'Most failed recovery tests break on DNS, identity, or a dependency that was never replicated.',
      'A runbook that has not been exercised is a document, not a control.',
    ],
    featured: false,
    kind: 'experience',
    notice:
      'Sanitized disaster recovery pattern. Customer names, regions used in a specific estate, addresses, and committed recovery numbers are omitted.',
    diagram: {
      nodes: [
        { id: 'primary', label: 'Primary region', x: 18, y: 50 },
        { id: 'asr', label: 'Replication', x: 46, y: 28, tone: 'accent' },
        { id: 'secondary', label: 'Secondary', x: 78, y: 28 },
        { id: 'backup', label: 'Backup', x: 46, y: 74 },
        { id: 'runbook', label: 'Runbook', x: 78, y: 74 },
      ],
      edges: [
        { from: 'primary', to: 'asr' },
        { from: 'asr', to: 'secondary' },
        { from: 'primary', to: 'backup' },
        { from: 'secondary', to: 'runbook' },
        { from: 'backup', to: 'runbook' },
      ],
    },
    relatedSolutions: ['disaster-recovery', 'cloud-backup', 'azure-networking'],
  },
  {
    id: 'hybrid-connectivity',
    slug: 'hybrid-cloud-connectivity',
    name: 'Hybrid Cloud Connectivity',
    summary:
      'Connectivity patterns joining on-premises data centers with Azure and AWS over private paths, inspected and routed deliberately.',
    problem:
      'Hybrid and multi-cloud estates fail quietly when connectivity is a set of one-off tunnels. Routing, DNS, inspection, and who owns the path are unclear, so every new workload invents another exception.',
    architecture:
      'The reference pattern keeps a small number of private paths. On-premises data centers connect toward Azure with ExpressRoute or VPN, and toward AWS with private connectivity such as a VPN or dedicated connection landing on a Transit Gateway. Firewalls inspect traffic at defined points instead of spreading controls across every spoke. Routing is explicit: which prefixes are advertised, where default routes point, and how overlapping address space is avoided. Azure and AWS network hubs are not assumed to be the same design. The page describes the pattern only. It does not document a customer network.',
    technologies: [
      'Azure',
      'AWS',
      'ExpressRoute',
      'VPN',
      'Transit Gateway',
      'Firewalls',
      'Routing',
      'Private connectivity',
    ],
    role: 'Architecture for hybrid and multi-cloud connectivity, routing, and inspection.',
    businessImpact:
      'A defined connectivity pattern reduces one-off tunnels and makes security inspection and routing reviewable. No customer network metrics are included.',
    learnings: [
      'Address planning is the constraint that shows up latest and costs the most to unwind.',
      'Inspection belongs on a known path. Encrypting everything end to end without a design for where traffic is examined creates a blind spot.',
      'DNS and routing should be reviewed together. Name resolution that returns an unreachable address looks like an application fault.',
    ],
    featured: false,
    kind: 'experience',
    notice:
      'Sanitized connectivity pattern. No device names, addresses, autonomous system numbers, or customer sites are shown.',
    diagram: {
      nodes: [
        { id: 'dc', label: 'Data center', x: 14, y: 50 },
        { id: 'path', label: 'Private path', x: 40, y: 50, tone: 'accent' },
        { id: 'azure', label: 'Azure hub', x: 68, y: 26 },
        { id: 'aws', label: 'AWS TGW', x: 68, y: 74 },
        { id: 'fw', label: 'Inspection', x: 90, y: 50 },
      ],
      edges: [
        { from: 'dc', to: 'path' },
        { from: 'path', to: 'azure' },
        { from: 'path', to: 'aws' },
        { from: 'azure', to: 'fw' },
        { from: 'aws', to: 'fw' },
      ],
    },
    relatedSolutions: ['hybrid-cloud', 'multi-cloud-connectivity', 'azure-networking', 'aws-networking', 'cloud-security'],
  },
]
