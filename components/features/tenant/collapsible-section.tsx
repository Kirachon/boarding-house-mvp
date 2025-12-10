

'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TenantCollapsibleSectionProps {
  id?: string
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export function TenantCollapsibleSection({
  id,
  title,
  children,
  defaultOpen = true,
  className,
}: TenantCollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section
      id={id}
      className={cn(
        "rounded-xl border border-border/50 bg-background/40 backdrop-blur-sm overflow-hidden transition-all duration-300",
        open ? "shadow-sm" : "shadow-none",
        className
      )}
    >
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors",
          !open && "rounded-xl"
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        <h2 className="text-base font-semibold tracking-tight text-foreground/90">{title}</h2>
        <span className="flex items-center text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded-md border shadow-xs">
          {open ? (
            <>
              Hide <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Show <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
            </>
          )}
        </span>
      </button>

      <div
        className={cn(
          "transition-[max-height,opacity] duration-300 ease-in-out px-4 overflow-hidden",
          open ? "max-h-[2000px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"
        )}
      >
        {children}
      </div>
    </section>
  )
}

