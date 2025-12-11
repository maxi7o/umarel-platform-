
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const { sliceId, status } = await request.json();

        await db.update(slices)
            .set({ status })
            .where(eq(slices.id, sliceId));

        return NextResponse.json({ success: true, status });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
