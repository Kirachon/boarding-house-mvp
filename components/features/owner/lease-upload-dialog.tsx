'use client'

import { useState } from 'react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { uploadLeaseDocument } from '@/actions/owner-documents'
import { toast } from 'sonner'
import { Database } from '@/types/supabase'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Local interface since profiles table may not exist in generated types
interface Profile {
  id: string
  full_name: string | null
}

interface LeaseUploadDialogProps {
  tenants: Profile[]
}

export function LeaseUploadDialog({ tenants }: LeaseUploadDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<string | undefined>()

  async function handleSubmit(formData: FormData) {
    if (!selectedTenant) {
      toast.error('Please select a tenant')
      return
    }

    formData.set('tenant_id', selectedTenant)

    setIsSubmitting(true)
    const res = await uploadLeaseDocument(formData)
    setIsSubmitting(false)

    if (res?.error) {
      toast.error(res.error)
      return
    }

    toast.success('Lease document uploaded')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Upload lease</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload lease document</DialogTitle>
          <DialogDescription>
            Attach a lease file for a tenant. Tenants will see it in their portal.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Tenant</Label>
            <Select value={selectedTenant} onValueChange={setSelectedTenant}>
              <SelectTrigger>
                <SelectValue placeholder="Select tenant" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.full_name || t.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., 2025 Lease Agreement"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input id="file" name="file" type="file" accept=".pdf,.jpg,.jpeg,.png" required />
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

