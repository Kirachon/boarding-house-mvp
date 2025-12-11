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
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { createProperty, updateProperty } from '@/actions/property'
import { Database } from '@/types/supabase'

type Property = Database['public']['Tables']['properties']['Row']

interface PropertyDialogProps {
  mode: 'create' | 'edit'
  property?: Property
  trigger?: React.ReactNode
}

export function PropertyDialog({ mode, property, trigger }: PropertyDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      let result
      if (mode === 'create') {
        result = await createProperty(formData)
      } else if (property) {
        result = await updateProperty(property.id, formData)
      }

      if (result?.error) {
        toast.error(result.error as string)
      } else {
        toast.success(mode === 'create' ? 'Property created' : 'Property updated')
        setOpen(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" className="gap-2">
            Add property
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add property' : 'Edit property'}</DialogTitle>
          <DialogDescription>
            These details will appear on your public verification page for this property.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={property?.name ?? ''}
              placeholder="e.g., Sunrise Boarding House"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={property?.address ?? ''}
              placeholder="Street address"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              defaultValue={(property as any)?.city ?? ''}
              placeholder="City / locality"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amenities">Amenities</Label>
            <Input
              id="amenities"
              name="amenities"
              defaultValue={Array.isArray((property as any)?.amenities) ? (property as any)?.amenities.join(', ') : ''}
              placeholder="Comma-separated (WiFi, Laundry, Parking)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={(property as any)?.description ?? ''}
              placeholder="Short description that helps guests understand this property."
              className="min-h-[100px]"
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="is_verified"
              name="is_verified"
              defaultChecked={Boolean((property as any)?.is_verified)}
            />
            <Label htmlFor="is_verified" className="text-sm font-normal">
              Mark as verified partner
            </Label>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

