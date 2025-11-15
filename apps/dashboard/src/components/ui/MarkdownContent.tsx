import { type FC, memo } from 'react'
import ReactMarkdown from 'react-markdown'
import { cn } from '@/lib/utils'

interface MarkdownContentProps {
  content: string
  className?: string
  renderMarkdown?: boolean // If false, always render as plain text
}

/**
 * Component to render text content with markdown support or preserve line breaks
 * Automatically detects if content contains markdown syntax (unless renderMarkdown is explicitly set)
 */
export const MarkdownContent: FC<MarkdownContentProps> = memo(({ content, className, renderMarkdown = true }) => {
  // Strip markdown syntax to get plain text
  const stripMarkdown = (text: string): string => {
    return text
      // Remove headers
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold/italic
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      // Remove links, keep text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove inline code
      .replace(/`([^`]+)`/g, '$1')
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      // Remove blockquotes
      .replace(/^>\s+/gm, '')
      // Remove list markers
      .replace(/^\s*[-+*]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      // Remove horizontal rules
      .replace(/^---+$/gm, '')
      .replace(/^===+$/gm, '')
  }

  // If renderMarkdown is false, always show as plain text
  if (!renderMarkdown) {
    return (
      <div className={cn('whitespace-pre-line', className)}>
        {stripMarkdown(content)}
      </div>
    )
  }

  // Detect common markdown patterns
  const hasMarkdown = /[#*_\[\]`]|^\s*[-+*]\s|^\s*\d+\.\s/m.test(content)

  if (!hasMarkdown) {
    // Plain text with preserved line breaks
    return (
      <div className={cn('whitespace-pre-line', className)}>
        {content}
      </div>
    )
  }

  // Render markdown with custom styling wrapped in a div
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 mt-6 first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 mt-5 first:mt-0">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4 first:mt-0">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2 mt-3 first:mt-0">
            {children}
          </h4>
        ),
        h5: ({ children }) => (
          <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 mt-3 first:mt-0">
            {children}
          </h5>
        ),
        h6: ({ children }) => (
          <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 mt-2 first:mt-0">
            {children}
          </h6>
        ),

        // Paragraphs
        p: ({ children }) => (
          <p className="mb-3 last:mb-0 leading-relaxed">
            {children}
          </p>
        ),

        // Lists
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-3 space-y-1 pl-2">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-3 space-y-1 pl-2">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed">
            {children}
          </li>
        ),

        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"
          >
            {children}
          </a>
        ),

        // Emphasis
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900 dark:text-white">
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className="italic text-gray-800 dark:text-gray-200">
            {children}
          </em>
        ),

        // Code
        code: ({ children, className }) => {
          const isInline = !className
          if (isInline) {
            return (
              <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono text-gray-800 dark:text-gray-200">
                {children}
              </code>
            )
          }
          return (
            <code className="block p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-mono overflow-x-auto mb-3">
              {children}
            </code>
          )
        },
        pre: ({ children }) => (
          <pre className="mb-3">
            {children}
          </pre>
        ),

        // Blockquote
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-1 mb-3 italic text-gray-700 dark:text-gray-400">
            {children}
          </blockquote>
        ),

        // Horizontal rule
        hr: () => (
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
        ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
})

MarkdownContent.displayName = 'MarkdownContent'
