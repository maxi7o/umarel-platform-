
import { db } from '@/lib/db';
import { users, requests, slices, quotes, quoteItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function seedShowcase() {
    console.log('🎨 Starting Showcase Seed for Request & Quote Quality...');

    // 1. Create Users
    const clientEmail = 'cliente.demo@elentendido.ar';
    const providerEmail = 'proveedor.demo@elentendido.ar';

    let client = await db.query.users.findFirst({ where: eq(users.email, clientEmail) });
    if (!client) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [newUser] = await db.insert(users).values({
            email: clientEmail,
            fullName: 'Sofía Cliente',
            role: 'user',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
        } as any).returning();
        client = newUser;
    }

    let provider = await db.query.users.findFirst({ where: eq(users.email, providerEmail) });
    if (!provider) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [newUser] = await db.insert(users).values({
            email: providerEmail,
            fullName: 'Carlos Experto',
            role: 'user',
            auraLevel: 'gold',
            totalSavingsGenerated: 1500000,
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
        } as any).returning();
        provider = newUser;
    }

    console.log('👥 Users ready:', client!.email, provider!.email);

    // ==========================================
    // CASE 1: URGENT PLUMBING (Simple Quote)
    // ==========================================

    // Create Request
    const [reqPlumber] = await db.insert(requests).values({
        userId: client!.id,
        title: 'URGENTE: Pérdida agua bajo mesada',
        description: 'Se rompió el flexible del agua caliente en la cocina. Está inundando el mueble. Cerré la llave de paso pero necesito reparación hoy mismo. Es una conexión standard de 1/2 pulgada.',
        category: 'Plomería',
        location: 'Palermo, CABA',
        status: 'open',
    }).returning({ id: requests.id });

    // Create Slice (Proposed Work)
    const [slicePlumber] = await db.insert(slices).values({
        requestId: reqPlumber.id,
        creatorId: provider!.id,
        title: 'Reparación de Flexible y Revisión',
        description: 'Incluye provisión de flexible mallado de acero inoxidable, cambio de la pieza dañada, y revisión de válvulas de cierre para asegurar estanqueidad. Visita de urgencia incluida.',
        estimatedEffort: '1 hora',
        estimatedHours: 1,
        finalPrice: 4500000, // $45.000 ARS (in cents)
        status: 'proposed',
        sliceType: 'standard',
    }).returning({ id: slices.id });

    // Create Quote
    const [quotePlumber] = await db.insert(quotes).values({
        requestId: reqPlumber.id,
        providerId: provider!.id,
        amount: 4500000,
        message: 'Hola Sofía, puedo pasar en 1 hora. Tengo el repuesto en la camioneta. El precio incluye materiales y mano de obra garantizada.',
        status: 'pending', // Pending client approval
        estimatedDeliveryDate: new Date(Date.now() + 3600 * 1000 * 4), // 4 hours from now
    }).returning({ id: quotes.id });

    // Link Quote Item
    await db.insert(quoteItems).values({
        quoteId: quotePlumber.id,
        sliceId: slicePlumber.id,
    });

    console.log('🚰 Plumbing Case Created:', reqPlumber.id);


    // ==========================================
    // CASE 2: BATHROOM RENO (Complex Quote)
    // ==========================================

    // Create Request
    const [reqReno] = await db.insert(requests).values({
        userId: client!.id,
        title: 'Remodelación Completa Baño Principal',
        description: 'Buscamos renovar totalmente el baño de 2x2.5m. Queremos sacar la bañera y poner ducha, cambiar todos los cerámicos por porcelanato, y renovar cañerías a termofusión. Ya tenemos los sanitarios comprados.',
        category: 'Albañilería',
        location: 'Belgrano R, CABA',
        status: 'open',
    }).returning({ id: requests.id });

    // Create Slices (Phased Work)

    // Phase 1: Demolition
    const [sliceDemo] = await db.insert(slices).values({
        requestId: reqReno.id,
        creatorId: provider!.id,
        title: 'Fase 1: Demolición y Descombro',
        description: 'Retiro de artefactos existentes, picado de revestimientos de piso y pared, levantamiento de carpeta. Incluye volquetes y limpieza gruesa.',
        estimatedEffort: '2 días',
        estimatedHours: 16,
        finalPrice: 35000000, // $350.000
        status: 'proposed',
        sliceType: 'standard',
    }).returning({ id: slices.id });

    // Phase 2: Installations
    const [sliceInstall] = await db.insert(slices).values({
        requestId: reqReno.id,
        creatorId: provider!.id,
        title: 'Fase 2: Instalaciones Sanitarias',
        description: 'Colocación de cañerías agua fría/caliente en termofusión (Saladillo o similar). Desagües nuevos PVC. Prueba hidráulica antes de cerrar.',
        estimatedEffort: '3 días',
        estimatedHours: 24,
        finalPrice: 50000000, // $500.000
        status: 'proposed',
        sliceType: 'standard',
    }).returning({ id: slices.id });

    // Phase 3: Finishes
    const [sliceFinish] = await db.insert(slices).values({
        requestId: reqReno.id,
        creatorId: provider!.id,
        title: 'Fase 3: Revestimientos y Terminación',
        description: 'Hacer carpeta e impermeabilización. Colocación de porcelanato en piso y pared (hasta 2m). Pastinado y colocación de artefactos sanitarios y grifería.',
        estimatedEffort: '5 días',
        estimatedHours: 40,
        finalPrice: 85000000, // $850.000
        status: 'proposed',
        sliceType: 'standard',
    }).returning({ id: slices.id });

    // Create Complex Quote
    const [quoteReno] = await db.insert(quotes).values({
        requestId: reqReno.id,
        providerId: provider!.id,
        amount: 35000000 + 50000000 + 85000000, // Total Sum
        message: 'Presupuesto completo llave en mano (mano de obra y materiales gruesos). No incluye cerámicos ni grifería (provisión cliente). Cronograma estimado de 2 semanas.',
        status: 'pending',
        estimatedDeliveryDate: new Date(Date.now() + 3600 * 1000 * 24 * 14), // 14 days
    }).returning({ id: quotes.id });

    // Link Quote Items
    await db.insert(quoteItems).values([
        { quoteId: quoteReno.id, sliceId: sliceDemo.id },
        { quoteId: quoteReno.id, sliceId: sliceInstall.id },
        { quoteId: quoteReno.id, sliceId: sliceFinish.id },
    ]);

    console.log('🏗️ Reno Case Created:', reqReno.id);
    console.log('✅ Showcase Seed Completed!');

    // Output URLs for easy access
    console.log(`\n🔗 View Plumbing Request: http://localhost:3000/requests/${reqPlumber.id}`);
    console.log(`🔗 View Reno Request: http://localhost:3000/requests/${reqReno.id}`);
}

seedShowcase().catch(console.error);
