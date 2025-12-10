'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { updateTenantProfile } from '@/actions/tenant-profile'
import { toast } from 'sonner'

interface TenantProfileFormProps {
  fullName: string | null
  email: string | null
}

export function TenantProfileForm({ fullName, email }: TenantProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    const res = await updateTenantProfile(formData)
    setIsSubmitting(false)

    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success('Profile updated')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">My profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email || ''} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              name="full_name"
              defaultValue={fullName || ''}
              placeholder="Your name"
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground">
          This basic profile is shared with your owner to help them identify you in rosters and
          invoices.
        </p>
      </CardContent>
    </Card>
  )
}

