'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Activity,
  Bell,
  Gauge,
  Globe,
  LayoutDashboard,
  Settings,
  Timer,
  Zap,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const nav = [
  { title: 'Overview', icon: LayoutDashboard, href: '/' },
  { title: 'Sites', icon: Globe, href: '/sites' },
  { title: 'Core Web Vitals', icon: Gauge, href: '/core-web-vitals' },
  { title: 'Real User Monitoring', icon: Activity, href: '/real-user-monitoring' },
  { title: 'Synthetic Checks', icon: Timer, href: '/synthetic-checks' },
  { title: 'Alerts', icon: Bell, href: '/alerts' },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2.5 px-1 py-1.5 hover:opacity-80 transition-opacity">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Zap className="size-4.5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">Speedo</span>
            <span className="text-xs text-muted-foreground">Performance Monitor</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
          <SidebarMenu>
            {nav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  asChild
                  tooltip={item.title}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
          <div className="flex size-7 items-center justify-center rounded-full bg-secondary text-xs font-medium">
            AC
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-xs font-medium">Acme Inc</span>
            <span className="truncate text-xs text-muted-foreground">Pro plan</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
