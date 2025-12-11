'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { updatePassword } from '@/actions/security'
import { toast } from 'sonner'
import { Loader2, Lock, CheckCircle2 } from 'lucide-react'

export function PasswordChangeForm() {
    const [loading, setLoading] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        const password = formData.get('password') as string
        const confirm = formData.get('confirmPassword') as string

        if (password !== confirm) {
            toast.error("Passwords do not match")
            setLoading(false)
            return
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters")
            setLoading(false)
            return
        }

        const res = await updatePassword(formData)

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Password updated successfully")
            formRef.current?.reset()
        }
        setLoading(false)
    }

    return (
        <Card className="card-premium">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Lock className="w-4 h-4 text-indigo-500" />
                    Security
                </CardTitle>
                <CardDescription>
                    Update your password to keep your account secure.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={loading} variant="outline" className="min-w-[120px]">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    Update Password
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
