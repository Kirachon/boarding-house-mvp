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
import { CheckCircle2, Clock, XCircle, FileSearch } from 'lucide-react'
import { updateInvoiceStatus } from '@/actions/invoice'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { PaymentVerificationDialog } from './payment-verification-dialog'

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
            case 'paid':
                return (
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none shadow-none font-medium">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Paid
                    </Badge>
                )
            case 'unpaid':
                return (
                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                        <Clock className="w-3 h-3 mr-1" /> Pending
                    </Badge>
                )
            case 'pending_verification':
                return (
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 animate-pulse">
                        <FileSearch className="w-3 h-3 mr-1" /> Review Needed
                    </Badge>
                )
            case 'overdue':
                return (
                    <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 border-none shadow-none">
                        <XCircle className="w-3 h-3 mr-1" /> Overdue
                    </Badge>
                )
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    return (
        <Card className="card-premium overflow-hidden border-0 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border/50">
                            <TableHead className="w-[200px] pl-6">Tenant</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <p>No invoices found</p>
                                        <p className="text-xs text-muted-foreground/60">Generate a new invoice to get started</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            invoices.map((invoice) => (
                                <TableRow key={invoice.id} className="group hover:bg-muted/30 border-b border-border/40 transition-colors">
                                    <TableCell className="font-medium pl-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                                                {invoice.profiles?.full_name?.charAt(0) || '?'}
                                            </div>
                                            {invoice.profiles?.full_name || 'Unknown'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{invoice.description}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(invoice.due_date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="font-mono font-semibold text-slate-700">
                                        ${invoice.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(invoice.status)}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        {invoice.status === 'pending_verification' ? (
                                            <PaymentVerificationDialog
                                                invoice={invoice}
                                                trigger={
                                                    <Button size="sm" className="gradient-blue text-white shadow-lg shadow-blue-500/20">
                                                        Review Proof
                                                    </Button>
                                                }
                                            />
                                        ) : (
                                            <>
                                                {invoice.status !== 'paid' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                                        onClick={() => handleStatusChange(invoice.id, 'paid')}
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                                        Mark Paid
                                                    </Button>
                                                )}
                                                {invoice.status === 'paid' && (
                                                    <span className="text-xs text-muted-foreground italic px-3 py-2">
                                                        Received
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
