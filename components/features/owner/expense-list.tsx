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
import { Trash2 } from 'lucide-react'
import { Database } from '@/types/supabase'
import { deleteExpense } from '@/actions/expense'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'

type Expense = Database['public']['Tables']['expenses']['Row']

interface ExpenseListProps {
  expenses: Expense[]
}

export function ExpenseList({ expenses }: ExpenseListProps) {
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return
    const res = await deleteExpense(id)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success('Expense deleted')
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right pr-6">Amount</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No expenses recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow key={expense.id} className="hover:bg-muted/40">
                  <TableCell className="pl-6 text-sm">
                    {new Date(expense.expense_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm capitalize">{expense.category}</TableCell>
                  <TableCell className="text-sm">
                    {expense.description || <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell className="text-right pr-6 font-mono text-sm">
                    ${expense.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

