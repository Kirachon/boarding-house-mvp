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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createInvoice } from '@/actions/invoice'
import { toast } from 'sonner'
import { Receipt, FileText } from 'lucide-react'
import { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

interface InvoiceDialogProps {
    tenants: Profile[]
}

export function InvoiceDialog({ tenants }: InvoiceDialogProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        const res = await createInvoice(formData)

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Invoice generated successfully")
            setIsOpen(false)
        }
    }

    const today = new Date().toISOString().split('T')[0]

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gradient-indigo text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all">
                    <FileText className="w-4 h-4 mr-2" />
                    Create Invoice
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-8 w-8 rounded-lg gradient-indigo flex items-center justify-center">
                            <Receipt className="h-4 w-4 text-white" />
                        </div>
                        Generate Invoice
                    </DialogTitle>
                    <DialogDescription>
                        Create a manual rent or utility invoice for a tenant.
                    </DialogDescription>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="tenant_id">Tenant</Label>
                        <Select name="tenant_id" required>
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder="Select Tenant" />
                            </SelectTrigger>
                            <SelectContent>
                                {tenants.map(tenant => (
                                    <SelectItem key={tenant.id} value={tenant.id}>
                                        {tenant.full_name || 'Unnamed Tenant'}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            name="description"
                            defaultValue="Rent for current month"
                            className="h-10"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount ($)</Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                placeholder="0.00"
                                className="h-10 font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="due_date">Due Date</Label>
                            <Input
                                id="due_date"
                                name="due_date"
                                type="date"
                                defaultValue={today}
                                className="h-10"
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button type="submit" className="gradient-indigo text-white">Create Invoice</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
