"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function TrattoriaHero() {
    const t = useTranslations('landing');

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#fafafa]">

            {/* The Tablecloth Background */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(45deg, #C41E3A 25%, transparent 25%, transparent 75%, #C41E3A 75%, #C41E3A),
                        linear-gradient(45deg, #C41E3A 25%, transparent 25%, transparent 75%, #C41E3A 75%, #C41E3A)
                     `,
                    backgroundPosition: '0 0, 20px 20px',
                    backgroundSize: '40px 40px'
                }}
            />
            {/* Soft Overlay to make text readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white/95 z-0" />


            {/* Content Container */}
            <div className="container relative z-10 px-6 max-w-6xl mx-auto flex flex-col items-center text-center">

                {/* The "Menu Header" */}
                <div className="mb-6 rotate-[-2deg]">
                    <span className="font-hand text-4xl md:text-5xl text-trattoria-red font-bold tracking-wider">
                        Benvenuti a
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black font-sans text-stone-900 leading-[0.9] mt-2 tracking-tighter shadow-sm">
                        UMAREL<span className="text-orange-600">.ORG</span>
                    </h1>
                </div>

                {/* The Scene: Old Man + Construction (INVERTED/MIRRORED) */}
                <div className="relative w-full max-w-2xl h-[400px] mb-12 group perspective-1000">
                    {/* The "Polaroid" */}
                    <div className="relative w-full h-full bg-white p-4 shadow-2xl rotate-2 transform transition-transform duration-500 hover:rotate-0 hover:scale-[1.02] border border-stone-200">
                        <div className="absolute -top-6 -right-6 z-20"> {/* Inverted sticker position */}
                            {/* Tape / Sticker */}
                            <div className="bg-yellow-200/80 w-32 h-10 rotate-[15deg] shadow-sm flex items-center justify-center font-hand text-stone-700 font-bold">
                                Work in Progress 🚧
                            </div>
                        </div>

                        {/* Content wrapper with Horizontal Flip to "Invert" the scene */}
                        <div className="w-full h-full bg-stone-100 overflow-hidden relative rounded-sm border border-stone-100 transform scale-x-[-1]">
                            <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-stone-200 flex items-end justify-center">
                                {/* Construction Site Background (Abstract) */}
                                <div className="w-full h-1/2 bg-stone-300 relative">
                                    <div className="absolute bottom-0 left-10 w-20 h-40 bg-orange-400/20" /> {/* Crane base */}
                                    <div className="absolute bottom-10 right-20 w-32 h-32 bg-stone-400/20 rotate-45" /> {/* Debris */}
                                </div>
                            </div>
                            {/* The Umarel */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-[150px] drop-shadow-2xl filter contrast-125">
                                👴
                            </div>
                            <div className="absolute bottom-8 right-10 text-6xl animate-bounce delay-700">
                                🍝
                            </div>
                        </div>

                        {/* Wine Stain */}
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full border-[12px] border-red-900/10 blur-sm pointer-events-none mix-blend-multiply" />
                    </div>
                </div>

                {/* Engaging Quote */}
                <p className="font-hand text-3xl md:text-4xl text-stone-600 mb-10 max-w-2xl leading-relaxed rotate-1">
                    "Helping you build better, one plate of pasta at a time.
                    <br />
                    <span className="text-orange-600 font-bold">Capisci?</span>"
                </p>

                {/* CTAs - Menu Style */}
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <Link href="/requests/create">
                        <Button size="lg" className="h-16 px-10 text-xl font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xl hover:shadow-2xl border-4 border-white transform transition hover:-translate-y-1">
                            Ordina un Projecto 🏗️
                        </Button>
                    </Link>
                    <Link href="/browse">
                        <Button size="lg" variant="outline" className="h-16 px-10 text-xl font-hand font-bold text-stone-600 hover:text-orange-600 border-2 border-dashed border-stone-300 hover:border-orange-300 bg-white/50">
                            Browse the Menu 🍕
                        </Button>
                    </Link>
                </div>

            </div>

            {/* Side Banners (Italian Food) */}
            {/* Left Banner: Pizza */}
            <div className="absolute left-0 top-1/4 transform -translate-x-1/2 rotate-12 opacity-80 pointer-events-none grayscale-[0.2] hover:grayscale-0 transition duration-700">
                <div className="text-[200px]">🍕</div>
            </div>
            {/* Right Banner: Spaghetti */}
            <div className="absolute right-0 bottom-1/4 transform translate-x-[30%] -rotate-12 opacity-80 pointer-events-none grayscale-[0.2] hover:grayscale-0 transition duration-700">
                <div className="text-[250px]">🍝</div>
            </div>

            {/* Grease Stains Decoration */}
            <div className="absolute top-20 left-10 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />
            <div className="absolute bottom-40 right-10 w-60 h-60 bg-red-600/5 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />

        </section>
    );
}
