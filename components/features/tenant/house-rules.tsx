'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpCircle } from 'lucide-react'

export function TenantHouseRules() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-100 flex items-center justify-center">
          <HelpCircle className="h-4 w-4" />
        </div>
        <div>
          <CardTitle className="text-base">House rules &amp; tips</CardTitle>
          <p className="text-xs text-muted-foreground">
            Quick reminders to keep everyone&apos;s stay smooth.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-xs text-muted-foreground">
        <ul className="list-disc pl-4 space-y-1">
          <li>Quiet hours are typically 10PM–6AM (confirm with your owner).</li>
          <li>Use the app to report maintenance issues instead of direct messaging, so nothing is lost.</li>
          <li>
            After paying via cash or e‑wallet, upload a clear screenshot or photo of the receipt in the
            <span className="font-medium"> Bills &amp; payments</span> section.
          </li>
          <li>For emergencies (fire, medical), contact local emergency numbers first, then notify the owner.</li>
        </ul>
      </CardContent>
    </Card>
  )
}

