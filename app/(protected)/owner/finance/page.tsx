import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { InvoiceList } from '@/components/features/owner/invoice-list'
import { InvoiceDialog } from '@/components/features/owner/invoice-dialog'
import { FinanceSummary } from '@/components/features/owner/finance-summary'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

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
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/owner/dashboard">
                            <Button variant="ghost" size="icon"><ChevronLeft className="w-5 h-5" /></Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Financials</h1>
                            <p className="text-gray-500">Track rent and manage invoices.</p>
                        </div>
                    </div>
                    <InvoiceDialog tenants={tenants || []} />
                </div>

                {/* P/L Summary Cards */}
                <FinanceSummary invoices={rawInvoices || []} />

                <InvoiceList invoices={invoices || []} />
            </div>
        </div>
    )
}
