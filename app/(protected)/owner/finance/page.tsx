import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { InvoiceList } from '@/components/features/owner/invoice-list'
import { InvoiceDialog } from '@/components/features/owner/invoice-dialog'
import { FinanceSummary } from '@/components/features/owner/finance-summary'
import { ExpenseDialog } from '@/components/features/owner/expense-dialog'
import { ExpenseList } from '@/components/features/owner/expense-list'
import { ProfitAndLossChart } from '@/components/features/owner/profit-and-loss-chart'
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

    const { data: expenses } = await supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false })

    // Build simple monthly P&L (YYYY-MM)
    const incomeByMonth: Record<string, number> = {}
    const expenseByMonth: Record<string, number> = {};

    (rawInvoices || []).forEach((invoice) => {
        if (invoice.status !== 'paid') return
        const month = new Date(invoice.due_date).toISOString().slice(0, 7)
        incomeByMonth[month] = (incomeByMonth[month] || 0) + Number(invoice.amount || 0)
    })

        ; (expenses || []).forEach((expense) => {
            const month = new Date(expense.expense_date).toISOString().slice(0, 7)
            expenseByMonth[month] = (expenseByMonth[month] || 0) + Number(expense.amount || 0)
        })

    const months = Array.from(new Set([...Object.keys(incomeByMonth), ...Object.keys(expenseByMonth)])).sort()
    const profitAndLossData = months.map((month) => {
        const income = incomeByMonth[month] || 0
        const exp = expenseByMonth[month] || 0
        return {
            month,
            income,
            expenses: exp,
            profit: income - exp,
        }
    })

    return (
        <DashboardShell
            title="Financials"
            subtitle="Track rent, expenses, and overall performance."
            maxWidthClassName="max-w-5xl"
            action={(
                <div className="flex items-center gap-2">
                    <ExpenseDialog />
                    <InvoiceDialog tenants={tenants || []} />
                </div>
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

            <section className="mt-6 grid gap-6 lg:grid-cols-[2fr,1.2fr]">
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold tracking-tight">
                        Profit &amp; loss
                    </h2>
                    <ProfitAndLossChart data={profitAndLossData} />
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold tracking-tight">
                            Expenses
                        </h2>
                        <ExpenseDialog />
                    </div>
                    <ExpenseList expenses={expenses || []} />
                </div>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-lg font-semibold tracking-tight">
                    Invoices
                </h2>
                <InvoiceList invoices={invoices || []} />
            </section>
        </DashboardShell>
    )
}
