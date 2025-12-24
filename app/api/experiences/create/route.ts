import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { experiences } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();

        // Basic validation
        if (!body.title || !body.date || !body.price) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // Insert into DB
        const result = await db.insert(experiences).values({
            providerId: user.id,
            title: body.title,
            description: body.description || '',
            location: body.location,
            date: new Date(body.date),
            durationMinutes: parseInt(body.duration) || 60,
            minParticipants: parseInt(body.minParticipants) || 1,
            maxParticipants: parseInt(body.maxParticipants) || 20,
            pricingConfig: {
                strategy: body.strategy,
                basePrice: parseInt(body.price),
                // Add any other config from strategy if needed
                tiers: body.strategy === 'early_bird' ?
                    [{ count: Math.ceil(parseInt(body.maxParticipants) * 0.3), discount: 0.2 }] : []
            },
            status: 'scheduled'
        }).returning();

        return NextResponse.json(result[0]);

    } catch (error) {
        console.error('[EXPERIENCE_CREATE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
