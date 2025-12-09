import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { GrievanceForm } from '@/components/features/tenant/grievance-form'
import { GrievanceList } from '@/components/features/tenant/grievance-list'
import { TenantInvoiceList } from '@/components/features/tenant/tenant-invoice-list'

export default async function TenantDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Fetch initial grievances
    const { data: grievances } = await supabase
        .from('grievances')
        .select('*')
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false })

    // Fetch invoices
    const { data: invoices } = await supabase
        .from('invoices')
        .select('*')
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gray-50">
            <div className="max-w-md mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-900">My Room</h1>
                    <form action={logout}>
                        <Button variant="ghost" size="sm">Sign Out</Button>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                    <p className="text-sm text-gray-500">Welcome back</p>
                    <p className="font-medium">{user.email}</p>
                </div>

                {/* New: Invoices Section */}
                <TenantInvoiceList invoices={invoices || []} />

                <Card>
                    <CardHeader>
                        <CardTitle>Report an Issue</CardTitle>
                        <CardDescription>
                            Something wrong? Let us know and we&apos;ll fix it.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <GrievanceForm />
                    </CardContent>
                </Card>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-4">My Reports</h3>
                    <GrievanceList
                        initialGrievances={grievances || []}
                        userId={user.id}
                    />
                </div>
            </div>
        </div>
    )
}
