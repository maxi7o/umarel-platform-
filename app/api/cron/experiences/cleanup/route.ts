import { db } from '@/lib/db';
import { experiences, experienceParticipants, escrowPayments } from '@/lib/db/schema';
import { eq, lt, and, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        // Authenticate Cron (e.g. check for a secret header)
        // const authHeader = req.headers.get('Authorization');
        // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) { ... }

        const now = new Date();

        // 1. Find experiences that started in the past but are still 'scheduled'
        const pendingExperiences = await db
            .select()
            .from(experiences)
            .where(and(
                lt(experiences.date, now),
                eq(experiences.status, 'scheduled')
            ));

        const results = {
            cancelled: 0,
            confirmed: 0,
            errors: 0
        };

        for (const exp of pendingExperiences) {
            // Count participants
            const participants = await db
                .select()
                .from(experienceParticipants)
                .where(eq(experienceParticipants.experienceId, exp.id));

            const count = participants.length;

            if (count < (exp.minParticipants || 1)) {
                // CANCEL & REFUND
                await db.transaction(async (tx) => {
                    // Update Experience
                    await tx.update(experiences)
                        .set({ status: 'cancelled' })
                        .where(eq(experiences.id, exp.id));

                    // Refund Participants
                    for (const p of participants) {
                        // 1. Mark participant as refunded
                        await tx.update(experienceParticipants)
                            .set({ status: 'refunded' })
                            .where(eq(experienceParticipants.id, p.id));

                        // 2. Mark Escrow as refunded
                        if (p.escrowPaymentId) {
                            await tx.update(escrowPayments)
                                .set({ status: 'refunded', refundedAt: new Date() })
                                .where(eq(escrowPayments.id, p.escrowPaymentId));

                            // 3. (Mock) Trigger Payment Gateway Refund Logic here
                            // await mercadoPago.refund(p.escrowPaymentId);
                        }
                    }
                });
                results.cancelled++;
            } else {
                // CONFIRM (Ready for evidence)
                await db.update(experiences)
                    .set({ status: 'confirmed' })
                    .where(eq(experiences.id, exp.id));
                results.confirmed++;
            }
        }

        return NextResponse.json({ success: true, results });

    } catch (error) {
        console.error('[CRON_EXPERIENCES]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
