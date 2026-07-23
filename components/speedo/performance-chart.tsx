'use client'

import { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { TrendPoint } from '@/lib/types'

type MetricKey = 'score' | 'lcp' | 'inp'

const config: ChartConfig = {
  score: { label: 'Performance score', color: 'var(--chart-1)' },
  lcp: { label: 'LCP (s)', color: 'var(--chart-2)' },
  inp: { label: 'INP (ms)', color: 'var(--chart-3)' },
}

const metricMeta: Record<MetricKey, { title: string; domain: [number, number | 'auto'] }> = {
  score: { title: 'Performance score', domain: [40, 100] },
  lcp: { title: 'Largest Contentful Paint', domain: [0, 'auto'] },
  inp: { title: 'Interaction to Next Paint', domain: [0, 'auto'] },
}

export function PerformanceChart({ data }: { data: TrendPoint[] }) {
  const [metric, setMetric] = useState<MetricKey>('score')
  const color = `var(--color-${metric})`
  const domain = useMemo(() => metricMeta[metric].domain, [metric])

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base">Fleet performance</CardTitle>
          <CardDescription>{metricMeta[metric].title} · last 14 days</CardDescription>
        </div>
        <ToggleGroup
          type="single"
          size="sm"
          value={metric}
          onValueChange={(v) => v && setMetric(v as MetricKey)}
          className="shrink-0"
        >
          <ToggleGroupItem value="score">Score</ToggleGroupItem>
          <ToggleGroupItem value="lcp">LCP</ToggleGroupItem>
          <ToggleGroupItem value="inp">INP</ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[260px] w-full">
          <AreaChart data={data} margin={{ left: -8, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id={`fill-${metric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              className="text-xs"
            />
            <YAxis
              domain={domain}
              tickLine={false}
              axisLine={false}
              width={36}
              className="text-xs"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey={metric}
              type="monotone"
              stroke={color}
              strokeWidth={2}
              fill={`url(#fill-${metric})`}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
