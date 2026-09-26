import { ArchitectureDiagram } from '@/components/ArchitectureDiagram'
import type { DiagramSpec } from '@/types'
import { safeHttpUrl } from '@/utils/urls'

type DiagramFrameProps = {
  title: string
  spec?: DiagramSpec
  image?: string
  onExpand?: () => void
}

export function DiagramFrame({ title, spec, image, onExpand }: DiagramFrameProps) {
  const src = safeHttpUrl(image)
  const visual = src ? (
    <img src={src} alt={title} className="aspect-[1000/560] h-auto w-full object-contain" loading="lazy" decoding="async" />
  ) : spec ? (
    <ArchitectureDiagram spec={spec} title={title} />
  ) : null

  if (!visual) return null

  if (!onExpand) {
    return <div className="border border-line bg-surface">{visual}</div>
  }

  return (
    <button type="button" onClick={onExpand} className="block w-full border border-line bg-surface text-left" aria-label={`Expand diagram: ${title}`}>
      {visual}
    </button>
  )
}
