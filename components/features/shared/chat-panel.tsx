'use client'

import { useState, useRef, useEffect } from 'react'
import { useMessages } from '@/lib/hooks/use-messages'
import { sendMessage } from '@/actions/messages'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, Loader2, User, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface ChatPanelProps {
    currentUserId: string
    otherUser: {
        id: string
        name: string
        avatar?: string
    }
    onClose?: () => void
}

export function ChatPanel({ currentUserId, otherUser, onClose }: ChatPanelProps) {
    const { messages, loading } = useMessages(otherUser.id, currentUserId)
    const [newMessage, setNewMessage] = useState('')
    const [sending, setSending] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async () => {
        if (!newMessage.trim() || sending) return

        setSending(true)
        const result = await sendMessage(otherUser.id, newMessage)
        if (result.error) {
            toast.error(result.error)
        } else {
            setNewMessage('')
        }
        setSending(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <Card className="flex flex-col h-[500px] max-h-[80vh] w-full max-w-md shadow-xl">
            <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={otherUser.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                            {otherUser.name?.charAt(0) || <User />}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-base">{otherUser.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">Chat</p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-4" ref={scrollRef}>
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <p>No messages yet.</p>
                            <p className="text-sm">Send a message to start the conversation!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <AnimatePresence initial={false}>
                                {messages.map((msg) => {
                                    const isMe = msg.sender_id === currentUserId
                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className={cn(
                                                'flex',
                                                isMe ? 'justify-end' : 'justify-start'
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'max-w-[75%] rounded-2xl px-4 py-2 text-sm',
                                                    isMe
                                                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                                                        : 'bg-muted rounded-bl-sm'
                                                )}
                                            >
                                                {msg.content}
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </ScrollArea>
            </CardContent>

            <div className="flex-shrink-0 border-t p-3">
                <div className="flex gap-2">
                    <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={sending}
                        className="flex-1"
                    />
                    <Button onClick={handleSend} disabled={sending || !newMessage.trim()} size="icon">
                        {sending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>
        </Card>
    )
}
