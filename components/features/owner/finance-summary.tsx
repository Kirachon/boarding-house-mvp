import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, AlertCircle, TrendingUp } from 'lucide-react'
import { Database } from '@/types/supabase'

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                        Income This Month
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                        ${totalPaidThisMonth.toFixed(2)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        From {thisMonthInvoices.filter(i => i.status === 'paid').length} paid invoices
                    </p>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                        Outstanding
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                        ${totalOutstanding.toFixed(2)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Awaiting payment
                    </p>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                        Overdue
                    </CardTitle>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                        ${totalOverdue.toFixed(2)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Past due date
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
