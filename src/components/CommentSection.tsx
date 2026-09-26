import { useEffect, useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import type { CommunityUser, ProviderId } from '@/hooks/useSession'
import { useSession } from '@/hooks/useSession'

type Comment = {
  id: string
  parentId: string | null
  body: string
  createdAt: string
  author: CommunityUser
}

const providerLabel: Record<ProviderId, string> = {
  google: 'Gmail',
  microsoft: 'Outlook',
  facebook: 'Facebook',
}

function formatWhen(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function Avatar({ user }: { user: CommunityUser }) {
  const initial = user.name.trim().slice(0, 1).toUpperCase() || 'R'
  if (user.avatar) {
    return <img src={user.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
  }
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-sm text-ink" aria-hidden="true">
      {initial}
    </span>
  )
}

function SignInPanel({ returnTo }: { returnTo: string }) {
  const { providers, unavailable, ready } = useSession()

  if (!ready) return <p className="text-sm text-muted">Checking sign-in.</p>
  if (unavailable) {
    return <p className="text-sm text-muted">The discussion service is not reachable from this page.</p>
  }

  const anyConfigured = providers.some((provider) => provider.configured)

  return (
    <div id="discussion-sign-in">
      <p className="text-sm leading-relaxed text-muted">
        {anyConfigured
          ? 'Sign in with a personal account to comment. The email address is not published.'
          : 'Sign-in with Gmail, Outlook, and Facebook is ready. Add each provider’s credentials on the server to open those accounts.'}
      </p>
      <ul className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {providers.map((provider) => (
          <li key={provider.id}>
            {provider.configured ? (
              <a
                href={`/api/auth/${provider.id}/start?returnTo=${encodeURIComponent(returnTo)}`}
                className="inline-flex min-w-44 items-center justify-center rounded-sm border border-line bg-surface px-4 py-2.5 text-sm text-ink hover:border-accent"
              >
                Continue with {provider.label}
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex min-w-44 cursor-not-allowed items-center justify-center rounded-sm border border-dashed border-line px-4 py-2.5 text-sm text-muted"
              >
                Continue with {provider.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Composer({
  label,
  value,
  onChange,
  onSubmit,
  busy,
  onCancel,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  onSubmit: (event: FormEvent) => void
  busy: boolean
  onCancel?: () => void
}) {
  return (
    <form onSubmit={onSubmit} className="mt-3">
      <label className="text-sm text-ink">
        {label}
        <textarea
          required
          minLength={2}
          maxLength={1200}
          rows={4}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1 w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm leading-relaxed text-ink"
        />
      </label>
      <div className="mt-2 flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-sm border border-accent bg-accent px-4 py-2 text-sm font-medium text-accent-fg disabled:opacity-60"
        >
          {busy ? 'Posting' : 'Post'}
        </button>
        {onCancel ? (
          <button type="button" onClick={onCancel} className="text-sm text-muted">
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  )
}

export function CommentSection({ slug }: { slug: string }) {
  const { user, logout } = useSession()
  const location = useLocation()
  const [comments, setComments] = useState<Comment[]>([])
  const [draft, setDraft] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyDraft, setReplyDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [confirming, setConfirming] = useState<string | null>(null)

  const returnParams = new URLSearchParams(location.search)
  returnParams.delete('authError')
  const returnQuery = returnParams.toString()
  const returnTo = returnQuery ? `${location.pathname}?${returnQuery}` : location.pathname

  const authCode = new URLSearchParams(location.search).get('authError')
  const authNotice =
    authCode === 'unconfigured'
      ? 'That sign-in provider is not configured yet.'
      : authCode
        ? 'Sign-in did not complete. Try again.'
        : ''

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const response = await fetch(`/api/articles/${slug}/comments`)
        if (!response.ok) return
        const data = (await response.json()) as { comments: Comment[] }
        if (!cancelled) setComments(Array.isArray(data.comments) ? data.comments : [])
      } catch {
        if (!cancelled) setMessage('Comments could not be loaded.')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [slug])

  async function publish(body: string, parentId: string | null) {
    setBusy(true)
    setMessage('')
    try {
      const response = await fetch(`/api/articles/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body, parentId }),
      })
      const data = (await response.json().catch(() => ({}))) as { error?: string; comment?: Comment }
      if (!response.ok || !data.comment) {
        setMessage(data.error || 'The comment was not saved.')
        return false
      }
      setComments((current) => [...current, data.comment as Comment])
      return true
    } catch {
      setMessage('The discussion service is not reachable.')
      return false
    } finally {
      setBusy(false)
    }
  }

  async function onPost(event: FormEvent) {
    event.preventDefault()
    const saved = await publish(draft, null)
    if (saved) setDraft('')
  }

  async function onReply(event: FormEvent) {
    event.preventDefault()
    if (!replyTo) return
    const saved = await publish(replyDraft, replyTo)
    if (saved) {
      setReplyDraft('')
      setReplyTo(null)
    }
  }

  async function remove(id: string) {
    setBusy(true)
    setMessage('')
    try {
      const response = await fetch(`/api/articles/${slug}/comments/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string }
        setMessage(data.error || 'The comment could not be removed.')
        return
      }
      setComments((current) => current.filter((item) => item.id !== id && item.parentId !== id))
      setConfirming(null)
    } catch {
      setMessage('The discussion service is not reachable.')
    } finally {
      setBusy(false)
    }
  }

  const roots = comments.filter((item) => !item.parentId)

  return (
    <section className="mt-16 border-t border-line pt-10" aria-labelledby="discussion-heading">
      <h2 id="discussion-heading" className="font-display text-3xl font-medium text-ink">
        Discussion
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        {roots.length === 0 ? 'No comments yet.' : `${roots.length} ${roots.length === 1 ? 'comment' : 'comments'}`}
      </p>

      {user ? (
        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-ink">
              Signed in as {user.name}
              <span className="text-muted"> · {providerLabel[user.provider]}</span>
            </p>
            <button type="button" onClick={() => void logout()} className="text-sm text-muted">
              Sign out
            </button>
          </div>
          <Composer label="Comment" value={draft} onChange={setDraft} onSubmit={onPost} busy={busy} />
        </div>
      ) : (
        <div className="mt-6">
          <SignInPanel returnTo={returnTo || `/articles/${slug}`} />
        </div>
      )}

      {authNotice || message ? (
        <p className="mt-4 text-sm text-muted" role="status">
          {authNotice || message}
        </p>
      ) : null}

      <div className="mt-8">
        {roots.map((comment) => {
          const replies = comments.filter((item) => item.parentId === comment.id)
          const mine = user?.id === comment.author.id
          return (
            <article key={comment.id} className="border-t border-line py-5">
              <header className="flex items-center gap-3">
                <Avatar user={comment.author} />
                <div>
                  <p className="text-sm text-ink">{comment.author.name}</p>
                  <p className="text-xs text-muted">
                    {formatWhen(comment.createdAt)}
                    {comment.author.provider ? ` · ${providerLabel[comment.author.provider]}` : ''}
                  </p>
                </div>
              </header>
              <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">{comment.body}</p>
              <div className="mt-3 flex gap-4 text-sm">
                {user ? (
                  <button
                    type="button"
                    className="text-muted"
                    onClick={() => {
                      setReplyTo(comment.id)
                      setReplyDraft('')
                    }}
                  >
                    Reply
                  </button>
                ) : (
                  <a href="#discussion-sign-in" className="text-muted">
                    Sign in to reply
                  </a>
                )}
                {mine ? (
                  confirming === comment.id ? (
                    <button type="button" className="text-ink" onClick={() => void remove(comment.id)}>
                      Remove this comment
                    </button>
                  ) : (
                    <button type="button" className="text-muted" onClick={() => setConfirming(comment.id)}>
                      Remove
                    </button>
                  )
                ) : null}
              </div>
              {replyTo === comment.id && user ? (
                <Composer
                  label={`Reply to ${comment.author.name}`}
                  value={replyDraft}
                  onChange={setReplyDraft}
                  onSubmit={onReply}
                  busy={busy}
                  onCancel={() => setReplyTo(null)}
                />
              ) : null}
              {replies.length > 0 ? (
                <ul className="mt-4 space-y-4 border-l border-line pl-4">
                  {replies.map((reply) => (
                    <li key={reply.id}>
                      <header className="flex items-center gap-3">
                        <Avatar user={reply.author} />
                        <div>
                          <p className="text-sm text-ink">{reply.author.name}</p>
                          <p className="text-xs text-muted">
                            {formatWhen(reply.createdAt)}
                            {reply.author.provider ? ` · ${providerLabel[reply.author.provider]}` : ''}
                          </p>
                        </div>
                      </header>
                      <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">{reply.body}</p>
                      {user?.id === reply.author.id ? (
                        <button type="button" className="mt-2 text-sm text-muted" onClick={() => void remove(reply.id)}>
                          Remove
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}
