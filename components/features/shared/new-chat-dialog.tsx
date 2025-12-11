'use client'

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, User, Loader2, MessageSquarePlus } from 'lucide-react'
import { getAvailableUsersForChat, ChatUser } from '@/actions/users'
import { createDirectChannel } from '@/actions/messages'
import { toast } from 'sonner'
import { ChatChannel } from '@/actions/messages'

interface NewChatDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onChannelCreated: (channel: ChatChannel) => void
}

export function NewChatDialog({ open, onOpenChange, onChannelCreated }: NewChatDialogProps) {
    const [users, setUsers] = useState<ChatUser[]>([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [creating, setCreating] = useState<string | null>(null)

    useEffect(() => {
        if (open) {
            loadUsers()
        }
    }, [open])

    const loadUsers = async () => {
        setLoading(true)
        const { data, error } = await getAvailableUsersForChat()
        if (data) {
            setUsers(data)
        } else {
            toast.error(error || 'Failed to load users')
        }
        setLoading(false)
    }

    const handleStartChat = async (userId: string) => {
        setCreating(userId)
        try {
            const result = await createDirectChannel(userId)
            if (result.error) {
                toast.error(result.error)
            } else if (result.data) {
                // We get the ID back. We need to construct a partial channel object 
                // or fetch it to pass back.
                // For simplicity, let's just close and let the parent refresh or 
                // we can try to fetch the single channel immediately.
                // The channel-list automatically refreshes on select usually if we did it right,
                // but here we need to tell the parent to switch view.
                // The createDirectChannel returns the ID.

                // Quick fetch of the channel to pass to onChannelCreated
                // We'll rely on the parent (ChannelList) to handle the 'refresh' 
                // logic or just switch to the view.
                // Actually `onChannelCreated` expects a `ChatChannel`.
                // Let's modify `onChannelCreated` to accept just ID or we fetch here.

                // Correct approach: Just return the ID to parent and let parent fetch/nav?
                // Or fetch here.
                // Let's assume onChannelCreated handles it.
                // Wait, ChannelList expects to select a channel object.
                // We'll mock it for now or we should fetch it.
                // Let's fetch the channel details to be clean.
                // Importing getChannelById from actions would be best but created circular deps maybe?
                // Let's just callback with the ID and let parent handle it if possible, 
                // but TS expects ChatChannel.

                // Minimal mock to switch immediately
                const user = users.find(u => u.id === userId)
                const mockChannel: any = {
                    id: result.data,
                    type: 'direct',
                    other_user: user,
                    unread_count: 0,
                    last_message_at: new Date().toISOString()
                }

                onChannelCreated(mockChannel)
                onOpenChange(false)
            }
        } catch (error) {
            toast.error('Failed to create chat')
        } finally {
            setCreating(null)
        }
    }

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-4 px-6 border-b">
                    <DialogTitle>New Message</DialogTitle>
                </DialogHeader>

                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search people..."
                            className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <ScrollArea className="h-[300px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-full py-8 text-muted-foreground">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-8 text-muted-foreground gap-2">
                            <User className="h-8 w-8 opacity-20" />
                            <p>No users found</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {filteredUsers.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => handleStartChat(user.id)}
                                    disabled={creating === user.id}
                                    className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left"
                                >
                                    <Avatar>
                                        <AvatarImage src={user.avatar_url || undefined} />
                                        <AvatarFallback>
                                            {user.full_name?.charAt(0) || <User className="h-4 w-4" />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="font-medium">{user.full_name || 'Unknown User'}</div>
                                        <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
                                    </div>
                                    {creating === user.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    ) : (
                                        <MessageSquarePlus className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
