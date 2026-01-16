import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/landing/hero-section';
import { TrustSection } from '@/components/landing/trust-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { MobileDemos } from '@/components/landing/mobile-demos';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { FaqSection } from '@/components/landing/faq-section';
import { CtaSection } from '@/components/landing/cta-section';

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('maintenance');

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-stone-950 text-white p-4 text-center">
      <div className="max-w-md space-y-8">
        {/* Logo or Icon */}
        <div className="w-24 h-24 bg-orange-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold font-outfit tracking-tight">
          Estamos Mejorando
        </h1>

        <p className="text-stone-400 text-lg">
          Estamos renovando nuestra plataforma para brindarte una mejor experiencia.
          <br />
          <span className="text-white font-medium">Volvemos pronto.</span>
        </p>

        <div className="pt-8 text-sm text-stone-600">
          &copy; {new Date().getFullYear()} Umarel
        </div>
      </div>
    </div>
  );
}
