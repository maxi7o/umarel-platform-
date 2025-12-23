
import { getTranslations } from 'next-intl/server';
import React from 'react';

export default async function TermsPage() {
    const t = await getTranslations('terms');

    return (
        <div className="container mx-auto max-w-4xl py-12 px-4">
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

            <div className="prose prose-orange max-w-none">
                <p className="text-sm text-gray-500 mb-8">Last Updated: December 22, 2025</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                    <p>Welcome to Umarel ("we," "our," or "us"). By accessing or using our platform, you agree to be bound by these Terms of Service ("Terms"). If you do not agree, you may not use the platform.</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>You must be at least 18 years old to use Umarel.</li>
                        <li>You are responsible for maintaining the security of your account credentials.</li>
                        <li>You accept full responsibility for all activities that occur under your account.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. Marketplace Services & Slices</h2>
                    <p><strong>Role of Umarel</strong>: We are a neutral marketplace connecting Clients ("Buyers") with Providers ("Sellers"). We do not perform the services ourselves.</p>
                    <p className="mt-2"><strong>Service Slices</strong>: All services are broken down into "Slices". Payment is released from Escrow only upon Client approval of the Slice.</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property (Ownership)</h2>
                    <h3 className="text-xl font-medium mb-2">4.1. Work for Hire</h3>
                    <p>Upon release of full payment from Escrow, the Seller assigns to the Buyer all right, title, and interest, including all intellectual property rights, in the delivered Work ("Slice Evidence"), unless otherwise specified in the Service Description.</p>

                    <h3 className="text-xl font-medium mt-4 mb-2">4.2. Seller Warranties</h3>
                    <p>Seller warrants that:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>The Work is original and does not infringe on any third party's rights.</li>
                        <li>They have obtained all necessary licenses for any stock assets used.</li>
                    </ul>

                    <h3 className="text-xl font-medium mt-4 mb-2">4.3. Platform License</h3>
                    <p>You grant Umarel a non-exclusive, worldwide, royalty-free license to use your User Generated Content (portfolios, reviews, profile data) for marketing and platform operation purposes.</p>
                </section>

                <div className="bg-blue-50 p-6 rounded-lg mb-8 border border-blue-100">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-900">5. Argentina Specific Terms (Cesión de Derechos)</h2>
                    <p className="text-blue-800">Para usuarios en Argentina: La transferencia de derechos mencionada en la sección 4.1 se rige como una "Cesión de Derechos de Explotación" bajo la Ley 11.723. Los derechos morales (paternidad de la obra) permanecen con el autor, pero el comprador adquiere el derecho exclusivo de uso comercial.</p>
                </div>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">6. Copyright Infringement (DMCA & Safe Harbor)</h2>
                    <p>We respect the intellectual property rights of others. If you believe content on Umarel infringes your copyright, please report it to our Designated Agent.</p>
                </section>
            </div>
        </div>
    );
}
