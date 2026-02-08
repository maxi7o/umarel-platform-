import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const ADMIN_EMAILS = ['admin@elentendido.ar'];

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin Access Check
    const isSuperAdmin = user.email && ADMIN_EMAILS.includes(user.email);
    let isAdmin = isSuperAdmin;

    if (!isSuperAdmin) {
        try {
            const [dbUser] = await db.select().from(users).where(eq(users.id, user.id));
            if (dbUser?.role === 'admin') {
                isAdmin = true;
            }
        } catch (e) {
            console.error("N8N Proxy Admin Check Failed:", e);
        }
    }

    if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { url, payload } = body;

        if (!url || !payload) {
            return NextResponse.json({ error: 'Missing URL or Payload' }, { status: 400 });
        }

        // Execute n8n request
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // Try to parse JSON response, fallback to text
        let responseData;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            responseData = await response.json();
        } else {
            responseData = { text: await response.text() };
        }

        return NextResponse.json({
            success: response.ok,
            status: response.status,
            data: responseData
        });

    } catch (e: any) {
        console.error("N8N Execution Error:", e);
        return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
    }
}
