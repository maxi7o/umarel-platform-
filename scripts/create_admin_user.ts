
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ ERROR: Missing SUPABASE_SERVICE_ROLE_KEY in .env");
    console.error("Please add it to your .env file to run this admin script.");
    process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function main() {
    const email = 'admin@elentendido.ar';
    const password = 'ElEntendidoAdmin123!';
    const fullName = 'Admin El Entendido';

    console.log(`🚀 Managing admin user: ${email}...`);

    let userId: string;

    // 1. Try to fetch existing user
    const { data: { users: allUsers }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
        console.error("❌ List Users Error:", listError.message);
        return;
    }

    const existingUser = allUsers.find(u => u.email === email);

    if (existingUser) {
        console.log("ℹ️ User exists. Resetting password...");
        userId = existingUser.id;

        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
            password: password,
            email_confirm: true,
            user_metadata: { full_name: fullName, role: 'admin' }
        });

        if (updateError) {
            console.error("❌ Password Reset Error:", updateError.message);
            return;
        }
        console.log("✅ Password reset successfully!");

    } else {
        console.log("ℹ️ User does not exist. Creating new user...");
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: fullName, role: 'admin' }
        });

        if (createError) {
            console.error("❌ Creation Error:", createError.message);
            return;
        }
        if (!newUser.user) {
            console.error("❌ Creation failed (no user returned).");
            return;
        }
        userId = newUser.user.id;
        console.log("✅ User created successfully!");
    }

    console.log(`✅ Auth User ID: ${userId}`);

    // 2. Create/Update User in Public DB (drizzle)
    console.log("📦 Syncing to public.users table...");

    try {
        await db.insert(users).values({
            id: userId,
            email: email,
            fullName: fullName,
            role: 'admin',
            auraPoints: 999999, // Max Aura for Admin
            auraLevel: 'diamond'
        }).onConflictDoUpdate({
            target: users.id,
            set: {
                role: 'admin',
                auraPoints: 999999,
                email: email // Ensure email matches
            }
        });
        console.log("✅ Database synced successfully.");
    } catch (dbError: any) {
        console.error("❌ Database Sync Error:", dbError.message);
        // Continue anyway, maybe connection failed but auth worked
    }

    console.log("\n============================================");
    console.log(`🎉 ADMIN READY`);
    console.log(`📧 User: ${email}`);
    console.log(`🔑 Pass: ${password}`);
    console.log("============================================");
    process.exit(0);
}

main().catch(console.error);
