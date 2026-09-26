import type { ArchitectureItem } from '@/types'

/**
 * Reference diagrams for the gallery. They are generic patterns, not customer networks.
 */
export const architecture: ArchitectureItem[] = [
  {
    id: 'hybrid-cloud',
    slug: 'hybrid-cloud',
    title: 'Hybrid Cloud',
    topic: 'Hybrid Cloud',
    summary: 'A private path from the data center into a cloud hub, with inspection before workloads.',
    context:
      'Enterprises rarely move everything at once. Identity, file services, and line-of-business systems keep a reason to stay reachable from the data center.',
    approach:
      'Terminate private connectivity on a hub, not on each application network. Advertise only the prefixes that must flow. Put firewall policy on that path, and treat DNS as part of connectivity.',
    components: ['Data center', 'ExpressRoute or VPN', 'Cloud hub', 'Firewall', 'Shared DNS', 'Workload spokes'],
    considerations: [
      'Overlapping addresses have to be resolved before the circuit is treated as production.',
      'The hub should have an owner. Shared networks without an owner become a ticket queue.',
    ],
    featured: true,
    diagram: {
      nodes: [
        { id: 'dc', label: 'Data center', x: 16, y: 50 },
        { id: 'link', label: 'Private link', x: 40, y: 50, tone: 'accent' },
        { id: 'hub', label: 'Cloud hub', x: 64, y: 32 },
        { id: 'spoke', label: 'Workloads', x: 88, y: 32 },
        { id: 'dns', label: 'DNS', x: 64, y: 74 },
      ],
      edges: [
        { from: 'dc', to: 'link' },
        { from: 'link', to: 'hub' },
        { from: 'hub', to: 'spoke' },
        { from: 'hub', to: 'dns' },
      ],
    },
  },
  {
    id: 'multi-cloud',
    slug: 'multi-cloud',
    title: 'Multi-Cloud',
    topic: 'Multi-Cloud',
    summary: 'Separate cloud landing zones with a thin shared layer for identity, connectivity, and operations.',
    context:
      'Using Azure and AWS together is common. Pretending they are one network or one control plane usually hides the differences that matter.',
    approach:
      'Give each cloud a landing zone that fits that provider. Share identity, naming, tagging, and an operations view. Connect the clouds only where an application actually requires it.',
    components: ['Azure landing zone', 'AWS landing zone', 'Identity', 'Private connectivity', 'Operations view'],
    considerations: [
      'Tagging and account structure are the integration. A shared portal cannot fix missing ownership.',
      'Avoid transitive routing between clouds unless a named workload needs it.',
    ],
    featured: true,
    diagram: {
      nodes: [
        { id: 'id', label: 'Identity', x: 50, y: 18, tone: 'accent' },
        { id: 'azure', label: 'Azure', x: 24, y: 55 },
        { id: 'aws', label: 'AWS', x: 76, y: 55 },
        { id: 'ops', label: 'Operations', x: 50, y: 84 },
      ],
      edges: [
        { from: 'id', to: 'azure' },
        { from: 'id', to: 'aws' },
        { from: 'azure', to: 'ops' },
        { from: 'aws', to: 'ops' },
      ],
    },
  },
  {
    id: 'ai-platform',
    slug: 'ai-platform',
    title: 'AI Platform',
    topic: 'AI Platform',
    summary: 'A controlled path from enterprise sources to a model, with secrets, network, and evaluation kept visible.',
    context:
      'Teams adopt models quickly and only later ask where prompts, documents, and keys live.',
    approach:
      'Front the model with an API. Keep documents in a known store. Retrieve before answering. Isolate keys in a vault and keep the model endpoint on a private network when the data is internal.',
    components: ['Sources', 'Ingestion', 'Search index', 'Model endpoint', 'API', 'Key vault', 'Observability'],
    considerations: [
      'Log prompts and answers only with a retention rule and a privacy review.',
      'A platform key shared by every application removes accountability.',
    ],
    featured: true,
    diagram: {
      nodes: [
        { id: 'src', label: 'Sources', x: 14, y: 50 },
        { id: 'index', label: 'Index', x: 38, y: 50 },
        { id: 'model', label: 'Model', x: 62, y: 50, tone: 'accent' },
        { id: 'api', label: 'API', x: 84, y: 28 },
        { id: 'vault', label: 'Key vault', x: 84, y: 74 },
      ],
      edges: [
        { from: 'src', to: 'index' },
        { from: 'index', to: 'model' },
        { from: 'model', to: 'api' },
        { from: 'vault', to: 'model' },
      ],
    },
  },
  {
    id: 'rag-architecture',
    slug: 'rag-architecture',
    title: 'RAG Architecture',
    topic: 'RAG Architecture',
    summary: 'Retrieve approved passages first, then ask the model to answer with citations.',
    context:
      'Generative answers drift when the model is the only source. Enterprise questions need an owner for the underlying document.',
    approach:
      'Chunk documents with their source and access label intact. Filter retrieval by the caller identity. Pass a small set of passages to the model and require the answer to cite them. If retrieval is empty, the assistant should say so.',
    components: ['Document source', 'Ingestion', 'Vector and keyword index', 'Identity filter', 'Model', 'Citation'],
    considerations: [
      'Access control belongs in retrieval, not in a reminder inside the prompt.',
      'Evaluate with real questions from the audience who will use it.',
    ],
    featured: true,
    diagram: {
      nodes: [
        { id: 'docs', label: 'Documents', x: 14, y: 50 },
        { id: 'ingest', label: 'Ingestion', x: 36, y: 50 },
        { id: 'index', label: 'Index', x: 58, y: 32, tone: 'accent' },
        { id: 'user', label: 'Caller', x: 58, y: 74 },
        { id: 'model', label: 'Grounded model', x: 86, y: 50 },
      ],
      edges: [
        { from: 'docs', to: 'ingest' },
        { from: 'ingest', to: 'index' },
        { from: 'user', to: 'index' },
        { from: 'index', to: 'model' },
      ],
    },
  },
  {
    id: 'azure-landing-zone',
    slug: 'azure-landing-zone',
    title: 'Azure Landing Zone',
    topic: 'Azure Landing Zone',
    summary: 'Management, identity, connectivity, and a subscription model before the first workload.',
    context:
      'Subscriptions created per project, with networking added later, become expensive to unwind.',
    approach:
      'Separate platform subscriptions from application subscriptions. Put identity, policy, logging, and connectivity in the platform. Give application teams a spoke and a way to request exceptions in the open.',
    components: ['Management group', 'Identity subscription', 'Connectivity subscription', 'Application landing zone', 'Policy', 'Logging'],
    considerations: [
      'Policy should start with a small set that is enforced, not a large set in audit mode forever.',
      'Naming and tags are part of the landing zone because cost and ownership depend on them.',
    ],
    featured: false,
    diagram: {
      nodes: [
        { id: 'mgmt', label: 'Management', x: 50, y: 16, tone: 'accent' },
        { id: 'id', label: 'Identity', x: 22, y: 48 },
        { id: 'net', label: 'Connectivity', x: 50, y: 48 },
        { id: 'app', label: 'Workloads', x: 78, y: 48 },
        { id: 'log', label: 'Logging', x: 50, y: 80 },
      ],
      edges: [
        { from: 'mgmt', to: 'id' },
        { from: 'mgmt', to: 'net' },
        { from: 'mgmt', to: 'app' },
        { from: 'id', to: 'log' },
        { from: 'net', to: 'app' },
      ],
    },
  },
  {
    id: 'cloud-migration',
    slug: 'cloud-migration',
    title: 'Cloud Migration',
    topic: 'Cloud Migration',
    summary: 'Discover, group, land, move, and only then decommission.',
    context:
      'Migration programs stall when the conversation starts with a tool instead of dependencies and the operating model.',
    approach:
      'Map dependencies, agree waves, prepare the landing zone, rehearse one wave, then cut over with the source still recoverable. Hand the system to the team that will run it before the project is called done.',
    components: ['Discovery', 'Wave plan', 'Landing zone', 'Replication', 'Cutover', 'Operations handover'],
    considerations: [
      'The first wave should teach the organization how exceptions are handled.',
      'Decommission is a step. Leaving the source running forever doubles the estate.',
    ],
    featured: false,
    diagram: {
      nodes: [
        { id: 'discover', label: 'Discover', x: 14, y: 50 },
        { id: 'land', label: 'Landing zone', x: 38, y: 50, tone: 'accent' },
        { id: 'move', label: 'Migrate', x: 62, y: 50 },
        { id: 'prove', label: 'Validate', x: 84, y: 28 },
        { id: 'run', label: 'Operate', x: 84, y: 74 },
      ],
      edges: [
        { from: 'discover', to: 'land' },
        { from: 'land', to: 'move' },
        { from: 'move', to: 'prove' },
        { from: 'prove', to: 'run' },
      ],
    },
  },
  {
    id: 'disaster-recovery',
    slug: 'disaster-recovery',
    title: 'Disaster Recovery',
    topic: 'Disaster Recovery',
    summary: 'Replication, backup, and a tested path for network and dependencies.',
    context:
      'Recovery objectives are often stated before anyone has listed the systems that have to move together.',
    approach:
      'Write RPO and RTO per application tier. Use replication for fast return of compute and backup for retention and corruption. Design the recovery network and DNS before the first test. Record who is allowed to declare a failover.',
    components: ['Primary region', 'Replication', 'Backup', 'Recovery region', 'DNS', 'Runbook'],
    considerations: [
      'A test that restores a server and stops there has not tested the application.',
      'Identity and name resolution are dependencies, even when they are "shared".',
    ],
    featured: true,
    diagram: {
      nodes: [
        { id: 'primary', label: 'Primary', x: 18, y: 50 },
        { id: 'repl', label: 'Replication', x: 46, y: 28, tone: 'accent' },
        { id: 'backup', label: 'Backup', x: 46, y: 74 },
        { id: 'second', label: 'Recovery site', x: 78, y: 40 },
        { id: 'dns', label: 'DNS and access', x: 78, y: 74 },
      ],
      edges: [
        { from: 'primary', to: 'repl' },
        { from: 'primary', to: 'backup' },
        { from: 'repl', to: 'second' },
        { from: 'second', to: 'dns' },
      ],
    },
  },
  {
    id: 'aks',
    slug: 'aks',
    title: 'AKS Platform',
    topic: 'AKS',
    summary: 'A cluster platform with identity, registry, ingress, and observability treated as product parts.',
    context:
      'A cluster is easy to create. A platform that more than one team can share needs admission, identity, and a way to see what is running.',
    approach:
      'Use a private registry, workload identity rather than long-lived secrets where the platform allows it, an ingress path with a known certificate story, and logs and metrics that leave the cluster. Separate platform namespaces from application namespaces.',
    components: ['AKS', 'ACR', 'Ingress', 'Workload identity', 'Policy', 'Observability'],
    considerations: [
      'Cluster upgrades are a platform feature. They need a calendar and a test namespace.',
      'Network policy should exist before the cluster is described as multi-tenant.',
    ],
    featured: false,
    diagram: {
      nodes: [
        { id: 'user', label: 'Clients', x: 14, y: 50 },
        { id: 'ingress', label: 'Ingress', x: 36, y: 50 },
        { id: 'aks', label: 'AKS', x: 58, y: 50, tone: 'accent' },
        { id: 'acr', label: 'Registry', x: 82, y: 28 },
        { id: 'obs', label: 'Observe', x: 82, y: 74 },
      ],
      edges: [
        { from: 'user', to: 'ingress' },
        { from: 'ingress', to: 'aks' },
        { from: 'acr', to: 'aks' },
        { from: 'aks', to: 'obs' },
      ],
    },
  },
  {
    id: 'networking',
    slug: 'networking',
    title: 'Cloud Networking',
    topic: 'Networking',
    summary: 'Hub, spokes, DNS, and a firewall path that application teams do not redesign per system.',
    context:
      'Cloud networks become a collection of peerings when there is no hub and no rule for when traffic is inspected.',
    approach:
      'Use a hub for shared services and inspection. Attach spokes for applications. Centralize DNS private zones. Publish a short rule for east-west traffic: what is allowed to talk, and what must pass a firewall.',
    components: ['Hub', 'Spokes', 'Firewall', 'Private DNS', 'Routes', 'On-premises link'],
    considerations: [
      'Route tables are architecture. Defaults that send traffic to the internet by accident are a design fault.',
      'Document which flows are intentionally not inspected, and why.',
    ],
    featured: false,
    diagram: {
      nodes: [
        { id: 'onprem', label: 'On-premises', x: 14, y: 50 },
        { id: 'hub', label: 'Hub', x: 42, y: 50, tone: 'accent' },
        { id: 'fw', label: 'Firewall', x: 42, y: 22 },
        { id: 'spoke', label: 'Spokes', x: 72, y: 36 },
        { id: 'dns', label: 'DNS', x: 72, y: 72 },
      ],
      edges: [
        { from: 'onprem', to: 'hub' },
        { from: 'hub', to: 'fw' },
        { from: 'hub', to: 'spoke' },
        { from: 'hub', to: 'dns' },
      ],
    },
  },
  {
    id: 'identity',
    slug: 'identity',
    title: 'Identity',
    topic: 'Identity',
    summary: 'One identity plane for people, workload access, and privileged administration.',
    context:
      'Cloud projects create local admin accounts when identity is left until integration testing.',
    approach:
      'Join workforce access to the enterprise identity provider. Use groups for access, conditional access for sensitive paths, and a separate privileged path for administration. Workload identities replace stored passwords where the platform supports them.',
    components: ['Identity provider', 'Conditional access', 'Groups', 'Privileged access', 'Workload identity', 'Applications'],
    considerations: [
      'Break-glass access should be rare, monitored, and stored out of the everyday vault process.',
      'Guest and automation accounts need an owner and an expiry.',
    ],
    featured: false,
    diagram: {
      nodes: [
        { id: 'idp', label: 'Identity', x: 18, y: 50, tone: 'accent' },
        { id: 'people', label: 'People', x: 48, y: 24 },
        { id: 'apps', label: 'Applications', x: 78, y: 24 },
        { id: 'priv', label: 'Privileged', x: 48, y: 76 },
        { id: 'work', label: 'Workloads', x: 78, y: 76 },
      ],
      edges: [
        { from: 'idp', to: 'people' },
        { from: 'people', to: 'apps' },
        { from: 'idp', to: 'priv' },
        { from: 'idp', to: 'work' },
      ],
    },
  },
  {
    id: 'data-platform',
    slug: 'data-platform',
    title: 'Data Platform',
    topic: 'Data Platform',
    summary: 'Ingest, store, transform, and present data with ownership and access kept attached.',
    context:
      'Analytics platforms fail the trust test when nobody can say which source a number came from or who may see it.',
    approach:
      'Land raw data separately from curated data. Transform in a known pipeline. Publish a small set of certified datasets. Apply access at the dataset, not only at the dashboard. Keep lineage good enough to answer "where did this come from".',
    components: ['Sources', 'Ingestion', 'Raw store', 'Transform', 'Curated data', 'Analytics'],
    considerations: [
      'A dashboard is not a data platform. The contract is the dataset and its owner.',
      'Cost follows retention and how often large tables are scanned.',
    ],
    featured: false,
    diagram: {
      nodes: [
        { id: 'src', label: 'Sources', x: 12, y: 50 },
        { id: 'raw', label: 'Raw store', x: 36, y: 50 },
        { id: 'transform', label: 'Transform', x: 58, y: 50, tone: 'accent' },
        { id: 'curated', label: 'Curated', x: 80, y: 30 },
        { id: 'bi', label: 'Analytics', x: 80, y: 72 },
      ],
      edges: [
        { from: 'src', to: 'raw' },
        { from: 'raw', to: 'transform' },
        { from: 'transform', to: 'curated' },
        { from: 'curated', to: 'bi' },
      ],
    },
  },
  {
    id: 'cloud-operations',
    slug: 'cloud-operations',
    title: 'Cloud Operations',
    topic: 'Cloud Operations',
    summary: 'Signals, knowledge, and a human decision, with automation only on the paths that are already understood.',
    context:
      'Operations teams are handed portals, tickets, and chat, and asked to look like one function.',
    approach:
      'Define the signals that matter, the system of record for incidents, and the knowledge that is allowed to guide action. Use automation for repeated, reversible tasks. Use AI to assemble context. Keep change rights with the operator and the existing change path.',
    components: ['Telemetry', 'Service management', 'Knowledge', 'Automation', 'AI assistance', 'Reporting'],
    considerations: [
      'An assistant with production credentials is an operations risk, not a shortcut.',
      'Reporting should use the same ownership tags as the architecture standards.',
    ],
    featured: true,
    diagram: {
      nodes: [
        { id: 'signals', label: 'Signals', x: 16, y: 32 },
        { id: 'tickets', label: 'Service desk', x: 16, y: 72 },
        { id: 'assist', label: 'AI assist', x: 48, y: 50, tone: 'accent' },
        { id: 'auto', label: 'Automation', x: 80, y: 32 },
        { id: 'human', label: 'Operator', x: 80, y: 72 },
      ],
      edges: [
        { from: 'signals', to: 'assist' },
        { from: 'tickets', to: 'assist' },
        { from: 'assist', to: 'human' },
        { from: 'human', to: 'auto' },
      ],
    },
  },
]
