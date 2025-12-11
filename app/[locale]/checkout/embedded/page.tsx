import CheckoutForm from '@/components/checkout/EmbeddedCheckout';

export default async function EmbeddedCheckoutPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    // Example: ?priceId=price_H5ggYJDq...
    const priceId = (resolvedSearchParams.priceId as string) || 'price_default_123';

    return (
        <div className="py-12 bg-gray-50 dark:bg-zinc-900 min-h-screen">
            <div className="container mx-auto px-4 text-center mb-8">
                <h1 className="text-3xl font-bold">Secure Checkout</h1>
                <p className="text-muted-foreground mt-2">Complete your purchase safely using Stripe.</p>
            </div>
            <CheckoutForm priceId={priceId} />
        </div>
    );
}
