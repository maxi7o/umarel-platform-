import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

import fs from 'fs';
import path from 'path';

async function main() {
    try {
        console.log('Resetting DB...');
        await db.execute(sql`DROP SCHEMA IF EXISTS drizzle CASCADE;`);
        await db.execute(sql`DROP SCHEMA public CASCADE;`);
        await db.execute(sql`CREATE SCHEMA public;`);
        await db.execute(sql`GRANT ALL ON SCHEMA public TO public;`);
        await db.execute(sql`GRANT ALL ON SCHEMA public TO postgres;`);
        console.log('DB Reset Complete. Applying migration manually...');

        // Find all migration files
        const migrationDir = path.join(process.cwd(), 'supabase/migrations');
        const files = fs.readdirSync(migrationDir)
            .filter(f => f.endsWith('.sql'))
            .sort(); // Ensure they are applied in order (0000, 0001, ...)

        if (files.length === 0) {
            throw new Error('No migration files found!');
        }

        for (const file of files) {
            console.log(`Applying migration: ${file}...`);
            const sqlContent = fs.readFileSync(path.join(migrationDir, file), 'utf-8');

            // Drizzle-kit generated SQL might have comments or specific statement delimiters
            // Simple approach: execute the whole file content or split by statement-breakpoint if needed
            // Ideally processing statement-breakpoint is safer for Drizzle format
            const statements = sqlContent.split('--> statement-breakpoint');

            for (const statement of statements) {
                if (statement.trim()) {
                    await db.execute(sql.raw(statement));
                }
            }
        }

        console.log('Migration Applied Successfully.');

    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}

main().then(() => process.exit(0));
