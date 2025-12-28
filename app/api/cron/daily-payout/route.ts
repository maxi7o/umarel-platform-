import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { dailyPayouts, users, userWallets, communityRewards, escrowPayments, comments, wizardMessages } from '@/lib/db/schema';
import { distributeDailyPool, calculateAuraScore } from '@/lib/aura/calculations';
import { sql, and, eq, gte, lt, desc } from 'drizzle-orm';

/**
 * Daily Payout Cron Job
 * Run at 00:00 UTC daily
 * Distributes 3% community pool to top Aura users
 */
import { PayoutService } from '@/lib/services/payout-service';

/**
 * Daily Payout Cron Job
 * Run at 00:00 UTC daily
 * Distributes 3% community pool to top Aura users
 */
export async function GET(request: NextRequest) {
    try {
        // Verify cron secret
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await PayoutService.processDailyPayout();

        if (!result.success) {
            return NextResponse.json({ message: result.message });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Daily payout error:', error);
        return NextResponse.json(
            { error: 'Failed to process daily payout' },
            { status: 500 }
        );
    }
}

