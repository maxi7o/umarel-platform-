
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
    try {
        const dbUrl = process.env.DATABASE_URL;
        console.log('Checking DB connection...');
        console.log('DATABASE_URL exists:', !!dbUrl);
        if (dbUrl) {
            console.log('DATABASE_URL length:', dbUrl.length);
            // Mask it for safety
            console.log('DATABASE_URL starts with:', dbUrl.substring(0, 15) + '...');
        } else {
            throw new Error('DATABASE_URL environment variable is NOT set');
        }

        // 1. Check if tables exist
        const tables = await db.execute(sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);

        const tableNames = tables.map((t: any) => t.table_name);

        // 2. Create Users table if missing
        if (!tableNames.includes('users')) {
            await db.execute(sql`
                CREATE TABLE IF NOT EXISTS users (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    email TEXT UNIQUE NOT NULL,
                    full_name TEXT,
                    avatar_url TEXT,
                    role TEXT DEFAULT 'user',
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW(),
                    aura_points INTEGER DEFAULT 0,
                    aura_level TEXT DEFAULT 'Bronze',
                    total_savings_generated INTEGER DEFAULT 0
                );
            `);
        }

        // 3. Create Requests table if missing
        if (!tableNames.includes('requests')) {
            await db.execute(sql`
                CREATE TABLE IF NOT EXISTS requests (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    user_id UUID NOT NULL REFERENCES users(id),
                    title TEXT NOT NULL,
                    description TEXT NOT NULL,
                    category TEXT,
                    location TEXT,
                    is_virtual BOOLEAN DEFAULT false,
                    featured BOOLEAN DEFAULT false,
                    status TEXT DEFAULT 'open',
                    created_at TIMESTAMP DEFAULT NOW()
                );
            `);
        }

        // 4. Create Slices table if missing
        if (!tableNames.includes('slices')) {
            await db.execute(sql`
                CREATE TABLE IF NOT EXISTS slices (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    request_id UUID NOT NULL REFERENCES requests(id),
                    creator_id UUID NOT NULL REFERENCES users(id),
                    title TEXT NOT NULL,
                    description TEXT NOT NULL,
                    status TEXT DEFAULT 'proposed',
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
            `);
        }

        // 5. Create SliceCards table if missing
        if (!tableNames.includes('slice_cards')) {
            await db.execute(sql`
                CREATE TABLE IF NOT EXISTS slice_cards (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    slice_id UUID NOT NULL REFERENCES slices(id),
                    request_id UUID NOT NULL REFERENCES requests(id),
                    title TEXT NOT NULL,
                    description TEXT NOT NULL,
                    version INTEGER DEFAULT 1,
                    is_locked BOOLEAN DEFAULT false,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
            `);
        }

        return NextResponse.json({
            success: true,
            message: 'Database initialized',
            existingTables: tableNames
        });

    } catch (error) {
        console.error('Init DB Error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
