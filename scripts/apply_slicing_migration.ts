// Script to apply Experience Slicing migration
import { sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

async function applyMigration() {
    console.log('🚀 Applying Experience Slicing migration...');

    try {
        const migrationPath = path.join(process.cwd(), 'drizzle/migrations/0009_experience_slicing.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

        // Execute the migration
        await db.execute(sql.raw(migrationSQL));

        console.log('✅ Migration applied successfully!');
        console.log('\nCreated tables:');
        console.log('  - experience_slices');
        console.log('  - slice_bookings');
        console.log('  - slice_evidence');
        console.log('  - slice_activations');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

applyMigration();
