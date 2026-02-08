
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function fullMigrate() {
    try {
        console.log("Applying FULL schema sync for slices...");

        const columns = [
            'experience_id uuid',
            'estimated_effort text',
            'estimated_hours integer',
            'market_price_min integer',
            'market_price_max integer',
            'final_price integer',
            'is_ai_generated boolean DEFAULT false',
            'dependencies jsonb',
            'slice_type text DEFAULT \'standard\'',
            'max_capacity integer',
            'current_bookings integer DEFAULT 0',
            'waitlist_enabled boolean DEFAULT false',
            'activation_type text DEFAULT \'manual\'',
            'activation_time timestamp',
            'decision_window_minutes integer',
            'duration_minutes integer',
            'pricing_type text DEFAULT \'fixed\'',
            'price_cents integer DEFAULT 0',
            'emoji text DEFAULT \'🔨\'',
            'acceptance_criteria jsonb',
            'evidence_requirements jsonb',
            'evidence_time_window_minutes integer',
            'ambiguity_score integer DEFAULT 0',
            'is_public boolean DEFAULT true',
            'material_advance_amount integer',
            'material_advance_evidence jsonb',
            'refund_reason text',
            'dispute_evidence jsonb',
            'refund_requested_at timestamp',
            'refund_decided_at timestamp',
            'skills_required jsonb',
            'escrow_payment_id text',
            'auto_release_at timestamp',
            'dispute_status text',
            'approved_by_client_at timestamp',
            'paid_at timestamp',
            'disputed_at timestamp'
        ];

        for (const col of columns) {
            const colName = col.split(' ')[0];
            try {
                await db.execute(sql.raw(`ALTER TABLE slices ADD COLUMN IF NOT EXISTS ${col}`));
                console.log(`Checked column: ${colName}`);
            } catch (e) {
                console.error(`Failed to add column ${colName}:`, e);
            }
        }

        console.log("Full sync complete.");
        process.exit(0);
    } catch (e) {
        console.error("Migration failed:", e);
        process.exit(1);
    }
}

fullMigrate();
