import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';

async function getSession(sessionId: string) {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        return session;
    } catch (err) {
        return null;
    }
}

export default async function ReturnPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const session_id = resolvedSearchParams.session_id as string;

    if (!session_id) redirect('/');

    const session = await getSession(session_id);

    if (!session || session.status === 'open') {
        return (
            <div className="container mx-auto py-20 text-center text-red-600">
                <p>Payment did not succeed or session is invalid. Please try again.</p>
            </div>
        );
    }

    if (session.status === 'complete') {
        return (
            <div className="container mx-auto py-20 text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Success!</h2>
                <p className="mb-4">
                    Thank you for your purchase. Your payment reference is: <span className="font-mono">{session.id}</span>
                </p>
                <p className="text-muted-foreground">
                    You will receive an email confirmation at {session.customer_details?.email}
                </p>
            </div>
        );
    }

    return null;
}
