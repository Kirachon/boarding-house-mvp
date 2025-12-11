'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { addMeterReading, deleteMeterReading } from '@/actions/meter-readings'
import { toast } from 'sonner'
import { Loader2, Trash2, Plus, Info, Droplets, Zap } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

interface RoomDetailsDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    roomId: string
    roomName: string
    currentPrice: number
}

// Local type for readings since we might not have generated types yet
type MeterReading = {
    id: string
    reading_date: string
    electricity_reading: number | null
    water_reading: number | null
    created_at: string
}

export function RoomDetailsDialog({ isOpen, onOpenChange, roomId, roomName, currentPrice }: RoomDetailsDialogProps) {
    const [activeTab, setActiveTab] = useState('details')
    const [readings, setReadings] = useState<MeterReading[]>([])
    const [loadingReadings, setLoadingReadings] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch readings when tab is 'utilities'
    useEffect(() => {
        if (isOpen && activeTab === 'utilities' && roomId) {
            fetchReadings()
        }
    }, [isOpen, activeTab, roomId])

    const fetchReadings = async () => {
        setLoadingReadings(true)
        const supabase = createClient()
        const { data, error } = await supabase
            .from('meter_readings')
            .select('*')
            .eq('room_id', roomId)
            .order('reading_date', { ascending: false })

        if (error) {
            toast.error("Failed to load readings")
        } else {
            setReadings(data as MeterReading[])
        }
        setLoadingReadings(false)
    }

    const handleAddReading = async (formData: FormData) => {
        setIsSubmitting(true)
        formData.append('room_id', roomId)

        const res = await addMeterReading(formData)

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Reading added")
            await fetchReadings()
            const form = document.getElementById('add-reading-form') as HTMLFormElement
            form?.reset()
        }
        setIsSubmitting(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this reading?")) return
        const res = await deleteMeterReading(id)
        if (res.error) toast.error(res.error)
        else {
            toast.success("Reading deleted")
            setReadings(prev => prev.filter(r => r.id !== id))
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {roomName}
                        <span className="text-sm font-normal text-muted-foreground">Details</span>
                    </DialogTitle>
                    <DialogDescription>
                        Manage utilities, inventory, and details for this room.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="utilities">Utilities</TabsTrigger>
                        <TabsTrigger value="inventory" disabled>Inventory (Soon)</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="pt-4 space-y-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground">Room Name</Label>
                                        <p className="font-medium text-lg">{roomName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground">Monthly Rent</Label>
                                        <p className="font-medium text-lg">₱{currentPrice.toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="utilities" className="pt-4 space-y-6">
                        {/* New Reading Form */}
                        <Card className="bg-muted/30 border-dashed">
                            <CardContent className="pt-4">
                                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Add New Reading
                                </h3>
                                <form id="add-reading-form" action={handleAddReading} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                    <div className="space-y-2">
                                        <Label htmlFor="reading_date">Date</Label>
                                        <Input type="date" name="reading_date" id="reading_date" required defaultValue={new Date().toISOString().split('T')[0]} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="electricity_reading" className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-500" /> Electricity</Label>
                                        <Input type="number" step="0.01" name="electricity_reading" id="electricity_reading" placeholder="kWh" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="water_reading" className="flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-500" /> Water</Label>
                                        <Input type="number" step="0.01" name="water_reading" id="water_reading" placeholder="Cubic m" />
                                    </div>
                                    <Button type="submit" disabled={isSubmitting} size="default">
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* History Table */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Reading History</h3>
                            {loadingReadings ? (
                                <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Electricity</TableHead>
                                            <TableHead>Water</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {readings.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                                    No readings recorded yet.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            readings.map((reading) => (
                                                <TableRow key={reading.id}>
                                                    <TableCell>{new Date(reading.reading_date).toLocaleDateString()}</TableCell>
                                                    <TableCell className="font-medium">
                                                        {reading.electricity_reading ? (
                                                            <div className="flex items-center gap-2">
                                                                <Zap className="w-3 h-3 text-slate-400" />
                                                                {reading.electricity_reading.toLocaleString()} <span className="text-xs text-muted-foreground font-normal">kWh</span>
                                                            </div>
                                                        ) : '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {reading.water_reading ? (
                                                            <div className="flex items-center gap-2">
                                                                <Droplets className="w-3 h-3 text-slate-400" />
                                                                {reading.water_reading.toLocaleString()} <span className="text-xs text-muted-foreground font-normal">m³</span>
                                                            </div>
                                                        ) : '-'}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(reading.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </div>

                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
