import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/landing/hero-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { FaqSection } from '@/components/landing/faq-section';
import { CtaSection } from '@/components/landing/cta-section';
import { generateSEOMetadata, SEO_CONFIGS } from '@/lib/seo';

export async function generateMetadata() {
  return generateSEOMetadata(SEO_CONFIGS.home);
}

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('maintenance');

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-stone-100 selection:text-orange-900 overflow-x-hidden w-full">
      <HeroSection />
      <HowItWorksSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}
