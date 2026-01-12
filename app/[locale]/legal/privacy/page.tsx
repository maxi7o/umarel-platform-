export default function PrivacyPage() {
    return (
        <div className="container mx-auto max-w-4xl py-12 px-6">
            <h1 className="text-4xl font-bold font-outfit mb-8">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground mb-8">Last Updated: January 2026</p>

            <div className="prose prose-stone max-w-none">
                <h2>1. Information We Collect</h2>
                <p>
                    We collect information to provide our verification services, including:
                    <ul>
                        <li><strong>Account Data:</strong> Name, email, phone number, and payment information.</li>
                        <li><strong>Verification Data:</strong> Photos, videos, and geolocation metadata uploaded to verify work ("Evidence").</li>
                        <li><strong>Usage Data:</strong> How you interact with our AI and platform.</li>
                    </ul>
                </p>

                <h2>2. How We Use Your Data</h2>
                <p>
                    <ul>
                        <li>To facilitate connections and process payments.</li>
                        <li>To verify the authenticity of work (using AI analysis of photo metadata).</li>
                        <li>To improve our AI models (e.g., better cost estimation).</li>
                        <li>To prevent fraud and ensure platform safety.</li>
                    </ul>
                </p>

                <h2>3. Data Sharing</h2>
                <p>
                    We do not sell your personal data. We share data only with:
                    <ul>
                        <li><strong>Payment Processors:</strong> To execute Escrow transactions.</li>
                        <li><strong>Counterparties:</strong> Clients/Providers see necessary contact info for active projects.</li>
                        <li><strong>Legal Authorities:</strong> If required by law.</li>
                    </ul>
                </p>

                <h2>4. Location Data</h2>
                <p>
                    For Providers and Umarels, we collect precise location data *only* when you are actively using the "Submit Evidence" feature
                    to prove presence at a job site. This is core to our "Proof of Truth" promise.
                </p>

                <h2>5. Your Rights</h2>
                <p>
                    You may request access to, correction of, or deletion of your personal data at any time by contacting privacy@umarel.org.
                    Note that some transaction records must be retained for legal/tax purposes.
                </p>
            </div>
        </div>
    );
}
