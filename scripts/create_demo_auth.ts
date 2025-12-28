
import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    console.error('   Please ensure you have the Service Role Key to seed Auth users.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const DEMO_USERS = [
    {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'maria@demo.com',
        password: 'password123',
        fullName: 'María González'
    },
    {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'carlos@demo.com',
        password: 'password123',
        fullName: 'Carlos Rodríguez'
    },
    {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'diego@demo.com',
        password: 'password123',
        fullName: 'Diego Martínez'
    }
];

async function createAuthUsers() {
    console.log('🔐 Seeding Supabase Auth Users...');

    for (const user of DEMO_USERS) {
        try {
            // 1. Check if user exists (by email) - admin.getUserById is better if possible, but email is safer lookup usually
            // Actually listUsers is safer to check existence
            const { data: { users } } = await supabase.auth.admin.listUsers();
            const existing = users.find(u => u.email === user.email);

            if (existing) {
                console.log(`   ⚠️ User ${user.email} already exists. Skipping.`);
                // Optional: Update password if needed?
                continue;
            }

            // 2. Create User with specific ID
            const { data, error } = await supabase.auth.admin.createUser({
                // @ts-ignore - uid is supported by Supabase Admin API but missing in some type definitions
                uid: user.id, // Important: Force the ID to match our seeded DB ID
                email: user.email,
                password: user.password,
                email_confirm: true,
                user_metadata: {
                    full_name: user.fullName
                }
            });

            if (error) {
                console.error(`   ❌ Failed to create ${user.email}:`, error.message);
            } else {
                console.log(`   ✅ Created Auth User: ${user.email} (ID: ${data.user.id})`);
            }

        } catch (err) {
            console.error(`   ❌ Unexpected error for ${user.email}:`, err);
        }
    }
}

createAuthUsers()
    .then(() => console.log('✨ Auth seeding complete!'))
    .catch(console.error);
