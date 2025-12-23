
import { TrustHero } from '@/components/landing/trust-hero';
import { SiteSafetyTips } from '@/components/landing/site-safety-tips';
import { useTranslations } from 'next-intl';

export default function LandingPage() {
  const t = useTranslations('landing');

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">

      {/* 1. Hero Section (Construction Site Vibe) */}
      <TrustHero />

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
          <div className="group bg-card p-8 rounded-xl border border-border shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
              👷
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">{t('roles.client.title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('roles.client.description')}
            </p>
          </div>

          {/* Role 2: The Maker */}
          <div className="group bg-card p-8 rounded-xl border border-border shadow-sm hover:shadow-xl hover:border-accent/50 transition-all duration-300">
            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
              🔨
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">{t('roles.builder.title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('roles.builder.description')}
            </p>
          </div>

          {/* Role 3: The Umarel */}
          <div className="group bg-card p-8 rounded-xl border border-border shadow-sm hover:shadow-xl hover:border-r-4 hover:border-r-primary transition-all duration-300">
            <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
              👴
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">{t('roles.umarel.title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('roles.umarel.description')}
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}

