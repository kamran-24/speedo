import type { AlertSeverity, Rating, SiteStatus } from './types'

/** Tailwind text-color class for a Core Web Vitals rating. */
export const ratingText: Record<Rating, string> = {
  good: 'text-[var(--chart-1)]',
  'needs-improvement': 'text-[var(--chart-3)]',
  poor: 'text-destructive',
}

/** Small dot / accent background for a rating. */
export const ratingDot: Record<Rating, string> = {
  good: 'bg-[var(--chart-1)]',
  'needs-improvement': 'bg-[var(--chart-3)]',
  poor: 'bg-destructive',
}

export const ratingLabel: Record<Rating, string> = {
  good: 'Good',
  'needs-improvement': 'Needs work',
  poor: 'Poor',
}

export const statusConfig: Record<
  SiteStatus,
  { label: string; dot: string; text: string }
> = {
  healthy: { label: 'Healthy', dot: 'bg-[var(--chart-1)]', text: 'text-[var(--chart-1)]' },
  degraded: { label: 'Degraded', dot: 'bg-[var(--chart-3)]', text: 'text-[var(--chart-3)]' },
  down: { label: 'Down', dot: 'bg-destructive', text: 'text-destructive' },
}

export const severityConfig: Record<
  AlertSeverity,
  { label: string; dot: string; text: string }
> = {
  critical: { label: 'Critical', dot: 'bg-destructive', text: 'text-destructive' },
  warning: { label: 'Warning', dot: 'bg-[var(--chart-3)]', text: 'text-[var(--chart-3)]' },
  info: { label: 'Info', dot: 'bg-[var(--chart-2)]', text: 'text-[var(--chart-2)]' },
}

/** Human-friendly relative time, e.g. "3m ago". */
export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}
