'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Message {
    id: string
    sender_id: string
    receiver_id: string
    content: string
    read_at: string | null
    created_at: string
    sender?: { full_name: string; avatar_url: string }
    receiver?: { full_name: string; avatar_url: string }
}

export function useMessages(otherUserId: string, currentUserId: string) {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)

    const fetchMessages = useCallback(async () => {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('messages')
            .select('*, sender:sender_id(full_name, avatar_url), receiver:receiver_id(full_name, avatar_url)')
            .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`)
            .order('created_at', { ascending: true })

        if (!error && data) {
            setMessages(data)
        }
        setLoading(false)
    }, [otherUserId, currentUserId])

    useEffect(() => {
        fetchMessages()

        // Subscribe to new messages
        const supabase = createClient()
        const channel = supabase
            .channel(`messages:${currentUserId}:${otherUserId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `or(and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId}))`
                },
                (payload) => {
                    // Append new message
                    setMessages((prev) => [...prev, payload.new as Message])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [fetchMessages, currentUserId, otherUserId])

    return { messages, loading, refetch: fetchMessages }
}
