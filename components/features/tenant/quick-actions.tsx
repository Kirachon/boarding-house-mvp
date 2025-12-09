'use client'

import { Button } from '@/components/ui/button'
import { ArrowDownCircle, FileText, MessageCircleMore } from 'lucide-react'

export function TenantQuickActions() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => scrollTo('bills-section')}
      >
        <ArrowDownCircle className="h-4 w-4" />
        Upload payment proof
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => scrollTo('issues-section')}
      >
        <MessageCircleMore className="h-4 w-4" />
        Report an issue
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => scrollTo('lease-section')}
      >
        <FileText className="h-4 w-4" />
        View lease
      </Button>
    </div>
  )
}

