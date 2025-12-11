"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function DigitalPiazza() {
    const t = useTranslations('landing');

    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-stone-50 dark:bg-stone-950 selection:bg-orange-200 selection:text-orange-900">

            {/* Ambient Background - The "Noise" and "Glow" */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-200/20 dark:bg-orange-900/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-overlay animate-float" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-overlay animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[url('/grid-noise.png')] opacity-[0.03] dark:opacity-[0.05]" />
                {/* Note: grid-noise is hypothetical, standard CSS grain implies it */}
            </div>

            <div className="container relative z-10 px-6 max-w-5xl mx-auto text-center">

                {/* Avant-Garde Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-black/30 backdrop-blur-sm text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-400">
                    <Sparkles className="w-3 h-3 text-orange-500" />
                    <span>The Renaissance of Service</span>
                </div>

                {/* Main Typography - Italian Style */}
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-stone-900 dark:text-stone-50 leading-[0.9] tracking-tight mb-8">
                    <span className="block italic font-light text-stone-400 dark:text-stone-600 text-4xl md:text-6xl mb-2">
                        Il Digital
                    </span>
                    Piazza
                </h1>

                <p className="max-w-2xl mx-auto text-xl md:text-2xl text-stone-600 dark:text-stone-300 font-light leading-relaxed mb-12">
                    Where avant-garde technology meets the
                    <span className="italic font-serif mx-2 text-stone-800 dark:text-stone-100">classic wisdom</span>
                    of the neighborhood. Connect with local experts, guided by AI.
                </p>

                {/* The "Portal" - Interaction Layer */}
                <div className="relative group max-w-md mx-auto">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-amber-200 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                    <div className="relative p-1 bg-stone-100 dark:bg-stone-900 rounded-2xl ring-1 ring-stone-900/5 dark:ring-white/10 shadow-xl">
                        <div className="flex gap-2">
                            <Link href="/requests/create" className="flex-1">
                                <Button size="lg" className="w-full h-14 bg-stone-900 dark:bg-white text-stone-50 dark:text-stone-900 hover:bg-orange-600 dark:hover:bg-orange-200 text-lg font-medium font-sans">
                                    Start a Project
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/browse">
                                <Button size="lg" variant="ghost" className="h-14 px-6 text-stone-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-200">
                                    <MapPin className="w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-3 text-sm text-stone-400">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            12 Umarels Active
                        </span>
                        <span>•</span>
                        <span>Buenos Aires Region</span>
                    </div>
                </div>

            </div>

            {/* Renaissance Decor - Bottom */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-stone-50 dark:from-stone-950 to-transparent z-10" />

        </section>
    );
}
