
import { db } from '../lib/db';
import { users, requests, slices } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function seedQA() {
    try {
        console.log("Seeding QA data...");

        // 1. Update Carlos (Provider) to be verified
        await db.update(users)
            .set({
                biometricStatus: 'verified',
                dniNumber: '12345678',
                dniVerifiedAt: new Date(),
                role: 'user'
            })
            .where(eq(users.id, '22222222-2222-2222-2222-222222222222'));

        // 2. Update Maria (Client) to be verified
        await db.update(users)
            .set({
                biometricStatus: 'verified',
                dniNumber: '87654321',
                dniVerifiedAt: new Date(),
                role: 'user'
            })
            .where(eq(users.id, '11111111-1111-1111-1111-111111111111'));

        // 3. Create a test project with fixed location for Carlos (Provider)
        // Project Location: Buenos Aires (Obelisco approx: -34.6037, -58.3816)
        const [project] = await db.insert(requests).values({
            id: 'fa70fa70-70fa-70fa-70fa-70fa70fa70fa',
            userId: '11111111-1111-1111-1111-111111111111', // Maria
            title: 'Reparación de Pared (Avenida Corrientes)',
            description: 'Necesito arreglar una filtración en la pared del living.',
            location: 'Av. Corrientes 1000, CABA',
            locationDetails: {
                lat: -34.6037,
                lng: -58.3816,
                address: 'Av. Corrientes 1000, CABA'
            },
            status: 'in_progress'
        }).onConflictDoUpdate({
            target: requests.id,
            set: { status: 'in_progress' }
        }).returning();

        // 4. Create a slice assigned to Carlos
        const [slice] = await db.insert(slices).values({
            id: '511ce511-ce51-1ce5-1ce5-1ce511ce511c',
            requestId: project.id,
            creatorId: '11111111-1111-1111-1111-111111111111',
            assignedProviderId: '22222222-2222-2222-2222-222222222222', // Carlos
            title: 'Picado y revoque grueso',
            description: 'Remover el material viejo y aplicar revoque impermeable.',
            status: 'active',
            priceCents: 5000000 // 50,000 ARS
        }).onConflictDoUpdate({
            target: slices.id,
            set: { status: 'active', assignedProviderId: '22222222-2222-2222-2222-222222222222' }
        }).returning();

        // 5. Create an Unverified user
        // We'll use Diego's ID or some other ID for unverified
        await db.update(users)
            .set({
                biometricStatus: 'none',
                dniNumber: null,
                dniVerifiedAt: null
            })
            .where(eq(users.id, '33333333-3333-3333-3333-333333333333'));

        console.log("QA Seed complete.");
        console.log("Project ID:", project.id);
        console.log("Slice ID:", slice.id);

        process.exit(0);
    } catch (e) {
        console.error("QA Seed failed:", e);
        process.exit(1);
    }
}

seedQA();
