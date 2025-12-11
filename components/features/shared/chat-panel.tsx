'use client'

import { useState, useRef, useEffect } from 'react'
import { sendMessage, getChannelMessages, ChatChannel, ChatMessage } from '@/actions/messages' // Fixed import
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, Loader2, User, X, Paperclip, ChevronLeft, Hash, Check, CheckCheck } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

interface ChatPanelProps {
    currentUserId: string
    channel: ChatChannel
    onClose?: () => void
    onBack?: () => void
}

export function ChatPanel({ currentUserId, channel, onClose, onBack }: ChatPanelProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [newMessage, setNewMessage] = useState('')
    const [sending, setSending] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [otherUserTyping, setOtherUserTyping] = useState(false)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const supabase = createClient()

    useEffect(() => {
        loadMessages()

        // Realtime subscription
        const channelSub = supabase
            .channel(`chat:${channel.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `channel_id=eq.${channel.id}`
                },
                (payload) => {
                    const newMsg = payload.new as unknown as ChatMessage
                    // Fetch sender info if needed or just add it
                    // For now, simpler to just append and let it re-fetch or optimistic
                    // But payload doesn't have sender info joined. We might need to fetch it.
                    // For quick update:
                    setMessages(prev => {
                        if (prev.find(m => m.id === newMsg.id)) return prev
                        return [...prev, { ...newMsg, sender: null, attachments: [] }] // minimal mock
                    })
                }
            )
            .on(
                'broadcast',
                { event: 'typing' },
                (payload) => {
                    if (payload.payload.userId !== currentUserId) {
                        setOtherUserTyping(true)
                        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
                        typingTimeoutRef.current = setTimeout(() => setOtherUserTyping(false), 3000)
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channelSub)
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        }
    }, [channel.id])

    // Scroll to bottom on load and new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, loading])

    const loadMessages = async () => {
        setLoading(true)
        const data = await getChannelMessages(channel.id)
        setMessages(data)
        setLoading(false)
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setSending(true)
        try {
            const fileName = `${Date.now()}-${file.name}`
            const filePath = `${channel.id}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('chat-attachments')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const content = newMessage.trim() || `Sent a file: ${file.name}`
            const result = await sendMessage(channel.id, content, [{
                path: filePath,
                type: file.type,
                size: file.size
            }])

            if (result.error) throw new Error(result.error)

            setNewMessage('')
            loadMessages()
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload file')
        } finally {
            setSending(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const handleSend = async () => {
        if (!newMessage.trim() || sending) return

        setSending(true)
        const result = await sendMessage(channel.id, newMessage)

        if (result.error) {
            toast.error(result.error)
        } else {
            setNewMessage('')
            // Optimistic update could happen here but we rely on realtime for now
            // Or manual fetch to be safe
            loadMessages()
        }
        setSending(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const getHeaderTitle = () => {
        if (channel.type === 'direct' && channel.other_user) {
            return channel.other_user.full_name
        }
        return channel.name || 'Chat'
    }

    const getHeaderIcon = () => {
        if (channel.type === 'direct') {
            return (
                <Avatar className="h-8 w-8">
                    <AvatarImage src={channel.other_user?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                        {channel.other_user?.full_name?.charAt(0) || <User className="h-4 w-4" />}
                    </AvatarFallback>
                </Avatar>
            )
        }
        return (
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                <Hash className="h-4 w-4 text-muted-foreground" />
            </div>
        )
    }

    return (
        <Card className="flex flex-col h-full shadow-none border-0">
            <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between border-b p-3 px-4 space-y-0">
                <div className="flex items-center gap-2">
                    {onBack && (
                        <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8" onClick={onBack}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    )}
                    {getHeaderIcon()}
                    <div>
                        <CardTitle className="text-sm font-medium leading-none">
                            {getHeaderTitle()}
                        </CardTitle>
                        {otherUserTyping && (
                            <p className="text-[10px] text-muted-foreground animate-pulse mt-0.5">Typing...</p>
                        )}
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden p-0 relative">
                <ScrollArea className="h-full px-4" ref={scrollRef}>
                    <div className="py-4 space-y-4">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <p>No messages yet.</p>
                                <p className="text-xs mt-1">Start the conversation!</p>
                            </div>
                        ) : (
                            <AnimatePresence initial={false}>
                                {messages.map((msg) => {
                                    const isMe = msg.sender_id === currentUserId
                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn(
                                                'flex w-full',
                                                isMe ? 'justify-end' : 'justify-start'
                                            )}
                                        >
                                            <div className={cn(
                                                "flex flex-col max-w-[80%] gap-1",
                                                isMe ? 'items-end' : 'items-start'
                                            )}>
                                                {!isMe && channel.type !== 'direct' && (
                                                    <span className="text-[10px] text-muted-foreground ml-1">
                                                        {msg.sender?.full_name || 'Unknown'}
                                                    </span>
                                                )}
                                                <div
                                                    className={cn(
                                                        'px-3 py-2 text-sm rounded-2xl',
                                                        isMe
                                                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                                                            : 'bg-muted rounded-bl-sm'
                                                    )}
                                                >
                                                    {!isMe && (
                                                        <p className="text-[10px] font-bold opacity-70 mb-1">
                                                            {msg.sender?.full_name || 'User'}
                                                        </p>
                                                    )}
                                                    <p>{msg.content}</p>
                                                    {isMe && (
                                                        <div className="flex justify-end mt-1">
                                                            {msg.read_at ? (
                                                                <CheckCheck className="h-3 w-3 text-blue-200" />
                                                            ) : (
                                                                <Check className="h-3 w-3 text-primary-foreground/70" />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                {msg.attachments && msg.attachments.length > 0 && (
                                                    <div className="flex flex-col gap-1 mt-1">
                                                        {msg.attachments.map((att: any, idx: number) => (
                                                            <a
                                                                key={idx}
                                                                href="#"
                                                                onClick={async (e) => {
                                                                    e.preventDefault();
                                                                    const { data } = await supabase.storage.from('chat-attachments').createSignedUrl(att.file_path, 3600);
                                                                    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
                                                                }}
                                                                className="text-xs flex items-center gap-1 text-blue-500 hover:underline bg-background/50 px-2 py-1 rounded"
                                                            >
                                                                <Paperclip className="h-3 w-3" />
                                                                Attachment {idx + 1}
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                                {/* Attachments would go here */}
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>

            <div className="flex-shrink-0 border-t p-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex gap-2 items-end">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 flex-shrink-0 rounded-full"
                        disabled={sending}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value)
                            supabase.channel(`chat:${channel.id}`).send({
                                type: 'broadcast',
                                event: 'typing',
                                payload: { userId: currentUserId }
                            })
                        }}
                        onKeyDown={handleKeyDown}
                        disabled={sending}
                        className="flex-1 min-w-0"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={sending || !newMessage.trim()}
                        size="icon"
                        className="h-9 w-9 flex-shrink-0 rounded-full"
                    >
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
