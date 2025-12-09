'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createExpense(formData: FormData) {
    const supabase = await createClient()
    const category = formData.get('category') as string
    const amount = parseFloat(formData.get('amount') as string)
    const description = formData.get('description') as string
    const expense_date = formData.get('expense_date') as string || new Date().toISOString()

    if (!category || isNaN(amount)) {
        return { error: 'Category and valid amount are required' }
    }

    const { error } = await supabase
        .from('expenses')
        .insert({
            category,
            amount,
            description,
            expense_date
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/owner/dashboard')
    revalidatePath('/owner/finance')
    return { success: true }
}

export async function deleteExpense(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/owner/dashboard')
    revalidatePath('/owner/finance')
    return { success: true }
}
