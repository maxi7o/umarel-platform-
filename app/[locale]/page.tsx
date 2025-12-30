import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
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

      {/* 3. Ecosystem Infographic - The "Table" */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50/30 skew-x-12 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-50/30 -skew-x-12 -translate-x-1/2 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-serif mb-4 text-gray-900">{t('rolesTitle')}</h2>
            <p className="text-lg text-gray-500">{t('rolesSubtitle')}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* The Seeker (Client) */}
            <div className="group relative bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-200/80 transition-all duration-300 hover:-translate-y-1">
              <div className="h-14 w-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 font-serif">{t('roleClientTitle')}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t('roleClientDesc')}
              </p>
              <ul className="space-y-3 text-sm text-gray-500 mb-8">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" /> {t('roleClientBenefit1')}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" /> {t('roleClientBenefit2')}</li>
              </ul>
              <div className="pt-6 border-t border-gray-100">
                <Link href="/requests/create">
                  <span className="text-blue-600 fo font-semibold flex items-center group-hover:gap-2 transition-all">
                    {t('roleClientAction')} <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>

            {/* The Umarel (Middleman/Verifier) - Featured */}
            <div className="group relative bg-gray-900 text-white p-8 rounded-3xl shadow-2xl shadow-orange-900/20 transform lg:-translate-y-4 border border-gray-800">
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{t('roleUmarelBadge')}</span>
              </div>
              <div className="h-14 w-14 bg-white/10 text-orange-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 font-serif text-white">{t('roleUmarelTitle')}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {t('roleUmarelDesc')}
              </p>
              <ul className="space-y-3 text-sm text-gray-400 mb-8">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-orange-500" /> {t('roleUmarelBenefit1')}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-orange-500" /> {t('roleUmarelBenefit2')}</li>
              </ul>
              <div className="pt-6 border-t border-gray-800">
                <span className="text-orange-400 font-semibold flex items-center group-hover:gap-2 transition-all cursor-not-allowed opacity-70">
                  {t('roleUmarelAction')} <span className="text-xs ml-2 text-gray-500">({t('soon')})</span>
                </span>
              </div>
            </div>

            {/* The Creator (Provider) */}
            <div className="group relative bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-200/80 transition-all duration-300 hover:-translate-y-1">
              <div className="h-14 w-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 font-serif">{t('roleProviderTitle')}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t('roleProviderDesc')}
              </p>
              <ul className="space-y-3 text-sm text-gray-500 mb-8">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> {t('roleProviderBenefit1')}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> {t('roleProviderBenefit2')}</li>
              </ul>
              <div className="pt-6 border-t border-gray-100">
                <Link href="/create-offering">
                  <span className="text-green-600 font-semibold flex items-center group-hover:gap-2 transition-all">
                    {t('roleProviderAction')} <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
