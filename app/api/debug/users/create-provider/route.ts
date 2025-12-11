
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const id = '22222222-2222-2222-2222-222222222222';
    try {
        const exists = await db.query.users.findFirst({
            where: eq(users.id, id)
        });

        if (!exists) {
            await db.insert(users).values({
                id: id,
                email: 'carlos@demo.com',
                fullName: 'Carlos Rodríguez',
                role: 'user',
                auraPoints: 650,
                auraLevel: 'gold',
                totalSavingsGenerated: 450000,
            });
            return NextResponse.json({ message: "Carlos created." });
        }
        return NextResponse.json({ message: "Carlos already exists." });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
