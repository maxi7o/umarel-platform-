import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/landing/hero-section';

import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { MobileDemos } from '@/components/landing/mobile-demos';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { FaqSection } from '@/components/landing/faq-section';
import { CtaSection } from '@/components/landing/cta-section';

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-orange-100 selection:text-orange-900">
      <HeroSection />
      {/* TrustSection removed to reduce redundancy with Hero */}
      <HowItWorksSection />
      <MobileDemos />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}
