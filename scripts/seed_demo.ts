import { db } from '../lib/db';
import {
    users,
    requests,
    slices,
    sliceCards,
    quotes,
    wizardMessages,
    serviceRatings,
    userWallets
} from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function seedDemoData() {
    console.log('🌱 Seeding demo data for investor meeting...');

    try {
        // 1. Create Demo Users
        console.log('Creating demo users...');

        const [maria] = await db.insert(users).values({
            id: '11111111-1111-1111-1111-111111111111',
            email: 'maria@demo.com',
            fullName: 'María González',
            role: 'user',
            auraPoints: 50,
            auraLevel: 'bronze',
        }).returning();

        const [carlos] = await db.insert(users).values({
            id: '22222222-2222-2222-2222-222222222222',
            email: 'carlos@demo.com',
            fullName: 'Carlos Rodríguez',
            role: 'user',
            auraPoints: 650,
            auraLevel: 'gold',
            totalSavingsGenerated: 450000,
        }).returning();

        const [diego] = await db.insert(users).values({
            id: '33333333-3333-3333-3333-333333333333',
            email: 'diego@demo.com',
            fullName: 'Diego Martínez',
            role: 'user',
            auraPoints: 847,
            auraLevel: 'silver',
            totalSavingsGenerated: 234500,
        }).returning();

        const [aiWizard] = await db.insert(users).values({
            id: '99999999-9999-9999-9999-999999999999',
            email: 'wizard@umarel.ai',
            fullName: 'Asistente Umarel',
            role: 'admin',
            avatarUrl: 'https://umarel.org/wizard-avatar.png',
        }).returning();

        // Create wallets
        await db.insert(userWallets).values([
            { userId: maria.id, balance: 0 },
            { userId: carlos.id, balance: 125000 },
            { userId: diego.id, balance: 45000 },
        ]);

        // 2. Create Demo Requests
        console.log('Creating demo requests...');

        const [bathroomRequest] = await db.insert(requests).values({
            id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            userId: maria.id,
            title: 'Renovar baño pequeño',
            description: 'Necesito renovar un baño de 3x2m. Incluye cambio de azulejos, sanitarios y grifería. El baño está en buen estado estructural, solo necesita actualización estética.',
            category: 'Plomería y Renovación',
            location: 'Palermo, Buenos Aires, Argentina',
            status: 'open',
        }).returning();

        const [kitchenRequest] = await db.insert(requests).values({
            userId: maria.id,
            title: 'Instalar muebles de cocina',
            description: 'Muebles ya comprados, necesito instalación profesional. Cocina de 4x3m.',
            category: 'Carpintería',
            location: 'Palermo, Buenos Aires, Argentina',
            status: 'in_progress',
        }).returning();

        const [paintingRequest] = await db.insert(requests).values({
            userId: diego.id,
            title: 'Pintar departamento 2 ambientes',
            description: 'Departamento de 50m2, paredes en buen estado. Preferencia por pintura lavable.',
            category: 'Pintura',
            location: 'Recoleta, Buenos Aires, Argentina',
            status: 'open',
        }).returning();

        // 3. Create Slices for Bathroom Request
        console.log('Creating slices...');

        const [bathroomSlice] = await db.insert(slices).values({
            id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            requestId: bathroomRequest.id,
            creatorId: maria.id,
            title: 'Renovar baño pequeño',
            description: 'Renovación completa de baño 3x2m con materiales de calidad media',
            status: 'proposed',
            marketPriceMin: 150000,
            marketPriceMax: 200000,
            finalPrice: 120000,
        }).returning();

        // 4. Create Slice Card
        const [sliceCard] = await db.insert(sliceCards).values({
            sliceId: bathroomSlice.id,
            requestId: bathroomRequest.id,
            title: 'Renovar baño pequeño',
            description: 'Renovación completa de baño 3x2m con materiales de calidad media. Incluye: azulejos nacionales, sanitarios marca estándar, grifería cromada.',
            version: 2,
            isLocked: false,
        }).returning();

        // 5. Create Wizard Messages
        console.log('Creating wizard messages...');

        await db.insert(wizardMessages).values([
            {
                sliceCardId: sliceCard.id,
                userId: aiWizard.id,
                content: `¡Hola! Soy el Asistente Umarel 🧙‍♂️

He recibido tu solicitud: "Renovar baño pequeño"

Mi trabajo es ayudarte a optimizar este pedido para que sea más claro, atraiga mejores profesionales y obtengas el mejor precio posible.

Voy a hacerte algunas preguntas para entender mejor lo que necesitas:

¿Cuándo necesitas que se realice el trabajo ?
¿Hay algún requisito específico o material que prefieras ?
¿Tienes algún presupuesto en mente ? `,
                role: 'assistant',
                metadata: { type: 'welcome' },
            },
            {
                sliceCardId: sliceCard.id,
                userId: maria.id,
                content: 'Necesito que esté listo en 2 semanas. Prefiero materiales de buena calidad pero no los más caros. Mi presupuesto es de $150,000.',
                role: 'user',
            },
            {
                sliceCardId: sliceCard.id,
                userId: diego.id,
                content: 'Te recomiendo usar cerámica nacional en vez de importada. Ahorras un 30% sin perder calidad. Marcas como Cerro Negro o San Lorenzo son excelentes. También, considera grifería FV en vez de marcas importadas - mismo resultado, mitad de precio.',
                role: 'user',
                isMarkedHelpful: true,
                markedHelpfulBy: maria.id,
                savingsGenerated: 45000,
            },
            {
                sliceCardId: sliceCard.id,
                userId: aiWizard.id,
                content: 'Excelente! He actualizado tu solicitud con estas recomendaciones. Basándome en tu presupuesto y las sugerencias de la comunidad, he optimizado el proyecto:\n\n✅ Cerámica nacional (Cerro Negro) - Ahorro: $25,000\n✅ Grifería FV - Ahorro: $15,000\n✅ Sanitarios Ferrum - Ahorro: $5,000\n\nTotal estimado: $120,000 (ahorraste $30,000)\n\n¿Te gustaría agregar algo más o publicar la solicitud?',
                role: 'assistant',
                metadata: { type: 'optimization' },
            },
        ]);

        // 6. Create Quotes
        console.log('Creating quotes...');

        await db.insert(quotes).values([
            {
                providerId: carlos.id,
                requestId: bathroomRequest.id,
                amount: 120000,
                message: 'Tengo 10 años de experiencia en renovaciones de baños. Puedo completar el trabajo en 5 días hábiles. Incluyo materiales según especificación (cerámica Cerro Negro, grifería FV, sanitarios Ferrum). Garantía de 1 año en mano de obra.',
                status: 'pending',
            },
            {
                providerId: carlos.id,
                requestId: kitchenRequest.id,
                amount: 85000,
                message: 'Instalación profesional de muebles de cocina. 2 días de trabajo. Incluye nivelación, fijación y ajustes finales.',
                status: 'accepted',
            },
        ]);

        // 7. Create Service Rating (for completed kitchen job)
        console.log('Creating service ratings...');

        const [kitchenSlice] = await db.insert(slices).values({
            requestId: kitchenRequest.id,
            creatorId: maria.id,
            assignedProviderId: carlos.id,
            title: 'Instalar muebles de cocina',
            description: 'Instalación profesional de muebles',
            status: 'completed',
            finalPrice: 85000,
        }).returning();

        await db.insert(serviceRatings).values({
            sliceId: kitchenSlice.id,
            requestId: kitchenRequest.id,
            providerId: carlos.id,
            clientId: maria.id,
            qualityRating: 5,
            communicationRating: 5,
            timelinessRating: 4,
            professionalismRating: 5,
            valueRating: 5,
            overallRating: '4.80',
            feedback: 'Excelente trabajo! Muy prolijo y profesional. Llegó puntual y terminó antes de lo esperado. Los muebles quedaron perfectos.',
            wouldRecommend: true,
            auraImpact: 46,
        });

        // 8. Update Diego's wallet to show earnings
        console.log('Updating wallets...');

        await db.update(userWallets)
            .set({
                balance: 45000,
                totalEarned: 47100,
            })
            .where(eq(userWallets.userId, diego.id));

        console.log('✅ Demo data seeded successfully!');
        console.log('\n📊 Demo Users Created:');
        console.log(`  👤 María(Consumer): maria @demo.com`);
        console.log(`  👷 Carlos(Provider): carlos @demo.com`);
        console.log(`  🧙 Diego(Umarel): diego @demo.com`);
        console.log('\n🎯 Demo URLs:');
        console.log(`  Landing: http://localhost:3000/es`);
        console.log(`  Browse: http://localhost:3000/es/browse`);
        console.log(`  Bathroom Request: http://localhost:3000/es/requests/${bathroomRequest.id}`);
        console.log(`  Wizard: http://localhost:3000/es/wizard/${bathroomSlice.id}`);
        console.log(`  Diego's Wallet: http://localhost:3000/es/wallet`);
        console.log(`  Admin Dashboard: http://localhost:3000/admin/umarel-launch`);

    } catch (error) {
        console.error('❌ Error seeding demo data:', error);
        throw error;
    }
}

seedDemoData()
    .then(() => {
        console.log('\n🎉 Ready for demo!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Failed to seed:', error);
        process.exit(1);
    });
