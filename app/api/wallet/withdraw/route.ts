import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userWallets } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { canWithdraw, MIN_WITHDRAWAL_AMOUNT } from '@/lib/payments/calculations';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const { amount, mercadoPagoEmail } = await request.json();

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = user.id;

        // Get user wallet
        const wallet = await db.query.userWallets.findFirst({
            where: eq(userWallets.userId, userId),
        });

        if (!wallet) {
            return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
        }

        // Validate withdrawal amount
        if (amount < MIN_WITHDRAWAL_AMOUNT) {
            return NextResponse.json(
                { error: `Minimum withdrawal is ${MIN_WITHDRAWAL_AMOUNT / 100} ARS` },
                { status: 400 }
            );
        }

        if (amount > (wallet.balance || 0)) {
            return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
        }

        if (!canWithdraw(wallet.balance || 0)) {
            return NextResponse.json(
                { error: 'Balance below minimum withdrawal amount' },
                { status: 400 }
            );
        }

        // TODO: Process Mercado Pago payout
        // This requires Mercado Pago Money Out API
        // For now, we'll just update the wallet

        // Update wallet
        await db
            .update(userWallets)
            .set({
                balance: (wallet.balance || 0) - amount,
                totalWithdrawn: (wallet.totalWithdrawn || 0) + amount,
                mercadoPagoEmail: mercadoPagoEmail || wallet.mercadoPagoEmail,
                updatedAt: new Date(),
            })
            .where(eq(userWallets.userId, userId));

        // TODO: Create withdrawal record for tracking
        // TODO: Send confirmation email

        return NextResponse.json({
            success: true,
            newBalance: (wallet.balance || 0) - amount,
            withdrawnAmount: amount,
        });
    } catch (error) {
        console.error('Withdrawal error:', error);
        return NextResponse.json(
            { error: 'Failed to process withdrawal' },
            { status: 500 }
        );
    }
}
