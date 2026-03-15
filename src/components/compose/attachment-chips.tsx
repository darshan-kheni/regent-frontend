'use client'

import { useRef } from 'react'
import { Paperclip, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { formatBytes } from '@/lib/utils'

interface AttachmentChipsProps {
  files: File[]
  onAdd: (files: FileList) => void
  onRemove: (index: number) => void
}

export function AttachmentChips({ files, onAdd, onRemove }: AttachmentChipsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onAdd(e.target.files)
            // Reset to allow re-selecting the same file
            e.target.value = ''
          }
        }}
      />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
      >
        <Paperclip className="h-4 w-4 mr-1.5" />
        Attach
      </Button>

      {files.map((file, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1.5 px-2 py-1 text-xs"
          style={{
            borderRadius: 0,
            backgroundColor: 'var(--accent-subtle)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-default)',
          }}
        >
          <Paperclip className="h-3 w-3" />
          <span className="max-w-[150px] truncate">{file.name}</span>
          <span style={{ color: 'var(--text-muted)' }}>
            ({formatBytes(file.size)})
          </span>
          <button
            type="button"
            className="inline-flex items-center justify-center h-3.5 w-3.5 hover:opacity-70"
            onClick={() => onRemove(index)}
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  )
}
