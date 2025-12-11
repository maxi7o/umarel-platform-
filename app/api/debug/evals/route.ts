
import { db } from '@/lib/db';
import { slices } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const data = await db.select().from(slices);
    return NextResponse.json(data);
}
