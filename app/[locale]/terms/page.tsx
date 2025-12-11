export default function TermsPage() {
    return (
        <div className="container mx-auto max-w-3xl py-12 px-4">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <div className="prose prose-gray max-w-none">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>Welcome to Umarel. By using our website, you agree to these terms.</p>

                <h3>1. Services</h3>
                <p>Umarel connects service providers with users seeking services. We are a marketplace platform.</p>

                <h3>2. User Accounts</h3>
                <p>You are responsible for maintaining the confidentiality of your account.</p>

                <h3>3. Payments</h3>
                <p>Payments for featured listings are processed securely via Stripe.</p>

                {/* Add more legal text as needed */}
            </div>
        </div>
    );
}
