import { getAlerts } from '@/lib/actions'
import { AlertsFeed } from '@/components/speedo/alerts-feed'

export default async function AlertsPage() {
  const alerts = await getAlerts()

  return (
    <>
      <div className="flex flex-col leading-none">
        <h1 className="text-sm font-semibold tracking-tight">Alerts</h1>
        <p className="hidden text-xs text-muted-foreground sm:block">
          View and manage all alerts
        </p>
      </div>
      <AlertsFeed alerts={alerts} />
    </>
  )
}
