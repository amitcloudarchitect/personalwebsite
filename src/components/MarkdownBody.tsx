import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { safeHttpUrl } from '@/utils/urls'

export function MarkdownBody({ content }: { content: string }) {
  return (
    <div className="prose-ak">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const url = safeHttpUrl(href)
            if (!url) return <span>{children}</span>
            const external = url.startsWith('http')
            return (
              <a href={url} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                {children}
              </a>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
