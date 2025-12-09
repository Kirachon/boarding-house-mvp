'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Database } from '@/types/supabase'
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { PaymentUploadDialog } from './payment-upload-dialog'

type Invoice = Database['public']['Tables']['invoices']['Row']

interface TenantInvoiceListProps {
    invoices: Invoice[]
}

export function TenantInvoiceList({ invoices }: TenantInvoiceListProps) {
    const unpaidCount = invoices.filter(i => i.status === 'unpaid' || i.status === 'overdue').length

    return (
        <Card className="card-premium h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-xl">My Bills</CardTitle>
                    <CardDescription>Recent invoices and payment status.</CardDescription>
                </div>
                {unpaidCount > 0 && (
                    <Badge variant="destructive" className="animate-pulse">
                        {unpaidCount} Due
                    </Badge>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {invoices.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground flex flex-col items-center">
                        <CheckCircle2 className="w-10 h-10 text-muted-foreground/30 mb-2" />
                        <p className="text-sm">No bills yet.</p>
                        <p className="text-xs text-muted-foreground/80">When your landlord issues an invoice, it will appear here.</p>
                    </div>
                ) : (
                    invoices.map(invoice => (
                        <div key={invoice.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 gap-4">
                            <div className="space-y-1">
                                <p className="font-semibold text-foreground">{invoice.description}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Due: {new Date(invoice.due_date).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 justify-between sm:justify-end w-full sm:w-auto">
                                <span className="font-mono font-bold text-lg text-slate-700">
                                    ${invoice.amount.toFixed(2)}
                                </span>

                                {invoice.status === 'paid' && (
                                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none shadow-none">
                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Paid
                                    </Badge>
                                )}

                                {invoice.status === 'pending_verification' && (
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        <Clock className="w-3 h-3 mr-1" /> Verifying
                                    </Badge>
                                )}

                                {(invoice.status === 'unpaid' || invoice.status === 'overdue') && (
                                    <PaymentUploadDialog invoice={invoice} />
                                )}
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
