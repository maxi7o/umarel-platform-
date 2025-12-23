
import { NextRequest, NextResponse } from 'next/server';
import { escrowService } from '@/lib/services/escrow-service';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { reason, userId } = await request.json();

        if (!reason) {
            return NextResponse.json({ error: 'Reason is required' }, { status: 400 });
        }

        // In a real app, verify user session here
        await escrowService.raiseDispute(id, reason, userId || 'current-user-id');

        return NextResponse.json({ success: true, message: 'Dispute raised' });
    } catch (error: any) {
        console.error('Failed to raise dispute:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
