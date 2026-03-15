'use client'

interface ReplyEditorProps {
  body: string
  onChange: (body: string) => void
}

export function ReplyEditor({ body, onChange }: ReplyEditorProps) {
  return (
    <div>
      <textarea
        value={body}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="w-full resize-y p-3 text-sm focus:outline-none"
        style={{
          borderRadius: 0,
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-primary)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#C9A96E'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-default)'
        }}
      />
      <p className="mt-1 text-xs text-right" style={{ color: 'var(--text-muted)' }}>
        {body.length} characters
      </p>
    </div>
  )
}
