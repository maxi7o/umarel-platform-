'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HardHat, Hammer, ArrowRight } from 'lucide-react';

export default function StartPage() {
    const t = useTranslations('start');

    return (
        <div className="container mx-auto max-w-5xl px-4 py-16 flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-outfit text-stone-900 mb-4 tracking-tight">
                    {t('title')}
                </h1>
                <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                    {t('subtitle')}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Option 1: Client / Request */}
                <Link href="/requests/create" className="group">
                    <Card className="h-full hover:shadow-xl hover:border-blue-400 transition-all cursor-pointer border-2 border-stone-200 bg-white group-hover:-translate-y-1">
                        <CardContent className="p-8 flex flex-col items-center text-center h-full">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <HardHat className="w-10 h-10 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-stone-900 mb-3">{t('request.title')}</h2>
                            <p className="text-stone-600 mb-8 text-lg leading-relaxed flex-grow">
                                {t('request.desc')}
                            </p>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 shadow-md shadow-blue-100">
                                {t('request.cta')} <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>

                {/* Option 2: Provider / Offering */}
                <Link href="/create-offering" className="group">
                    <Card className="h-full hover:shadow-xl hover:border-orange-400 transition-all cursor-pointer border-2 border-stone-200 bg-white group-hover:-translate-y-1">
                        <CardContent className="p-8 flex flex-col items-center text-center h-full">
                            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Hammer className="w-10 h-10 text-orange-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-stone-900 mb-3">{t('offering.title')}</h2>
                            <p className="text-stone-600 mb-8 text-lg leading-relaxed flex-grow">
                                {t('offering.desc')}
                            </p>
                            <Button variant="outline" className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800 text-lg py-6">
                                {t('offering.cta')} <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
