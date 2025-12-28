
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

async function main() {
    console.log('🔧 Patching Schema manually...');

    // 1. Add refund_status enum type if not exists
    try {
        await db.execute(sql`CREATE TYPE refund_status AS ENUM ('none', 'requested', 'approved', 'disputed', 'resolved')`);
        console.log('   Created Type: refund_status');
    } catch (e) {
        console.log('   Type refund_status likely exists');
    }

    // 2. Add Columns to Slices
    const columns = [
        `ADD COLUMN IF NOT EXISTS refund_status refund_status DEFAULT 'none'`,
        `ADD COLUMN IF NOT EXISTS refund_reason text`,
        `ADD COLUMN IF NOT EXISTS dispute_evidence jsonb`,
        `ADD COLUMN IF NOT EXISTS refund_requested_at timestamp`,
        `ADD COLUMN IF NOT EXISTS refund_decided_at timestamp`,
        `ADD COLUMN IF NOT EXISTS auto_release_at timestamp`,
        `ADD COLUMN IF NOT EXISTS dispute_status text`
    ];

    for (const col of columns) {
        try {
            await db.execute(sql.raw(`ALTER TABLE slices ${col}`));
            console.log(`   Added: ${col}`);
        } catch (e: any) {
            console.error(`   Failed to add ${col}:`, e.message);
        }
    }

    console.log('✅ Patch Complete');
    process.exit(0);
}

main().catch(console.error);
