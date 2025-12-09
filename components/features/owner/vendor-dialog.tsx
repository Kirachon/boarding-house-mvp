'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createVendor } from '@/actions/maintenance'
import { toast } from 'sonner'
import { Briefcase } from 'lucide-react'

interface VendorDialogProps {
  triggerLabel?: string
}

export function VendorDialog({ triggerLabel = 'Add vendor' }: VendorDialogProps) {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const result = await createVendor(formData)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Vendor saved')
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all"
        >
          <Briefcase className="h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add maintenance vendor</DialogTitle>
          <DialogDescription>
            Store contact details for your preferred handymen, cleaners, or contractors.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required placeholder="e.g. AC Repair Co." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" placeholder="+63 900 000 0000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="vendor@example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="services">Services</Label>
            <Input id="services" name="services" placeholder="Plumbing, electrical, cleaning…" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any special rates, preferred contact times, etc."
              className="min-h-[80px]"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-teal text-white">
              Save vendor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

