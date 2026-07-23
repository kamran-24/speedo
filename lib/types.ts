export type SiteStatus = 'healthy' | 'degraded' | 'down'
export type Environment = 'production' | 'staging' | 'preview'
export type Rating = 'good' | 'needs-improvement' | 'poor'
export type AlertSeverity = 'critical' | 'warning' | 'info'

/** Core Web Vitals + supporting field metrics for a single site. */
export interface WebVitals {
  /** Largest Contentful Paint, in seconds. */
  lcp: number
  /** Interaction to Next Paint, in milliseconds. */
  inp: number
  /** Cumulative Layout Shift, unitless. */
  cls: number
  /** First Contentful Paint, in seconds. */
  fcp: number
  /** Time to First Byte, in milliseconds. */
  ttfb: number
}

export interface Site {
  id: string
  name: string
  url: string
  environment: Environment
  status: SiteStatus
  /** Lighthouse-style performance score, 0-100. */
  score: number
  vitals: WebVitals
  /** Uptime over the trailing 30 days, as a percentage. */
  uptime: number
  /** Median page weight in kilobytes. */
  pageWeight: number
  region: string
  monitoring: boolean
  /** ISO timestamp of the most recent synthetic check. */
  lastChecked: string
}

export interface TrendPoint {
  /** Short label for the x-axis, e.g. "Mon" or "09:00". */
  label: string
  score: number
  lcp: number
  inp: number
}

export interface Alert {
  id: string
  siteId: string
  siteName: string
  severity: AlertSeverity
  title: string
  detail: string
  /** ISO timestamp. */
  timestamp: string
  resolved: boolean
}

export interface OverviewMetric {
  key: string
  label: string
  value: string
  unit?: string
  /** Percentage change vs previous period; positive is up. */
  delta: number
  /** Whether an upward delta is good (e.g. score) or bad (e.g. LCP). */
  higherIsBetter: boolean
  rating: Rating
}

/** A single high-traffic page observed in the field (Real User Monitoring). */
export interface RumPage {
  path: string
  siteName: string
  views: number
  lcp: number
  inp: number
  cls: number
}

/** Share of sessions and field score by device class. */
export interface DeviceShare {
  device: 'Desktop' | 'Mobile' | 'Tablet'
  /** Percentage of sessions, 0-100. */
  share: number
  score: number
}

/** Field latency (p75 LCP) grouped by geographic region. */
export interface GeoLatency {
  region: string
  label: string
  /** p75 LCP in seconds. */
  p75: number
  /** Percentage of sessions, 0-100. */
  share: number
}

/** A single synthetic check execution record. */
export interface CheckRun {
  id: string
  siteName: string
  region: string
  status: 'passed' | 'failed'
  /** End-to-end response time in milliseconds. */
  responseMs: number
  httpStatus: number
  /** ISO timestamp. */
  timestamp: string
}
