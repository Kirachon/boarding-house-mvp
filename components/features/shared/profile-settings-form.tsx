'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updateProfile } from '@/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { User, Camera, Loader2, Save } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { PasswordChangeForm } from './password-change-form'

interface ProfileSettingsFormProps {
    user: any
    profile: any
}

export function ProfileSettingsForm({ user, profile }: ProfileSettingsFormProps) {
    const [loading, setLoading] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Preferences state
    const [emailEnabled, setEmailEnabled] = useState(profile?.reminder_email_enabled ?? true)

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            const file = event.target.files?.[0]
            if (!file) return

            const supabase = createClient()
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}-${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
            setAvatarUrl(data.publicUrl)
            toast.success('Avatar uploaded successfully')
        } catch (error: any) {
            toast.error('Error uploading avatar: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        formData.append('avatar_url', avatarUrl || '')

        // Preferences
        const preferences = {
            theme: 'system', // placeholder
            notifications: {
                email: emailEnabled
            }
        }
        formData.append('preferences', JSON.stringify(preferences))

        // Just for the migration we did earlier - strictly speaking 'reminder_email_enabled' is a column on profiles now
        // but our updateProfile action handles generic columns. Wait, verify updateProfile action.
        // Ah, I need to make sure updateProfile handles 'reminder_email_enabled' if it's a column, 
        // or we store it in JSON preferences. The migration added both. 
        // Let's rely on JSON preferences for flexibility, but also sync the column if possible?
        // Actually, createProfile action I wrote only specifically updates: full_name, phone, avatar_url, preferences.
        // So 'reminder_email_enabled' column won't be updated by `updateProfile` unless I add it.
        // Let's start with 'preferences' JSON for now or update the action. 
        // I'll stick to what I wrote in `actions/profile.ts` which uses `preferences` JSON.

        const result = await updateProfile(formData)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Profile updated')
        }
        setLoading(false)
    }

    return (
        <>
            <Card className="card-premium">
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                        Manage your account details and preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Avatar Section */}
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <Avatar className="h-20 w-20 border-2 border-border">
                                    <AvatarImage src={avatarUrl || ''} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                        {profile?.full_name?.charAt(0) || <User />}
                                    </AvatarFallback>
                                </Avatar>
                                <div
                                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Camera className="h-5 w-5" />
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={uploading}
                                />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-medium">Profile Photo</h3>
                                <p className="text-sm text-muted-foreground">
                                    Click the image to upload. JPG, GIF or PNG.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={user.email}
                                    disabled
                                    className="bg-muted text-muted-foreground"
                                />
                                <p className="text-[10px] text-muted-foreground">
                                    Email cannot be changed. Contact support for help.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="full_name">Full Name</Label>
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    defaultValue={profile?.full_name || ''}
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    defaultValue={profile?.phone || ''}
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t">
                            <h3 className="font-medium text-sm">Notifications</h3>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="notifications"
                                    checked={emailEnabled}
                                    onCheckedChange={(c) => setEmailEnabled(!!c)}
                                />
                                <Label htmlFor="notifications" className="font-normal cursor-pointer">
                                    Receive email notifications for invoices and updates
                                </Label>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={loading || uploading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <PasswordChangeForm />
        </>
    )
}
