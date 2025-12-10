'use client'

import { useTransition, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createGrievance } from '@/actions/grievance'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

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
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<GrievanceFormValues>({
        resolver: zodResolver(grievanceSchema),
        defaultValues: {
            category: 'maintenance',
            description: "",
        },
    })

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB")
                return
            }
            setSelectedFile(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const clearFile = () => {
        setSelectedFile(null)
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    function onSubmit(values: GrievanceFormValues) {
        startTransition(async () => {
            // Optimistic Update Mock: We could add a temporary item to the list here if we had access to the list state. 
            // Since the list is server-rendered, we rely on fast server action + revalidation.
            // Ideally, we'd lift the state up or use a query provider, but for this MVP, instant loading state is sufficient.
            try {
                const formData = new FormData()
                formData.append('category', values.category)
                formData.append('description', values.description)
                if (selectedFile) {
                    formData.append('photo', selectedFile)
                }

                const result = await createGrievance(formData)

                if (result?.error) {
                    const fieldErr = result.details?.fieldErrors
                    const descErr = fieldErr?.description?.[0]
                    const catErr = fieldErr?.category?.[0]
                    toast.error(descErr || catErr || result.error)
                } else {
                    toast.success("Grievance reported. We're on it!")
                    form.reset({ category: 'maintenance', description: '' })
                    clearFile()
                }
            } catch (error) {
                console.error("Submission error:", error);
                toast.error("An unexpected error occurred. Please try again.")
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Type</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger className="bg-background/50 border-white/10">
                                            <SelectValue placeholder="Select type" />
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

                    {/* File Upload Trigger */}
                    <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
                        <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Photo Evidence</span>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full bg-background/50 border-dashed border-white/20 hover:bg-white/5 hover:border-white/40 text-muted-foreground transition-all"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {selectedFile ? (
                                <span className="flex items-center gap-2 truncate max-w-[150px]">
                                    <ImageIcon className="h-4 w-4" />
                                    {selectedFile.name}
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Upload className="h-4 w-4" />
                                    Upload Photo
                                </span>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Image Preview */}
                {previewUrl && (
                    <div className="relative rounded-lg overflow-hidden border border-white/10 h-32 w-full bg-black/20 group">
                        <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation()
                                clearFile()
                            }}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                )}

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder="Briefly describe the issue..."
                                    className="min-h-[100px] bg-background/50 border-white/10 resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-medium shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        "Submit Report"
                    )}
                </Button>
            </form>
        </Form>
    )
}
