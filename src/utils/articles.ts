const articleFiles = import.meta.glob('../content/articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export function getArticleBody(slug: string) {
  const match = Object.entries(articleFiles).find(([path]) => path.endsWith(`/${slug}.md`))
  return match?.[1]
}
