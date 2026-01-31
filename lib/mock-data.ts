
export function getMockBrowseResults() {
    const requests = [
        {
            id: 'mock-req-1',
            title: 'Arreglar Humedad en Techo',
            description: 'Tengo una mancha de humedad que crece cada vez que llueve. Necesito reparar e impermeabilizar.',
            location: 'Palermo, CABA',
            category: 'masonry',
            status: 'open',
            budget: 150000,
            createdAt: new Date().toISOString(),
            type: 'request',
            featured: true,
            user: { id: 'mock-user-1', fullName: 'Juan Pérez' }
        },
        {
            id: 'mock-req-2',
            title: 'Instalación de Aire Acondicionado',
            description: 'Compré un split de 3000 frigorías. Necesito instalación básica en un primer piso.',
            location: 'Belgrano, CABA',
            category: 'electrical',
            status: 'open',
            budget: 80000,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            type: 'request',
            featured: false,
            user: { id: 'mock-user-2', fullName: 'Ana Gómez' }
        }
    ];

    const offerings = [
        {
            id: 'mock-off-1',
            title: 'Gasista Matriculado - Urgencias',
            description: 'Reparaciones de gas, habilitaciones, estufas y calefones. Matrícula al día. Trabajo con garantía.',
            location: 'CABA y GBA Norte',
            category: 'plumbing',
            status: 'active',
            hourlyRate: 25000,
            createdAt: new Date().toISOString(),
            type: 'offering',
            featured: true,
            provider: {
                id: 'mock-prov-1',
                fullName: 'Carlos Gas',
                avatarUrl: '',
                auraPoints: 156
            },
            metrics: { completionRate: 98, onTimeRate: 95, rating: 4.9 }
        },
        {
            id: 'mock-off-2',
            title: 'Electricista 24hs - Domiciliario',
            description: 'Cortocircuitos, cambio de térmicas, cableado nuevo. Atención rápida.',
            location: 'Caballito, CABA',
            category: 'electrical',
            status: 'active',
            hourlyRate: 20000,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            type: 'offering',
            featured: false,
            provider: {
                id: 'mock-prov-2',
                fullName: 'ElectroMax',
                avatarUrl: '',
                auraPoints: 89
            },
            metrics: { completionRate: 92, onTimeRate: 88, rating: 4.7 }
        }
    ];

    // Generators
    const locations = ['Palermo', 'Recoleta', 'Belgrano', 'Caballito', 'San Telmo', 'Villa Urquiza', 'Nuñez', 'Almagro', 'Villa Crespo', 'Colegiales'];
    const names = ['Sofía', 'Martín', 'Lucía', 'Diego', 'Valentina', 'Lucas', 'Camila', 'Mateo', 'Julieta', 'Nicolás'];
    const surnames = ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Díaz'];

    // 20 More Requests
    const requestTitles = [
        { t: 'Pintura total departamento 3 amb', c: 'painting', b: 450000 },
        { t: 'Cambio de cerradura puerta blindada', c: 'other', b: 40000 },
        { t: 'Colocación de cerámicas en baño', c: 'masonry', b: 200000 },
        { t: 'Flete mudanza chica', c: 'moving', b: 60000 },
        { t: 'Podar árbol patio interno', c: 'gardening', b: 35000 },
        { t: 'Limpieza final de obra', c: 'cleaning', b: 80000 },
        { t: 'Mueble a medida cocina', c: 'carpentry', b: 300000 },
        { t: 'Reparación pérdida inodoro', c: 'plumbing', b: 25000 },
        { t: 'Cableado red oficina', c: 'electrical', b: 120000 },
        { t: 'Instalar luminarias techo', c: 'electrical', b: 30000 }
    ];

    for (let i = 0; i < 20; i++) {
        const template = requestTitles[i % requestTitles.length];
        const user = `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;

        requests.push({
            id: `mock-req-gen-${i}`,
            title: i % 2 === 0 ? template.t : `${template.t} (Urgente)`,
            description: `Necesito ${template.t.toLowerCase()}. Ubicación accesible. Presupuesto flexible.`,
            location: `${locations[Math.floor(Math.random() * locations.length)]}, CABA`,
            category: template.c,
            status: 'open',
            budget: template.b * (0.8 + Math.random() * 0.4),
            createdAt: new Date(Date.now() - Math.random() * 864000000).toISOString(),
            type: 'request',
            featured: Math.random() > 0.8,
            user: { id: `mock-user-gen-${i}`, fullName: user }
        });
    }

    // 20 Creative & Tech Services (Service Offerings)
    const creativeTitles = [
        { t: 'Diseño de Interiores 3D', c: 'painting', d: 'Visualizá tu reforma antes de empezar. Renders fotorealistas.' },
        { t: 'Consultoría Feng Shui', c: 'other', d: 'Armonizá tus espacios para mejorar la energía del hogar.' },
        { t: 'Diseño de Jardines Verticales', c: 'gardening', d: 'Paisajismo urbano para balcones y terrazas.' },
        { t: 'Automatización Smart Home', c: 'electrical', d: 'Domótica, luces inteligentes y control por voz.' },
        { t: 'Asesoría en Materiales Sustentables', c: 'other', d: 'Construcción ecológica y ahorro energético.' },
        { t: 'Murales Artísticos a Mano', c: 'painting', d: 'Dale vida a tus paredes con arte único.' },
        { t: 'Restauración Muebles Antiguos', c: 'carpentry', d: 'Recupero el brillo de tus muebles con técnicas tradicionales.' },
        { t: 'Organización de Espacios (Marie Kondo)', c: 'cleaning', d: 'Orden y método para tu placard y cocina.' },
        { t: 'Fotografía de Arquitectura', c: 'other', d: 'Fotos profesionales para venta o alquiler.' },
        { t: 'Gestión Municipal y Planos', c: 'other', d: 'Trámites, habilitaciones y firma de planos.' }
    ];

    for (let i = 0; i < 20; i++) {
        const template = creativeTitles[i % creativeTitles.length];
        const providerName = `${names[Math.floor(Math.random() * names.length)]}`;

        offerings.push({
            id: `mock-off-gen-${i}`,
            title: i % 2 === 0 ? template.t : `${template.t} Premium`,
            description: template.d,
            location: `${locations[Math.floor(Math.random() * locations.length)]}, CABA`,
            category: template.c,
            status: 'active',
            hourlyRate: 15000 + Math.random() * 20000,
            createdAt: new Date(Date.now() - Math.random() * 864000000).toISOString(),
            type: 'offering',
            featured: Math.random() > 0.7,
            provider: {
                id: `mock-prov-gen-${i}`,
                fullName: `${providerName} Creativo`,
                avatarUrl: '',
                auraPoints: Math.floor(50 + Math.random() * 100)
            },
            metrics: {
                completionRate: 85 + Math.floor(Math.random() * 15),
                onTimeRate: 80 + Math.floor(Math.random() * 20),
                rating: 4.0 + Math.random()
            }
        });
    }

    return { requests, offerings };
}
