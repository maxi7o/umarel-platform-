import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { db } from '../lib/db';
import { users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

const EMAIL = 'admin@elentendido.ar';
const PASSWORD = 'AdminScoutRoot!';

async function main() {
    console.log(`🚀 Creando usuario: ${EMAIL}...`);

    // 1. Create User in Auth
    const { data: { user }, error } = await supabaseAdmin.auth.admin.createUser({
        email: EMAIL,
        password: PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: 'System Admin' }
    });

    if (error) {
        console.log(`⚠️ Info Auth: ${error.message}`);
    } else {
        console.log(`✅ Usuario Auth creado. ID: ${user?.id}`);
    }

    console.log("⏳ Esperando sincronización (2s)...");
    await new Promise(r => setTimeout(r, 2000));

    // 2. Promote to Admin in public.users
    const dbUser = await db.query.users.findFirst({
        where: eq(users.email, EMAIL)
    });

    if (!dbUser) {
        console.error("❌ Error: El usuario no aparece en la tabla pública 'users'.");
        console.log("Esto puede pasar si el trigger de Supabase falla o tarda mucho.");
        process.exit(1);
    }

    await db.update(users)
        .set({ role: 'admin' })
        .where(eq(users.id, dbUser.id));

    console.log(`👑 ¡LISTO! ${EMAIL} ahora es ADMIN.`);
    console.log(`🔑 Tu Password es: ${PASSWORD}`);
    console.log(`👉 Entrá a: https://elentendido.ar/login`);
    process.exit(0);
}

main().catch(console.error);
