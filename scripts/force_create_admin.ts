import 'dotenv/config';
import { db } from '../lib/db';
import { users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

const AUTH_ID = '8736d9f0-fd05-40d4-ad28-62a98ec42f67';
const EMAIL = 'admin@elentendido.ar';

async function main() {
    console.log(`🔧 Creando usuario público manualmente para ID: ${AUTH_ID}...`);

    try {
        await db.insert(users).values({
            id: AUTH_ID,
            email: EMAIL,
            fullName: 'System Administrator',
            role: 'admin',
            avatarUrl: 'https://github.com/shadcn.png'
        }).onConflictDoUpdate({
            target: users.id,
            set: { role: 'admin' }
        });

        console.log(`✅ ¡ÉXITO! Usuario público creado y vinculado.`);
        console.log(`🔑 Tu Password para entrar es: AdminScoutRoot!`);
        console.log(`👉 Entrá a: https://elentendido.ar/login`);
    } catch (error) {
        console.error("Error inserting user:", error);
    }
    process.exit(0);
}

main();
