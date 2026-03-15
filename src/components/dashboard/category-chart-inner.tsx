'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface CategoryChartInnerProps {
  distribution: { category: string; count: number }[]
  colors: Record<string, string>
  defaultColor: string
}

export function CategoryChartInner({ distribution, colors, defaultColor }: CategoryChartInnerProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={distribution} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <XAxis
          dataKey="category"
          tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip
          cursor={{ fill: 'var(--bg-secondary)', opacity: 0.5 }}
          contentStyle={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 0,
            fontSize: 12,
          }}
          labelStyle={{ color: 'var(--text-primary)' }}
          itemStyle={{ color: 'var(--text-secondary)' }}
        />
        <Bar dataKey="count" name="Emails">
          {distribution.map((entry) => (
            <Cell
              key={entry.category}
              fill={colors[entry.category] || defaultColor}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
