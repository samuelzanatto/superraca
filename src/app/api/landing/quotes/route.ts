import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Revalidate cache every 60 seconds
export const revalidate = 60

export async function GET() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('landing_quotes')
            .select('book, phrase, author')
            .eq('active', true)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching quotes:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data || [])
    } catch (error) {
        console.error('Quotes API error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
