import type {
  Alert,
  CheckRun,
  DeviceShare,
  GeoLatency,
  Rating,
  RumPage,
  Site,
  TrendPoint,
  WebVitals,
} from './types'

/**
 * In-memory mock database. Mutations from Server Actions persist for the
 * lifetime of the server process (reset on restart / redeploy).
 */

function iso(minutesAgo: number): string {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString()
}

export const sites: Site[] = [
  {
    id: 'st_marketing',
    name: 'Acme Marketing',
    url: 'acme.com',
    environment: 'production',
    status: 'healthy',
    score: 96,
    vitals: { lcp: 1.4, inp: 88, cls: 0.02, fcp: 0.9, ttfb: 120 },
    uptime: 99.98,
    pageWeight: 780,
    region: 'iad1',
    monitoring: true,
    lastChecked: iso(3),
  },
  {
    id: 'st_app',
    name: 'Acme Dashboard',
    url: 'app.acme.com',
    environment: 'production',
    status: 'degraded',
    score: 74,
    vitals: { lcp: 2.9, inp: 210, cls: 0.08, fcp: 1.7, ttfb: 340 },
    uptime: 99.82,
    pageWeight: 2140,
    region: 'sfo1',
    monitoring: true,
    lastChecked: iso(2),
  },
  {
    id: 'st_docs',
    name: 'Developer Docs',
    url: 'docs.acme.com',
    environment: 'production',
    status: 'healthy',
    score: 91,
    vitals: { lcp: 1.7, inp: 120, cls: 0.03, fcp: 1.1, ttfb: 180 },
    uptime: 99.95,
    pageWeight: 950,
    region: 'iad1',
    monitoring: true,
    lastChecked: iso(6),
  },
  {
    id: 'st_store',
    name: 'Acme Store',
    url: 'store.acme.com',
    environment: 'production',
    status: 'down',
    score: 42,
    vitals: { lcp: 4.8, inp: 460, cls: 0.21, fcp: 3.1, ttfb: 720 },
    uptime: 98.4,
    pageWeight: 3480,
    region: 'cdg1',
    monitoring: true,
    lastChecked: iso(1),
  },
  {
    id: 'st_blog',
    name: 'Engineering Blog',
    url: 'blog.acme.com',
    environment: 'production',
    status: 'healthy',
    score: 88,
    vitals: { lcp: 1.9, inp: 140, cls: 0.04, fcp: 1.2, ttfb: 210 },
    uptime: 99.9,
    pageWeight: 1120,
    region: 'iad1',
    monitoring: true,
    lastChecked: iso(11),
  },
  {
    id: 'st_staging',
    name: 'Dashboard (staging)',
    url: 'staging.app.acme.com',
    environment: 'staging',
    status: 'degraded',
    score: 68,
    vitals: { lcp: 3.2, inp: 260, cls: 0.11, fcp: 2.0, ttfb: 420 },
    uptime: 99.1,
    pageWeight: 2360,
    region: 'sfo1',
    monitoring: false,
    lastChecked: iso(28),
  },
  {
    id: 'st_landing',
    name: 'Campaign Landing',
    url: 'go.acme.com',
    environment: 'preview',
    status: 'healthy',
    score: 94,
    vitals: { lcp: 1.5, inp: 96, cls: 0.01, fcp: 1.0, ttfb: 140 },
    uptime: 99.99,
    pageWeight: 640,
    region: 'iad1',
    monitoring: true,
    lastChecked: iso(9),
  },
  {
    id: 'st_api',
    name: 'Status Page',
    url: 'status.acme.com',
    environment: 'production',
    status: 'healthy',
    score: 97,
    vitals: { lcp: 1.2, inp: 72, cls: 0.0, fcp: 0.8, ttfb: 90 },
    uptime: 100,
    pageWeight: 420,
    region: 'iad1',
    monitoring: true,
    lastChecked: iso(4),
  },
]

export const alerts: Alert[] = [
  {
    id: 'al_1',
    siteId: 'st_store',
    siteName: 'Acme Store',
    severity: 'critical',
    title: 'Site unreachable',
    detail: 'Synthetic check failed with HTTP 503 from 3 regions.',
    timestamp: iso(1),
    resolved: false,
  },
  {
    id: 'al_2',
    siteId: 'st_store',
    siteName: 'Acme Store',
    severity: 'critical',
    title: 'LCP regressed past 4.0s',
    detail: 'Largest Contentful Paint rose to 4.8s after the last deploy.',
    timestamp: iso(14),
    resolved: false,
  },
  {
    id: 'al_3',
    siteId: 'st_app',
    siteName: 'Acme Dashboard',
    severity: 'warning',
    title: 'INP above 200ms',
    detail: 'Interaction to Next Paint at 210ms on /billing.',
    timestamp: iso(22),
    resolved: false,
  },
  {
    id: 'al_4',
    siteId: 'st_app',
    siteName: 'Acme Dashboard',
    severity: 'warning',
    title: 'Page weight increased 18%',
    detail: 'Median bundle grew to 2.1MB — check the vendor chunk.',
    timestamp: iso(46),
    resolved: false,
  },
  {
    id: 'al_5',
    siteId: 'st_blog',
    siteName: 'Engineering Blog',
    severity: 'info',
    title: 'New deploy detected',
    detail: 'Baseline metrics recalibrated for commit a1f9c22.',
    timestamp: iso(70),
    resolved: false,
  },
  {
    id: 'al_6',
    siteId: 'st_docs',
    siteName: 'Developer Docs',
    severity: 'info',
    title: 'CLS improved to 0.03',
    detail: 'Layout shift dropped below the "good" threshold.',
    timestamp: iso(140),
    resolved: true,
  },
]

/** 14-day performance trend used by the overview chart. */
export const performanceTrend: TrendPoint[] = [
  { label: 'Jul 10', score: 82, lcp: 2.3, inp: 168 },
  { label: 'Jul 11', score: 84, lcp: 2.2, inp: 160 },
  { label: 'Jul 12', score: 81, lcp: 2.4, inp: 175 },
  { label: 'Jul 13', score: 86, lcp: 2.0, inp: 150 },
  { label: 'Jul 14', score: 88, lcp: 1.9, inp: 142 },
  { label: 'Jul 15', score: 85, lcp: 2.1, inp: 158 },
  { label: 'Jul 16', score: 83, lcp: 2.2, inp: 166 },
  { label: 'Jul 17', score: 87, lcp: 1.9, inp: 148 },
  { label: 'Jul 18', score: 90, lcp: 1.7, inp: 132 },
  { label: 'Jul 19', score: 89, lcp: 1.8, inp: 138 },
  { label: 'Jul 20', score: 84, lcp: 2.1, inp: 156 },
  { label: 'Jul 21', score: 86, lcp: 2.0, inp: 149 },
  { label: 'Jul 22', score: 85, lcp: 2.0, inp: 151 },
  { label: 'Jul 23', score: 84, lcp: 2.1, inp: 154 },
]

/** Real User Monitoring — highest-traffic pages observed in the field. */
export const rumPages: RumPage[] = [
  { path: '/', siteName: 'Acme Marketing', views: 184_320, lcp: 1.4, inp: 84, cls: 0.02 },
  { path: '/pricing', siteName: 'Acme Marketing', views: 96_140, lcp: 1.6, inp: 92, cls: 0.03 },
  { path: '/dashboard', siteName: 'Acme Dashboard', views: 71_880, lcp: 2.8, inp: 205, cls: 0.07 },
  { path: '/billing', siteName: 'Acme Dashboard', views: 42_610, lcp: 3.1, inp: 240, cls: 0.09 },
  { path: '/checkout', siteName: 'Acme Store', views: 38_270, lcp: 4.6, inp: 430, cls: 0.19 },
  { path: '/products', siteName: 'Acme Store', views: 55_910, lcp: 3.9, inp: 360, cls: 0.14 },
  { path: '/docs/getting-started', siteName: 'Developer Docs', views: 61_450, lcp: 1.7, inp: 118, cls: 0.03 },
  { path: '/blog/scaling-edge', siteName: 'Engineering Blog', views: 33_720, lcp: 1.9, inp: 138, cls: 0.04 },
]

export const rumDevices: DeviceShare[] = [
  { device: 'Mobile', share: 58, score: 79 },
  { device: 'Desktop', share: 37, score: 93 },
  { device: 'Tablet', share: 5, score: 85 },
]

export const rumGeo: GeoLatency[] = [
  { region: 'na', label: 'North America', p75: 1.8, share: 44 },
  { region: 'eu', label: 'Europe', p75: 2.1, share: 31 },
  { region: 'apac', label: 'Asia Pacific', p75: 2.9, share: 18 },
  { region: 'sa', label: 'South America', p75: 3.4, share: 7 },
]

/** Recent synthetic check executions, newest first. */
export const checkRuns: CheckRun[] = [
  { id: 'ck_1', siteName: 'Acme Store', region: 'cdg1', status: 'failed', responseMs: 0, httpStatus: 503, timestamp: iso(1) },
  { id: 'ck_2', siteName: 'Acme Dashboard', region: 'sfo1', status: 'passed', responseMs: 340, httpStatus: 200, timestamp: iso(2) },
  { id: 'ck_3', siteName: 'Acme Marketing', region: 'iad1', status: 'passed', responseMs: 120, httpStatus: 200, timestamp: iso(3) },
  { id: 'ck_4', siteName: 'Status Page', region: 'iad1', status: 'passed', responseMs: 90, httpStatus: 200, timestamp: iso(4) },
  { id: 'ck_5', siteName: 'Developer Docs', region: 'iad1', status: 'passed', responseMs: 180, httpStatus: 200, timestamp: iso(6) },
  { id: 'ck_6', siteName: 'Campaign Landing', region: 'iad1', status: 'passed', responseMs: 140, httpStatus: 200, timestamp: iso(9) },
  { id: 'ck_7', siteName: 'Engineering Blog', region: 'iad1', status: 'passed', responseMs: 210, httpStatus: 200, timestamp: iso(11) },
  { id: 'ck_8', siteName: 'Acme Store', region: 'cdg1', status: 'failed', responseMs: 0, httpStatus: 503, timestamp: iso(16) },
  { id: 'ck_9', siteName: 'Acme Dashboard', region: 'sfo1', status: 'passed', responseMs: 420, httpStatus: 200, timestamp: iso(22) },
  { id: 'ck_10', siteName: 'Acme Marketing', region: 'iad1', status: 'passed', responseMs: 118, httpStatus: 200, timestamp: iso(33) },
]

// --- Rating helpers (Core Web Vitals thresholds) --------------------------

export function rateScore(score: number): Rating {
  if (score >= 90) return 'good'
  if (score >= 50) return 'needs-improvement'
  return 'poor'
}

export function rateLcp(lcp: number): Rating {
  if (lcp <= 2.5) return 'good'
  if (lcp <= 4.0) return 'needs-improvement'
  return 'poor'
}

export function rateInp(inp: number): Rating {
  if (inp <= 200) return 'good'
  if (inp <= 500) return 'needs-improvement'
  return 'poor'
}

export function rateCls(cls: number): Rating {
  if (cls <= 0.1) return 'good'
  if (cls <= 0.25) return 'needs-improvement'
  return 'poor'
}

/** Derive a coarse status from the current vitals + score. */
export function deriveStatus(site: Pick<Site, 'score' | 'vitals'>): Site['status'] {
  if (site.score < 50 || rateLcp(site.vitals.lcp) === 'poor') return 'down'
  if (site.score < 90) return 'degraded'
  return 'healthy'
}
