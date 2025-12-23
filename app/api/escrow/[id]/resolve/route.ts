
import { NextRequest, NextResponse } from 'next/server';
import { escrowService } from '@/lib/services/escrow-service';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { resolution, notes, adminId } = await request.json();

        if (!['release', 'refund'].includes(resolution)) {
            return NextResponse.json({ error: 'Invalid resolution action' }, { status: 400 });
        }

        // Validation: Ensure adminId is actually an admin
        await escrowService.resolveDispute(id, resolution, notes, adminId || 'admin-id');

        return NextResponse.json({ success: true, message: `Dispute resolved: ${resolution}` });
    } catch (error: any) {
        console.error('Failed to resolve dispute:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
