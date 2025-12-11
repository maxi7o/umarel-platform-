
import { db } from '@/lib/db';
import { contributionEvaluations } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
    const evals = await db.select().from(contributionEvaluations);
    return NextResponse.json(evals);
}
