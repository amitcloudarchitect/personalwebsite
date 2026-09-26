import { useId } from 'react'
import type { DiagramSpec } from '@/types'

function labelLines(label: string) {
  if (label.length <= 18) return [label]
  const splitAt = label.lastIndexOf(' ', 18)
  if (splitAt <= 0) return [label]
  return [label.slice(0, splitAt), label.slice(splitAt + 1)]
}

export function ArchitectureDiagram({ spec, title }: { spec: DiagramSpec; title: string }) {
  const patternId = `grid-${useId().replace(/:/g, '')}`
  const width = 1000
  const height = 560

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title} className="h-auto w-full">
      <defs>
        <pattern id={patternId} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--line)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={width} height={height} fill="var(--surface)" />
      <rect width={width} height={height} fill={`url(#${patternId})`} />
      {spec.edges.map((edge) => {
        const from = spec.nodes.find((node) => node.id === edge.from)
        const to = spec.nodes.find((node) => node.id === edge.to)
        if (!from || !to) return null
        return (
          <line
            key={`${edge.from}-${edge.to}`}
            x1={(from.x / 100) * width}
            y1={(from.y / 100) * height}
            x2={(to.x / 100) * width}
            y2={(to.y / 100) * height}
            stroke="var(--accent)"
            strokeOpacity="0.55"
            strokeWidth="1.5"
          />
        )
      })}
      {spec.nodes.map((node) => {
        const lines = labelLines(node.label)
        const x = (node.x / 100) * width
        const y = (node.y / 100) * height
        return (
          <g key={node.id} transform={`translate(${x} ${y})`}>
            <rect
              x={-84}
              y={-28}
              width={168}
              height={56}
              rx="2"
              fill="var(--canvas)"
              stroke={node.tone === 'accent' ? 'var(--accent)' : 'var(--line)'}
              strokeWidth={node.tone === 'accent' ? 1.5 : 1}
            />
            <text textAnchor="middle" fill="var(--ink)" fontSize="14" fontFamily="Segoe UI, Helvetica Neue, Arial, sans-serif">
              {lines.map((line, index) => (
                <tspan key={line} x="0" dy={index === 0 ? (lines.length === 1 ? 4 : -4) : 16}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
