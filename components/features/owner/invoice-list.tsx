'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Database } from '@/types/supabase'
import { CheckCircle2 } from 'lucide-react'
import { updateInvoiceStatus } from '@/actions/invoice'
import { toast } from 'sonner'

type Invoice = Database['public']['Tables']['invoices']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'] | null
}

interface InvoiceListProps {
    invoices: Invoice[]
}

export function InvoiceList({ invoices }: InvoiceListProps) {

    const handleStatusChange = async (id: string, newStatus: 'paid' | 'unpaid' | 'cancelled') => {
        const res = await updateInvoiceStatus(id, newStatus)
        if (res?.error) toast.error(res.error)
        else toast.success(`Invoice marked as ${newStatus}`)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Paid</Badge>
            case 'unpaid': return <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Unpaid</Badge>
            case 'overdue': return <Badge variant="destructive">Overdue</Badge>
            default: return <Badge variant="secondary">{status}</Badge>
        }
    }

    return (
        <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                                No invoices found. Generate one above.
                            </TableCell>
                        </TableRow>
                    ) : (
                        invoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell className="font-medium">
                                    {invoice.profiles?.full_name || 'Unknown'}
                                </TableCell>
                                <TableCell>{invoice.description}</TableCell>
                                <TableCell className="text-gray-500">
                                    {new Date(invoice.due_date).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="font-mono font-semibold">
                                    ${invoice.amount.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(invoice.status)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {invoice.status !== 'paid' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-green-600 hover:bg-green-50"
                                            onClick={() => handleStatusChange(invoice.id, 'paid')}
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            Mark Paid
                                        </Button>
                                    )}
                                    {invoice.status === 'paid' && (
                                        <span className="text-xs text-gray-400 italic mr-2">Received</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        )))}
                </TableBody>
            </Table>
        </div>
    )
}
