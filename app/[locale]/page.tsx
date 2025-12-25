
import { TrustHero } from '@/components/landing/trust-hero';
import { SiteSafetyTips } from '@/components/landing/site-safety-tips';
import { ItalianQuotes } from '@/components/landing/italian-quotes';
import { Manifesto } from '@/components/landing/manifesto';
import { useTranslations } from 'next-intl';

export default function LandingPage() {
  const t = useTranslations('landing');

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">

      {/* 1. Hero Section (Construction Site Vibe) */}
      <TrustHero />

      {/* 2. Italian Wisdom Ticker */}
      <ItalianQuotes />

      {/* 2. Safety / Wisdom Section */}
      <section className="py-16 bg-muted/50 border-y border-border">
        <div className="container mx-auto px-6">
          <SiteSafetyTips />
        </div>
      </section>

      {/* 3. The Crew (Roles) */}
      <section className="py-24 container mx-auto px-6 relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="grid md:grid-cols-3 gap-8 relative z-10">

          {/* Role 1: The Client */}
          <div className="group bg-white p-8 rounded-xl border border-stone-200 shadow-lg relative overflow-hidden transform transition-all duration-300 hover:-translate-y-2">
            {/* ID Badge Hole */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-stone-100 border border-stone-300 rounded-full" />
            <div className="w-14 h-14 bg-blue-50 border-2 border-blue-100 rounded-lg flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
              👷
            </div>
            <h3 className="text-2xl font-bold mb-3 text-stone-900">{t('roles.client.title')}</h3>
            <p className="text-stone-500 leading-relaxed">
              {t('roles.client.description')}
            </p>
          </div>

          {/* Role 2: The Maker */}
          <div className="group bg-white p-8 rounded-xl border border-stone-200 shadow-lg relative overflow-hidden transform transition-all duration-300 hover:-translate-y-2">
            {/* ID Badge Hole */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-stone-100 border border-stone-300 rounded-full" />
            <div className="w-14 h-14 bg-orange-50 border-2 border-orange-100 rounded-lg flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
              🔨
            </div>
            <h3 className="text-2xl font-bold mb-3 text-stone-900">{t('roles.builder.title')}</h3>
            <p className="text-stone-500 leading-relaxed">
              {t('roles.builder.description')}
            </p>
          </div>

          {/* Role 3: The Umarel */}
          <div className="group bg-white p-8 rounded-xl border border-stone-200 shadow-lg relative overflow-hidden transform transition-all duration-300 hover:-translate-y-2">
            {/* ID Badge Hole */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-stone-100 border border-stone-300 rounded-full" />
            <div className="w-14 h-14 bg-yellow-50 border-2 border-yellow-100 rounded-lg flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
              👴
            </div>
            <h3 className="text-2xl font-bold mb-3 text-stone-900">{t('roles.umarel.title')}</h3>
            <p className="text-stone-500 leading-relaxed">
              {t('roles.umarel.description')}
            </p>
          </div>

        </div>
      </section>

      {/* 4. Manifesto Section */}
      <Manifesto />

    </div>
  );
}

