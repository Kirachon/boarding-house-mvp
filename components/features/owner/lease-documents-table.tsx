'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Download, Trash2 } from 'lucide-react'
import { Database } from '@/types/supabase'
import { deleteLeaseDocument } from '@/actions/owner-documents'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'

// Local interfaces since these tables may not exist in generated types
interface Profile {
  id: string
  full_name: string | null
}

interface Document {
  id: string
  title: string
  file_url: string
  created_at: string
  profiles?: Profile | null
}

interface LeaseDocumentsTableProps {
  documents: Document[]
}

export function LeaseDocumentsTable({ documents }: LeaseDocumentsTableProps) {
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document?')) return
    const res = await deleteLeaseDocument(id)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success('Document deleted')
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Tenant</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No lease documents uploaded yet.
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-muted/40">
                  <TableCell className="pl-6 text-sm">
                    {doc.profiles?.full_name || '(Tenant)'}
                  </TableCell>
                  <TableCell className="text-sm">{doc.title}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="icon" className="h-8 w-8">
                        <a href={doc.file_url} target="_blank" rel="noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

