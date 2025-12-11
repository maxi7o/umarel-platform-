import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Users, Briefcase, Lightbulb, Heart, TrendingDown, Zap } from 'lucide-react';
import { RotatingQuotes } from '@/components/landing/rotating-quotes';
import { useTranslations } from 'next-intl';

export default function LandingPage() {
  const t = useTranslations('landing');

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Main Headline */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold font-outfit mb-6 bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
              {t('hero.subtitle1')}
              <br />
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {t('hero.subtitle2')}
              </span>
            </p>
            <div className="mt-10 flex justify-center">
              <Link href="/browse">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Umarel Caricature */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              {/* Placeholder for umarel caricature - replace with actual image */}
              <div className="w-64 h-64 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-full flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <div className="text-8xl mb-2">👴</div>
                  <p className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                    The Umarel
                  </p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-orange-400 rounded-full opacity-20 animate-pulse delay-75" />
            </div>
          </div>

          {/* Rotating Italian Quotes */}
          <div className="mb-16">
            <RotatingQuotes />
          </div>
        </div>
      </section>

      {/* Value Proposition Cards */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            {t('howItWorks')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Clients */}
            <Card className="border-2 border-blue-200 dark:border-blue-800 hover:shadow-2xl transition-shadow">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-4">
                  {t('clients.title')}
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  {t('clients.description')}
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <TrendingDown className="h-4 w-4" />
                  <span className="font-semibold">{t('clients.badge')}</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Providers */}
            <Card className="border-2 border-green-200 dark:border-green-800 hover:shadow-2xl transition-shadow">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-4">
                  {t('providers.title')}
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  {t('providers.description')}
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <Zap className="h-4 w-4" />
                  <span className="font-semibold">{t('providers.badge')}</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Umarels (Community) */}
            <Card className="border-2 border-orange-200 dark:border-orange-800 hover:shadow-2xl transition-shadow">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-4">
                  {t('umarels.title')}
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  {t('umarels.description')}
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                  <Heart className="h-4 w-4" />
                  <span className="font-semibold">{t('umarels.badge')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">{t('stats.savings')}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('stats.savingsLabel')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">{t('stats.free')}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('stats.freeLabel')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">{t('stats.daily')}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('stats.dailyLabel')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            {t('cta.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/requests/create">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all">
                {t('cta.postButton')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline" className="px-12 py-6 text-lg">
                {t('cta.browseButton')}
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            {t('cta.joinText')}
          </p>
        </div>
      </section>

      {/* Footer Spacer */}
      <div className="h-20" />
    </div>
  );
}
