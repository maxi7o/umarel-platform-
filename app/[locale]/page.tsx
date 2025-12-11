import { TrattoriaHero } from '@/components/landing/trattoria-hero';
import { RotatingQuotes } from '@/components/landing/rotating-quotes';
import { useTranslations } from 'next-intl';

export default function LandingPage() {
  const t = useTranslations('landing');

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* 1. Trattoria Hero (Dinner Table Vibe) */}
      <TrattoriaHero />

      {/* 2. Engaging Italian Phrases */}
      <section className="py-20 border-y-4 border-double border-red-100 bg-orange-50/50">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-hand font-bold text-stone-500 mb-8 -rotate-1">
            Words of Wisdom from Nonno
          </h3>
          <RotatingQuotes />
        </div>
      </section>

      {/* 3. The Pillars (Menu Cards) */}
      <section className="py-32 container mx-auto px-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[url('/pizza-slice-bg.svg')] opacity-5 pointer-events-none" />

        <div className="grid md:grid-cols-3 gap-12">

          {/* Pillar 1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-stone-100 hover:shadow-2xl transition-all transform hover:-rotate-1">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">
              👷
            </div>
            <h3 className="text-2xl font-bold mb-4 text-stone-800 text-center">
              The Client
            </h3>
            <p className="text-stone-600 text-center font-hand text-xl">
              Sit down, relax. Tell us what you need built, and we serve you the best slices.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-stone-100 hover:shadow-2xl transition-all transform hover:rotate-1 mt-8 md:mt-0">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">
              🔨
            </div>
            <h3 className="text-2xl font-bold mb-4 text-stone-800 text-center">
              The Maker
            </h3>
            <p className="text-stone-600 text-center font-hand text-xl">
              Our chefs (providers) are masters of their craft. Quality ingredients only.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-stone-100 hover:shadow-2xl transition-all transform hover:-rotate-1 mt-8 md:mt-0">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">
              👴
            </div>
            <h3 className="text-2xl font-bold mb-4 text-stone-800 text-center">
              The Umarel
            </h3>
            <p className="text-stone-600 text-center font-hand text-xl">
              Watching over the shoulder to ensure your lasagna (project) is perfect.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
