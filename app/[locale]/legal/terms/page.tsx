import { getTranslations } from 'next-intl/server';

export default async function TermsPage() {
    return (
        <div className="container mx-auto max-w-4xl py-12 px-6">
            <h1 className="text-4xl font-bold font-outfit mb-8">Terms of Service</h1>
            <p className="text-sm text-muted-foreground mb-8">Last Updated: January 2026</p>

            <div className="prose prose-stone max-w-none">
                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing or using Umarel ("the Platform"), you agree to be bound by these Terms of Service.
                    If you do not agree, do not use our services. Umarel connects Service Seekers ("Clients") with Service Providers ("Creators")
                    and Verifiers ("Umarels").
                </p>

                <h2>2. The Umarel Platform Role</h2>
                <p>
                    Umarel is an online marketplace and verification tool. We are <strong>not a construction company, employer, or direct service provider</strong>.
                    We act as a neutral intermediary to facilitate connections, manage project scopes via AI, and secure payments via Escrow.
                    We do not guarantee the quality, safety, or legality of services advertised, although we use "Umarel Verification" to reduce risk.
                </p>

                <h2>3. Escrow and Payments</h2>
                <h3>3.1. Escrow Mechanism</h3>
                <p>
                    All payments for services are held in a secure Escrow account managed by third-party payment processors
                    (e.g., MercadoPago, Stripe). Funds are <strong>not</strong> held directly in Umarel's corporate bank accounts for operational use.
                </p>
                <h3>3.2. Release of Funds</h3>
                <p>
                    Funds are released to the Provider only upon:
                    <ul>
                        <li>Explicit approval by the Client; or</li>
                        <li>Verification of completed work by an authorized Umarel (Verifier) if the Client is unresponsive for 72 hours; or</li>
                        <li>Resolution of a Dispute in favor of the Provider.</li>
                    </ul>
                </p>
                <h3>3.3. Fees</h3>
                <p>
                    Umarel charges a Platform Fee (typically 5-10%) and an Umarel Dividend Fee (3%) on successfully completed transactions.
                    These fees are deducted from the total payment released.
                </p>

                <h2>4. User Responsibilities</h2>
                <h3>4.1. Clients</h3>
                <p>
                    You agree to define scopes accurately using our AI tools and to review evidence of work promptly.
                    Unreasonable delays in approval may result in auto-release of funds to protect Providers.
                </p>
                <h3>4.2. Providers (Creators)</h3>
                <p>
                    You agree to perform work to professional standards and to provide truthful, unmanipulated photo/video evidence
                    via the Umarel App ("Proof of Truth"). Falsifying evidence leads to immediate account termination.
                </p>
                <h3>4.3. Umarels (Verifiers)</h3>
                <p>
                    You act as impartial judges. You must verify work based solely on the evidence provided and the agreed scope,
                    without bias or collusion.
                </p>

                <h2>5. Disputes and Arbitration</h2>
                <p>
                    Disputes are handled via our "Community Wisdom" process or internal review. By using the platform,
                    you agree that the decision reached by Umarel's designated dispute resolution process is <strong>final and binding</strong>
                    regarding the release of Escrow funds.
                </p>

                <h2>6. Liability and Indemnification</h2>
                <p>
                    To the maximum extent permitted by law, Umarel Shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
                    Our total liability for any claim shall not exceed the amount of Fees paid to Umarel by you in the 6 months preceding the claim.
                </p>

                <h2>7. Governing Law</h2>
                <p>
                    These terms are governed by the laws of Argentina (or the jurisdiction where the service is performed), without regard to its conflict of law principles.
                </p>

                <h2>8. Contact</h2>
                <p>
                    For legal inquiries, please contact legal@umarel.org.
                </p>
            </div>
        </div>
    );
}
