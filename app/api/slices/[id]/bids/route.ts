
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sliceBids, slices, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { GUEST_USER_ID } from '@/lib/services/special-users';
import { sendEmail, newBidEmail } from '@/lib/notifications/email'; // Assuming this exists or mocking behavior

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: sliceId } = await params;
        const body = await req.json();
        const { price, contactInfo, description, isGuest } = body;

        // 1. Validate
        if (!sliceId || !price || !contactInfo) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 2. Determine User ID (Guest or Auth)
        const providerId = GUEST_USER_ID;

        // 3. Create Bid
        await db.insert(sliceBids).values({
            sliceId: sliceId,
            providerId: providerId,
            bidAmount: price, // in cents
            estimatedHours: 4, // Default assumption or ask in dialog
            message: `${description || ''} \n\n[Guest Contact: ${contactInfo}]`,
            status: 'pending',
            createdAt: new Date(),
        });

        // 4. Notify Client (Slice Owner)
        // For MVP: Log notification
        console.log(`[Notification] New Guest Bid for Slice ${sliceId}: ${price} ARS from ${contactInfo}`);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Guest Bid Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
