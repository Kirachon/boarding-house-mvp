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

  const actions = [
    {
      id: 'bills-section',
      label: 'Upload Payment',
      icon: ArrowDownCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-500/10',
      hover: 'hover:border-emerald-200 hover:bg-emerald-50'
    },
    {
      id: 'issues-section',
      label: 'Report Issue',
      icon: MessageCircleMore,
      color: 'text-blue-600',
      bg: 'bg-blue-500/10',
      hover: 'hover:border-blue-200 hover:bg-blue-50'
    },
    {
      id: 'lease-section',
      label: 'View Lease',
      icon: FileText,
      color: 'text-purple-600',
      bg: 'bg-purple-500/10',
      hover: 'hover:border-purple-200 hover:bg-purple-50'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => scrollTo(action.id)}
          className={`
            group flex items-center p-3 gap-3 rounded-xl border border-transparent 
            bg-background/50 transition-all duration-300 hover:shadow-sm border-border/40
            ${action.hover}
          `}
        >
          <div className={`p-2 rounded-lg ${action.bg} ${action.color} transition-transform group-hover:scale-110`}>
            <action.icon className="h-5 w-5" />
          </div>
          <span className="font-medium text-sm text-foreground/80 group-hover:text-foreground">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  )
}

