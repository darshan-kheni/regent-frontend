'use client'

import { useServiceConfig } from '@/hooks/use-service-config'
import { ModuleStats } from '@/components/modules/module-stats'
import { PipelineGroup } from '@/components/modules/pipeline-group'
import { Badge } from '@/components/ui'

export default function ModulesPage() {
  const { groups, toggleService, stats, isLoading } = useServiceConfig()

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1
          className="font-display text-3xl"
          style={{ color: 'var(--text-primary)' }}
        >
          Modules
        </h1>
        {!isLoading && (
          <Badge variant="gold">
            {stats.activeCount} active
          </Badge>
        )}
      </div>

      {/* Stats row */}
      <ModuleStats stats={stats} isLoading={isLoading} />

      {/* Service groups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {groups.map((group) => (
          <PipelineGroup
            key={group.key}
            title={group.title}
            services={group.services}
            onToggle={toggleService}
          />
        ))}
      </div>
    </div>
  )
}
