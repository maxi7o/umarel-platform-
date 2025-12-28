import { TrattoriaHero } from '@/components/landing/trattoria-hero';
import { TrattoriaBenefits } from '@/components/landing/trattoria-benefits';
import { TrattoriaHowItWorks } from '@/components/landing/trattoria-how-it-works';
import { TrattoriaRoles } from '@/components/landing/trattoria-roles';
import { ItalianQuotes } from '@/components/landing/italian-quotes';
import { useTranslations } from 'next-intl';

export default function LandingPage() {
  const t = useTranslations('home');

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#3D2817] font-sans selection:bg-[#D62828]/20 selection:text-[#D62828]">

      {/* 1. Hero Section - Warm Welcome */}
      <TrattoriaHero />

      {/* 2. Italian Wisdom Ticker */}
      <ItalianQuotes />

      {/* 3. Benefits - What's on the Table */}
      <TrattoriaBenefits />

      {/* 4. How It Works - The Recipe */}
      <TrattoriaHowItWorks />

      {/* 5. Roles - Everyone at the Table */}
      <TrattoriaRoles />

      {/* 6. Final CTA - Join the Family */}
      <section className="py-20 bg-gradient-to-b from-[#FFF8F0] to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-checkered opacity-20" />

        <div className="container relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="text-6xl mb-6">🍷</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#3D2817] mb-6">
              {t('finalCtaTitle')}
            </h2>
            <p className="text-xl text-[#6C5B4D] mb-8 leading-relaxed">
              {t('finalCtaSubtitle')}
            </p>

            <div className="inline-block bg-white/90 backdrop-blur-sm px-8 py-6 rounded-2xl border-2 border-[#D62828] shadow-2xl">
              <p className="text-[#3D2817] text-lg italic">
                "{t('finalCtaQuote')}"
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
