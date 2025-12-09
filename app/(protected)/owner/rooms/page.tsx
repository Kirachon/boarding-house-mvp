import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RoomDataTable } from '@/components/features/owner/room-data-table'
import { RoomDialog } from '@/components/features/owner/room-dialog'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default async function RoomManagementPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Fetch rooms
    const { data: rooms } = await supabase
        .from('rooms')
        .select('*')
        .order('name')

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/owner/dashboard">
                            <Button variant="ghost" size="icon"><ChevronLeft className="w-5 h-5" /></Button>
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
                    </div>
                    <RoomDialog mode="create" />
                </div>

                <RoomDataTable rooms={rooms || []} />
            </div>
        </div>
    )
}
