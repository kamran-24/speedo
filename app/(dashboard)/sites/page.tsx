import { getSites } from '@/lib/actions'
import { AddSiteDialog } from '@/components/speedo/add-site-dialog'
import { SitesTable } from '@/components/speedo/sites-table'

export default async function SitesPage() {
  const sites = await getSites()

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col leading-none">
          <h1 className="text-sm font-semibold tracking-tight">Sites</h1>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Manage and monitor your websites
          </p>
        </div>
        <AddSiteDialog />
      </div>
      <SitesTable sites={sites} />
    </>
  )
}
