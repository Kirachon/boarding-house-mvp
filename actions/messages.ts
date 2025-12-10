'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendMessage(receiverId: string, content: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    if (!content.trim()) {
        return { error: 'Message cannot be empty' }
    }

    const { error } = await supabase
        .from('messages')
        .insert({
            sender_id: user.id,
            receiver_id: receiverId,
            content: content.trim()
        })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function markAsRead(messageId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('receiver_id', user.id) // Ensure only receiver can mark as read

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function getConversation(otherUserId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('messages')
        .select('*, sender:sender_id(full_name, avatar_url), receiver:receiver_id(full_name, avatar_url)')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })

    if (error) return []
    return data
}

export async function getChatList() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // Get unique users this user has chatted with
    const { data, error } = await supabase
        .from('messages')
        .select('sender_id, receiver_id, content, created_at, sender:sender_id(full_name, avatar_url), receiver:receiver_id(full_name, avatar_url)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

    if (error || !data) return []

    // Deduplicate and get latest message per conversation
    const conversations = new Map()
    for (const msg of data as any[]) {
        const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id
        const otherProfile = msg.sender_id === user.id ? msg.receiver : msg.sender
        if (!conversations.has(otherId)) {
            conversations.set(otherId, {
                id: otherId,
                name: otherProfile?.full_name ?? 'Unknown',
                avatar: otherProfile?.avatar_url ?? null,
                lastMessage: msg.content,
                lastMessageAt: msg.created_at
            })
        }
    }

    return Array.from(conversations.values())
}
