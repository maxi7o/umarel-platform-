
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const t = useTranslations('home');

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans selection:bg-orange-100 selection:text-orange-900">

      {/* 1. Hero Section - Streamlined */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-6 text-center z-10 relative">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-gray-900">
            {t('heroTitle1')} <br className="hidden md:block" />
            <span className="text-orange-600">{t('heroTitleHighlight')}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/requests/create">
              <Button size="lg" className="h-14 px-8 text-lg bg-gray-900 hover:bg-black text-white rounded-full shadow-lg hover:shadow-xl transition-all">
                {t('postRequest')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-gray-300 hover:bg-gray-50">
                {t('browseServices')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Abstract Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-orange-100/50 to-blue-50/50 rounded-full blur-3xl -z-10 opacity-60" />
      </section>

      {/* 2. Brand Definition - The "Umarel" (Requested Content) */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="text-orange-600 font-bold tracking-widest uppercase text-sm mb-4 block">{t('originLabel')}</span>
          <blockquote className="text-2xl md:text-3xl font-serif text-gray-800 leading-normal mb-8">
            {t('originQuote')}
          </blockquote>
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            {t('originSource')}
          </div>
        </div>
      </section>

      {/* 3. Value Props - Simple Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{t('prop1Title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('prop1Desc')}
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{t('prop2Title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('prop2Desc')}
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-4">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{t('prop3Title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('prop3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
