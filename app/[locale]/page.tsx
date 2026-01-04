import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Hammer, ShieldCheck, Banknote } from 'lucide-react';

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 text-gray-900 font-sans selection:bg-orange-100 selection:text-orange-900">

      {/* 1. Hero Section - The "Command Center" Look */}{/* Origin Story Updated */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">

        {/* Background Gradients */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-slate-900 via-slate-900/5 to-transparent -z-20" />
        <div className="absolute top-0 right-0 w-1/2 h-[800px] bg-blue-500/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center z-10 relative">

          {/* Left: Copy */}
          <div className="text-left space-y-8">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 font-outfit leading-[1.1]">
              {t('heroTitle1')} <br />
              <span className="text-orange-600 relative inline-block">
                {t('heroTitleHighlight')}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-orange-200/50 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
                </svg>
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link href="/requests/create">
                <Button size="lg" className="h-14 px-8 text-lg bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg hover:shadow-orange-500/30 transition-all font-outfit">
                  {t('postRequest')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/browse">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-gray-300 hover:bg-gray-50 font-outfit bg-white/50 backdrop-blur">
                  {t('browseServices')}
                </Button>
              </Link>
            </div>

// 1-10 are implicitly handled by the replacements below.

            {/* Trust Badge */}
            <div className="flex items-center gap-4 text-sm text-stone-500 font-medium">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-orange-200 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white" />
              </div>
              <span>{t('steps.trustedBy')}</span>
            </div>
          </div>

          {/* Right: The "Visual Handshake" Mockup */}
          <div className="hidden lg:block relative h-[600px] perspective-1000">
            <div className="relative w-full h-full transform rotate-y-[-6deg] rotate-x-[4deg] transition-transform duration-1000">
              {/* Floating Timeline Visual */}

              {/* Step 1: Defined (Dimmed) */}
              <div className="absolute top-10 left-10 right-10 bg-white rounded-xl shadow-lg border border-stone-100 p-5 flex gap-4 items-center opacity-70 scale-95 origin-top">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100 shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="text-base font-bold text-stone-800 font-outfit">{t('steps.stage1.title')}</div>
                  <div className="text-sm text-stone-500">{t('steps.stage1.desc')}</div>
                </div>
                <div className="ml-auto text-green-600 font-bold">$0.00</div>
              </div>

              {/* Connection */}
              <div className="absolute top-[5rem] left-[3.9rem] w-0.5 h-16 bg-stone-200" />

              {/* Step 2: In Progress (Active/Highlight) */}
              <div className="absolute top-32 left-0 right-0 bg-white rounded-xl shadow-2xl border-l-4 border-l-blue-600 p-6 flex gap-4 items-center z-20 scale-105">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 animate-pulse shrink-0">
                  <Hammer size={28} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-stone-900 font-outfit">{t('steps.stage2.title')}</h3>
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{t('steps.stage2.badge')}</span>
                  </div>
                  <div className="text-sm text-stone-500 mt-1">{t('steps.stage2.desc')}</div>

                  {/* Progress Bar Mock */}
                  <div className="w-full bg-stone-100 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-blue-600 w-3/4 h-full rounded-full" />
                  </div>
                </div>
              </div>

              {/* Connection */}
              <div className="absolute top-[12rem] left-[3.9rem] w-0.5 h-24 bg-stone-200" />

              {/* Step 3: Verify (Future) */}
              <div className="absolute top-80 left-10 right-10 bg-white/80 backdrop-blur-sm rounded-xl border border-dashed border-stone-300 p-5 flex gap-4 items-center opacity-60">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div className="text-base font-bold text-stone-600 font-outfit">{t('steps.stage3.title')}</div>
                  <div className="text-sm text-stone-400">{t('steps.stage3.desc')}</div>
                </div>
                <div className="ml-auto text-stone-400 font-bold">$450.00</div>
              </div>

              {/* Floater: Escrow Shield */}
              <div className="absolute -bottom-10 -right-10 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl shadow-blue-900/50 flex gap-3 items-center max-w-[200px] animate-bounce duration-[3000ms]">
                <Banknote className="text-green-400" size={32} />
                <div className="text-xs">
                  <div className="font-bold text-green-400">{t('steps.floater.title')}</div>
                  <div className="opacity-80">{t('steps.floater.desc')}</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Definition */}
      <section className="py-24 bg-white border-y border-stone-100">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="text-orange-600 font-bold tracking-widest uppercase text-sm mb-4 block font-outfit">{t('originLabel')}</span>
          <blockquote className="text-3xl md:text-4xl font-serif text-slate-900 leading-tight mb-8">
            {t('originQuote')}
          </blockquote>
          <div className="flex items-center justify-center gap-2 text-stone-500 text-sm font-medium">
            {t('originSource')}
          </div>
        </div>
      </section>

      {/* 3. Ecosystem Infographic */}
      <section className="py-24 bg-stone-50 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-outfit mb-4 text-slate-900">{t('rolesTitle')}</h2>
            <p className="text-lg text-stone-500">{t('rolesSubtitle')}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* Client */}
            <div className="group relative bg-white p-8 rounded-[2rem] border border-stone-100 shadow-xl shadow-stone-200/50 hover:shadow-2xl hover:shadow-stone-200/80 transition-all duration-300 hover:-translate-y-2">
              <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 font-outfit text-slate-900">{t('roleClientTitle')}</h3>
              <p className="text-stone-600 mb-8 leading-relaxed">
                {t('roleClientDesc')}
              </p>
              <div className="pt-6 border-t border-stone-100">
                <Link href="/requests/create">
                  <span className="text-blue-600 font-bold flex items-center group-hover:gap-2 transition-all">
                    {t('roleClientAction')} <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Umarel */}
            <div className="group relative bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-2xl shadow-slate-900/20 hover:shadow-slate-900/30 transition-all duration-300 hover:-translate-y-2 -mt-4 lg:-mt-8">
              <div className="h-16 w-16 bg-orange-500/10 text-orange-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-orange-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 font-outfit text-white">{t('roleUmarelTitle')}</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                {t('roleUmarelDesc')}
              </p>
              <div className="pt-6 border-t border-slate-800">
                <Link href="/browse">
                  <span className="text-orange-400 font-bold flex items-center group-hover:gap-2 transition-all">
                    {t('roleUmarelAction')} <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Creator */}
            <div className="group relative bg-white p-8 rounded-[2rem] border border-stone-100 shadow-xl shadow-stone-200/50 hover:shadow-2xl hover:shadow-stone-200/80 transition-all duration-300 hover:-translate-y-2">
              <div className="h-16 w-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 font-outfit text-slate-900">{t('roleProviderTitle')}</h3>
              <p className="text-stone-600 mb-8 leading-relaxed">
                {t('roleProviderDesc')}
              </p>
              <div className="pt-6 border-t border-stone-100">
                <Link href="/create-offering">
                  <span className="text-green-600 font-bold flex items-center group-hover:gap-2 transition-all">
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
