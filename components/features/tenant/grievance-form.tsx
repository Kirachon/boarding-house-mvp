'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createGrievance } from '@/actions/grievance'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const categories = ['wifi', 'cleaning', 'maintenance', 'other'] as const

const grievanceSchema = z.object({
    category: z.enum(categories),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
})

type GrievanceFormValues = z.infer<typeof grievanceSchema>

export function GrievanceForm() {
    const [isPending, startTransition] = useTransition()

    const form = useForm<GrievanceFormValues>({
        resolver: zodResolver(grievanceSchema),
        defaultValues: {
            // Preselect a sensible default to avoid empty submissions
            category: 'maintenance',
            description: "",
        },
    })

    function onSubmit(values: GrievanceFormValues) {
        startTransition(async () => {
            const formData = new FormData()
            formData.append('category', values.category)
            formData.append('description', values.description)

            const result = await createGrievance(formData)

            if (result?.error) {
                // Show field-specific errors if available
                const fieldErr = result.details?.fieldErrors
                const descErr = fieldErr?.description?.[0]
                const catErr = fieldErr?.category?.[0]
                toast.error(descErr || catErr || result.error)
            } else {
                toast.success("Grievance submitted successfully")
                form.reset({ category: 'maintenance', description: '' })
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="wifi">WiFi / Internet</SelectItem>
                                    <SelectItem value="cleaning">Cleaning</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe the issue..."
                                    className="min-h-[120px] text-base"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full h-12 text-lg" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Submit Report
                </Button>
            </form>
        </Form>
    )
}
