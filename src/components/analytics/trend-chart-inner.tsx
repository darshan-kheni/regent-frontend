'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface TrendChartInnerProps {
  trend: { date: string; tokens: number }[]
}

export function TrendChartInner({ trend }: TrendChartInnerProps) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={trend} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <XAxis
          dataKey="date"
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
          tickFormatter={(value: number) => {
            if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
            if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
            return String(value)
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 0,
            fontSize: 12,
          }}
          labelStyle={{ color: 'var(--text-primary)' }}
          itemStyle={{ color: 'var(--text-secondary)' }}
          formatter={(value) => [Number(value).toLocaleString(), 'Tokens']}
        />
        <Line
          type="monotone"
          dataKey="tokens"
          stroke="var(--accent)"
          strokeWidth={2}
          dot={{ fill: 'var(--accent)', r: 3 }}
          activeDot={{ r: 5, fill: 'var(--accent)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
