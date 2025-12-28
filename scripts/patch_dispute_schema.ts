
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

async function main() {
    console.log('🔧 Manual Patch: Dispute Engine Schema...');

    try {
        // 1. Re-create Enum (if missing)
        try {
            await db.execute(sql`CREATE TYPE refund_status AS ENUM ('none', 'requested', 'approved', 'disputed', 'resolved')`);
            console.log('   Created Type: refund_status');
        } catch (e) {
            console.log('   Type refund_status likely exists');
        }

        // 2. Add Columns to Slices (if missing)
        const sliceCols = [
            `ADD COLUMN IF NOT EXISTS refund_status refund_status DEFAULT 'none'`,
            `ADD COLUMN IF NOT EXISTS refund_reason text`,
            `ADD COLUMN IF NOT EXISTS dispute_evidence jsonb`,
            `ADD COLUMN IF NOT EXISTS refund_requested_at timestamp`,
            `ADD COLUMN IF NOT EXISTS refund_decided_at timestamp`,
            `ADD COLUMN IF NOT EXISTS auto_release_at timestamp`,
            `ADD COLUMN IF NOT EXISTS dispute_status text`
        ];

        for (const col of sliceCols) {
            try {
                await db.execute(sql.raw(`ALTER TABLE slices ${col}`));
                console.log(`   Slices: ${col}`);
            } catch (e: any) {
                console.error(`   Failed slice col:`, e.message);
            }
        }

        // 3. Create product_insights Table
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS product_insights (
                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                source text NOT NULL,
                source_id text,
                insight text NOT NULL,
                feature_area text,
                sentiment text,
                confidence integer DEFAULT 0,
                created_at timestamp DEFAULT now()
            )
        `);
        console.log('   Created Table: product_insights');

    } catch (e: any) {
        console.error('❌ Patch Failed:', e.message);
    }

    process.exit(0);
}

main().catch(console.error);
