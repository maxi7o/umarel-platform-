
import { DigitalPiazza } from '@/components/landing/digital-piazza';
import { RotatingQuotes } from '@/components/landing/rotating-quotes';
import { useTranslations } from 'next-intl';

export default function LandingPage() {
  const t = useTranslations('landing');

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">

      {/* 1. Digital Piazza Hero */}
      <DigitalPiazza />

      {/* 2. Philosophy / Wisdom Section (The Rotating Quotes) */}
      <section className="py-24 border-y border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-sm font-serif italic text-stone-400 mb-8 uppercase tracking-widest">
            Wisdom of the Ages
          </h3>
          <RotatingQuotes />
        </div>
      </section>

      {/* 3. The Three Pillars (Restyled) */}
      <section className="py-32 container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">

          {/* Pillar 1 */}
          <div className="group text-center">
            <div className="w-full h-64 mb-6 bg-stone-200 dark:bg-stone-900 rounded-t-[10rem] rounded-b-lg overflow-hidden relative">
              {/* Placeholder for "Classic Art" style image */}
              <div className="absolute inset-0 bg-stone-300 dark:bg-stone-800 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/20 transition duration-500" />
              <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 grayscale group-hover:grayscale-0 transition duration-500">
                🏛️
              </div>
            </div>
            <h3 className="text-3xl font-serif mb-4 text-stone-900 dark:text-stone-50 group-hover:text-orange-600 transition">
              The Client
            </h3>
            <p className="text-stone-600 dark:text-stone-400 font-light leading-relaxed">
              Start a project with clarity. Our AI breaks down complexity into artisan slices.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="group text-center mt-12 md:mt-0">
            <div className="w-full h-64 mb-6 bg-stone-200 dark:bg-stone-900 rounded-t-[10rem] rounded-b-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-stone-300 dark:bg-stone-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition duration-500" />
              <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 grayscale group-hover:grayscale-0 transition duration-500">
                ⚒️
              </div>
            </div>
            <h3 className="text-3xl font-serif mb-4 text-stone-900 dark:text-stone-50 group-hover:text-blue-600 transition">
              The Maker
            </h3>
            <p className="text-stone-600 dark:text-stone-400 font-light leading-relaxed">
              Local experts providing verified craftsmanship. Guaranteed via secure escrow.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="group text-center mt-24 md:mt-0">
            <div className="w-full h-64 mb-6 bg-stone-200 dark:bg-stone-900 rounded-t-[10rem] rounded-b-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-stone-300 dark:bg-stone-800 group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/20 transition duration-500" />
              <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 grayscale group-hover:grayscale-0 transition duration-500">
                👴
              </div>
            </div>
            <h3 className="text-3xl font-serif mb-4 text-stone-900 dark:text-stone-50 group-hover:text-yellow-600 transition">
              The Umarel
            </h3>
            <p className="text-stone-600 dark:text-stone-400 font-light leading-relaxed">
              The wise observer. Providing feedback, ensuring quality, and earning Aura.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
