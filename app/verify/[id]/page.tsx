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
            <Card className="w-full max-w-lg border-t-8 border-t-blue-600 shadow-xl">
                <CardHeader className="pb-2 text-center">
                    <div className="mx-auto mb-4 w-fit rounded-full bg-blue-100 p-3">
                        <ShieldCheck className="w-10 h-10 text-blue-600" />
                    </div>

                    {property.is_verified ? (
                        <Badge variant="default" className="mx-auto mb-2 w-fit bg-blue-600 hover:bg-blue-700">
                            Official Verified Partner
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="mx-auto mb-2 w-fit">
                            Registered Property
                        </Badge>
                    )}

                    <CardTitle className="mt-2 text-2xl font-bold text-foreground">
                        {property.name}
                    </CardTitle>
                    <CardDescription className="mt-1 flex items-center justify-center gap-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {property.address}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">

                    {/* Availability Status */}
                    <div className={`flex items-center gap-4 rounded-lg p-4 ${property.available_rooms > 0 ? 'bg-green-50 border border-green-200' : 'bg-muted border border-border'}`}>
                        <div className={`rounded-full p-2 ${property.available_rooms > 0 ? 'bg-green-100 text-green-600' : 'bg-muted-foreground/10 text-muted-foreground'}`}>
                            <BedDouble className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className={`font-semibold ${property.available_rooms > 0 ? 'text-green-900' : 'text-foreground'}`}>
                                {property.available_rooms > 0 ? 'Space Available' : 'Fully Booked'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {property.available_rooms > 0
                                    ? `${property.available_rooms} room${property.available_rooms > 1 ? 's' : ''} currently vacant.`
                                    : 'Check back later for openings.'}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">About</h3>
                        <p className="leading-relaxed text-foreground">
                            {property.description || "No description provided."}
                        </p>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/40 p-4">
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Amenities</h3>
                        {property.amenities && property.amenities.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {property.amenities.map((amenity: string) => (
                                    <div key={amenity} className="flex items-center gap-2 text-foreground">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span className="text-sm">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm italic text-muted-foreground">No specific amenities listed.</p>
                        )}
                    </div>

                    <div className="border-t border-border/40 pt-4 text-center">
                        <p className="text-xs text-muted-foreground">
                            Official Verification Page • Powered by BoardingHouse Trust
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
