'use client'

import { useMemo, useState, useTransition } from 'react'
import {
  ExternalLink,
  MoreHorizontal,
  RefreshCw,
  Search,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { runCheck, toggleMonitoring } from '@/lib/actions'
import { ratingText, statusConfig } from '@/lib/format'
import { rateInp, rateLcp } from '@/lib/mock-db'
import type { Site } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ScoreRing } from './score-ring'
import { SiteDetailSheet } from './site-detail-sheet'

type Filter = 'all' | 'production' | 'degraded' | 'down'
type Sort = 'score-desc' | 'score-asc' | 'lcp-asc' | 'name'

function RowActions({ site }: { site: Site }) {
  const [isPending, startTransition] = useTransition()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="size-8" disabled={isPending}>
            <RefreshCw className={cn('size-4', isPending && 'animate-spin')} />
            <span className="sr-only">Site actions</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => startTransition(() => runCheck(site.id))}>
            <RefreshCw data-icon="inline-start" />
            Run check now
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => startTransition(() => toggleMonitoring(site.id))}>
            {site.monitoring ? 'Pause monitoring' : 'Resume monitoring'}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            render={
              <a href={`https://${site.url}`} target="_blank" rel="noreferrer">
                <ExternalLink data-icon="inline-start" />
                Open site
              </a>
            }
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SitesTable({ sites }: { sites: Site[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>('score-desc')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Site | null>(null)

  const rows = useMemo(() => {
    let list = [...sites]
    if (filter === 'production') list = list.filter((s) => s.environment === 'production')
    if (filter === 'degraded') list = list.filter((s) => s.status === 'degraded')
    if (filter === 'down') list = list.filter((s) => s.status === 'down')

    const q = query.trim().toLowerCase()
    if (q) list = list.filter((s) => s.name.toLowerCase().includes(q) || s.url.toLowerCase().includes(q))

    list.sort((a, b) => {
      switch (sort) {
        case 'score-asc':
          return a.score - b.score
        case 'lcp-asc':
          return a.vitals.lcp - b.vitals.lcp
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return b.score - a.score
      }
    })
    return list
  }, [sites, filter, sort, query])

  return (
    <>
      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-base">Monitored sites</CardTitle>
            <div className="flex flex-1 items-center justify-end gap-2">
              <div className="relative w-full max-w-56">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sites…"
                  className="pl-8"
                />
              </div>
              <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score-desc">Score: high → low</SelectItem>
                  <SelectItem value="score-asc">Score: low → high</SelectItem>
                  <SelectItem value="lcp-asc">Fastest LCP</SelectItem>
                  <SelectItem value="name">Name (A–Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="production">Production</TabsTrigger>
              <TabsTrigger value="degraded">Degraded</TabsTrigger>
              <TabsTrigger value="down">Down</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Site</TableHead>
                  <TableHead className="w-[110px]">Status</TableHead>
                  <TableHead className="w-[90px] text-center">Score</TableHead>
                  <TableHead className="w-[90px] text-right">LCP</TableHead>
                  <TableHead className="hidden w-[90px] text-right md:table-cell">INP</TableHead>
                  <TableHead className="hidden w-[100px] text-right lg:table-cell">Uptime</TableHead>
                  <TableHead className="w-[48px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((site) => {
                  const status = statusConfig[site.status]
                  return (
                    <TableRow
                      key={site.id}
                      className="cursor-pointer"
                      onClick={() => setSelected(site)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex min-w-0 flex-col">
                            <span className="flex items-center gap-2 text-sm font-medium">
                              <span className="truncate">{site.name}</span>
                              {!site.monitoring ? (
                                <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                                  Paused
                                </Badge>
                              ) : null}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">{site.url}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5">
                          <span className={cn('size-2 rounded-full', status.dot)} />
                          <span className={cn('text-xs font-medium', status.text)}>
                            {status.label}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <ScoreRing score={site.score} size={40} />
                        </div>
                      </TableCell>
                      <TableCell className={cn('text-right font-mono text-sm tabular-nums', ratingText[rateLcp(site.vitals.lcp)])}>
                        {site.vitals.lcp.toFixed(1)}s
                      </TableCell>
                      <TableCell className={cn('hidden text-right font-mono text-sm tabular-nums md:table-cell', ratingText[rateInp(site.vitals.inp)])}>
                        {site.vitals.inp}ms
                      </TableCell>
                      <TableCell className="hidden text-right font-mono text-sm tabular-nums text-muted-foreground lg:table-cell">
                        {site.uptime.toFixed(2)}%
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <RowActions site={site} />
                      </TableCell>
                    </TableRow>
                  )
                })}
                {rows.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                      No sites match your filters.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <SiteDetailSheet
        site={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </>
  )
}
