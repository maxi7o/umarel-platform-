import 'dotenv/config';
import { db } from '../lib/db';
import { scoutLeads } from '../lib/db/schema';
import { desc } from 'drizzle-orm';

async function main() {
    console.log('🔍 Checking Supabase for Scout Leads...');
    try {
        const leads = await db.select().from(scoutLeads).orderBy(desc(scoutLeads.createdAt)).limit(5);

        if (leads.length === 0) {
            console.log('❌ No leads found yet. Check if n8n finished running.');
        } else {
            console.log(`✅ SUCCESS: Found ${leads.length} leads in the database!`);
            leads.forEach(lead => {
                console.log(`\n--- Lead from ${lead.source} ---`);
                console.log(`Status: ${lead.status}`);
                console.log(`Intent Score: ${lead.intentScore}/10`);
                console.log(`Reasoning: ${lead.intentReasoning ? lead.intentReasoning.substring(0, 100) + '...' : 'N/A'}`);
            });
            console.log('\nVerified: The pipeline n8n -> Supabase is working correctly.');
        }
    } catch (e) {
        console.error("Error querying DB:", e);
    }
    process.exit(0);
}

main();
