
import dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);

async function main() {
    console.log('🔌 Connecting to DB:', connectionString.replace(/:[^:@]*@/, ':***@'));

    const tables = await sql`
        SELECT table_schema, table_name 
        FROM information_schema.tables 
        WHERE table_name = 'slices';
    `;
    console.log('Found tables:', tables);

    for (const t of tables) {
        const columns = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'slices' AND table_schema = ${t.table_schema};
        `;
        console.log(`Columns in ${t.table_schema}.slices:`, columns.map(c => c.column_name).sort());
    }

    await sql.end();
}

main().catch(console.error);
