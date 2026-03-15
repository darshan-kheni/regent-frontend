'use client'

interface HourlyHistogramProps {
  hours: number[]
}

function HourlyHistogram({ hours }: HourlyHistogramProps) {
  const max = Math.max(...hours, 1)
  const peakHour = hours.indexOf(Math.max(...hours))

  return (
    <div className="w-full">
      <div className="flex items-end gap-px" style={{ height: 120 }}>
        {hours.map((count, hour) => {
          const heightPct = (count / max) * 100
          const isPeak = hour === peakHour && count > 0
          return (
            <div
              key={hour}
              className="flex-1 relative group"
              style={{ height: '100%' }}
            >
              <div
                className="absolute bottom-0 w-full"
                style={{
                  height: `${heightPct}%`,
                  backgroundColor: isPeak ? '#8A6E3A' : '#C9A96E',
                  minHeight: count > 0 ? 2 : 0,
                  transition: 'height 0.3s ease-out',
                }}
              />
              <div
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none"
                style={{ color: 'var(--text-muted)' }}
              >
                {count}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex gap-px mt-1">
        {hours.map((_, hour) => (
          <div key={hour} className="flex-1 text-center">
            {hour % 4 === 0 && (
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {hour}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export { HourlyHistogram }
