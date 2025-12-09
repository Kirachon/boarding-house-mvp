import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { MapPin, ShieldCheck, CheckCircle2, BedDouble } from 'lucide-react'
import { notFound } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getProperty(id: string) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet) { },
            },
        }
    )

    const { data: property, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !property) return null

    // Fetch Available Rooms Count
    const { count } = await supabase
        .from('rooms')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', id)
        .eq('occupancy', 'vacant')

    return { ...property, available_rooms: count || 0 }
}

export default async function PublicVerificationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const property = await getProperty(id)

    if (!property) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex items-center justify-center">
            <Card className="w-full max-w-lg shadow-xl border-t-8 border-t-blue-600">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit mb-4">
                        <ShieldCheck className="w-10 h-10 text-blue-600" />
                    </div>

                    {property.is_verified ? (
                        <Badge variant="default" className="mx-auto w-fit bg-blue-600 hover:bg-blue-700 mb-2">
                            Official Verified Partner
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="mx-auto w-fit mb-2">
                            Registered Property
                        </Badge>
                    )}

                    <CardTitle className="text-2xl font-bold text-gray-900 mt-2">
                        {property.name}
                    </CardTitle>
                    <CardDescription className="flex items-center justify-center gap-1 mt-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {property.address}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">

                    {/* Availability Status */}
                    <div className={`rounded-lg p-4 flex items-center gap-4 ${property.available_rooms > 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-100 border border-gray-200'}`}>
                        <div className={`p-2 rounded-full ${property.available_rooms > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                            <BedDouble className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className={`font-semibold ${property.available_rooms > 0 ? 'text-green-900' : 'text-gray-700'}`}>
                                {property.available_rooms > 0 ? 'Space Available' : 'Fully Booked'}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {property.available_rooms > 0
                                    ? `${property.available_rooms} room${property.available_rooms > 1 ? 's' : ''} currently vacant.`
                                    : 'Check back later for openings.'}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">About</h3>
                        <p className="text-gray-700 leading-relaxed">
                            {property.description || "No description provided."}
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Amenities</h3>
                        {property.amenities && property.amenities.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {property.amenities.map((amenity: string) => (
                                    <div key={amenity} className="flex items-center gap-2 text-gray-700">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span className="text-sm">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No specific amenities listed.</p>
                        )}
                    </div>

                    <div className="text-center pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                            Official Verification Page • Powered by BoardingHouse Trust
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
