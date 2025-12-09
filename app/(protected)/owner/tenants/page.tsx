import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { TenantList } from '@/components/features/owner/tenant-list'
import { TenantDialog } from '@/components/features/owner/tenant-dialog'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default async function TenantManagementPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Fetch active assignments
    const { data: assignments } = await supabase
        .from('tenant_room_assignments')
        .select(`
        *,
        profiles!inner(*),
        rooms!inner(*)
    `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    // Fetch rooms for dropdown
    const { data: rooms } = await supabase.from('rooms').select('*').order('name')

    // Cast weird type issue if necessary, or let implicit inference handle it if schemas match
    // The join type in supabase-js can be tricky. We'll cast in props if needed.

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/owner/dashboard">
                            <Button variant="ghost" size="icon"><ChevronLeft className="w-5 h-5" /></Button>
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Tenant Roster</h1>
                    </div>
                    <TenantDialog rooms={rooms || []} />
                </div>

                <TenantList assignments={assignments || []} />
            </div>
        </div>
    )
}
