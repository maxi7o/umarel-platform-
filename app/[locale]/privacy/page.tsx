
import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="container mx-auto max-w-4xl py-12 px-4">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

            <div className="prose prose-orange max-w-none">
                <p className="text-sm text-gray-500 mb-8">Last Updated: December 22, 2025</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Data Collection</h2>
                    <p>We collect email, profile information, and transaction data to provide our services.</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. Evidence Data</h2>
                    <p>To verify the authenticity of work ("Proof of Slicing"), we collect <strong>Geolocation</strong> and <strong>Device Metadata</strong> when you upload evidence. This helps us resolve disputes and prevent fraud.</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. Data Usage</h2>
                    <p>We use your data to operate the marketplace, facilitate payments, prevent fraud, and comply with legal obligations.</p>
                </section>
            </div>
        </div>
    );
}
