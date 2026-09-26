import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { defaultConfig } from '@/data/site'
import type { SiteConfig } from '@/types'

const ConfigContext = createContext<SiteConfig>(defaultConfig)

function pick(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState(defaultConfig)

  useEffect(() => {
    let active = true
    fetch('/config.json')
      .then((response) => (response.ok ? response.json() : null))
      .then((data: unknown) => {
        if (!active || !data || typeof data !== 'object') return
        const record = data as Record<string, unknown>
        setConfig((current) => ({
          siteUrl: pick(record.siteUrl, current.siteUrl).replace(/\/$/, ''),
          linkedin: pick(record.linkedin, current.linkedin),
          github: pick(record.github, current.github),
          email: pick(record.email, current.email),
          youtube: pick(record.youtube, current.youtube),
          resumeUrl: pick(record.resumeUrl, current.resumeUrl),
        }))
      })
      .catch(() => undefined)

    return () => {
      active = false
    }
  }, [])

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
}

export function useConfig() {
  return useContext(ConfigContext)
}
