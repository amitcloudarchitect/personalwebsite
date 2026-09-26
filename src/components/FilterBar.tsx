import { cx } from '@/utils/classNames'

type FilterBarProps = {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

export function FilterBar({ label, options, value, onChange }: FilterBarProps) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value === option
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={cx(
              'border px-3 py-1.5 text-sm',
              selected ? 'border-accent bg-accent text-accent-fg' : 'border-line bg-surface text-ink hover:border-accent',
            )}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
