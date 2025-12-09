'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, FileQuestion } from 'lucide-react'

type Document = Database['public']['Tables']['documents']['Row']

interface TenantLeaseDocumentsProps {
  initialDocuments: Document[]
}

export function TenantLeaseDocuments({ initialDocuments }: TenantLeaseDocumentsProps) {
  const supabase = createClient()
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)

  useEffect(() => {
    const fetchLatest = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('tenant_id', user.id)
        .eq('type', 'lease')
        .order('created_at', { ascending: false })

      if (data) setDocuments(data)
    }

    // simple refresh on mount
    if (initialDocuments.length === 0) {
      fetchLatest()
    }
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-100 flex items-center justify-center">
          <FileText className="h-4 w-4" />
        </div>
        <div>
          <CardTitle className="text-base">Lease documents</CardTitle>
          <p className="text-xs text-muted-foreground">
            Copies of your lease uploaded by the owner.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <FileQuestion className="h-6 w-6 mb-2 opacity-40" />
            <p className="text-sm">No lease documents are available yet.</p>
            <p className="text-xs">
              If you need a copy, please contact your owner or manager.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-md border bg-card/50 px-3 py-2"
              >
                <div>
                  <p className="font-medium truncate">{doc.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Uploaded {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button asChild size="icon" variant="outline" className="h-8 w-8 shrink-0">
                  <a href={doc.file_url} target="_blank" rel="noreferrer">
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

