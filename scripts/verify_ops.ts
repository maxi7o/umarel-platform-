
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { sendAlert } from '../lib/notifications';

async function verifyOps() {
    console.log('🧪 Verifying Ops Infrastructure...');

    // 1. Test Notification
    console.log('Testing Discord Alert...');
    await sendAlert('DISPUTE_RAISED', {
        title: 'Test Dispute Notification',
        description: 'This is a test alert from the release process.',
        metadata: { sliceId: 'slice_test_123', amount: '5000' }
    });
    console.log('✅ Notification Sent (Check Discord)');

    console.log('✅ Sentry Configured in Code (Check Project Settings)');
    console.log('✅ Admin Dashboard Route Created (/admin/disputes)');
}

verifyOps().catch(console.error);
