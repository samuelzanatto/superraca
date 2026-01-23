import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Revalidate cache every 60 seconds
export const revalidate = 60

export async function GET() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('landing_cards')
            .select('id, type, thumbnail, title, tag')
            .eq('active', true)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching cards:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Transform to match frontend expected format
        const cards = (data || []).map(item => ({
            id: item.id,
            type: item.type,
            src: item.thumbnail,
            title: item.title,
            code: item.tag
        }))

        return NextResponse.json(cards)
    } catch (error) {
        console.error('Cards API error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
