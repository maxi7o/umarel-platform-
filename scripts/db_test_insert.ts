
import dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);

async function main() {
    const MARIA_ID = '11111111-1111-1111-1111-111111111111';

    console.log('🧪 Testing RAW SQL Insert...');

    // 1. Need a request first
    const [req] = await sql`
        INSERT INTO requests (user_id, title, description)
        VALUES (${MARIA_ID}, 'Raw Test', 'Raw Desc')
        RETURNING id
    `;
    console.log('Created Request:', req.id);

    // 2. Try inserting slice with refund_status
    try {
        const [slice] = await sql`
            INSERT INTO "slices" (
                "request_id", "creator_id", "title", "description", "status", "refund_status"
            ) VALUES (
                ${req.id}, ${MARIA_ID}, 'Raw Slice Quoted', 'Desc', 'proposed', 'none'
            )
            RETURNING *
        `;
        console.log('✅ INSERT QUOTED SUCCEEDED! Slice:', slice);
    } catch (e) {
        console.error('❌ INSERT with refund_status FAILED!');
        console.error(e);
    }

    await sql.end();
}

main().catch(console.error);
