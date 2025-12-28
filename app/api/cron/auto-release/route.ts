
import { NextResponse } from 'next/server';
import { PayoutService } from '@/lib/services/payout-service';

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const result = await PayoutService.processAutoReleases();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Auto-release cron failed:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
