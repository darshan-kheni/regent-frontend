export default function DashboardLoading() {
  return (
    <div className="p-8 space-y-4">
      <div
        className="h-8 w-48"
        style={{
          background: 'linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-elevated) 50%, var(--bg-secondary) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        }}
      />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24"
            style={{
              background: 'linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-elevated) 50%, var(--bg-secondary) 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}
          />
        ))}
      </div>
    </div>
  )
}
