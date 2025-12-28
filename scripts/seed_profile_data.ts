
import { db, sql } from '../lib/db';
import { users, profiles, sliceEvidence, providerMetrics, auraLevelEnum } from '../lib/db/schema';
import crypto from 'crypto';

async function main() {
    console.log("🌱 Seeding Demo Profile Data...");

    const userId = '11111111-1111-1111-1111-111111111111'; // Karl Marx (Demo User)

    // 1. Upsert User (Ensure Aura)
    await sql`
        INSERT INTO users (id, email, full_name, aura_points, aura_level, total_savings_generated, role)
        VALUES (${userId}, 'carlos@demo.com', 'Carlos "El Profe" Rodriguez', 1250, 'gold', 5000000, 'admin')
        ON CONFLICT (id) DO UPDATE SET 
            aura_points = 1250,
            aura_level = 'gold',
            full_name = 'Carlos "El Profe" Rodriguez'
    `;

    // 2. Upsert Profile
    await sql`
        INSERT INTO profiles (user_id, bio, tagline, location, website, social_links)
        VALUES (
            ${userId}, 
            'Master Plumber & Umarel. Teaching the next generation how to avoid "atamo con alambre". Expert in gas fittings and complex humidity issues.',
            'Fixing pipes & correcting prices since 1998.',
            'Buenos Aires, CABA',
            'https://elprofe-rodriguez.com',
            '{"twitter": "https://twitter.com/elprofe", "linkedin": "https://linkedin.com/in/carlos"}'
        )
        ON CONFLICT (user_id) DO UPDATE SET
            bio = EXCLUDED.bio,
            tagline = EXCLUDED.tagline,
            social_links = EXCLUDED.social_links
    `;

    // 3. Upsert Provider Metrics
    await sql`
        INSERT INTO provider_metrics (provider_id, total_slices_completed, total_slices_on_time, average_completion_hours, total_earnings, rating)
        VALUES (${userId}, 42, 40, 4, 8500000, 96)
        ON CONFLICT (provider_id) DO UPDATE SET
            total_slices_completed = 42,
            rating = 96
    `;

    // 4. Insert Evidence (Mock Images)
    // Delete old evidence first to avoid duplicates in this script
    await sql`DELETE FROM slice_evidence WHERE provider_id = ${userId}`;

    const sliceId = crypto.randomUUID();
    const requestId = crypto.randomUUID();

    await sql`INSERT INTO requests (id, user_id, title, description) VALUES (${requestId}, ${userId}, 'Dummy Req', 'Desc')`;
    await sql`INSERT INTO slices (id, request_id, creator_id, title, description) VALUES (${sliceId}, ${requestId}, ${userId}, 'Title', 'Desc')`;

    await db.insert(sliceEvidence).values([
        {
            sliceId: sliceId,
            providerId: userId,
            fileUrl: 'https://images.unsplash.com/photo-1581242163695-19d0acdeabe9?w=800&q=80', // Welding
            description: 'Reforging the main gas pipe inlet under pressure.',
            isVerified: true
        },
        {
            sliceId: sliceId,
            providerId: userId,
            fileUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80', // Electrician
            description: 'Rewiring the old switchboard to meet 2024 safety codes.',
            isVerified: true
        },
        {
            sliceId: sliceId,
            providerId: userId,
            fileUrl: 'https://images.unsplash.com/photo-1505798577917-36e11801f352?w=800&q=80', // Construction
            description: 'Before/After of the humidity treatment in the basement.',
            isVerified: true
        }
    ]);

    console.log("✅ Profile Seeded! Visit: /profile/" + userId);
}

main().catch(console.error);
