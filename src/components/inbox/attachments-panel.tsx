'use client'

import { Card } from '@/components/ui/card'
import { FileText, Image, File, Download } from 'lucide-react'
import { formatBytes } from '@/lib/utils'
import type { Attachment } from '@/types/email'

interface AttachmentsPanelProps {
  attachments: Attachment[]
}

function getFileIcon(contentType: string) {
  if (contentType.startsWith('image/')) return Image
  if (
    contentType.includes('pdf') ||
    contentType.includes('document') ||
    contentType.includes('text')
  ) return FileText
  return File
}

function AttachmentsPanel({ attachments }: AttachmentsPanelProps) {
  if (attachments.length === 0) return null

  return (
    <div className="mb-6">
      <h3
        className="text-xs font-medium uppercase tracking-wider mb-3"
        style={{ color: 'var(--text-muted)' }}
      >
        Attachments ({attachments.length})
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {attachments.map((attachment, index) => {
          const IconComponent = getFileIcon(attachment.content_type)

          return (
            <Card key={index} hover padding="sm">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'var(--accent-subtle)' }}
                >
                  <IconComponent className="h-5 w-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: 'var(--text-primary)' }}
                    title={attachment.filename}
                  >
                    {attachment.filename}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {formatBytes(attachment.size)}
                  </p>
                </div>
                <a
                  href={attachment.url}
                  download={attachment.filename}
                  className="flex-shrink-0 p-1.5 transition-opacity hover:opacity-70"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label={`Download ${attachment.filename}`}
                >
                  <Download className="h-4 w-4" />
                </a>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export { AttachmentsPanel, type AttachmentsPanelProps }
