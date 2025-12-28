
import { TrustHero } from '@/components/landing/trust-hero';
import { ValueProposition } from '@/components/landing/value-proposition';
import { ItalianQuotes } from '@/components/landing/italian-quotes';
import { Manifesto } from '@/components/landing/manifesto';
import { useTranslations } from 'next-intl';

export default function LandingPage() {
  const t = useTranslations('landing');

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-orange-100 selection:text-orange-900">

      {/* 1. Hero Section (New Brand) */}
      <TrustHero />

      {/* 2. Italian Wisdom Ticker */}
      <ItalianQuotes />

      {/* 3. The Economic Engine (Values) */}
      <ValueProposition />

      {/* 4. Roles Section (Updated Visuals) */}
      <section className="py-24 container mx-auto px-6 relative overflow-hidden">

        <div className="text-center mb-16">
          <h2 className="text-3xl font-heading font-bold mb-4">Who makes this ecosystem work?</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative z-10">

          {/* Role 1: The Client */}
          <div className="group bg-stone-50 p-8 rounded-3xl border border-stone-100 hover:bg-white hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 text-3xl shadow-sm">
              🔭
            </div>
            <h3 className="text-xl font-bold mb-3 text-stone-900">{t('roles.client.title')}</h3>
            <p className="text-stone-500 leading-relaxed text-sm">
              {t('roles.client.description')}
            </p>
          </div>

          {/* Role 2: The Maker */}
          <div className="group bg-stone-50 p-8 rounded-3xl border border-stone-100 hover:bg-white hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 text-3xl shadow-sm">
              🎨
            </div>
            <h3 className="text-xl font-bold mb-3 text-stone-900">{t('roles.builder.title')}</h3>
            <p className="text-stone-500 leading-relaxed text-sm">
              {t('roles.builder.description')}
            </p>
          </div>

          {/* Role 3: The Umarel */}
          <div className="group bg-stone-50 p-8 rounded-3xl border border-stone-100 hover:bg-white hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 text-3xl shadow-sm">
              🦉
            </div>
            <h3 className="text-xl font-bold mb-3 text-stone-900">{t('roles.umarel.title')}</h3>
            <p className="text-stone-500 leading-relaxed text-sm">
              {t('roles.umarel.description')}
            </p>
          </div>

        </div>
      </section>

      {/* 5. Manifesto Section */}
      <Manifesto />

    </div>
  );
}

