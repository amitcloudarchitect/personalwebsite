import { Button } from '@/components/Button'
import { Seo } from '@/components/Seo'

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found" description="The requested page is not part of this site." path="/404" noindex />
      <div className="mx-auto max-w-6xl px-5 py-24">
        <p className="kicker">404</p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink">This page is not on the site</h1>
        <p className="mt-4 max-w-xl text-muted">The address may be mistyped, or the entry has not been published yet.</p>
        <div className="mt-8">
          <Button to="/">Back to home</Button>
        </div>
      </div>
    </>
  )
}
