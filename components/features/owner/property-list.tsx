'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, ExternalLink, MapPin, ShieldCheck, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Database } from '@/types/supabase'
import { PropertyDialog } from './property-dialog'
import { deleteProperty } from '@/actions/property'

type Property = Database['public']['Tables']['properties']['Row']

interface PropertyListProps {
  properties: Property[]
}

export function PropertyList({ properties }: PropertyListProps) {
  const handleCopyLink = async (id: string) => {
    const url = `${window.location.origin}/verify/${id}`
    await navigator.clipboard.writeText(url)
    toast.success('Verification link copied to clipboard')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this property? This cannot be undone.')) return
    const res = await deleteProperty(id)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success('Property deleted')
    }
  }

  if (properties.length === 0) {
    return (
      <Card className="border-dashed border-2 border-muted">
        <CardContent className="py-10 flex flex-col items-center gap-3 text-center text-muted-foreground">
          <ShieldCheck className="h-8 w-8 mb-1 text-muted-foreground/60" />
          <p className="text-sm">No properties yet.</p>
          <p className="text-xs max-w-sm">
            Add your first property to generate a public verification link tenants and guests can
            trust.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {properties.map((property) => {
        const verifyUrl = `/verify/${property.id}`
        return (
          <Card key={property.id} className="card-premium">
            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  {property.name}
                  {(property as any).is_verified && (
                    <Badge className="bg-blue-600 text-white hover:bg-blue-700">Verified</Badge>
                  )}
                </CardTitle>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {property.address}, {(property as any).city}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <PropertyDialog
                  mode="edit"
                  property={property}
                  trigger={
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <ShieldCheck className="h-4 w-4" />
                    </Button>
                  }
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-red-500 border-red-100 hover:bg-red-50"
                  onClick={() => handleDelete(property.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-wrap gap-2">
                {Array.isArray((property as any).amenities) &&
                  (property as any).amenities.map((amenity: string) => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-3">
                {(property as any).description || 'No description provided.'}
              </p>
              <div className="flex items-center justify-between pt-2 border-t mt-2 text-xs">
                <span className="text-muted-foreground">Public verification link</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    asChild
                  >
                    <a href={verifyUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 gap-1 text-xs"
                    onClick={() => handleCopyLink(property.id)}
                  >
                    <Copy className="h-3 w-3" />
                    Copy link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

