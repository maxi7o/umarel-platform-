import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sliceBids, slices, users } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { validateSliceEffort } from '@/lib/validators/slice-validator';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: sliceId } = await params;
        const body = await request.json();
        const { providerId, bidAmount, estimatedHours, message } = body;

        if (!providerId || !bidAmount || !estimatedHours) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate estimated hours (≤4)
        const validationErrors = validateSliceEffort({ estimatedHours, title: '', description: '' });
        if (validationErrors.length > 0) {
            return NextResponse.json(
                { error: validationErrors[0].message },
                { status: 400 }
            );
        }

        // Check if slice exists
        const [slice] = await db
            .select()
            .from(slices)
            .where(eq(slices.id, sliceId));

        if (!slice) {
            return NextResponse.json(
                { error: 'Slice not found' },
                { status: 404 }
            );
        }

        // Check if provider already has a pending bid on this slice
        const existingBids = await db
            .select()
            .from(sliceBids)
            .where(and(
                eq(sliceBids.sliceId, sliceId),
                eq(sliceBids.providerId, providerId),
                eq(sliceBids.status, 'pending')
            ));

        if (existingBids.length > 0) {
            return NextResponse.json(
                { error: 'You already have a pending bid on this slice' },
                { status: 400 }
            );
        }

        // Create bid
        const [newBid] = await db.insert(sliceBids).values({
            sliceId,
            providerId,
            bidAmount,
            estimatedHours,
            message,
            status: 'pending',
        }).returning();

        return NextResponse.json(newBid);
    } catch (error) {
        console.error('Error creating bid:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: sliceId } = await params;

        // Fetch all bids for this slice with provider info
        const bids = await db
            .select()
            .from(sliceBids)
            .where(eq(sliceBids.sliceId, sliceId))
            .orderBy(desc(sliceBids.createdAt));

        // Fetch provider info for each bid
        const bidsWithProviders = await Promise.all(
            bids.map(async (bid) => {
                const [provider] = await db
                    .select()
                    .from(users)
                    .where(eq(users.id, bid.providerId));
                return { ...bid, provider };
            })
        );

        return NextResponse.json(bidsWithProviders);
    } catch (error) {
        console.error('Error fetching bids:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
