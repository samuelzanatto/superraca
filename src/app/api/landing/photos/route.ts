import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Revalidate cache every 60 seconds
export const revalidate = 60

export async function GET() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('gallery_photos')
            .select('id, url, alt, object_position')
            .eq('active', true)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching photos:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Transform data to simpler format
        const photos = (data || []).map(photo => ({
            id: photo.id,
            src: photo.url,
            alt: photo.alt || `Foto ${photo.id}`,
            objectPosition: photo.object_position || '50 50'
        }))

        return NextResponse.json(photos)
    } catch (error) {
        console.error('Photos API error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
