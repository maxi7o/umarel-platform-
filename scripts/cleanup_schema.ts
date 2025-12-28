
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

async function main() {
    console.log('🧹 Cleaning up conflicting enums...');

    try {
        // Drop columns first to release dependency on type
        await db.execute(sql`ALTER TABLE slices DROP COLUMN IF EXISTS refund_status`);
        await db.execute(sql`ALTER TABLE slices DROP COLUMN IF EXISTS refund_reason`);
        await db.execute(sql`ALTER TABLE slices DROP COLUMN IF EXISTS dispute_evidence`);
        await db.execute(sql`ALTER TABLE slices DROP COLUMN IF EXISTS refund_requested_at`);
        await db.execute(sql`ALTER TABLE slices DROP COLUMN IF EXISTS refund_decided_at`);
        await db.execute(sql`ALTER TABLE slices DROP COLUMN IF EXISTS auto_release_at`);
        await db.execute(sql`ALTER TABLE slices DROP COLUMN IF EXISTS dispute_status`);

        // Drop the type
        await db.execute(sql`DROP TYPE IF EXISTS refund_status`);
        console.log('✅ Dropped refund_status type and columns');
    } catch (e: any) {
        console.error('❌ Error dropping cleanup:', e.message);
    }

    process.exit(0);
}

main().catch(console.error);
