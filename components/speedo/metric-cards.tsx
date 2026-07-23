import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ratingDot, ratingLabel } from '@/lib/format'
import type { OverviewMetric } from '@/lib/types'
import { cn } from '@/lib/utils'

function DeltaBadge({ metric }: { metric: OverviewMetric }) {
  const positive = metric.delta >= 0
  // "Good" direction depends on whether higher is better for this metric.
  const isImprovement = metric.higherIsBetter ? positive : !positive
  const Icon = positive ? ArrowUpRight : ArrowDownRight

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums',
        isImprovement
          ? 'bg-[var(--chart-1)]/12 text-[var(--chart-1)]'
          : 'bg-destructive/12 text-destructive',
      )}
    >
      <Icon className="size-3" />
      {Math.abs(metric.delta)}
      {metric.key === 'cls' || metric.key === 'uptime' ? '' : '%'}
    </span>
  )
}

export function MetricCards({ metrics }: { metrics: OverviewMetric[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {metrics.map((metric) => (
        <Card key={metric.key} className="gap-0 py-0">
          <CardContent className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs font-medium text-muted-foreground">
                {metric.label}
              </p>
              <DeltaBadge metric={metric} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-2xl font-semibold tracking-tight tabular-nums">
                {metric.value}
              </span>
              {metric.unit ? (
                <span className="text-sm text-muted-foreground">{metric.unit}</span>
              ) : null}
            </div>
            <div className="flex items-center gap-1.5">
              <span className={cn('size-1.5 rounded-full', ratingDot[metric.rating])} />
              <span className="text-xs text-muted-foreground">
                {ratingLabel[metric.rating]}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
