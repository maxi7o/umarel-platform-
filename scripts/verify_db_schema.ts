
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import postgres from 'postgres';

async function verify() {
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL not found');
        process.exit(1);
    }
    console.log(`Checking DB: ${process.env.DATABASE_URL}`);

    // Mask password for safety in log if needed, but logging URL helps debug if it's localhost vs cloud

    const sql = postgres(process.env.DATABASE_URL);

    try {
        const columns = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users'
        `;

        console.log('--- Columns in "users" table ---');
        columns.forEach(c => console.log(`- ${c.column_name} (${c.data_type})`));

        const hasLastComment = columns.some(c => c.column_name === 'last_comment_at');
        const hasTos = columns.some(c => c.column_name === 'last_tos_accepted_at');

        console.log('--------------------------------');
        console.log(`Has last_comment_at: ${hasLastComment ? '✅' : '❌'}`);
        console.log(`Has last_tos_accepted_at: ${hasTos ? '✅' : '❌'}`);

    } catch (e) {
        console.error('Error querying DB:', e);
    } finally {
        await sql.end();
    }
}

verify();
