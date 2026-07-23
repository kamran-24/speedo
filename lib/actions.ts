'use server'

import { revalidatePath } from 'next/cache'
import {
  alerts,
  checkRuns,
  deriveStatus,
  performanceTrend,
  rateCls,
  rateInp,
  rateLcp,
  rateScore,
  rumDevices,
  rumGeo,
  rumPages,
  sites,
} from './mock-db'
import type {
  Alert,
  CheckRun,
  DeviceShare,
  GeoLatency,
  OverviewMetric,
  RumPage,
  Site,
  TrendPoint,
} from './types'

/** Simulate synthetic-check latency so the UI exercises pending states. */
function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

// --- Reads ----------------------------------------------------------------

export async function getSites(): Promise<Site[]> {
  await delay(120)
  return clone(sites)
}

export async function getAlerts(): Promise<Alert[]> {
  await delay(120)
  return clone(alerts)
}

export async function getTrend(): Promise<TrendPoint[]> {
  await delay(120)
  return clone(performanceTrend)
}

export async function getOverview(): Promise<OverviewMetric[]> {
  await delay(120)
  const monitored = sites.filter((s) => s.monitoring)
  const count = monitored.length || 1

  const avgScore = Math.round(monitored.reduce((a, s) => a + s.score, 0) / count)
  const avgLcp = monitored.reduce((a, s) => a + s.vitals.lcp, 0) / count
  const avgInp = Math.round(monitored.reduce((a, s) => a + s.vitals.inp, 0) / count)
  const avgCls = monitored.reduce((a, s) => a + s.vitals.cls, 0) / count
  const avgUptime = monitored.reduce((a, s) => a + s.uptime, 0) / count

  return [
    {
      key: 'score',
      label: 'Avg Performance',
      value: String(avgScore),
      delta: 2.1,
      higherIsBetter: true,
      rating: rateScore(avgScore),
    },
    {
      key: 'lcp',
      label: 'Largest Contentful Paint',
      value: avgLcp.toFixed(1),
      unit: 's',
      delta: -4.3,
      higherIsBetter: false,
      rating: rateLcp(avgLcp),
    },
    {
      key: 'inp',
      label: 'Interaction to Next Paint',
      value: String(avgInp),
      unit: 'ms',
      delta: -1.8,
      higherIsBetter: false,
      rating: rateInp(avgInp),
    },
    {
      key: 'cls',
      label: 'Cumulative Layout Shift',
      value: avgCls.toFixed(2),
      delta: 0.6,
      higherIsBetter: false,
      rating: rateCls(avgCls),
    },
    {
      key: 'uptime',
      label: 'Fleet Uptime',
      value: avgUptime.toFixed(2),
      unit: '%',
      delta: 0.04,
      higherIsBetter: true,
      rating: avgUptime >= 99.9 ? 'good' : avgUptime >= 99 ? 'needs-improvement' : 'poor',
    },
  ]
}

export async function getRumPages(): Promise<RumPage[]> {
  await delay(120)
  return clone(rumPages)
}

export async function getRumDevices(): Promise<DeviceShare[]> {
  await delay(120)
  return clone(rumDevices)
}

export async function getRumGeo(): Promise<GeoLatency[]> {
  await delay(120)
  return clone(rumGeo)
}

export async function getCheckRuns(): Promise<CheckRun[]> {
  await delay(120)
  return clone(checkRuns)
}

// --- Mutations ------------------------------------------------------------

export async function toggleMonitoring(siteId: string): Promise<void> {
  await delay(250)
  const site = sites.find((s) => s.id === siteId)
  if (site) site.monitoring = !site.monitoring
  revalidatePath('/', 'layout')
}

export async function resolveAlert(alertId: string): Promise<void> {
  await delay(250)
  const alert = alerts.find((a) => a.id === alertId)
  if (alert) alert.resolved = true
  revalidatePath('/', 'layout')
}

/** Re-run a synthetic check: jitter the vitals and recompute score + status. */
export async function runCheck(siteId: string): Promise<void> {
  await delay(700)
  const site = sites.find((s) => s.id === siteId)
  if (!site) return

  const jitter = (v: number, pct: number) => v * (1 + (Math.random() - 0.5) * pct)

  site.vitals = {
    lcp: Math.max(0.6, +jitter(site.vitals.lcp, 0.18).toFixed(1)),
    inp: Math.max(40, Math.round(jitter(site.vitals.inp, 0.2))),
    cls: Math.max(0, +jitter(site.vitals.cls, 0.3).toFixed(2)),
    fcp: Math.max(0.4, +jitter(site.vitals.fcp, 0.18).toFixed(1)),
    ttfb: Math.max(40, Math.round(jitter(site.vitals.ttfb, 0.2))),
  }

  // Recompute score from the fresh vitals (weighted toward LCP + INP).
  const lcpScore = Math.max(0, 100 - (site.vitals.lcp - 1) * 26)
  const inpScore = Math.max(0, 100 - (site.vitals.inp - 60) * 0.16)
  const clsScore = Math.max(0, 100 - site.vitals.cls * 320)
  site.score = Math.round(
    Math.min(100, lcpScore * 0.4 + inpScore * 0.4 + clsScore * 0.2),
  )
  site.status = deriveStatus(site)
  site.lastChecked = new Date().toISOString()
  revalidatePath('/', 'layout')
}

export async function addSite(formData: FormData): Promise<void> {
  await delay(500)
  const name = String(formData.get('name') ?? '').trim()
  const rawUrl = String(formData.get('url') ?? '').trim()
  const environment = String(formData.get('environment') ?? 'production') as Site['environment']
  const region = String(formData.get('region') ?? 'iad1')
  if (!name || !rawUrl) return

  const url = rawUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')

  sites.unshift({
    id: `st_${Math.random().toString(36).slice(2, 8)}`,
    name,
    url,
    environment,
    status: 'healthy',
    score: 100,
    vitals: { lcp: 1.0, inp: 80, cls: 0.0, fcp: 0.7, ttfb: 100 },
    uptime: 100,
    pageWeight: 500,
    region,
    monitoring: true,
    lastChecked: new Date().toISOString(),
  })
  revalidatePath('/', 'layout')
}
