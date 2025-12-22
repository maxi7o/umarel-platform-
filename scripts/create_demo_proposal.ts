import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from '@/lib/db';
import { changeProposals, comments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    const requestId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    const mariaId = '11111111-1111-1111-1111-111111111111';
    const diegoId = '33333333-3333-3333-3333-333333333333';

    try {
        console.log('Seeding demo proposal...');

        // 1. Create Comment from Diego
        const [comment] = await db.insert(comments).values({
            requestId: requestId,
            userId: diegoId,
            content: 'Sugiero agregar impermeabilización antes de colocar los azulejos para evitar humedad futura.',
            type: 'text',
        }).returning();

        // 2. Create Change Proposal
        await db.insert(changeProposals).values({
            requestId: requestId,
            commentId: comment.id,
            status: 'pending',
            proposedActions: [
                {
                    type: 'CREATE_CARD',
                    data: {
                        title: 'Impermeabilización de Paredes',
                        description: 'Aplicar membrana líquida o revoque hidrófugo antes de la colocación de cerámicos.',
                        skills: ['Albañilería'],
                    },
                    impactAnalysis: 'Prevents future damages, saving approx $300,000 in repairs.'
                }
            ],
            aiImpact: {
                qualityScore: 9,
                impactType: 'risk_mitigation',
                estimatedSavings: 300000
            }
        });

        console.log('✅ Demo proposal created!');
    } catch (e) {
        console.error('Error:', e);
    }
}

main().then(() => process.exit(0));
