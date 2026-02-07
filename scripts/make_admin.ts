import 'dotenv/config';
import { db } from '../lib/db';
import { users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

const email = process.argv[2];

if (!email) {
    console.error("\n❌ Error: Debes proporcionar un email.");
    console.log("Uso: npx tsx scripts/make_admin.ts tu_email@ejemplo.com\n");
    process.exit(1);
}

async function main() {
    console.log(`\n🔍 Buscando usuario con email: ${email}...`);

    // Buscar usuario
    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (!user) {
        console.error(`❌ No encontré ningún usuario con el email '${email}'.`);
        console.log("Asegurate de haberte logueado al menos una vez en la aplicación con este email.");
        process.exit(1);
    }

    console.log(`👤 Usuario encontrado: ${user.fullName || 'Sin nombre'} (ID: ${user.id})`);
    console.log(`🔰 Rol actual: ${user.role}`);

    if (user.role === 'admin') {
        console.log("✅ Este usuario YA es admin. No es necesario hacer nada.");
        process.exit(0);
    }

    console.log("🚀 Promoviendo a ADMIN...");

    await db.update(users)
        .set({ role: 'admin' })
        .where(eq(users.id, user.id));

    console.log(`\n✅ ¡ÉXITO! El usuario ${email} ahora tiene acceso total al Command Center.`);
    console.log(`👉 Entrá a: https://elentendido.ar/admin`);
    process.exit(0);
}

main().catch((err) => {
    console.error("Error inesperado:", err);
    process.exit(1);
});
