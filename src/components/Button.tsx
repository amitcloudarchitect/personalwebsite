import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '@/utils/classNames'
import { safeHttpUrl } from '@/utils/urls'

const styles = {
  primary: 'border-accent bg-accent text-accent-fg hover:opacity-90',
  secondary: 'border-line bg-surface text-ink hover:border-accent',
  inverted: 'border-transparent bg-canvas text-ink hover:opacity-90',
}

type ButtonProps = {
  children: ReactNode
  to?: string
  href?: string
  variant?: keyof typeof styles
  className?: string
  onClick?: () => void
}

export function Button({ children, to, href, variant = 'primary', className, onClick }: ButtonProps) {
  const classes = cx(
    'inline-flex items-center justify-center gap-2 rounded-sm border px-5 py-2.5 text-sm font-medium tracking-wide transition-opacity',
    styles[variant],
    className,
  )

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {children}
      </Link>
    )
  }

  const url = safeHttpUrl(href)
  if (url) {
    const external = url.startsWith('http')
    return (
      <a href={url} className={classes} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  )
}
