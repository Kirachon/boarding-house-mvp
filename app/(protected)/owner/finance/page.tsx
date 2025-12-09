import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { InvoiceList } from '@/components/features/owner/invoice-list'
import { InvoiceDialog } from '@/components/features/owner/invoice-dialog'
import { FinanceSummary } from '@/components/features/owner/finance-summary'
import { DashboardShell } from '@/components/shared/dashboard-shell'

export default async function OwnerFinancePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Fetch invoices with tenant details
    const { data: invoices } = await supabase
        .from('invoices')
        .select(`
        *,
        profiles:tenant_id(*)
    `)
        .order('created_at', { ascending: false })

    // Fetch tenants for dropdown (only those with role tenant)
    const { data: tenants } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'tenant')

    // For finance summary, we need raw invoices without joins for simplicity
    const { data: rawInvoices } = await supabase
        .from('invoices')
        .select('*')

    return (
        <DashboardShell
            title="Financials"
            subtitle="Track rent performance and manage invoices."
            maxWidthClassName="max-w-5xl"
            action={(
                <InvoiceDialog tenants={tenants || []} />
            )}
        >
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/owner/dashboard">
                    <Button variant="ghost" size="icon-sm" aria-label="Back to owner dashboard">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <span>Back to dashboard</span>
            </div>

            <section className="space-y-4">
                <h2 className="text-lg font-semibold tracking-tight">
                    Summary
                </h2>
                <FinanceSummary invoices={rawInvoices || []} />
            </section>

            <section className="mt-6 space-y-4">
                <h2 className="text-lg font-semibold tracking-tight">
                    Invoices
                </h2>
                <InvoiceList invoices={invoices || []} />
            </section>
        </DashboardShell>
    )
}
