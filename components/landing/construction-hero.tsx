
"use client";

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { HardHat, Hammer, ArrowRight, Clipboard } from 'lucide-react';
import Link from 'next/link';

export function ConstructionHero() {
    const t = useTranslations('landing');

    return (
        <section className="relative bg-blueprint min-h-[90vh] flex items-center justify-center overflow-hidden border-b-4 border-primary">
            {/* Background overlay for better contrast if needed */}
            <div className="absolute inset-0 bg-background/50 dark:bg-background/80 backdrop-blur-[1px]" />

            {/* Construction Accents */}
            <div className="absolute top-0 left-0 w-full h-8 bg-black/10 flex items-center overflow-hidden">
                <div className="flex animate-marquee whitespace-nowrap gap-8 text-xs font-mono opacity-50 font-bold uppercase tracking-widest text-primary">
                    <span>Caution: Men at Work</span>
                    <span>///</span>
                    <span>Safety First</span>
                    <span>///</span>
                    <span>Inspection in Progress</span>
                    <span>///</span>
                    <span>Entendido Watching</span>
                    <span>///</span>
                    <span>Caution: Men at Work</span>
                    <span>///</span>
                    <span>Safety First</span>
                    <span>///</span>
                </div>
            </div>

            <div className="container relative mx-auto px-6 text-center z-10 flex flex-col items-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium text-sm mb-6 animate-fade-in-up">
                    <HardHat className="w-4 h-4" />
                    <span>Construction Season is Open</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-5xl md:text-7xl font-bold font-sans tracking-tight mb-6 max-w-4xl text-foreground">
                    <span className="text-primary inline-block transform -rotate-1 decoration-4">{t('hero.title')}</span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10 font-light leading-relaxed">
                    {t('hero.subtitle1')} <br className="hidden md:block" />
                    {t('hero.subtitle2')}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <Button
                        asChild
                        size="lg"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg h-14 rounded-xl shadow-xl shadow-primary/20"
                    >
                        <Link href="/post-request">
                            <Hammer className="mr-2 h-5 w-5" />
                            {t('cta.postButton')}
                        </Link>
                    </Button>

                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="w-full border-2 border-muted-foreground/20 hover:border-foreground/50 text-foreground font-semibold text-lg h-14 rounded-xl"
                    >
                        <Link href="/browse">
                            <Clipboard className="mr-2 h-5 w-5" />
                            {t('cta.browseButton')}
                        </Link>
                    </Button>
                </div>

                {/* Stats / Trust */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 pt-8 border-t border-border/50">
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-foreground">{t('stats.foundations')}</h3>
                        <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest mt-1">{t('stats.foundationsLabel')}</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-foreground">{t('stats.savings')}</h3>
                        <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest mt-1">{t('stats.savingsLabel')}</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-foreground">{t('stats.free')}</h3>
                        <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest mt-1">{t('stats.freeLabel')}</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-foreground">{t('stats.daily')}</h3>
                        <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest mt-1">{t('stats.dailyLabel')}</p>
                    </div>
                </div>

            </div>
        </section>
    );
}
