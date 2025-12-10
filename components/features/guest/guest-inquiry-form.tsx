'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createInquiry } from '@/actions/inquiry'
import { toast } from 'sonner'

interface GuestInquiryFormProps {
  propertyId: string
}

export function GuestInquiryForm({ propertyId }: GuestInquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    const res = await createInquiry(propertyId, formData)
    setIsSubmitting(false)

    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success('Inquiry sent to owner')
    }
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} action={handleSubmit} className="space-y-3">
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="Your name" />
        </div>
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="contact">Contact</Label>
          <Input
            id="contact"
            name="contact"
            required
            placeholder="Email or phone"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Optional: share your preferred move-in date or questions."
          className="min-h-[80px]"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send inquiry'}
      </Button>
    </form>
  )
}

