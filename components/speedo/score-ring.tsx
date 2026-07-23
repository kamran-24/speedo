import { rateScore } from '@/lib/mock-db'
import { cn } from '@/lib/utils'

const colorForRating = {
  good: 'var(--chart-1)',
  'needs-improvement': 'var(--chart-3)',
  poor: 'var(--destructive)',
} as const

export function ScoreRing({
  score,
  size = 44,
  className,
}: {
  score: number
  size?: number
  className?: string
}) {
  const stroke = size < 56 ? 4 : 6
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)
  const color = colorForRating[rateScore(score)]

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span
        className="absolute font-mono font-medium tabular-nums"
        style={{ fontSize: size * 0.3, color }}
      >
        {score}
      </span>
    </div>
  )
}
