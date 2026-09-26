import { profile } from '@/data/profile'
import { safeHttpUrl } from '@/utils/urls'

export function Portrait() {
  const src = safeHttpUrl(profile.photo.src)

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-sm border border-line bg-surface">
      <div className="absolute inset-4 overflow-hidden border border-line bg-canvas">
        {src ? (
          <img
            src={src}
            alt={profile.photo.alt}
            className="h-full w-full object-cover"
            width={640}
            height={800}
            fetchPriority="high"
            decoding="async"
          />
        ) : (
          <div className="grid-fade flex h-full flex-col items-center justify-center gap-3 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-sm bg-accent font-display text-xl text-accent-fg" aria-hidden="true">
              {profile.monogram}
            </span>
            <p className="px-6 kicker">Portrait placeholder</p>
          </div>
        )}
      </div>
    </div>
  )
}
