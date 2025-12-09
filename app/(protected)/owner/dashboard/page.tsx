import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { OwnerGrievanceList } from '@/components/features/owner/owner-grievance-list'
import { RoomHealthGrid } from '@/components/features/owner/room-health-grid'

export default async function OwnerDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Fetch all active grievances
    const { data: grievances } = await supabase
        .from('grievances')
        .select('*')
        .order('created_at', { ascending: true })

    // Fetch rooms with inventory (Deep Fetch)
    const { data: rooms } = await supabase
        .from('rooms')
        .select(`
      *,
      inventory_items (*)
    `)
        .order('name')

    const activeCount = grievances?.filter(g => g.status === 'open' || g.status === 'in_progress').length || 0

    // Calculate Occupancy
    const totalRooms = rooms?.length || 0
    const occupiedRooms = rooms?.filter(r => r.occupancy === 'occupied').length || 0
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-teal-900">Owner Command Center</h1>
                    <form action={logout}>
                        <Button variant="outline">Sign Out</Button>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-teal-600 mb-8">
                    <h2 className="text-xl font-semibold mb-2">Property Overview</h2>
                    <p className="text-gray-600 mb-4">Welcome back, Owner {user.email}</p>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 bg-teal-50 rounded border border-teal-100">
                            <h3 className="font-medium text-teal-800">Active Issues</h3>
                            <p className="text-2xl font-bold text-teal-900">{activeCount}</p>
                        </div>
                        <div className="p-4 bg-teal-50 rounded border border-teal-100">
                            <h3 className="font-medium text-teal-800">Occupancy</h3>
                            <p className="text-2xl font-bold text-teal-900">{occupancyRate}%</p>
                            <p className="text-sm text-gray-500">{occupiedRooms} / {totalRooms} Rooms</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Living Inventory</h2>
                            <RoomHealthGrid rooms={rooms || []} />
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Grievance Inbox</h2>
                        <OwnerGrievanceList initialGrievances={grievances || []} />
                    </div>
                </div>
            </div>
        </div>
    )
}
