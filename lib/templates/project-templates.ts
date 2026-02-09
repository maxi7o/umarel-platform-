export interface ProjectTemplate {
    id: string;
    name: string;
    category: string;
    icon: string;
    description: string;
    title: string;
    descriptionTemplate: string;
    suggestedMilestones: Array<{
        title: string;
        description: string;
        estimatedHours: number;
    }>;
    estimatedBudget: {
        min: number;
        max: number;
        currency: string;
    };
    suggestedSkills: string[];
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
    {
        id: 'web-mvp',
        name: 'Desarrollo Web MVP',
        category: 'tech',
        icon: '💻',
        description: 'Landing page o aplicación web básica',
        title: 'Desarrollo de Landing Page / Web App',
        descriptionTemplate: `Necesito desarrollar una [landing page / aplicación web] para [describir el negocio/producto].

**Funcionalidades principales:**
- [Funcionalidad 1]
- [Funcionalidad 2]
- [Funcionalidad 3]

**Tecnologías preferidas:**
- [React / Next.js / otro]

**Plazo estimado:** [X semanas]`,
        suggestedMilestones: [
            {
                title: 'Diseño y Wireframes',
                description: 'Diseño de interfaz y estructura de la aplicación',
                estimatedHours: 8
            },
            {
                title: 'Desarrollo Frontend',
                description: 'Implementación de componentes y páginas',
                estimatedHours: 24
            },
            {
                title: 'Integración Backend',
                description: 'APIs, base de datos y lógica de negocio',
                estimatedHours: 16
            },
            {
                title: 'Testing y Deploy',
                description: 'Pruebas, correcciones y puesta en producción',
                estimatedHours: 8
            }
        ],
        estimatedBudget: {
            min: 300000,
            max: 800000,
            currency: 'ARS'
        },
        suggestedSkills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js']
    },
    {
        id: 'bathroom-renovation',
        name: 'Reforma de Baño',
        category: 'construction',
        icon: '🚿',
        description: 'Renovación completa de baño',
        title: 'Reforma Completa de Baño',
        descriptionTemplate: `Necesito reformar un baño de [X m²] en [ubicación].

**Trabajos a realizar:**
- Cambio de sanitarios (inodoro, bidet, lavatorio)
- Revestimiento de paredes y piso
- Instalación de ducha/bañera
- Grifería nueva
- Iluminación

**Estado actual:**
[Describir estado actual del baño]

**Plazo deseado:** [X semanas]`,
        suggestedMilestones: [
            {
                title: 'Demolición y Preparación',
                description: 'Retiro de sanitarios viejos y preparación de superficies',
                estimatedHours: 16
            },
            {
                title: 'Instalaciones (Plomería y Electricidad)',
                description: 'Nuevas instalaciones de agua, desagües y electricidad',
                estimatedHours: 24
            },
            {
                title: 'Revestimientos',
                description: 'Colocación de cerámicos en paredes y pisos',
                estimatedHours: 32
            },
            {
                title: 'Sanitarios y Terminaciones',
                description: 'Instalación de sanitarios, grifería y detalles finales',
                estimatedHours: 16
            }
        ],
        estimatedBudget: {
            min: 800000,
            max: 2000000,
            currency: 'ARS'
        },
        suggestedSkills: ['Plomería', 'Electricidad', 'Albañilería', 'Colocación de Cerámicos']
    },
    {
        id: 'logo-branding',
        name: 'Logo y Branding',
        category: 'design',
        icon: '🎨',
        description: 'Identidad visual completa',
        title: 'Diseño de Logo e Identidad Visual',
        descriptionTemplate: `Necesito diseñar la identidad visual para [nombre del proyecto/empresa].

**Sobre el proyecto:**
[Describir el negocio, público objetivo, valores]

**Entregables deseados:**
- Logo (versiones en color, blanco/negro, horizontal/vertical)
- Paleta de colores
- Tipografías
- Manual de marca básico

**Estilo preferido:**
[Moderno / Minimalista / Clásico / etc.]`,
        suggestedMilestones: [
            {
                title: 'Investigación y Conceptos',
                description: 'Brief, moodboard y primeras propuestas conceptuales',
                estimatedHours: 8
            },
            {
                title: 'Diseño de Logo',
                description: '3 propuestas de logo con variaciones',
                estimatedHours: 12
            },
            {
                title: 'Refinamiento',
                description: 'Ajustes y versiones finales del logo seleccionado',
                estimatedHours: 6
            },
            {
                title: 'Manual de Marca',
                description: 'Paleta, tipografías y guía de uso',
                estimatedHours: 6
            }
        ],
        estimatedBudget: {
            min: 150000,
            max: 400000,
            currency: 'ARS'
        },
        suggestedSkills: ['Diseño Gráfico', 'Illustrator', 'Photoshop', 'Branding']
    },
    {
        id: 'event-planning',
        name: 'Organización de Evento',
        category: 'events',
        icon: '🎉',
        description: 'Evento corporativo o social',
        title: 'Organización de Evento [Tipo]',
        descriptionTemplate: `Necesito organizar un [tipo de evento] para [cantidad de personas] en [ubicación].

**Detalles del evento:**
- Fecha: [fecha]
- Tipo: [corporativo / social / otro]
- Cantidad de invitados: [X personas]
- Presupuesto aproximado: [ARS X]

**Servicios requeridos:**
- Catering
- Ambientación
- Sonido/Música
- [Otros]`,
        suggestedMilestones: [
            {
                title: 'Planificación y Presupuesto',
                description: 'Definición de concepto, cronograma y presupuesto detallado',
                estimatedHours: 8
            },
            {
                title: 'Coordinación de Proveedores',
                description: 'Contratación de catering, sonido, decoración, etc.',
                estimatedHours: 12
            },
            {
                title: 'Logística Pre-Evento',
                description: 'Confirmaciones, timeline y preparativos finales',
                estimatedHours: 8
            },
            {
                title: 'Ejecución del Evento',
                description: 'Coordinación durante el evento',
                estimatedHours: 10
            }
        ],
        estimatedBudget: {
            min: 500000,
            max: 2000000,
            currency: 'ARS'
        },
        suggestedSkills: ['Organización de Eventos', 'Coordinación', 'Negociación', 'Logística']
    },
    {
        id: 'mobile-app',
        name: 'Aplicación Móvil',
        category: 'tech',
        icon: '📱',
        description: 'App nativa o híbrida',
        title: 'Desarrollo de Aplicación Móvil',
        descriptionTemplate: `Necesito desarrollar una aplicación móvil para [iOS / Android / ambas] con las siguientes características:

**Funcionalidades principales:**
- [Funcionalidad 1]
- [Funcionalidad 2]
- [Funcionalidad 3]

**Integraciones:**
- [APIs / Servicios externos]

**Tecnología preferida:**
- [React Native / Flutter / Nativo]`,
        suggestedMilestones: [
            {
                title: 'UX/UI Design',
                description: 'Diseño de flujos y pantallas de la app',
                estimatedHours: 16
            },
            {
                title: 'Desarrollo Core',
                description: 'Implementación de funcionalidades principales',
                estimatedHours: 40
            },
            {
                title: 'Integraciones',
                description: 'APIs, autenticación, pagos, etc.',
                estimatedHours: 20
            },
            {
                title: 'Testing y Publicación',
                description: 'QA, correcciones y publicación en stores',
                estimatedHours: 12
            }
        ],
        estimatedBudget: {
            min: 600000,
            max: 1500000,
            currency: 'ARS'
        },
        suggestedSkills: ['React Native', 'Flutter', 'iOS', 'Android', 'API Integration']
    },
    {
        id: 'seo-marketing',
        name: 'SEO y Marketing Digital',
        category: 'marketing',
        icon: '📈',
        description: 'Optimización y estrategia digital',
        title: 'Estrategia de SEO y Marketing Digital',
        descriptionTemplate: `Necesito mejorar la presencia online de [nombre del negocio/sitio].

**Objetivos:**
- Aumentar tráfico orgánico
- Mejorar posicionamiento en Google
- [Otros objetivos]

**Sitio web actual:**
[URL]

**Público objetivo:**
[Describir audiencia]

**Plazo:** [X meses]`,
        suggestedMilestones: [
            {
                title: 'Auditoría SEO',
                description: 'Análisis completo del sitio y competencia',
                estimatedHours: 12
            },
            {
                title: 'Estrategia y Plan',
                description: 'Definición de keywords, contenido y acciones',
                estimatedHours: 8
            },
            {
                title: 'Optimización On-Page',
                description: 'Mejoras técnicas, contenido y meta tags',
                estimatedHours: 20
            },
            {
                title: 'Link Building y Seguimiento',
                description: 'Construcción de enlaces y reportes mensuales',
                estimatedHours: 16
            }
        ],
        estimatedBudget: {
            min: 200000,
            max: 600000,
            currency: 'ARS'
        },
        suggestedSkills: ['SEO', 'Google Analytics', 'Content Marketing', 'Link Building']
    }
];

/**
 * Get template by ID
 */
export function getTemplateById(id: string): ProjectTemplate | undefined {
    return PROJECT_TEMPLATES.find(t => t.id === id);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): ProjectTemplate[] {
    return PROJECT_TEMPLATES.filter(t => t.category === category);
}
