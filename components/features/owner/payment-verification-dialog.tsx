'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import { verifyPayment } from '@/actions/invoice'
import { toast } from 'sonner'
import { Database } from '@/types/supabase'
import { CheckCircle2, XCircle, ExternalLink, Receipt } from 'lucide-react'
import Image from 'next/image'

type Invoice = Database['public']['Tables']['invoices']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'] | null
}

interface PaymentVerificationDialogProps {
    invoice: Invoice
    trigger?: React.ReactNode
}

export function PaymentVerificationDialog({ invoice, trigger }: PaymentVerificationDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleVerification = async (approved: boolean) => {
        setIsSubmitting(true)
        const res = await verifyPayment(invoice.id, approved)
        setIsSubmitting(false)

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success(approved ? "Payment Approved" : "Payment Rejected")
            setIsOpen(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || <Button variant="outline" size="sm">Review</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Verify Payment</DialogTitle>
                    <DialogDescription>
                        Review the proof of payment submitted by {invoice.profiles?.full_name}.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-md border text-sm">
                        <span className="text-muted-foreground">Amount Claimed:</span>
                        <span className="font-mono font-bold text-lg">${invoice.amount.toFixed(2)}</span>
                    </div>

                    <div className="relative aspect-video w-full bg-slate-100 rounded-lg overflow-hidden border">
                        {invoice.proof_image_url ? (
                            <Image
                                src={invoice.proof_image_url}
                                alt="Payment Proof"
                                fill
                                className="object-contain"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground italic">
                                No image available
                            </div>
                        )}
                    </div>

                    {invoice.proof_image_url && (
                        <div className="text-right">
                            <a
                                href={invoice.proof_image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline flex items-center justify-end gap-1"
                            >
                                <ExternalLink className="w-3 h-3" /> View Full Image
                            </a>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-4">
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleVerification(false)}
                        disabled={isSubmitting}
                    >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                    </Button>
                    <div className="flex-1" />
                    <Button
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleVerification(true)}
                        disabled={isSubmitting}
                    >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve Payment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
