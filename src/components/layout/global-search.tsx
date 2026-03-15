'use client'

import { useCallback } from 'react'
import { SearchInput } from '@/components/ui'
import { useUIStore } from '@/stores/ui-store'

export function GlobalSearch() {
  const globalSearchQuery = useUIStore((s) => s.globalSearchQuery)
  const setGlobalSearchQuery = useUIStore((s) => s.setGlobalSearchQuery)

  const handleChange = useCallback(
    (value: string) => {
      setGlobalSearchQuery(value)
    },
    [setGlobalSearchQuery]
  )

  return (
    <SearchInput
      value={globalSearchQuery}
      onChange={handleChange}
      placeholder="Search emails, contacts..."
      debounceMs={300}
      className="w-full"
    />
  )
}
