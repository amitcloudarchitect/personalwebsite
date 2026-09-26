import crypto from 'node:crypto'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { withStore } from './store.mjs'

const port = Number(process.env.PORT || 8787)
const sessionDays = 14
const secret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex')

if (!process.env.SESSION_SECRET) {
  console.warn('SESSION_SECRET is not set. Sessions will reset when the API process restarts.')
}

const providers = {
  google: {
    label: 'Gmail',
    pkce: true,
    auth: 'https://accounts.google.com/o/oauth2/v2/auth',
    token: 'https://oauth2.googleapis.com/token',
    scope: 'openid email profile',
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    extraAuth: { prompt: 'select_account' },
    profile: async (token) => {
      const data = await getJson('https://www.googleapis.com/oauth2/v3/userinfo', token)
      return { providerId: data.sub, name: data.name, email: data.email, avatar: data.picture }
    },
  },
  microsoft: {
    label: 'Outlook',
    pkce: true,
    auth: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    token: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    scope: 'openid profile email User.Read',
    clientId: process.env.MICROSOFT_CLIENT_ID || '',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
    extraAuth: { prompt: 'select_account' },
    profile: async (token) => {
      const data = await getJson('https://graph.microsoft.com/oidc/userinfo', token)
      return {
        providerId: data.sub,
        name: data.name,
        email: data.email || data.preferred_username,
        avatar: '',
      }
    },
  },
  facebook: {
    label: 'Facebook',
    pkce: false,
    auth: 'https://www.facebook.com/v19.0/dialog/oauth',
    token: 'https://graph.facebook.com/v19.0/oauth/access_token',
    scope: 'email,public_profile',
    clientId: process.env.FACEBOOK_APP_ID || '',
    clientSecret: process.env.FACEBOOK_APP_SECRET || '',
    extraAuth: {},
    profile: async (token) => {
      const data = await getJson(
        'https://graph.facebook.com/me?fields=id,name,email,picture.type(large)',
        token,
      )
      return {
        providerId: data.id,
        name: data.name,
        email: data.email,
        avatar: data.picture?.data?.url,
      }
    },
  },
}

function configured(provider) {
  return Boolean(provider.clientId && provider.clientSecret)
}

function articleSlugs() {
  const file = path.join(process.cwd(), 'src', 'data', 'articles.ts')
  if (!fs.existsSync(file)) return null
  const text = fs.readFileSync(file, 'utf8')
  const slugs = new Set()
  const expression = /slug:\s*'([^']+)'/g
  let match = expression.exec(text)
  while (match) {
    slugs.add(match[1])
    match = expression.exec(text)
  }
  return slugs
}

const knownSlugs = articleSlugs()

function sign(value) {
  const mac = crypto.createHmac('sha256', secret).update(value).digest('base64url')
  return `${value}.${mac}`
}

function unsign(signed) {
  if (typeof signed !== 'string') return null
  const index = signed.lastIndexOf('.')
  if (index <= 0) return null
  const value = signed.slice(0, index)
  const mac = signed.slice(index + 1)
  const expected = crypto.createHmac('sha256', secret).update(value).digest('base64url')
  const left = Buffer.from(mac)
  const right = Buffer.from(expected)
  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) return null
  return value
}

function cookies(request) {
  const header = request.headers.cookie || ''
  const result = {}
  for (const part of header.split(';')) {
    const index = part.indexOf('=')
    if (index === -1) continue
    const key = part.slice(0, index).trim()
    result[key] = decodeURIComponent(part.slice(index + 1).trim())
  }
  return result
}

function cookie(name, value, request, { maxAge = 0, clear = false } = {}) {
  const forwarded = request.headers['x-forwarded-proto']
  const proto = (typeof forwarded === 'string' ? forwarded.split(',')[0] : 'http').trim()
  const secure = proto === 'https' || process.env.COOKIE_SECURE === 'true' ? '; Secure' : ''
  const age = clear ? 0 : maxAge
  return `${name}=${encodeURIComponent(value)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${age}${secure}`
}

function originOf(request) {
  const forwarded = request.headers['x-forwarded-proto']
  const proto = (typeof forwarded === 'string' ? forwarded.split(',')[0] : 'http').trim()
  const hostHeader = request.headers['x-forwarded-host'] || request.headers.host || 'localhost'
  const host = (typeof hostHeader === 'string' ? hostHeader.split(',')[0] : 'localhost').trim()
  return `${proto}://${host}`
}

function clientAddress(request) {
  const forwarded = request.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.trim()) return forwarded.split(',')[0].trim()
  return request.socket.remoteAddress || 'unknown'
}

function safeReturn(value) {
  if (typeof value !== 'string' || value.length > 240) return '/'
  if (!value.startsWith('/') || value.startsWith('//')) return '/'
  if (!/^\/[A-Za-z0-9/?&=._~%-]*$/.test(value)) return '/'
  return value
}

function withQuery(target, key, value) {
  const url = new URL(target, 'http://localhost')
  url.searchParams.set(key, value)
  return `${url.pathname}${url.search}`
}

function publicUser(user) {
  if (!user) return null
  return {
    id: user.id,
    name: user.name,
    provider: user.provider,
    ...(user.avatar ? { avatar: user.avatar } : {}),
  }
}

function publicComment(comment, users) {
  const author = users.find((user) => user.id === comment.userId)
  return {
    id: comment.id,
    parentId: comment.parentId,
    body: comment.body,
    createdAt: comment.createdAt,
    author: publicUser(author) || { id: 'removed', name: 'Reader', provider: 'google' },
  }
}

async function getJson(url, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const response = await fetch(url, { headers })
  const data = await response.json()
  if (!response.ok) throw new Error('profile request failed')
  return data
}

function safeAvatar(value) {
  if (typeof value !== 'string' || !value) return ''
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.toString() : ''
  } catch {
    return ''
  }
}

function cleanText(value) {
  if (typeof value !== 'string') return ''
  let cleaned = ''
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0
    if (code < 32 && code !== 9 && code !== 10 && code !== 13) continue
    cleaned += char
  }
  return cleaned.replace(/\n{3,}/g, '\n\n').trim()
}

function validEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) && value.trim().length <= 160
}

const limits = new Map()

function limited(key, maximum, windowMs) {
  const now = Date.now()
  const current = limits.get(key)
  if (!current || current.reset < now) {
    limits.set(key, { count: 1, reset: now + windowMs })
    return false
  }
  current.count += 1
  return current.count > maximum
}

function send(response, status, payload, extraHeaders = {}) {
  const body = JSON.stringify(payload)
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...extraHeaders,
  })
  response.end(body)
}

function redirect(response, location, setCookies = []) {
  response.writeHead(302, {
    Location: location,
    'Cache-Control': 'no-store',
    ...(setCookies.length ? { 'Set-Cookie': setCookies } : {}),
  })
  response.end()
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    let settled = false
    const fail = (error) => {
      if (settled) return
      settled = true
      reject(error)
    }
    const ok = (value) => {
      if (settled) return
      settled = true
      resolve(value)
    }
    request.on('data', (chunk) => {
      size += chunk.length
      if (size > 20_000) {
        fail(new Error('too large'))
        request.destroy()
        return
      }
      chunks.push(chunk)
    })
    request.on('end', () => {
      if (!chunks.length) {
        ok({})
        return
      }
      try {
        ok(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        fail(new Error('invalid json'))
      }
    })
    request.on('error', fail)
  })
}

function allowedOrigin(request) {
  const origin = request.headers.origin
  if (!origin) return true
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true
  const allowed = new Set()
  const configured = (process.env.PUBLIC_SITE_URL || process.env.VITE_SITE_URL || '').split(',')
  for (const entry of configured) {
    const site = entry.trim().replace(/\/$/, '')
    if (!site) continue
    allowed.add(site)
    try {
      const url = new URL(site)
      const host = url.hostname.startsWith('www.') ? url.hostname.slice(4) : `www.${url.hostname}`
      allowed.add(`${url.protocol}//${host}`)
    } catch {
      /* ignore a value that is not an origin */
    }
  }
  return allowed.has(origin)
}

async function currentUser(request) {
  const raw = cookies(request).ak_session
  const sessionId = unsign(raw || '')
  if (!sessionId) return null
  return withStore((data) => {
    const now = Date.now()
    const session = data.sessions.find((item) => item.id === sessionId && item.expires > now)
    const user = session ? data.users.find((item) => item.id === session.userId) : null
    return { value: user || null }
  })
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', 'http://localhost')
    const pathname = url.pathname

    if (request.method === 'GET' && pathname === '/api/health') {
      send(response, 200, { ok: true })
      return
    }

    if (request.method === 'GET' && pathname === '/api/auth/session') {
      const user = await currentUser(request)
      send(response, 200, {
        user: publicUser(user),
        providers: Object.entries(providers).map(([id, provider]) => ({
          id,
          label: provider.label,
          configured: configured(provider),
        })),
      })
      return
    }

    if (request.method === 'POST' && pathname === '/api/auth/logout') {
      if (!allowedOrigin(request)) {
        send(response, 403, { error: 'This action is not allowed from that origin.' })
        return
      }
      const sessionId = unsign(cookies(request).ak_session || '')
      if (sessionId) {
        await withStore((data) => {
          data.sessions = data.sessions.filter((item) => item.id !== sessionId)
          return { save: true }
        })
      }
      send(response, 200, { ok: true }, { 'Set-Cookie': cookie('ak_session', '', request, { clear: true }) })
      return
    }

    const start = pathname.match(/^\/api\/auth\/(google|microsoft|facebook)\/start$/)
    if (request.method === 'GET' && start) {
      const provider = providers[start[1]]
      if (!configured(provider)) {
        redirect(response, withQuery(safeReturn(url.searchParams.get('returnTo')), 'authError', 'unconfigured'))
        return
      }
      const state = crypto.randomBytes(16).toString('base64url')
      const verifier = crypto.randomBytes(32).toString('base64url')
      const challenge = crypto.createHash('sha256').update(verifier).digest('base64url')
      const returnTo = safeReturn(url.searchParams.get('returnTo'))
      const payload = Buffer.from(JSON.stringify({ state, verifier, returnTo, exp: Date.now() + 10 * 60 * 1000 })).toString('base64url')
      const redirectUri = `${originOf(request)}/api/auth/${start[1]}/callback`
      const auth = new URL(provider.auth)
      auth.searchParams.set('client_id', provider.clientId)
      auth.searchParams.set('redirect_uri', redirectUri)
      auth.searchParams.set('response_type', 'code')
      auth.searchParams.set('scope', provider.scope)
      auth.searchParams.set('state', state)
      for (const [key, value] of Object.entries(provider.extraAuth)) auth.searchParams.set(key, value)
      if (provider.pkce) {
        auth.searchParams.set('code_challenge', challenge)
        auth.searchParams.set('code_challenge_method', 'S256')
      }
      redirect(response, auth.toString(), [cookie('ak_oauth', sign(payload), request, { maxAge: 600 })])
      return
    }

    const callback = pathname.match(/^\/api\/auth\/(google|microsoft|facebook)\/callback$/)
    if (request.method === 'GET' && callback) {
      const providerName = callback[1]
      const provider = providers[providerName]
      const payloadRaw = unsign(cookies(request).ak_oauth || '')
      const clearOauth = cookie('ak_oauth', '', request, { clear: true })
      let saved = null
      try {
        saved = payloadRaw ? JSON.parse(Buffer.from(payloadRaw, 'base64url').toString('utf8')) : null
      } catch {
        saved = null
      }
      const returnTo = safeReturn(saved?.returnTo)
      if (!saved || saved.exp < Date.now() || saved.state !== url.searchParams.get('state') || !url.searchParams.get('code')) {
        redirect(response, withQuery(returnTo, 'authError', 'denied'), [clearOauth])
        return
      }
      try {
        const redirectUri = `${originOf(request)}/api/auth/${providerName}/callback`
        const body = new URLSearchParams({
          client_id: provider.clientId,
          client_secret: provider.clientSecret,
          code: url.searchParams.get('code'),
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        })
        if (provider.pkce) body.set('code_verifier', saved.verifier)
        const tokenResponse = await fetch(provider.token, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
          body,
        })
        const tokenData = await tokenResponse.json()
        if (!tokenResponse.ok || !tokenData.access_token) throw new Error('token')
        const profile = await provider.profile(tokenData.access_token)
        if (!profile.providerId || !profile.name) throw new Error('profile')
        const user = await withStore((data) => {
          let existing = data.users.find((item) => item.provider === providerName && item.providerId === String(profile.providerId))
          if (!existing) {
            existing = {
              id: crypto.randomUUID(),
              provider: providerName,
              providerId: String(profile.providerId),
              name: String(profile.name).slice(0, 80),
              email: typeof profile.email === 'string' ? profile.email.slice(0, 160) : '',
              avatar: safeAvatar(profile.avatar),
              createdAt: new Date().toISOString(),
            }
            data.users.push(existing)
          } else {
            existing.name = String(profile.name).slice(0, 80)
            existing.avatar = safeAvatar(profile.avatar)
            if (typeof profile.email === 'string') existing.email = profile.email.slice(0, 160)
          }
          const session = {
            id: crypto.randomBytes(24).toString('base64url'),
            userId: existing.id,
            expires: Date.now() + sessionDays * 24 * 60 * 60 * 1000,
          }
          data.sessions = data.sessions.filter((item) => item.expires > Date.now())
          data.sessions.push(session)
          return { save: true, value: session.id }
        })
        redirect(response, returnTo, [
          clearOauth,
          cookie('ak_session', sign(user), request, { maxAge: sessionDays * 24 * 60 * 60 }),
        ])
      } catch {
        console.error(`Sign-in failed for ${providerName}`)
        redirect(response, withQuery(returnTo, 'authError', 'failed'), [clearOauth])
      }
      return
    }

    const commentsMatch = pathname.match(/^\/api\/articles\/([a-z0-9-]{3,80})\/comments$/)
    if (commentsMatch && request.method === 'GET') {
      const slug = commentsMatch[1]
      if (knownSlugs && !knownSlugs.has(slug)) {
        send(response, 404, { error: 'Article not found.' })
        return
      }
      const comments = await withStore((data) => ({
        value: data.comments.filter((item) => item.articleSlug === slug).map((item) => publicComment(item, data.users)),
      }))
      send(response, 200, { comments })
      return
    }

    if (commentsMatch && request.method === 'POST') {
      if (!allowedOrigin(request)) {
        send(response, 403, { error: 'This action is not allowed from that origin.' })
        return
      }
      const slug = commentsMatch[1]
      if (knownSlugs && !knownSlugs.has(slug)) {
        send(response, 404, { error: 'Article not found.' })
        return
      }
      const user = await currentUser(request)
      if (!user) {
        send(response, 401, { error: 'Sign in to join the discussion.' })
        return
      }
      if (limited(`comment:${user.id}`, 20, 60 * 60 * 1000)) {
        send(response, 429, { error: 'Please wait before posting again.' })
        return
      }
      let payload
      try {
        payload = await readBody(request)
      } catch {
        send(response, 400, { error: 'The comment could not be read.' })
        return
      }
      const body = cleanText(payload.body)
      if (body.length < 2 || body.length > 1200) {
        send(response, 400, { error: 'Write between 2 and 1200 characters.' })
        return
      }
      const parentId = typeof payload.parentId === 'string' ? payload.parentId : null
      const created = await withStore((data) => {
        if (data.comments.filter((item) => item.articleSlug === slug).length >= 500) {
          return { value: { error: 'This discussion is full.' } }
        }
        if (parentId) {
          const parent = data.comments.find((item) => item.id === parentId && item.articleSlug === slug)
          if (!parent || parent.parentId) return { value: { error: 'Reply to an existing comment.' } }
        }
        const comment = {
          id: crypto.randomUUID(),
          articleSlug: slug,
          parentId,
          userId: user.id,
          body,
          createdAt: new Date().toISOString(),
        }
        data.comments.push(comment)
        return { save: true, value: { comment: publicComment(comment, data.users) } }
      })
      if (created.error) {
        send(response, 400, { error: created.error })
        return
      }
      send(response, 201, created)
      return
    }

    const deleteMatch = pathname.match(/^\/api\/articles\/([a-z0-9-]{3,80})\/comments\/([0-9a-f-]{36})$/)
    if (deleteMatch && request.method === 'DELETE') {
      if (!allowedOrigin(request)) {
        send(response, 403, { error: 'This action is not allowed from that origin.' })
        return
      }
      const user = await currentUser(request)
      if (!user) {
        send(response, 401, { error: 'Sign in to remove a comment.' })
        return
      }
      const removed = await withStore((data) => {
        const comment = data.comments.find((item) => item.id === deleteMatch[2] && item.articleSlug === deleteMatch[1])
        if (!comment || comment.userId !== user.id) return { value: false }
        data.comments = data.comments.filter((item) => item.id !== comment.id && item.parentId !== comment.id)
        return { save: true, value: true }
      })
      if (!removed) {
        send(response, 404, { error: 'Comment not found.' })
        return
      }
      send(response, 200, { ok: true })
      return
    }

    if (request.method === 'POST' && pathname === '/api/newsletter') {
      if (!allowedOrigin(request)) {
        send(response, 403, { error: 'This action is not allowed from that origin.' })
        return
      }
      if (limited(`news:${clientAddress(request)}`, 8, 60 * 60 * 1000)) {
        send(response, 429, { error: 'Please wait before subscribing again.' })
        return
      }
      let payload
      try {
        payload = await readBody(request)
      } catch {
        send(response, 400, { error: 'The address could not be read.' })
        return
      }
      if (!validEmail(payload.email)) {
        send(response, 400, { error: 'Enter a valid email address.' })
        return
      }
      const email = payload.email.trim().toLowerCase()
      await withStore((data) => {
        if (!data.subscribers.some((item) => item.email === email)) {
          data.subscribers.push({ id: crypto.randomUUID(), email, createdAt: new Date().toISOString() })
          return { save: true }
        }
        return { save: false }
      })
      send(response, 200, { ok: true })
      return
    }

    send(response, 404, { error: 'Not found.' })
  } catch (error) {
    console.error(error)
    if (!response.headersSent) send(response, 500, { error: 'Something went wrong.' })
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Community API listening on http://127.0.0.1:${port}`)
})
