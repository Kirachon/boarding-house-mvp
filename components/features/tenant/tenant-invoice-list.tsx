'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Database } from '@/types/supabase'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

type Invoice = Database['public']['Tables']['invoices']['Row']

interface TenantInvoiceListProps {
    invoices: Invoice[]
}

export function TenantInvoiceList({ invoices }: TenantInvoiceListProps) {
    const unpaidCount = invoices.filter(i => i.status === 'unpaid' || i.status === 'overdue').length

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>My Bills</CardTitle>
                    {unpaidCount > 0 && <Badge variant="destructive">{unpaidCount} Due</Badge>}
                </div>
                <CardDescription>Recent invoices and payment status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {invoices.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                        No bills yet. When your landlord issues an invoice, it will appear here.
                    </p>
                ) : (
                    invoices.map(invoice => (
                        <div key={invoice.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                            <div>
                                <p className="text-sm font-medium text-foreground">{invoice.description}</p>
                                <p className="text-xs text-muted-foreground">Due: {new Date(invoice.due_date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-foreground">${invoice.amount.toFixed(2)}</p>
                                {invoice.status === 'paid' ? (
                                    <span className="flex items-center text-xs text-green-600 gap-1 justify-end">
                                        <CheckCircle2 className="w-3 h-3" /> Paid
                                    </span>
                                ) : (
                                    <span className="flex items-center text-xs text-orange-600 gap-1 justify-end font-medium">
                                        <AlertCircle className="w-3 h-3" /> Unpaid
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
