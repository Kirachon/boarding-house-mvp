'use client'

import { useState } from 'react'
import { ChatPanel } from './chat-panel'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface ChatWidgetProps {
    currentUserId: string
    otherUser?: { // In a real app, this would be selected from a list or context
        id: string
        name: string
        avatar?: string
    }
}

export function ChatWidget({ currentUserId }: ChatWidgetProps) {
    const [open, setOpen] = useState(false)

    // For MVP, we'll just show a placeholder or a specific user if known.
    // Since this is a global widget, we probably need a "Chat List" first, then "Chat Panel".
    // But my current ChatPanel takes a specific 'otherUser'.
    // To keep it simple for the MVP "Verification", I'll make it open a list (which I added to server actions but maybe not UI).
    // Actually, let's just make it a "Support/Global Chat" button that opens the panel for a *demo* user if we don't have a list UI yet.
    // OR: Just implement the "Chat List" inside the widget.

    // Let's check `actions/messages.ts` -> `getChatList`.
    // I'll create a simple 'ChatList' view inside the widget.

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button size="icon" className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground">
                        <MessageCircle className="h-6 w-6" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 mr-6 mb-2" side="top" align="end">
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        <p>Chat System Ready</p>
                        <p className="text-xs mt-2">(Select a tenant from the dashboard to chat)</p>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
