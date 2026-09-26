import { useId, useState, type FormEvent } from 'react'

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const fieldId = useId()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setStatus('saving')
    setMessage('')
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = (await response.json().catch(() => ({}))) as { error?: string }
      if (!response.ok) {
        setStatus('error')
        setMessage(data.error || 'That address could not be saved.')
        return
      }
      setStatus('done')
      setMessage('Saved. A letter goes out when mail delivery is connected.')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('The subscription service is not reachable.')
    }
  }

  return (
    <form onSubmit={onSubmit} className={compact ? 'max-w-xl' : 'max-w-2xl'}>
      <p className={compact ? 'font-display text-2xl text-ink' : 'font-display text-3xl font-medium text-ink'}>
        Notes on architecture
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        A short letter when a new article is published. The address stays with the site and is not shown publicly.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor={fieldId} className="text-sm text-ink">
            Email
          </label>
          <input
            id={fieldId}
            type="email"
            name="email"
            autoComplete="email"
            required
            maxLength={160}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-sm border border-line bg-surface px-3 py-2.5 text-sm text-ink"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'saving'}
          className="rounded-sm border border-accent bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg disabled:opacity-60"
        >
          {status === 'saving' ? 'Saving' : 'Subscribe'}
        </button>
      </div>
      {message ? (
        <p className="mt-3 text-sm text-muted" role="status">
          {message}
        </p>
      ) : null}
    </form>
  )
}
