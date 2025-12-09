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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { uploadPaymentProof } from '@/actions/invoice'
import { toast } from 'sonner'
import { UploadCloud, Loader2 } from 'lucide-react'
import { Database } from '@/types/supabase'

type Invoice = Database['public']['Tables']['invoices']['Row']

interface PaymentUploadDialogProps {
    invoice: Invoice
}

export function PaymentUploadDialog({ invoice }: PaymentUploadDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsUploading(true)
        const res = await uploadPaymentProof(invoice.id, formData)
        setIsUploading(false)

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Payment proof uploaded! Pending verification.")
            setIsOpen(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gradient-teal shadow-teal-500/20 shadow-lg text-white">
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Pay / Upload Proof
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload Payment Proof</DialogTitle>
                    <DialogDescription>
                        Please upload a screenshot or photo of your payment receipt (e.g., Bank Transfer, G-Cash).
                    </DialogDescription>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount Due</Label>
                        <div className="text-2xl font-bold font-mono text-slate-700">
                            ${invoice.amount.toFixed(2)}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="proof">Payment Receipt</Label>
                        <Input
                            id="proof"
                            name="proof"
                            type="file"
                            accept="image/*,application/pdf"
                            required
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isUploading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isUploading} className="gradient-teal text-white">
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {isUploading ? 'Uploading...' : 'Submit Proof'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
