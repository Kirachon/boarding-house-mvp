'use client'

import { useState, useEffect } from 'react'
import { ChatPanel } from './chat-panel'
import { ChannelList } from './channel-list'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChatChannel, getChannelById } from '@/actions/messages'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'

interface ChatWidgetProps {
    currentUserId: string
}

export function ChatWidget({ currentUserId }: ChatWidgetProps) {
    const [open, setOpen] = useState(false)
    const [view, setView] = useState<'list' | 'chat'>('list')
    const [activeChannel, setActiveChannel] = useState<ChatChannel | null>(null)
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Handle deep linking via URL params
    useEffect(() => {
        const channelId = searchParams.get('chatChannelId')
        if (channelId) {
            setOpen(true)
            setView('chat')
            // Fetch channel if not already active or available
            // We need to fetch the full channel object to pass to ChatPanel
            const loadChannel = async () => {
                const { data, error } = await getChannelById(channelId)
                if (data) {
                    setActiveChannel(data)
                } else {
                    toast.error('Failed to load chat: ' + error)
                    // Remove invalid param to avoid loops or errors
                    // const params = new URLSearchParams(searchParams.toString())
                    // params.delete('chatChannelId')
                    // router.replace(`${pathname}?${params.toString()}`)
                }
            }
            loadChannel()
        }
    }, [searchParams])

    const handleSelectChannel = (channel: ChatChannel) => {
        setActiveChannel(channel)
        setView('chat')
    }

    const handleBack = () => {
        setView('list')
        setActiveChannel(null)
        // Clear URL param if present
        if (searchParams.get('chatChannelId')) {
            const params = new URLSearchParams(searchParams.toString())
            params.delete('chatChannelId')
            router.replace(`${pathname}?${params.toString()}`)
        }
    }

    const handleClose = () => {
        setOpen(false)
        // Optionally clear params or keep state? Usually better to clear or keep.
        // If we keep, re-opening might not trigger effect if params didn't change?
        // Actually effect runs on searchParams change.
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button size="icon" className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground">
                        <MessageCircle className="h-6 w-6" />
                        {/* Todo: Unread badge count here */}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] h-[600px] p-0 mr-6 mb-2 overflow-hidden shadow-2xl border-border/50" side="top" align="end">
                    {view === 'list' ? (
                        <ChannelList
                            currentUserId={currentUserId}
                            onSelectChannel={handleSelectChannel}
                        />
                    ) : activeChannel ? (
                        <ChatPanel
                            currentUserId={currentUserId}
                            channel={activeChannel}
                            onBack={handleBack}
                            onClose={handleClose}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>Loading chat...</p>
                        </div>
                    )}
                </PopoverContent>
            </Popover>
        </div>
    )
}
