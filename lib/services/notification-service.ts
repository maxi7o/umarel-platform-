
import { Resend } from 'resend';
import { sendAlert } from '@/lib/notifications'; // Fallback to Discord for ops

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const SYSTEM_EMAIL = 'notifications@umarel.org';

export class NotificationService {

    /**
     * Notify Provider that their proposal was accepted
     */
    static async notifyProposalAccepted(email: string, providerName: string, sliceTitle: string, sliceId: string) {
        const subject = `You're Hired! Job: ${sliceTitle}`;
        const html = `
            <h1>Congratulations, ${providerName}! 🚀</h1>
            <p>Your proposal for <strong>"${sliceTitle}"</strong> has been accepted by the client.</p>
            <p><strong>Next Steps:</strong></p>
            <ol>
                <li>Go to the Slice details page.</li>
                <li>Tap <strong>"Start Job"</strong> when you arrive on site.</li>
                <li>Get paid!</li>
            </ol>
            <p><a href="https://umarel.org/slices/${sliceId}">View Job Details</a></p>
        `;

        await this.sendEmail(email, subject, html, { type: 'PROPOSAL_ACCEPTED', sliceId });
    }

    /**
     * Notify Provider that funds have been released
     */
    static async notifyFundsReleased(email: string, providerName: string, sliceTitle: string, amountCents: number) {
        const amount = (amountCents / 100).toFixed(2);
        const subject = `Payment Released: $${amount} for ${sliceTitle}`;
        const html = `
            <h1>Ka-ching! 💸</h1>
            <p>Hey ${providerName},</p>
            <p>The funds ($${amount}) for <strong>"${sliceTitle}"</strong> have been released to your Umarel Wallet.</p>
            <p>You can withdraw them to your bank account anytime.</p>
            <p><a href="https://umarel.org/wallet">Go to Wallet</a></p>
        `;

        await this.sendEmail(email, subject, html, { type: 'FUNDS_RELEASED', amount });
    }

    /**
     * Notify about a Dispute
     */
    static async notifyDisputeOpened(clientEmail: string, providerEmail: string, sliceTitle: string, reason: string) {
        // Notify Client (Confirmation)
        await this.sendEmail(clientEmail, `Dispute Opened: ${sliceTitle}`, `
            <h1>Dispute Raised</h1>
            <p>You have paused the release for <strong>"${sliceTitle}"</strong>.</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p>Our AI Judge is reviewing the evidence. We will notify you shortly.</p>
        `, { type: 'DISPUTE_OPENED_CLIENT' });

        // Notify Provider (Action Required)
        await this.sendEmail(providerEmail, `Action Required: Dispute on ${sliceTitle}`, `
            <h1>Payment Paused 🛑</h1>
            <p>The client has raised a dispute on <strong>"${sliceTitle}"</strong>.</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p>Please check the app to provide any additional evidence.</p>
            <p><a href="https://umarel.org">View Details</a></p>
        `, { type: 'DISPUTE_OPENED_PROVIDER' });
    }

    /**
     * Internal sender with Fallback
     */
    private static async sendEmail(to: string, subject: string, html: string, metadata: any) {
        if (!resend) {
            console.log(`[Mock Email] To: ${to} | Subject: ${subject}`);
            // Fallback: Notify Admins via Discord that a transactional email *would* have gone out
            await sendAlert('HIGH_VALUE_SLICE', { // Reusing alert type for visibility
                title: `Mock Email: ${subject}`,
                description: `To: ${to}\nMetadata: ${JSON.stringify(metadata)}`
            });
            return;
        }

        try {
            await resend.emails.send({
                from: SYSTEM_EMAIL,
                to,
                subject,
                html
            });
            console.log(`[Email Sent] To: ${to} | Subject: ${subject}`);
        } catch (error) {
            console.error('[Email Failed]', error);
            // Fallback to Discord on failure
            await sendAlert('ERROR_500', {
                title: 'Email Delivery Failed',
                description: `Subject: ${subject}\nError: ${error}`
            });
        }
    }
}
