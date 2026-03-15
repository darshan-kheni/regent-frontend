import { formatDistanceToNow, format } from 'date-fns'

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatRelativeTime(date: string): string {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return formatDistanceToNow(d, { addSuffix: true })
}

export function formatDate(date: string, fmt: string = 'MMM d, yyyy'): string {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return format(d, fmt)
}

export function formatTokenCount(count: number): string {
  if (count == null) return '0'
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`
  return count.toString()
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Derive a display name from an email address when from_name is empty.
 * "john.doe@example.com" → "John Doe"
 * "miniso@marketing.news.miniso.com" → "Miniso"
 */
export function formatEmailName(name: string | undefined | null, address: string): string {
  if (name && name.trim()) return name
  if (!address) return 'Unknown'
  const local = address.split('@')[0]
  return local
    .split(/[._-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Format an address as "Name <email>" for display in To/CC fields.
 */
export function formatAddressWithName(address: string): string {
  const name = formatEmailName(null, address)
  return `${name} <${address}>`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
