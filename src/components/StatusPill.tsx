import { cx } from '@/utils/classNames'

export function StatusPill({ children, dashed = false }: { children: string; dashed?: boolean }) {
  return (
    <span
      className={cx(
        'inline-flex rounded-sm border px-2 py-0.5 text-[11px]',
        dashed ? 'border-dashed border-muted text-muted' : 'border-accent text-accent',
      )}
    >
      {children}
    </span>
  )
}
