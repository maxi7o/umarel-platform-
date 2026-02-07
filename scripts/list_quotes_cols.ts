
import { sql } from '@/lib/db';

async function main() {
    const cols = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'quotes';
    `;
    console.log('Columns in quotes table:', cols);
    process.exit(0);
}

main();
