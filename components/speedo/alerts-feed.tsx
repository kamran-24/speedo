'use client'

import { useState, useTransition } from 'react'
import { AlertTriangle, Bell, Check, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { resolveAlert } from '@/lib/actions'
import { relativeTime, severityConfig } from '@/lib/format'
import type { Alert, AlertSeverity } from '@/lib/types'
import { cn } from '@/lib/utils'

const severityIcon: Record<AlertSeverity, typeof Info> = {
  critical: AlertTriangle,
  warning: AlertTriangle,
  info: Info,
}

function AlertRow({ alert }: { alert: Alert }) {
  const [isPending, startTransition] = useTransition()
  const conf = severityConfig[alert.severity]
  const Icon = severityIcon[alert.severity]

  return (
    <div
      className={cn(
        'flex gap-3 rounded-lg border border-border/60 p-3 transition-colors',
        alert.resolved ? 'opacity-55' : 'hover:bg-accent/40',
      )}
    >
      <div className={cn('mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-accent', conf.text)}>
        <Icon className="size-4" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium">{alert.title}</p>
          <span className="shrink-0 text-xs text-muted-foreground">
            {relativeTime(alert.timestamp)}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{alert.detail}</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="truncate text-xs font-medium text-muted-foreground">
            {alert.siteName}
          </span>
          {alert.resolved ? (
            <Badge variant="secondary" className="gap-1">
              <Check className="size-3" /> Resolved
            </Badge>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              disabled={isPending}
              onClick={() => startTransition(() => resolveAlert(alert.id))}
            >
              {isPending ? 'Resolving…' : 'Resolve'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export function AlertsFeed({ alerts }: { alerts: Alert[] }) {
  const [showResolved, setShowResolved] = useState(false)
  const open = alerts.filter((a) => !a.resolved)
  const visible = showResolved ? alerts : open

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="size-4" /> Alerts
            {open.length > 0 ? (
              <Badge variant="destructive" className="tabular-nums">
                {open.length}
              </Badge>
            ) : null}
          </CardTitle>
          <CardDescription>Active incidents across monitored sites</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 shrink-0 px-2 text-xs"
          onClick={() => setShowResolved((v) => !v)}
        >
          {showResolved ? 'Hide resolved' : 'Show all'}
        </Button>
      </CardHeader>
      <CardContent className="flex-1">
        <ScrollArea className="h-[320px] pr-3">
          <div className="flex flex-col gap-2">
            {visible.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <div className="flex size-10 items-center justify-center rounded-full bg-accent text-[var(--chart-1)]">
                  <Check className="size-5" />
                </div>
                <p className="text-sm font-medium">All clear</p>
                <p className="text-xs text-muted-foreground">No active alerts right now.</p>
              </div>
            ) : (
              visible.map((alert) => <AlertRow key={alert.id} alert={alert} />)
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
