'use client'

import { useEffect, useState } from 'react'
import { getChannels, ChatChannel } from '@/actions/messages'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Hash, User, MessageCircle, AlertCircle, Briefcase } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface ChannelListProps {
    currentUserId: string
    onSelectChannel: (channel: ChatChannel) => void
    className?: string
}

export function ChannelList({ currentUserId, onSelectChannel, className }: ChannelListProps) {
    const [channels, setChannels] = useState<ChatChannel[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadChannels()
    }, [])

    const loadChannels = async () => {
        setLoading(true)
        const { data, error } = await getChannels()
        if (data) {
            setChannels(data)
        }
        setLoading(false)
    }

    const getChannelIcon = (type: string) => {
        switch (type) {
            case 'direct': return <User className="h-4 w-4" />
            case 'announcement': return <MessageCircle className="h-4 w-4" />
            case 'grievance': return <AlertCircle className="h-4 w-4" />
            case 'work_order': return <Briefcase className="h-4 w-4" />
            default: return <Hash className="h-4 w-4" />
        }
    }

    const getChannelName = (channel: ChatChannel) => {
        if (channel.type === 'direct' && channel.other_user) {
            return channel.other_user.full_name || 'Unknown User'
        }
        return channel.name || `Channel ${channel.id.substring(0, 8)}`
    }

    return (
        <Card className={cn("h-full flex flex-col shadow-none border-0", className)}>
            <CardHeader className="p-4 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Messages
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    {loading ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">Loading chats...</div>
                    ) : channels.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <p>No conversations yet.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {channels.map(channel => (
                                <button
                                    key={channel.id}
                                    onClick={() => onSelectChannel(channel)}
                                    className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left border-b last:border-0"
                                >
                                    <Avatar className="h-10 w-10 border">
                                        {channel.type === 'direct' ? (
                                            <AvatarImage src={channel.other_user?.avatar_url || undefined} />
                                        ) : null}
                                        <AvatarFallback className={cn(
                                            channel.type !== 'direct' ? "bg-primary/10 text-primary" : ""
                                        )}>
                                            {channel.type === 'direct'
                                                ? (channel.other_user?.full_name?.charAt(0) || <User className="h-4 w-4" />)
                                                : getChannelIcon(channel.type)
                                            }
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="font-medium truncate text-sm">
                                                {getChannelName(channel)}
                                            </span>
                                            {channel.last_message_at && (
                                                <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                                    {formatDistanceToNow(new Date(channel.last_message_at), { addSuffix: true })}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center text-xs text-muted-foreground">
                                            {channel.type !== 'direct' && (
                                                <span className="mr-2 px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] capitalize">
                                                    {channel.type.replace('_', ' ')}
                                                </span>
                                            )}
                                            {/* Preview text could go here if we fetched it */}
                                        </div>
                                    </div>
                                    {channel.unread_count && channel.unread_count > 0 ? (
                                        <span className="h-2 w-2 rounded-full bg-primary" />
                                    ) : null}
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
