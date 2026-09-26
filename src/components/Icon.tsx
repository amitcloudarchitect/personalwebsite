import {
  BookOpen,
  Bot,
  Boxes,
  Brain,
  Cloud,
  Coins,
  Container,
  Cpu,
  Database,
  GitBranch,
  Layers,
  Lock,
  Network,
  Radar,
  RefreshCw,
  Search,
  Server,
  Shield,
  Sparkles,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import type { IconName } from '@/types'

const icons: Record<IconName, LucideIcon> = {
  cloud: Cloud,
  brain: Brain,
  spark: Sparkles,
  layers: Layers,
  refresh: RefreshCw,
  boxes: Boxes,
  workflow: Workflow,
  coins: Coins,
  shield: Shield,
  git: GitBranch,
  server: Server,
  network: Network,
  database: Database,
  bot: Bot,
  search: Search,
  lock: Lock,
  container: Container,
  cpu: Cpu,
  book: BookOpen,
  radar: Radar,
}

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Component = icons[name]
  return <Component className={className} aria-hidden="true" />
}
