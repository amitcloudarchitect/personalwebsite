import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type ProviderId = 'google' | 'microsoft' | 'facebook'

export type CommunityUser = {
  id: string
  name: string
  provider: ProviderId
  avatar?: string
}

export type AuthProvider = {
  id: ProviderId
  label: string
  configured: boolean
}

type SessionState = {
  user: CommunityUser | null
  providers: AuthProvider[]
  ready: boolean
  unavailable: boolean
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const SessionContext = createContext<SessionState | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CommunityUser | null>(null)
  const [providers, setProviders] = useState<AuthProvider[]>([])
  const [ready, setReady] = useState(false)
  const [unavailable, setUnavailable] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session')
      if (!response.ok) throw new Error('session')
      const data = (await response.json()) as { user: CommunityUser | null; providers: AuthProvider[] }
      setUser(data.user)
      setProviders(Array.isArray(data.providers) ? data.providers : [])
      setUnavailable(false)
    } catch {
      setUnavailable(true)
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    let active = true
    fetch('/api/auth/session')
      .then((response) => {
        if (!response.ok) throw new Error('session')
        return response.json() as Promise<{ user: CommunityUser | null; providers: AuthProvider[] }>
      })
      .then((data) => {
        if (!active) return
        setUser(data.user)
        setProviders(Array.isArray(data.providers) ? data.providers : [])
        setUnavailable(false)
      })
      .catch(() => {
        if (active) setUnavailable(true)
      })
      .finally(() => {
        if (active) setReady(true)
      })
    return () => {
      active = false
    }
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, providers, ready, unavailable, refresh, logout }),
    [user, providers, ready, unavailable, refresh, logout],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) throw new Error('useSession must be used within SessionProvider')
  return context
}
