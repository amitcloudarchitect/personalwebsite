import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

function readSiteUrl() {
  const fromEnv = process.env.VITE_SITE_URL?.trim().replace(/\/$/, '')
  if (fromEnv) return fromEnv
  const envFile = path.join(root, '.env')
  if (!fs.existsSync(envFile)) return ''
  const line = fs
    .readFileSync(envFile, 'utf8')
    .split(/\r?\n/)
    .find((entry) => entry.startsWith('VITE_SITE_URL='))
  if (!line) return ''
  return line
    .slice('VITE_SITE_URL='.length)
    .trim()
    .replace(/^["']|["']$/g, '')
    .replace(/\/$/, '')
}

function slugs(file, { skipPlaceholder = false } = {}) {
  const text = fs.readFileSync(path.join(root, file), 'utf8')
  const found = []
  const expression = /slug:\s*'([^']+)'/g
  let match = expression.exec(text)
  while (match) {
    const slice = text.slice(Math.max(0, match.index - 800), match.index + 800)
    if (!(skipPlaceholder && /placeholder:\s*true/.test(slice))) found.push(match[1])
    match = expression.exec(text)
  }
  return found
}

const staticPaths = [
  '/',
  '/about',
  '/experience',
  '/projects',
  '/solutions',
  '/ai-lab',
  '/articles',
  '/videos',
  '/certifications',
  '/speaking',
  '/architecture',
  '/contact',
]

const paths = [
  ...staticPaths,
  ...slugs('src/data/projects.ts').map((slug) => `/projects/${slug}`),
  ...slugs('src/data/solutions.ts').map((slug) => `/solutions/${slug}`),
  ...slugs('src/data/aiLab.ts').map((slug) => `/ai-lab/${slug}`),
  ...slugs('src/data/architecture.ts').map((slug) => `/architecture/${slug}`),
  ...slugs('src/data/articles.ts', { skipPlaceholder: true }).map((slug) => `/articles/${slug}`),
]

const siteUrl = readSiteUrl()
if (!siteUrl) {
  console.warn('VITE_SITE_URL is empty. Sitemap locations will be path-only until you set it and rebuild.')
}

const lastmod = new Date().toISOString().slice(0, 10)
const urls = paths
  .map((route) => {
    const loc = siteUrl ? `${siteUrl}${route}` : route
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
  })
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
fs.mkdirSync(path.join(root, 'public'), { recursive: true })
fs.writeFileSync(path.join(root, 'public', 'sitemap.xml'), sitemap)

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl ? `${siteUrl}/sitemap.xml` : '/sitemap.xml'}\n`
fs.writeFileSync(path.join(root, 'public', 'robots.txt'), robots)
console.log(`Wrote sitemap with ${paths.length} urls`)
