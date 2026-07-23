'use client'

import { useTransition } from 'react'
import { ExternalLink, MapPin, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { runCheck, toggleMonitoring } from '@/lib/actions'
import { ratingLabel, ratingText, relativeTime, statusConfig } from '@/lib/format'
import { rateCls, rateInp, rateLcp } from '@/lib/mock-db'
import type { Rating, Site } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ScoreRing } from './score-ring'

function Vital({
  label,
  value,
  rating,
}: {
  label: string
  value: string
  rating: Rating
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border/60 p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn('font-mono text-lg font-semibold tabular-nums', ratingText[rating])}>
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{ratingLabel[rating]}</span>
    </div>
  )
}

export function SiteDetailSheet({
  site,
  onOpenChange,
}: {
  site: Site | null
  onOpenChange: (open: boolean) => void
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <Sheet open={!!site} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-md">
        {site ? (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3">
                <ScoreRing score={site.score} size={56} />
                <div className="flex min-w-0 flex-col gap-1">
                  <SheetTitle className="truncate">{site.name}</SheetTitle>
                  <SheetDescription className="truncate">{site.url}</SheetDescription>
                </div>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {site.environment}
                </Badge>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                  <span className={cn('size-2 rounded-full', statusConfig[site.status].dot)} />
                  <span className={statusConfig[site.status].text}>
                    {statusConfig[site.status].label}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" /> {site.region}
                </span>
              </div>
            </SheetHeader>

            <div className="flex flex-col gap-4 px-4 pb-2">
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Core Web Vitals</p>
                <div className="grid grid-cols-2 gap-2">
                  <Vital label="LCP" value={`${site.vitals.lcp.toFixed(1)}s`} rating={rateLcp(site.vitals.lcp)} />
                  <Vital label="INP" value={`${site.vitals.inp}ms`} rating={rateInp(site.vitals.inp)} />
                  <Vital label="CLS" value={site.vitals.cls.toFixed(2)} rating={rateCls(site.vitals.cls)} />
                  <Vital
                    label="FCP"
                    value={`${site.vitals.fcp.toFixed(1)}s`}
                    rating={site.vitals.fcp <= 1.8 ? 'good' : site.vitals.fcp <= 3 ? 'needs-improvement' : 'poor'}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">30-day uptime</span>
                    <span className="font-mono tabular-nums">{site.uptime.toFixed(2)}%</span>
                  </div>
                  <Progress value={site.uptime} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">TTFB</span>
                  <span className="font-mono tabular-nums">{site.vitals.ttfb}ms</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Median page weight</span>
                  <span className="font-mono tabular-nums">
                    {(site.pageWeight / 1000).toFixed(2)}MB
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last checked</span>
                  <span className="tabular-nums">{relativeTime(site.lastChecked)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Monitoring</span>
                  <Badge variant={site.monitoring ? 'default' : 'outline'}>
                    {site.monitoring ? 'Active' : 'Paused'}
                  </Badge>
                </div>
              </div>
            </div>

            <SheetFooter className="flex-row gap-2">
              <Button
                variant="outline"
                className="flex-1"
                disabled={isPending}
                onClick={() => startTransition(() => toggleMonitoring(site.id))}
              >
                {site.monitoring ? 'Pause' : 'Resume'}
              </Button>
              <Button
                className="flex-1"
                disabled={isPending}
                onClick={() => startTransition(() => runCheck(site.id))}
              >
                <RefreshCw data-icon="inline-start" className={cn(isPending && 'animate-spin')} />
                {isPending ? 'Checking…' : 'Run check'}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                render={
                  <a href={`https://${site.url}`} target="_blank" rel="noreferrer">
                    <ExternalLink />
                    <span className="sr-only">Open site</span>
                  </a>
                }
              />
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
