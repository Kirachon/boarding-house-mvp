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
import { Receipt } from 'lucide-react'
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
                <Button><Receipt className="w-4 h-4 mr-2" /> Generate Invoice</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate Rent Invoice</DialogTitle>
                    <DialogDescription>
                        Create a manual invoice for a tenant.
                    </DialogDescription>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="tenant_id">Tenant</Label>
                        <Select name="tenant_id" required>
                            <SelectTrigger>
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
                        <Input id="description" name="description" defaultValue="Rent for current month" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount ($)</Label>
                            <Input id="amount" name="amount" type="number" step="0.01" min="0" required placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="due_date">Due Date</Label>
                            <Input id="due_date" name="due_date" type="date" defaultValue={today} required />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit">Create Invoice</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
