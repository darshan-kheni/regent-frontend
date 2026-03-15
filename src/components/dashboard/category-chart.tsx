'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface CategoryChartProps {
  distribution: { category: string; count: number }[] | undefined
  isLoading: boolean
}

// Known categories get specific colors; unknown ones get auto-assigned from palette
const KNOWN_COLORS: Record<string, string> = {
  urgent: '#D4645D',
  work: '#7EA3C2',
  finance: '#C9A96E',
  reading: '#9B7EBD',
  personal: '#C27E9B',
  system: '#6E6660',
  uncategorized: '#6E6660',
  shopping: '#C9865A',
  social: '#C27E9B',
  travel: '#5BA4C9',
  newsletters: '#9B7EBD',
  promotions: '#c9a96e',
  updates: '#7EA3C2',
  security: '#D4645D',
  health: '#6FAD76',
  legal: '#c9a96e',
  education: '#5BA4C9',
  entertainment: '#9B7EBD',
  recruitment: '#7EA3C2',
  support: '#6E6660',
  shipping: '#C9865A',
  events: '#C27E9B',
  subscriptions: '#9B7EBD',
  spam: '#6E6660',
}

const COLOR_PALETTE = ['#7EA3C2', '#C9A96E', '#9B7EBD', '#C27E9B', '#6FAD76', '#5BA4C9', '#C9865A']
const DEFAULT_COLOR = '#7EA3C2'

function getCategoryColor(category: string): string {
  if (KNOWN_COLORS[category]) return KNOWN_COLORS[category]
  let hash = 0
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length]
}

// Build a dynamic color map from distribution data
export function buildCategoryColors(distribution: { category: string }[]): Record<string, string> {
  const colors: Record<string, string> = {}
  for (const item of distribution) {
    colors[item.category] = getCategoryColor(item.category)
  }
  return colors
}

export const CATEGORY_COLORS = KNOWN_COLORS

const ChartContent = dynamic(
  () => import('./category-chart-inner').then((mod) => mod.CategoryChartInner),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-2">
        <Skeleton height="200px" />
      </div>
    ),
  }
)

export function CategoryChart({ distribution, isLoading }: CategoryChartProps) {
  const hasData = distribution && distribution.length > 0

  return (
    <Card padding="lg">
      <h2
        className="font-display text-lg mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        Distribution
      </h2>
      {isLoading ? (
        <Skeleton height="240px" />
      ) : hasData ? (
        <>
          <ChartContent
            distribution={distribution}
            colors={buildCategoryColors(distribution)}
            defaultColor={DEFAULT_COLOR}
          />
          <div className="flex flex-wrap gap-4 mt-4">
            {distribution.map((item) => (
              <div key={item.category} className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0"
                  style={{
                    backgroundColor: getCategoryColor(item.category),
                    borderRadius: 0,
                  }}
                />
                <span
                  className="text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Connect an email account to see your email distribution.
          </p>
          <Link href="/settings">
            <Button variant="primary">Connect Email Account</Button>
          </Link>
        </div>
      )}
    </Card>
  )
}
