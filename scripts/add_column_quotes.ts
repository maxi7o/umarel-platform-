
import { sql } from '@/lib/db';

async function main() {
    console.log('Adding proposed_acceptance_criteria column to quotes table...');
    try {
        await sql`
            ALTER TABLE quotes 
            ADD COLUMN IF NOT EXISTS proposed_acceptance_criteria JSONB;
        `;
        console.log('✅ Column added successfully');
    } catch (e) {
        console.error('❌ Failed to add column:', e);
    }
    process.exit(0);
}

main();
