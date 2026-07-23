'use client'

import { useState, useTransition } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { addSite } from '@/lib/actions'

const regions = [
  { value: 'iad1', label: 'Washington, D.C. (iad1)' },
  { value: 'sfo1', label: 'San Francisco (sfo1)' },
  { value: 'cdg1', label: 'Paris (cdg1)' },
  { value: 'hnd1', label: 'Tokyo (hnd1)' },
]

export function AddSiteDialog() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      await addSite(formData)
      setOpen(false)
      toast.success('Site added', {
        description: `${formData.get('name')} is now being monitored.`,
      })
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm">
            <Plus data-icon="inline-start" />
            Add site
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>Add a site to monitor</DialogTitle>
            <DialogDescription>
              Speedo will start collecting Core Web Vitals and run synthetic checks.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="site-name">Display name</FieldLabel>
              <Input id="site-name" name="name" placeholder="Acme Marketing" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="site-url">URL</FieldLabel>
              <Input id="site-url" name="url" placeholder="acme.com" required />
            </Field>
            <Field>
              <FieldLabel>Environment</FieldLabel>
              <Select name="environment" defaultValue="production">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="preview">Preview</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Check region</FieldLabel>
              <Select name="region" defaultValue="iad1">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Adding…' : 'Add site'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
