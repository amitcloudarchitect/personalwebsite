export function safeHttpUrl(value?: string) {
  if (!value) return undefined
  const trimmed = value.trim()
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.toLowerCase().includes('javascript:')) {
    return trimmed
  }
  try {
    const url = new URL(trimmed)
    if (url.protocol === 'https:' || url.protocol === 'http:') return url.toString()
  } catch {
    return undefined
  }
  return undefined
}

export function safeMailto(value?: string) {
  if (!value) return undefined
  const email = value.trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return undefined
  return `mailto:${email}`
}

export function absoluteUrl(siteUrl: string, path: string) {
  if (!siteUrl) return undefined
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}
