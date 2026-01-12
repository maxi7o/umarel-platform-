
/**
 * Email notification templates and sending utilities
 * Uses Resend for email delivery
 */

export interface EmailNotification {
    to: string;
    subject: string;
    html: string;
}

/**
 * Send email notification
 * TODO: Integrate with your email service (Resend, SendGrid, etc.)
 */
export async function sendEmail(notification: EmailNotification): Promise<void> {
    // For now, just log. Replace with actual email service
    console.log('📧 Email notification:', {
        to: notification.to,
        subject: notification.subject,
    });

    // Example Resend integration:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'Umarel <noreply@umarel.com>',
    //   to: notification.to,
    //   subject: notification.subject,
    //   html: notification.html,
    // });
}

/**
 * Payment received notification (to provider)
 */
export function paymentInEscrowEmail(
    providerEmail: string,
    sliceTitle: string,
    amount: string
): EmailNotification {
    return {
        to: providerEmail,
        subject: '💰 Payment Received - Work Can Begin',
        html: `
      <h2>Payment Received in Escrow</h2>
      <p>Great news! The client has paid for the slice:</p>
      <p><strong>${sliceTitle}</strong></p>
      <p>Amount: <strong>${amount}</strong></p>
      <p>The payment is being held securely in escrow. Once you complete the work and the client approves, the funds will be released to you.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/earnings">View Earnings Dashboard</a></p>
    `,
    };
}

/**
 * Work completed notification (to client)
 */
export function workCompletedEmail(
    clientEmail: string,
    sliceTitle: string,
    sliceId: string
): EmailNotification {
    return {
        to: clientEmail,
        subject: '✅ Work Completed - Please Review',
        html: `
      <h2>Work Completed</h2>
      <p>The provider has marked the following slice as completed:</p>
      <p><strong>${sliceTitle}</strong></p>
      <p>Please review the work and approve if you're satisfied. Your payment will be released once you approve.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/requests/${sliceId}">Review & Approve</a></p>
    `,
    };
}

/**
 * Payment released notification (to provider)
 */
export function paymentReleasedEmail(
    providerEmail: string,
    sliceTitle: string,
    amount: string
): EmailNotification {
    return {
        to: providerEmail,
        subject: '🎉 Payment Released!',
        html: `
      <h2>Payment Released</h2>
      <p>Congratulations! The client has approved your work:</p>
      <p><strong>${sliceTitle}</strong></p>
      <p>Amount received: <strong>${amount}</strong></p>
      <p>The payment has been released and will be available in your account shortly.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/earnings">View Earnings</a></p>
    `,
    };
}

/**
 * Community reward notification (to helper)
 */
export function communityRewardEmail(
    helperEmail: string,
    amount: string,
    reason: string
): EmailNotification {
    return {
        to: helperEmail,
        subject: '💎 You Earned a Community Reward!',
        html: `
      <h2>Community Reward Earned</h2>
      <p>You've earned a reward for helping the Umarel community!</p>
      <p>Amount: <strong>${amount}</strong></p>
      <p>Reason: ${reason}</p>
      <p>The reward has been added to your wallet.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/wallet">View Wallet</a></p>
    `,
    };
}

/**
 * Payment failed notification (to client)
 */
export function paymentFailedEmail(
    clientEmail: string,
    sliceTitle: string,
    sliceId: string
): EmailNotification {
    return {
        to: clientEmail,
        subject: '❌ Payment Failed',
        html: `
      <h2>Payment Failed</h2>
      <p>We couldn't process your payment for:</p>
      <p><strong>${sliceTitle}</strong></p>
      <p>Please try again or use a different payment method.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/checkout/${sliceId}">Try Again</a></p>
    `,
    };
}

/**
 * New Guest Bid notification (to client)
 */
export function newBidEmail(
    clientEmail: string,
    sliceTitle: string,
    amount: string,
    contactInfo: string
): EmailNotification {
    return {
        to: clientEmail,
        subject: '🔔 New Bid Received (Guest)',
        html: `
      <h2>New Bid Received!</h2>
      <p>A service provider has submitted a quick bid for:</p>
      <p><strong>${sliceTitle}</strong></p>
      <p>Price: <strong>${amount}</strong></p>
      <p>Contact: ${contactInfo}</p>
      <p>To accept this bid or view details, log in to your dashboard.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">View Bid</a></p>
    `,
    };
}
