import { getAlerts, getOverview, getSites, getTrend } from '@/lib/actions'
import { AddSiteDialog } from '@/components/speedo/add-site-dialog'
import { AlertsFeed } from '@/components/speedo/alerts-feed'
import { MetricCards } from '@/components/speedo/metric-cards'
import { PerformanceChart } from '@/components/speedo/performance-chart'
import { SitesTable } from '@/components/speedo/sites-table'

export default async function OverviewPage() {
  const [overview, sites, alerts, trend] = await Promise.all([
    getOverview(),
    getSites(),
    getAlerts(),
    getTrend(),
  ])

  const monitored = sites.filter((s) => s.monitoring).length

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col leading-none">
          <h1 className="text-sm font-semibold tracking-tight">Overview</h1>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Monitoring {monitored} of {sites.length} sites
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground md:inline-flex">
            <span className="size-1.5 animate-pulse rounded-full bg-[var(--chart-1)]" />
            Live
          </span>
          <AddSiteDialog />
        </div>
      </div>
      <MetricCards metrics={overview} />
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <PerformanceChart data={trend} />
        </div>
        <AlertsFeed alerts={alerts} />
      </div>
      <SitesTable sites={sites} />
    </>
  )
}
