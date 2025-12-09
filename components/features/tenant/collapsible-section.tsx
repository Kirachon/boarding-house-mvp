'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface TenantCollapsibleSectionProps {
  id?: string
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function TenantCollapsibleSection({
  id,
  title,
  children,
  defaultOpen = true,
}: TenantCollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section id={id} className="space-y-3">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 md:cursor-default"
        onClick={() => setOpen((prev) => !prev)}
      >
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <span className="md:hidden inline-flex items-center text-xs text-muted-foreground">
          {open ? (
            <>
              Hide <ChevronDown className="ml-1 h-3 w-3" />
            </>
          ) : (
            <>
              Show <ChevronRight className="ml-1 h-3 w-3" />
            </>
          )}
        </span>
      </button>
      <div className={open ? 'block' : 'hidden md:block'}>{children}</div>
    </section>
  )
}

