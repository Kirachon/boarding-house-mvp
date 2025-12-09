import { DollarSign, AlertCircle, TrendingUp } from 'lucide-react'
import { Database } from '@/types/supabase'
import { MetricCard } from '@/components/shared/metric-card'

type Invoice = Database['public']['Tables']['invoices']['Row']

interface FinanceSummaryProps {
    invoices: Invoice[]
}

export function FinanceSummary({ invoices }: FinanceSummaryProps) {
    // Calculate metrics
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // Filter invoices for current month (by created_at or due_date - let's use due_date for "monthly revenue")
    const thisMonthInvoices = invoices.filter(inv => {
        const dueDate = new Date(inv.due_date)
        return dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear
    })

    const totalPaidThisMonth = thisMonthInvoices
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + Number(i.amount), 0)

    const totalOutstanding = invoices
        .filter(i => i.status === 'unpaid' || i.status === 'overdue')
        .reduce((sum, i) => sum + Number(i.amount), 0)

    const totalOverdue = invoices
        .filter(i => i.status === 'overdue')
        .reduce((sum, i) => sum + Number(i.amount), 0)

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard
                label="Income This Month"
                value={`$${totalPaidThisMonth.toFixed(2)}`}
                helperText={`${thisMonthInvoices.filter(i => i.status === 'paid').length} paid invoices`}
                icon={<TrendingUp />}
                trend="up"
                trendValue="Current"
                className="border-l-4 border-l-emerald-500"
            />

            <MetricCard
                label="Outstanding"
                value={`$${totalOutstanding.toFixed(2)}`}
                helperText="Awaiting payment"
                icon={<DollarSign />}
                trend="neutral"
                trendValue="Pending"
                className="border-l-4 border-l-amber-500"
            />

            <MetricCard
                label="Overdue"
                value={`$${totalOverdue.toFixed(2)}`}
                helperText={`Past due date`}
                icon={<AlertCircle />}
                trend="down"
                trendValue="Action Needed"
                className="border-l-4 border-l-red-500"
            />
        </div>
    )
}
