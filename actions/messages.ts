'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// --- Types ---
export interface ChatChannel {
    id: string
    type: 'direct' | 'group' | 'announcement' | 'work_order' | 'grievance'
    name: string | null
    context_id: string | null
    last_message_at: string | null
    metadata: any
    // For direct chats, we might want the other user's info
    other_user?: {
        id: string
        full_name: string
        avatar_url: string | null
    } | null
    unread_count?: number
}

export interface ChatMessage {
    id: string
    content: string
    created_at: string
    sender_id: string
    channel_id: string | null
    read_at: string | null
    sender: {
        full_name: string | null
        avatar_url: string | null
    } | null
    attachments: any[] // TODO: define better type
}


// --- Actions ---

export async function sendMessage(channelId: string, content: string, attachments: { path: string, type: string, size: number }[] = []) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    if (!content.trim() && attachments.length === 0) {
        return { error: 'Message cannot be empty' }
    }

    // Insert message
    const { data: message, error } = await supabase
        .from('messages')
        .insert({
            sender_id: user.id,
            channel_id: channelId,
            content: content.trim()
        })
        .select()
        .single()

    if (error) return { error: error.message }

    // Insert attachments if any
    if (attachments.length > 0) {
        const { error: attError } = await supabase
            .from('message_attachments')
            .insert(
                attachments.map(a => ({
                    message_id: message.id,
                    file_path: a.path,
                    file_type: a.type,
                    file_size: a.size
                }))
            )
        if (attError) console.error('Error saving attachments:', attError)
    }

    // Update channel last_message_at
    await supabase
        .from('chat_channels')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', channelId)

    return { success: true }
}


export async function getChannels(): Promise<{ data?: ChatChannel[], error?: string }> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Get channels user is a member of
    const { data: memberships, error } = await supabase
        .from('channel_members')
        .select(`
            channel:chat_channels(
                id, type, name, context_id, last_message_at, metadata
            ),
            last_read_at
        `)
        .eq('user_id', user.id)
        .order('last_read_at', { ascending: false }) // Initial sort

    if (error) return { error: error.message }
    if (!memberships) return { data: [] }

    // Format and fetch other user info for direct chats
    // Todo: Optimise this to avoid N+1 queries. 
    // Ideally we join `channel_members` again to find the "other" user.

    // Let's do a second query to get all members for these channels
    const channelIds = memberships.map((m: any) => Array.isArray(m.channel) ? m.channel[0].id : m.channel.id)
    const { data: allMembers } = await supabase
        .from('channel_members')
        .select('channel_id, user_id, user:user_id(full_name, avatar_url)')
        .in('channel_id', channelIds)

    const channels: ChatChannel[] = memberships.map((m: any) => {
        const ch = m.channel
        let otherUser = null

        if (ch.type === 'direct') {
            const member = allMembers?.find(am => am.channel_id === ch.id && am.user_id !== user.id)
            if (member?.user) {
                // Manually map database response to expected type
                // Types might be unknown due to complex joins
                otherUser = {
                    id: member.user_id,
                    full_name: (member.user as any).full_name ?? 'Unknown', // Type assertion if needed
                    avatar_url: (member.user as any).avatar_url ?? null
                }
            }
        }

        return {
            ...ch,
            other_user: otherUser,
            unread_count: 0 // logic to calc unread count based on last_read_at vs last_message_at
        }
    })

    // Sort by last_message_at desc
    channels.sort((a, b) => {
        const ta = a.last_message_at ? new Date(a.last_message_at).getTime() : 0
        const tb = b.last_message_at ? new Date(b.last_message_at).getTime() : 0
        return tb - ta
    })

    return { data: channels }
}


export async function getChannelMessages(channelId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('messages')
        .select(`
            *,
            sender:sender_id(full_name, avatar_url),
            attachments:message_attachments(*)
        `)
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true })

    if (error) return []
    return data as unknown as ChatMessage[]
}


export async function createDirectChannel(otherUserId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Check if channel already exists
    // Complex query: find a direct channel where both are members
    // For now, let's just use the RPC approach or simplistic "find all my direct channels and check members"
    // Since we filtered migration to be unique pairs, we should be careful.

    // Easier: Just try to call a dedicated postgres function if possible.
    // Or client-side logic: getChannels -> check `other_user.id`.

    // Let's assume the caller checked locally first, but double check here.
    const { data: myChannels } = await supabase
        .from('channel_members')
        .select('channel_id, channel:chat_channels(type)')
        .eq('user_id', user.id)

    const directChannelIds = myChannels?.filter((mc: any) => mc.channel.type === 'direct').map((mc: any) => mc.channel_id) || []

    if (directChannelIds.length > 0) {
        const { data: existing } = await supabase
            .from('channel_members')
            .select('channel_id')
            .in('channel_id', directChannelIds)
            .eq('user_id', otherUserId)
            .single()

        if (existing) {
            return { data: existing.channel_id }
        }
    }

    // Create new
    const { data: channel, error: createError } = await supabase
        .from('chat_channels')
        .insert({ type: 'direct' })
        .select()
        .single()

    if (createError) return { error: createError.message }

    // Add members
    const { error: memberError } = await supabase
        .from('channel_members')
        .insert([
            { channel_id: channel.id, user_id: user.id },
            { channel_id: channel.id, user_id: otherUserId }
        ])

    if (memberError) return { error: memberError.message }

    return { data: channel.id }
}

export async function markChannelRead(channelId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
        .from('channel_members')
        .update({ last_read_at: new Date().toISOString() })
        .eq('channel_id', channelId)
        .eq('user_id', user.id)
}

export async function getChannelById(channelId: string): Promise<{ data?: ChatChannel, error?: string }> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // fetching channel + explicit single member check to ensure access
    const { data: channel, error } = await supabase
        .from('chat_channels')
        .select('*')
        .eq('id', channelId)
        .single()

    if (error) return { error: error.message }

    // Verify membership
    const { data: membership } = await supabase
        .from('channel_members')
        .select('*')
        .eq('channel_id', channelId)
        .eq('user_id', user.id)
        .single()

    if (!membership) return { error: 'Access denied' }

    // If direct, we might need other user info.
    // Reusing logic from getChannels partially or just defined minimalist return
    let otherUser = null
    if (channel.type === 'direct') {
        const { data: members } = await supabase
            .from('channel_members')
            .select('user:user_id(id, full_name, avatar_url)')
            .eq('channel_id', channelId)
            .neq('user_id', user.id)
            .single()

        if (members?.user) {
            otherUser = {
                id: (members.user as any).id,
                full_name: (members.user as any).full_name,
                avatar_url: (members.user as any).avatar_url
            }
        }
    }

    return {
        data: {
            ...channel,
            other_user: otherUser,
            unread_count: 0
        }
    }
}

export async function getOrCreateContextChannel(
    contextType: 'work_order' | 'grievance' | 'announcement',
    contextId: string,
    name: string,
    participantIds: string[]
): Promise<{ data?: ChatChannel, error?: string }> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // 1. Check if channel exists for this context
    const { data: existing } = await supabase
        .from('chat_channels')
        .select('*')
        .eq('context_type', contextType)
        .eq('context_id', contextId)
        .single()

    if (existing) {
        // Ensure membership
        const { data: membership } = await supabase
            .from('channel_members')
            .select('*')
            .eq('channel_id', existing.id)
            .eq('user_id', user.id)
            .single()

        if (!membership) {
            await supabase
                .from('channel_members')
                .insert({ channel_id: existing.id, user_id: user.id, role: 'member' })
        }
        return { data: existing as any }
    }

    // 2. Create new channel
    const { data: newChannel, error: createError } = await supabase
        .from('chat_channels')
        .insert({
            type: contextType as any,
            context_type: contextType,
            context_id: contextId,
            name: name,
            created_by: user.id
        })
        .select()
        .single()

    if (createError) return { error: createError.message }

    // 3. Add members
    const distinctIds = Array.from(new Set([user.id, ...participantIds]))
    const members = distinctIds.map(uid => ({
        channel_id: newChannel.id,
        user_id: uid,
        role: uid === user.id ? 'owner' : 'member'
    }))

    const { error: memberError } = await supabase
        .from('channel_members')
        .insert(members)

    if (memberError) return { error: 'Channel created but failed to add members: ' + memberError.message }

    return { data: newChannel as any }
}
