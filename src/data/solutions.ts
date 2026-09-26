import type { Solution } from '@/types'

/**
 * Reusable patterns. They describe an approach, not a specific customer implementation.
 */
export const solutions: Solution[] = [
  {
    id: 'cloud-migration',
    slug: 'cloud-migration',
    title: 'Cloud Migration',
    category: 'Cloud Migration',
    domain: 'Cloud',
    summary: 'Move selected systems in waves onto a landing zone that is already operable.',
    problem:
      'Estates that grew in a data center or across ad hoc hosting are difficult to move in a single cutover. Dependencies, identity, and the team that will run the target are rarely ready at the same moment.',
    businessRequirement:
      'Relocate agreed workloads with a known order, a security baseline, and a period where the source can still be used if validation fails.',
    architecture:
      'Discover applications and dependencies, then group them into waves. Stand up identity, network, logging, and the subscription or account model before production moves. Replicate and cut over wave by wave. Keep backup and a rollback window until the target is accepted, then decommission the source.',
    components: ['Discovery', 'Landing zone', 'Replication', 'Identity and DNS', 'Backup', 'Observability'],
    designDecisions: [
      'Group waves by dependency and criticality, not by how easy the server looks.',
      'Place the security and network baseline before the first production cutover.',
      'Use the first wave to rehearse operations, not only the migration tool.',
    ],
    security: [
      'Move data over private connectivity when the source is on-premises.',
      'Use time-bound migration credentials stored in a vault.',
      'Turn on destination logging before workloads arrive.',
    ],
    availability:
      'Pilot with a non-critical system. Leave the source available until the validation window closes.',
    dr: 'Migration replication is not the long-term recovery design. Set RPO and RTO for the target after the architecture is stable.',
    cost: 'Right-size after observation. Tag owner and environment so each wave can be traced in the bill.',
    lessons: [
      'Dependency mapping and handover decide the schedule more often than transfer speed.',
      'A temporary landing zone becomes permanent, so the baseline should be fit to run.',
    ],
    technologies: ['Azure', 'AWS', 'Landing zone', 'Migration', 'DNS', 'Identity'],
    relatedArchitecture: 'cloud-migration',
  },
  {
    id: 'disaster-recovery',
    slug: 'disaster-recovery',
    title: 'Disaster Recovery',
    category: 'Disaster Recovery',
    domain: 'Resilience',
    summary: 'Design failover around application dependencies, not around a single replicated machine.',
    problem:
      'Teams buy replication and still cannot recover, because identity, DNS, data, and downstream systems were never part of the same plan.',
    businessRequirement:
      'Return an agreed set of services within a stated RPO and RTO, with a person accountable for declaring the failover.',
    architecture:
      'Classify applications by recovery objective. Replicate the tiers that need a short RPO. Back up data that also needs retention or protection from corruption. Pre-build the recovery network, routes, and name resolution. Write the start order. Test it, including failback considerations.',
    components: ['Azure Site Recovery', 'Azure Backup', 'Recovery region', 'DNS', 'Identity', 'Runbook'],
    designDecisions: [
      'RPO and RTO are inputs per application, not one number for the estate.',
      'Backup and replication are both in the design because they fail differently.',
      'The recovery region is designed, not left as an empty paired region.',
    ],
    security: [
      'Recovery credentials are separate and monitored.',
      'Security controls in the recovery region are deployed before the test, not during it.',
      'Backups are protected from the same accounts that administer production daily.',
    ],
    availability: 'Recovery tests use a defined window and a rollback if the test itself threatens production.',
    dr: 'This pattern is the DR design. It includes network recovery and dependency order, and it expects a recorded test.',
    cost: 'Replication and a warm recovery footprint have a standing cost. That cost should be compared with the agreed RTO, not hidden inside the application budget.',
    lessons: [
      'Tests fail on DNS, identity, and forgotten dependencies more often than on the replication product.',
      'A runbook that has not been used is not yet a control.',
    ],
    technologies: ['Azure Site Recovery', 'Azure Backup', 'DNS', 'Networking', 'RPO', 'RTO'],
    relatedArchitecture: 'disaster-recovery',
    relatedProject: 'azure-disaster-recovery',
  },
  {
    id: 'hybrid-cloud',
    slug: 'hybrid-cloud',
    title: 'Hybrid Cloud',
    category: 'Hybrid Cloud',
    domain: 'Cloud',
    summary: 'Keep the data center and the cloud on a small number of private, owned paths.',
    problem:
      'Hybrid environments accumulate tunnels. Routing and DNS diverge, and every new system adds an exception.',
    businessRequirement:
      'Applications that must stay split across the data center and the cloud need a private, supportable path with known latency and inspection.',
    architecture:
      'Land ExpressRoute or VPN on a hub. Advertise a deliberate set of prefixes. Place shared services and inspection in the hub. Attach application networks as spokes. Treat the data center and the cloud as two sites with a contract, not as one flat network.',
    components: ['Data center', 'ExpressRoute', 'VPN', 'Hub', 'Firewall', 'DNS'],
    designDecisions: [
      'Prefer one or two private paths over a tunnel per application.',
      'Decide which flows are inspected and write that down.',
      'Give the hub an owner and a change process.',
    ],
    security: [
      'Do not publish management ports to the internet because the private path was slow to deliver.',
      'Restrict route advertisements to required prefixes.',
      'Log denied flows at the firewall during the first months.',
    ],
    availability: 'Use a secondary path where the business requirement justifies it, and test failover of the path itself.',
    dr: 'Hybrid recovery must include the private path. A recovered cloud region that cannot reach the data center may still be down.',
    cost: 'Circuits and egress dominate. Place chatty traffic with an awareness of where the data lives.',
    lessons: [
      'Address overlap is an architecture problem, not a firewall ticket.',
      'DNS and routing should be reviewed as one design.',
    ],
    technologies: ['Azure', 'ExpressRoute', 'VPN', 'Firewall', 'DNS', 'Routing'],
    relatedArchitecture: 'hybrid-cloud',
    relatedProject: 'hybrid-cloud-connectivity',
  },
  {
    id: 'multi-cloud-connectivity',
    slug: 'multi-cloud-connectivity',
    title: 'Multi-Cloud Connectivity',
    category: 'Multi-Cloud Connectivity',
    domain: 'Cloud',
    summary: 'Connect Azure and AWS only where a workload needs it, through hubs rather than peer sprawl.',
    problem:
      'Multi-cloud networking becomes a mesh of tunnels and unclear ownership when each project builds its own path.',
    businessRequirement:
      'Selected systems on Azure and AWS need private reachability, inspection, and a support model that names an owner.',
    architecture:
      'Each cloud keeps its own hub. Azure uses a hub virtual network. AWS uses a Transit Gateway. A private interconnection joins the hubs. Routing is explicit and limited to the prefixes those systems require. Firewalls sit on the path that was designed for inspection.',
    components: ['Azure hub', 'AWS Transit Gateway', 'Private interconnection', 'Firewalls', 'Route control', 'DNS'],
    designDecisions: [
      'Do not make the clouds generally routable to each other.',
      'Choose one interconnection pattern and reuse it.',
      'Publish which team accepts a route change.',
    ],
    security: [
      'Inspect cross-cloud flows at a defined point.',
      'Avoid sharing broad administrative networks across clouds.',
      'Log the interconnection like any other perimeter.',
    ],
    availability: 'Redundant attachments are a business decision tied to the systems that cross the clouds.',
    dr: 'Document whether failover of one cloud depends on the other remaining reachable.',
    cost: 'Data transfer between clouds is a design constraint. Place data next to the processing when the volume is high.',
    lessons: [
      'A shared diagram of both hubs prevents two teams from advertising the same space.',
      'Connectivity is not a landing zone. Each cloud still needs its own.',
    ],
    technologies: ['Azure', 'AWS', 'Transit Gateway', 'ExpressRoute', 'VPN', 'Firewall'],
    relatedArchitecture: 'multi-cloud',
    relatedProject: 'hybrid-cloud-connectivity',
  },
  {
    id: 'identity',
    slug: 'identity',
    title: 'Identity',
    category: 'Identity',
    domain: 'Security',
    summary: 'Use enterprise identity for people and workloads, and keep privileged access on a separate path.',
    problem:
      'Local accounts and shared secrets appear when identity is treated as an integration task at the end of a project.',
    businessRequirement:
      'People and workloads need access that can be reviewed, revoked, and tied to an owner.',
    architecture:
      'Workforce sign-in uses the enterprise identity provider, with conditional access on sensitive applications. Access is granted through groups. Administration uses a privileged path with stronger authentication and shorter standing access. Workloads use a platform identity instead of a stored password where that option exists.',
    components: ['Identity provider', 'Conditional access', 'Groups', 'Privileged access', 'Workload identity', 'Applications'],
    designDecisions: [
      'Groups over individual exceptions.',
      'Privileged roles are not daily roles.',
      'Automation identities have an owner and a narrow permission set.',
    ],
    security: [
      'Protect break-glass accounts and alert on their use.',
      'Expire guests and unused credentials.',
      'Do not place long-lived secrets in application configuration.',
    ],
    availability: 'Identity is a dependency of every recovery plan. The recovery design includes how administrators sign in if the primary path is impaired.',
    dr: 'Document the identity dependency for each critical application. A restored server without a trusted identity source is not recovered.',
    cost: 'License cost follows the privileged and automation features actually used. Design the path before buying every add-on.',
    lessons: [
      'Most cloud security findings are identity findings.',
      'An access review only works if the groups mean something.',
    ],
    technologies: ['Active Directory', 'Entra ID', 'Kerberos', 'Conditional access', 'Workload identity'],
    relatedArchitecture: 'identity',
  },
  {
    id: 'azure-files',
    slug: 'azure-files',
    title: 'Azure Files',
    category: 'Azure Files',
    domain: 'Platforms',
    summary: 'Present Azure Files as an enterprise file service with identity, private access, and recovery.',
    problem:
      'Lifting a file share to the cloud without the namespace, authentication, and permissions model strands users and applications.',
    businessRequirement:
      'Users and applications need a private file path with familiar identity and a defined recovery position.',
    architecture:
      'Use Azure Files with Active Directory authentication and Kerberos. Present shares through a DFS namespace when that is how clients find data today. Reach the share over ExpressRoute or VPN. Design ACLs from groups. Plan disaster recovery for the data and for the identity service clients use to authenticate.',
    components: ['Azure Files', 'Active Directory', 'Kerberos', 'DFS', 'Private connectivity', 'ACL', 'Backup'],
    designDecisions: [
      'Identity-based access rather than storage keys for users.',
      'Group-based ACLs with a documented inheritance model.',
      'Private endpoints or a private network path as the default.',
    ],
    security: [
      'Disable broad key-based access for interactive users.',
      'Limit share permissions to the groups that need them.',
      'Keep the storage account off the public internet when policy requires it.',
    ],
    availability: 'Choose a redundancy option that matches the availability target, and test access from a real client network.',
    dr: 'Recover the share and prove that clients can authenticate and resolve the name. Data without identity is not a successful test.',
    cost: 'Transaction patterns and snapshot retention change the file bill. Size the tier from actual access, then review it.',
    lessons: [
      'File migration is an identity project.',
      'Namespace design should be agreed with the people who support the current shares.',
    ],
    technologies: ['Azure Files', 'Active Directory', 'Kerberos', 'DFS', 'ExpressRoute', 'ACL'],
    relatedProject: 'enterprise-azure-file-services',
  },
  {
    id: 'aws-networking',
    slug: 'aws-networking',
    title: 'AWS Networking',
    category: 'AWS Networking',
    domain: 'Cloud',
    summary: 'A Transit Gateway hub for accounts that need a shared, inspected network.',
    problem:
      'VPC peering scales poorly once more than a handful of accounts must talk to on-premises or to each other.',
    businessRequirement:
      'Accounts need private connectivity to shared services and, where required, to the data center, without each team owning a tunnel.',
    architecture:
      'Attach VPCs to a Transit Gateway. Land VPN or dedicated connectivity on that hub. Use route tables to separate environments. Put inspection in an appliance VPC on the path that policy names. Keep DNS consistent with the on-premises and Azure views if those environments are in scope.',
    components: ['VPC', 'Transit Gateway', 'Route tables', 'VPN or dedicated link', 'Inspection VPC', 'DNS'],
    designDecisions: [
      'Separate route tables for production and non-production.',
      'Inspection is a designed attachment, not an accident of a default route.',
      'Account network layout follows the landing zone, not the reverse.',
    ],
    security: [
      'Security groups remain the workload control. The hub does not replace them.',
      'Limit propagated routes.',
      'Log the inspection point.',
    ],
    availability: 'Multiple attachments and availability zones for the hub services that the business classes as critical.',
    dr: 'Include the Transit Gateway path in recovery tests if applications depend on cross-account or hybrid flows.',
    cost: 'Attachment hours and data processing are the standing cost. Avoid sending high-volume flows across the hub without a reason.',
    lessons: [
      'Route tables are the architecture diagram that routing will actually follow.',
      'Agree address ranges before the second account is created.',
    ],
    technologies: ['AWS', 'Transit Gateway', 'VPC', 'VPN', 'Firewall', 'DNS'],
    relatedArchitecture: 'networking',
  },
  {
    id: 'azure-networking',
    slug: 'azure-networking',
    title: 'Azure Networking',
    category: 'Azure Networking',
    domain: 'Cloud',
    summary: 'A hub-and-spoke Azure network with private DNS and a firewall path.',
    problem:
      'Application teams create virtual networks that cannot reach on-premises, or that reach everything, when there is no shared hub.',
    businessRequirement:
      'Workloads need private access to shared services and to the enterprise network under a policy someone can explain.',
    architecture:
      'A connectivity subscription holds the hub, firewall, and gateways for ExpressRoute or VPN. Application spokes peer to the hub. User-defined routes send inspected traffic to the firewall. Private DNS zones are linked deliberately so names resolve to private addresses.',
    components: ['Hub virtual network', 'Spokes', 'Azure Firewall or NVA', 'ExpressRoute', 'VPN', 'Private DNS'],
    designDecisions: [
      'Spokes do not peer to each other by default.',
      'Gateway and firewall live in the hub, with a named platform owner.',
      'Public endpoints are an exception.',
    ],
    security: [
      'Deny-by-default rules on the firewall for new spokes.',
      'Private endpoints for platform services that support them.',
      'Separate management access from application traffic.',
    ],
    availability: 'Zone-redundant firewall and gateway options where the availability target requires them.',
    dr: 'Recovery in a second region needs its own address plan and DNS, not a copy of the hub that overlaps the first.',
    cost: 'Firewall processing and private endpoint counts are visible costs. Centralizing them is still usually cheaper than unmanaged public exposure.',
    lessons: [
      'DNS zones that are linked too broadly create surprising resolution paths.',
      'Write the route intent next to the diagram. The route table is what packets follow.',
    ],
    technologies: ['Azure', 'Hub and spoke', 'ExpressRoute', 'VPN', 'Private DNS', 'Firewall'],
    relatedArchitecture: 'networking',
  },
  {
    id: 'cloud-security',
    slug: 'cloud-security',
    title: 'Cloud Security',
    category: 'Cloud Security',
    domain: 'Security',
    summary: 'A baseline of identity, network, logging, and posture that new workloads inherit.',
    problem:
      'Security reviews that start after deployment turn into exception lists. The baseline was never part of the platform.',
    businessRequirement:
      'New workloads should land on a platform that already logs, restricts admin access, and exposes a short list of required controls.',
    architecture:
      'Encode the baseline in the landing zone: identity, policy, diagnostic settings, encryption, and network defaults. Use a cloud security posture tool as a queue, not as the design. Exceptions have an owner and an expiry. SecOps reviews what the baseline cannot prevent.',
    components: ['Landing zone policy', 'Identity', 'Logging', 'Network controls', 'Posture management', 'Exception process'],
    designDecisions: [
      'A small enforced baseline beats a large unenforced catalog.',
      'Exceptions expire.',
      'Security telemetry lands in a place the operations team already watches.',
    ],
    security: [
      'Separate duties for policy authors and workload teams.',
      'Protect the logging store from the accounts it monitors.',
      'Prefer private network paths for administrative access.',
    ],
    availability: 'Security controls should fail in a way that is visible. Silent failure of logging is treated as an incident.',
    dr: 'The recovery region inherits the same baseline. Recovery is not an excuse to drop policy.',
    cost: 'Retaining every log at the highest tier is rarely justified. Agree retention per signal.',
    lessons: [
      'Posture scores move when the platform defaults change, not when a report is circulated.',
      'Identity and network design remove more findings than ticket handling does.',
    ],
    technologies: ['Identity', 'Policy', 'Logging', 'Network security', 'SecOps'],
    relatedArchitecture: 'identity',
    relatedProject: 'cloud-management-platform',
  },
  {
    id: 'cloud-backup',
    slug: 'cloud-backup',
    title: 'Cloud Backup',
    category: 'Cloud Backup',
    domain: 'Resilience',
    summary: 'Backups with an owner, a retention rule, and a restore test.',
    problem:
      'Backup jobs that have never been restored are a report, not a recovery capability.',
    businessRequirement:
      'Agreed data needs a restore point that survives the loss of the original resource and can be returned within a known time.',
    architecture:
      'Use Azure Backup or the equivalent provider service for the resource type. Separate backup administration from everyday operations administration. Set retention from the business rule, including longer retention where ransomware or deletion is the threat. Test restores into an isolated location.',
    components: ['Backup policy', 'Vault', 'Retention', 'Immutable options where required', 'Restore test', 'Alerting'],
    designDecisions: [
      'Policy is assigned by platform default for in-scope resources.',
      'Restore tests are scheduled, not heroic.',
      'Backup scope is written down: which data is in, which is out.',
    ],
    security: [
      'Limit who can delete backups.',
      'Alert on failed jobs and on backup policy removal.',
      'Keep backup credentials out of workload configuration.',
    ],
    availability: 'Backup does not replace a running secondary. It covers corruption, deletion, and retention.',
    dr: 'Backup supports the DR design. Replication covers short RPO for compute. Backup covers history. Both are named in the runbook.',
    cost: 'Retention and redundancy are the cost drivers. Match them to the rule rather than to the maximum setting.',
    lessons: [
      'An untested restore is an assumption.',
      'Application-consistent backups need the application owner in the design, not only the infrastructure owner.',
    ],
    technologies: ['Azure Backup', 'Recovery vault', 'Retention', 'Restore testing'],
    relatedArchitecture: 'disaster-recovery',
  },
  {
    id: 'finops',
    slug: 'finops',
    title: 'FinOps',
    category: 'FinOps',
    domain: 'Operations',
    summary: 'Make cloud spend attributable, then decide what to change.',
    problem:
      'Bills arrive without an owner. Architects are asked to "optimize" accounts that do not show who created the resources.',
    businessRequirement:
      'Leaders need to see spend by owner, environment, and service, and teams need a way to act on waste without guessing.',
    architecture:
      'Require tags or an equivalent ownership model in the landing zone. Publish a small set of views: by owner, by environment, by service. Review idle and oversized resources on a cadence. Use commitments only where usage is already understood. An assistant can explain movements, but purchasing and deletion stay with a person.',
    components: ['Tagging standard', 'Cost exports', 'Owner views', 'Review cadence', 'Commitments', 'Anomaly review'],
    designDecisions: [
      'Ownership data is mandatory for new resources.',
      'Optimization follows visibility. Do not start with a savings target and a script.',
      'Shared platform costs are shown, not hidden inside one subscription.',
    ],
    security: [
      'Cost data is sensitive. Restrict exports.',
      'Automation that deletes resources needs the same change control as any other production change.',
    ],
    availability: 'Cost controls must not turn off production protections, such as redundancy that was chosen for a recovery objective.',
    dr: 'Recovery footprints have a cost. Show it next to the RTO they buy.',
    cost: 'This pattern is the cost practice: visibility, accountability, then action. Specific savings are not assumed.',
    lessons: [
      'Untagged resources make every later conversation political.',
      'Rightsizing needs a week of real utilization, not a screenshot.',
    ],
    technologies: ['FinOps', 'Azure', 'AWS', 'Tagging', 'Cost management', 'Power BI'],
    relatedProject: 'cloud-management-platform',
  },
  {
    id: 'secops',
    slug: 'secops',
    title: 'SecOps',
    category: 'SecOps',
    domain: 'Security',
    summary: 'Operate security findings as a queue with owners, exposure, and an expiry on exceptions.',
    problem:
      'Findings accumulate in a tool that the operations team does not live in, so critical exposure and low-value noise look the same.',
    businessRequirement:
      'The organization needs a way to see which findings matter, who owns the resource, and whether an exception is still justified.',
    architecture:
      'Send high-value signals to the place incidents are already managed. Enrich a finding with owner, exposure, and environment before asking a human to rank it. AI can group duplicates and draft a summary. Closing a finding or changing policy stays in the security process. Exceptions expire.',
    components: ['Posture signals', 'Incident queue', 'Ownership data', 'Exposure context', 'Exception register', 'Summary assistance'],
    designDecisions: [
      'A short list of finding types gets operational attention first.',
      'The security product remains the system of record.',
      'Exceptions are data, not email.',
    ],
    security: [
      'An assistant used for triage does not receive standing rights to change policy or close findings.',
      'Protect the finding store like security data.',
    ],
    availability: 'Detection that pages nobody is not a control. Agree the path for after-hours signals.',
    dr: 'Security monitoring has to exist in the recovery region, or the failover creates a blind period.',
    cost: 'Ingesting every verbose log into a premium tier needs a reason. Start from the signals that change a decision.',
    lessons: [
      'Ownership tags decide whether SecOps can route work.',
      'Duplicate findings are a product problem. Group them before adding analysts.',
    ],
    technologies: ['SecOps', 'Defender', 'ServiceNow', 'Identity', 'RAG'],
    relatedArchitecture: 'cloud-operations',
    relatedProject: 'ai-cloud-operations-engineer',
  },
  {
    id: 'kubernetes',
    slug: 'kubernetes',
    title: 'Kubernetes',
    category: 'Kubernetes',
    domain: 'Platforms',
    summary: 'Run Kubernetes as a platform: identity, registry, policy, upgrades, and a way to see workloads.',
    problem:
      'Clusters created per project drift. Upgrades stall, secrets spread, and nobody can say what is exposed.',
    businessRequirement:
      'Application teams need a place to run containers that already has ingress, identity, image storage, and an upgrade path.',
    architecture:
      'Offer AKS or another managed Kubernetes service as a platform product. Use a private registry. Prefer workload identity over copied secrets. Separate platform namespaces from tenant namespaces. Put policy on admission. Ship logs and metrics out of the cluster. Publish an upgrade calendar.',
    components: ['AKS', 'Container registry', 'Ingress', 'Workload identity', 'Policy', 'Observability'],
    designDecisions: [
      'Multi-tenancy is a conscious choice with network policy, not a hope.',
      'The platform team owns the cluster. Application teams own the workload manifests.',
      'Upgrades are scheduled.',
    ],
    security: [
      'Restrict who can pull and push images.',
      'Avoid privileged pods as a default.',
      'Keep the API server off the public internet when the operating model allows it.',
    ],
    availability: 'Use multiple nodes and, where required, multiple zones. A single-node cluster is a lab.',
    dr: 'Decide whether recovery means rebuilding the cluster from manifests plus data, or failing over a whole region. Write that choice down.',
    cost: 'Node pools sized for peaks that never come are the usual waste. Request limits and a review cadence belong in the platform.',
    lessons: [
      'The cluster is not the product. The paved path onto the cluster is the product.',
      'Specialization and audit conversations go better when identity, policy, and observability are already there.',
    ],
    technologies: ['Kubernetes', 'AKS', 'ACR', 'Docker', 'Identity', 'Policy'],
    relatedArchitecture: 'aks',
  },
  {
    id: 'ai-platforms',
    slug: 'ai-platforms',
    title: 'AI Platforms',
    category: 'AI Platforms',
    domain: 'AI',
    summary: 'A shared way to call models, ground them, and keep keys and data in known places.',
    problem:
      'Each team wires a model key into an application, copies documents into a notebook, and leaves evaluation for later.',
    businessRequirement:
      'The organization needs a repeatable way to use models on enterprise content without each project inventing security and operations.',
    architecture:
      'Expose models through a platform API. Store keys in a vault. Put internal endpoints on a private network. Attach retrieval when answers must come from enterprise content. Log usage with an application identity. Evaluate a small set of real questions before calling a use case ready.',
    components: ['Azure AI Foundry', 'Azure OpenAI', 'API Management', 'Key Vault', 'Private network', 'Evaluation set'],
    designDecisions: [
      'Applications get their own identity. They do not share one platform key in a config file.',
      'Retrieval is part of the platform when the use case needs enterprise facts.',
      'A use case without an evaluation set is still an experiment.',
    ],
    security: [
      'Classify the data that may be sent to a model.',
      'Retain prompts only under a written rule.',
      'Separate development endpoints from anything holding production documents.',
    ],
    availability: 'Treat the model endpoint as a dependency with a timeout, a fallback message, and an owner.',
    dr: 'Document whether the AI path is required for the business service to be "up". Many services should degrade to a manual path.',
    cost: 'Token use follows prompt size and how much context retrieval adds. Cache and trim context before scaling the model.',
    lessons: [
      'The platform is the API, the vault, and the evaluation habit. The model is replaceable.',
      'Private networking and identity take longer than the first demo, and they are the work.',
    ],
    technologies: ['Azure AI Foundry', 'Azure OpenAI', 'API Management', 'Key Vault', 'Private networking'],
    relatedArchitecture: 'ai-platform',
  },
  {
    id: 'rag',
    slug: 'rag',
    title: 'RAG',
    category: 'RAG',
    domain: 'AI',
    summary: 'Ground answers in retrieved passages, filtered by identity, with a citation.',
    problem:
      'A model asked to answer from memory will invent detail. Enterprise users need to know which document was used and whether they were allowed to see it.',
    businessRequirement:
      'Staff need answers from approved knowledge, limited to what they can already access, with a pointer back to the source.',
    architecture:
      'Ingest documents with their source identifier and access label. Index them for keyword and semantic retrieval. On a question, filter by the caller, retrieve a small set of passages, and ask the model to answer only from those passages. If nothing is retrieved, return that outcome. Show citations.',
    components: ['Document source', 'Ingestion', 'Azure AI Search', 'Identity filter', 'Azure OpenAI', 'Citations'],
    designDecisions: [
      'Authorization is applied in retrieval.',
      'Empty retrieval is a valid answer.',
      'The source system remains the system of record. The index is a copy with a refresh rule.',
    ],
    security: [
      'Do not index content the platform identity can see if the user cannot.',
      'Strip secrets from documents before indexing.',
      'Treat the index as sensitive as the source.',
    ],
    availability: 'If search or the model is unavailable, the application should fail with a clear message rather than an ungrounded answer.',
    dr: 'Know how to rebuild the index from the source. The index is derived data.',
    cost: 'Re-indexing and large contexts cost more than the first prototype suggests. Refresh on change where possible.',
    lessons: [
      'Most quality issues are chunking, metadata, and permissions, not the model name.',
      'Evaluate with questions the real audience asks, including questions that should be refused.',
    ],
    technologies: ['RAG', 'Azure AI Search', 'Azure OpenAI', 'Identity', 'Citations'],
    relatedArchitecture: 'rag-architecture',
    relatedProject: 'ai-cloud-operations-engineer',
  },
  {
    id: 'ai-operations',
    slug: 'ai-operations',
    title: 'AI Operations',
    category: 'AI Operations',
    domain: 'AI',
    summary: 'Use AI to assemble operational context. Leave the change with the operator.',
    problem:
      'During an incident or a review, context is spread across alerts, tickets, mail, chat, and documents. People spend the first stretch of the event collecting it.',
    businessRequirement:
      'Operators need a briefing they can correct, grounded in the tools they already use, without giving a model the right to change production.',
    architecture:
      'Connect a defined set of sources. Retrieve relevant records for the incident, resource, or question. Draft a summary, a timeline, or a runbook update. Present it to an operator. Any automation runs through the existing change or runbook path, not through the model.',
    components: ['Telemetry', 'Service management', 'Knowledge base', 'Retrieval', 'Model', 'Human approval', 'Automation boundary'],
    designDecisions: [
      'The assistant drafts. It does not close incidents or modify resources.',
      'Sources are opt-in and have an owner.',
      'Outputs cite the records they used.',
    ],
    security: [
      'No standing cloud credentials on the assistant.',
      'Respect the permissions of the person asking.',
      'Keep customer data and secrets out of demonstration corpora.',
    ],
    availability: 'Operations must still function when the assistant is down. It is an aid, not the console.',
    dr: 'Do not place the only copy of a runbook inside a chat history. Write accepted steps back to the knowledge system.',
    cost: 'Index the operational sources you will actually query. Indexing everything is how these platforms become expensive and noisy.',
    lessons: [
      'The value is the briefing, not an autonomous agent.',
      'If the knowledge base is stale, retrieval will confidently surface stale steps.',
    ],
    technologies: ['Azure OpenAI', 'Azure AI Search', 'RAG', 'ServiceNow', 'Automation', 'AKS'],
    relatedArchitecture: 'cloud-operations',
    relatedProject: 'ai-cloud-operations-engineer',
  },
  {
    id: 'platform-engineering',
    slug: 'platform-engineering',
    title: 'Platform Engineering',
    category: 'Platform Engineering',
    domain: 'Platforms',
    summary: 'Offer teams a paved path: landing zone, pipeline, identity, and a place to see what they run.',
    problem:
      'Every team assembles cloud accounts, pipelines, and naming from scratch, so governance arrives as a late review.',
    businessRequirement:
      'Delivery teams need to provision approved infrastructure and ship changes without waiting for a bespoke architecture each time.',
    architecture:
      'Productize the platform. Provide templates or modules for the common cases, an identity for the pipeline, a registry or artifact store, and an inventory of what was created. Keep an escape hatch for the cases the template does not cover, with a review. The cloud management platform is one expression of this: a control plane over AWS and Azure with workflow integration.',
    components: ['Templates', 'Pipeline identity', 'Inventory', 'Workflow integration', 'Policy', 'Documentation'],
    designDecisions: [
      'The default path is the secure path.',
      'Inventory is part of the platform, otherwise cost and security views are guesses.',
      'A template without an owner will rot.',
    ],
    security: [
      'Pipeline identities are narrow.',
      'Secrets stay in a vault.',
      'Policy runs at provision time, not only in a quarterly audit.',
    ],
    availability: 'The platform itself needs an owner and a status. If nobody can provision, delivery stops.',
    dr: 'Platform state, such as inventories and repositories, needs backup. Recreating it from memory is not a plan.',
    cost: 'A platform that shows ownership tags pays for itself in the FinOps conversation. Build that in.',
    lessons: [
      'Adoption follows the path of least resistance. Make the right path the easy one.',
      'Abstractions should leak on purpose, so engineers can still reach the cloud when the template is wrong.',
    ],
    technologies: ['React', 'Python', 'Flask', 'Azure', 'AWS', 'ServiceNow', 'Policy'],
    relatedProject: 'cloud-management-platform',
  },
  {
    id: 'devops',
    slug: 'devops',
    title: 'DevOps',
    category: 'DevOps',
    domain: 'Operations',
    summary: 'Connect architecture standards to the pipeline that actually ships the change.',
    problem:
      'Architecture documents and delivery pipelines diverge. Reviews happen after the environment exists.',
    businessRequirement:
      'Changes need a repeatable path from source to environment, with identity, secrets, and approvals that match the risk.',
    architecture:
      'Use a pipeline with a workload or platform identity, environment separation, and secrets from a vault. Infrastructure changes are code where the team can support that. Approvals sit on production. Observability is part of "done". The same flow should be able to call cloud APIs through a management platform rather than from laptops.',
    components: ['Source control', 'Pipeline', 'Environment separation', 'Vault', 'Infrastructure as code', 'Approvals', 'Telemetry'],
    designDecisions: [
      'Production credentials do not live on workstations.',
      'Separation of duties matches the change risk.',
      'A failed health check blocks the rollout where the service has one.',
    ],
    security: [
      'Protect the pipeline as a production system.',
      'Pin dependencies that the team intends to trust.',
      'Scan images before they are admitted to the registry used by production.',
    ],
    availability: 'Roll forward or roll back should both be boring. Write which one the service uses.',
    dr: 'Pipelines should be able to rebuild an environment. That is part of recovery, not a separate ideal.',
    cost: 'Long-lived unused environments are a delivery habit. Give them an expiry.',
    lessons: [
      'DevOps work fails when the architecture is only a slide. The pipeline is where the standard either exists or does not.',
      'Start with one paved path for one type of service.',
    ],
    technologies: ['DevOps', 'Automation', 'Docker', 'AKS', 'Key Vault', 'APIs'],
    relatedProject: 'cloud-management-platform',
  },
  {
    id: 'data-platforms',
    slug: 'data-platforms',
    title: 'Data Platforms',
    category: 'Data Platforms',
    domain: 'Data',
    summary: 'Separate raw and curated data, and publish datasets with an owner.',
    problem:
      'Reports disagree because each one prepared the data differently, and nobody can say who is allowed to see a column.',
    businessRequirement:
      'The business needs a small set of trusted datasets and a place to ask questions without copying extracts into uncontrolled files.',
    architecture:
      'Ingest into a raw area that preserves the source. Transform into curated datasets with tests and an owner. Present them through analytics tools such as Power BI or Fabric. Apply access on the dataset. Keep enough lineage to explain a number. AI features sit on top of curated data, not on an unknown extract.',
    components: ['Sources', 'Ingestion', 'Raw store', 'Transform', 'Curated dataset', 'Analytics', 'Access control'],
    designDecisions: [
      'Certified datasets are few. Sandboxes are allowed and labeled as sandboxes.',
      'Access is designed with the data owner.',
      'AI retrieval uses curated or approved content, not every file share.',
    ],
    security: [
      'Classify data before it is copied into a model or an index.',
      'Separate analytical identities from operational admin roles.',
      'Do not put production secrets in data pipelines as plain configuration.',
    ],
    availability: 'State which reports are operationally important and give those pipelines an alert.',
    dr: 'Know how to rebuild curated data from raw or from source. Back up what cannot be rebuilt.',
    cost: 'Warehouse cost follows scan size and retention. Partition and retain on purpose.',
    lessons: [
      'A dashboard without an owner will be quoted in a meeting and then disowned.',
      'The platform boundary is the certified dataset, not the visualization tool.',
    ],
    technologies: ['SQL', 'Power BI', 'Microsoft Fabric', 'Azure Storage', 'Pipelines'],
    relatedArchitecture: 'data-platform',
  },
]
