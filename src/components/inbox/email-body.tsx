'use client'

import { useMemo } from 'react'

interface EmailBodyProps {
  bodyHtml: string | null
  bodyText: string
}

function EmailBody({ bodyHtml, bodyText }: EmailBodyProps) {
  const sanitizedHtml = useMemo(() => {
    if (!bodyHtml || typeof window === 'undefined') return null

    // Dynamic import is not ideal in useMemo, so we access the already-loaded module
    // DOMPurify is only available client-side
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const DOMPurifyModule = require('dompurify')
      const purify = (DOMPurifyModule.default ?? DOMPurifyModule) as { sanitize: (dirty: string, config?: Record<string, unknown>) => string }
      return purify.sanitize(bodyHtml, {
        FORBID_TAGS: ['script', 'form', 'iframe', 'object', 'embed'],
        FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover'],
        ALLOW_DATA_ATTR: false,
      })
    } catch {
      return null
    }
  }, [bodyHtml])

  // Detect complex HTML (tables or originally had iframes) to use sandboxed iframe
  const isComplexHtml = useMemo(() => {
    if (!bodyHtml) return false
    return /<table[\s>]/i.test(bodyHtml) || /<iframe[\s>]/i.test(bodyHtml)
  }, [bodyHtml])

  // No HTML content: render plain text
  if (!bodyHtml || !sanitizedHtml) {
    return (
      <div
        className="text-sm leading-relaxed"
        style={{
          color: 'var(--text-primary)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {bodyText}
      </div>
    )
  }

  // Complex HTML: render in sandboxed iframe for safety
  if (isComplexHtml) {
    return (
      <iframe
        sandbox=""
        srcDoc={sanitizedHtml}
        title="Email content"
        style={{
          border: 'none',
          width: '100%',
          minHeight: 400,
          backgroundColor: 'transparent',
        }}
        onLoad={(e) => {
          // Auto-resize iframe to fit content
          const frame = e.currentTarget
          try {
            const height = frame.contentDocument?.documentElement?.scrollHeight
            if (height) frame.style.height = `${height + 20}px`
          } catch {
            // Cross-origin restriction, keep default height
          }
        }}
      />
    )
  }

  // Simple HTML: render sanitized inline
  return (
    <div
      className="text-sm leading-relaxed email-body-content"
      style={{
        color: 'var(--text-primary)',
        wordBreak: 'break-word',
      }}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  )
}

export { EmailBody, type EmailBodyProps }
