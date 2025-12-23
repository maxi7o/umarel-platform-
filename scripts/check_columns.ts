
import { config } from 'dotenv';
config({ path: '.env.local' });
import postgres from 'postgres';

async function check() {

    const sql = postgres(process.env.DATABASE_URL!);
    try {
        const [connInfo] = await sql`SELECT inet_server_addr(), inet_server_port(), current_database()`;
        console.log('DB Info:', connInfo);

        const columns = await sql`
            SELECT table_schema, column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users';
        `;
        console.log('Columns in users table:', columns.map(c => `${c.table_schema}.${c.column_name}`));
    } catch (e) {
        console.error(e);
    } finally {
        await sql.end();
    }
}
check();
