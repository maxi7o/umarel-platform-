'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Hammer, Search, HelpCircle, ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function GuidePage() {
    const t = useTranslations('guide');

    const roles = [
        {
            key: 'seeker',
            icon: Search,
            color: 'text-blue-500',
            bg: 'bg-blue-50 border-blue-100'
        },
        {
            key: 'creator',
            icon: Hammer,
            color: 'text-orange-500',
            bg: 'bg-orange-50 border-orange-100'
        },
        {
            key: 'umarel',
            icon: ShieldCheck,
            color: 'text-green-500',
            bg: 'bg-green-50 border-green-100'
        }
    ];

    return (
        <div className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-16">

                {/* Hero */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 font-outfit">
                        {t('title')}
                    </h1>
                    <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                    <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-sm max-w-3xl mx-auto mt-6">
                        <p className="text-stone-700 italic">
                            "{t('intro')}"
                        </p>
                    </div>
                </div>

                {/* Roles Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {roles.map((role) => (
                        <Card key={role.key} className={`h-full border-2 ${role.bg} hover:shadow-lg transition-shadow duration-300`}>
                            <CardHeader>
                                <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm ${role.color}`}>
                                    <role.icon size={24} />
                                </div>
                                <CardTitle className="text-xl">{t(`roles.${role.key}.title`)}</CardTitle>
                                <CardDescription className="text-base text-stone-600">
                                    {t(`roles.${role.key}.desc`)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-stone-900">{t(`roles.${role.key}.step1`)}</h4>
                                    <p className="text-sm text-stone-600">{t(`roles.${role.key}.step1Desc`)}</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-stone-900">{t(`roles.${role.key}.step2`)}</h4>
                                    <p className="text-sm text-stone-600">{t(`roles.${role.key}.step2Desc`)}</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-stone-900">{t(`roles.${role.key}.step3`)}</h4>
                                    <p className="text-sm text-stone-600">{t(`roles.${role.key}.step3Desc`)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* FAQ - Using Native Details/Summary for simplicity and accessibility */}
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="flex items-center gap-3 justify-center text-stone-800">
                        <HelpCircle className="w-8 h-8 text-stone-400" />
                        <h2 className="text-3xl font-bold">{t('faq.title')}</h2>
                    </div>

                    <div className="space-y-4">
                        {['q1', 'q2', 'q3'].map((q) => (
                            <details key={q} className="group bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none text-lg font-medium text-stone-800 group-open:bg-stone-50 transition-colors">
                                    {t(`faq.${q}`)}
                                    <ChevronDown className="w-5 h-5 text-stone-400 transition-transform group-open:rotate-180" />
                                </summary>
                                <div className="px-6 pb-6 pt-2 text-stone-600">
                                    {t(`faq.${q.replace('q', 'a')}` as any)}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center py-12">
                    <Link href="/requests/create">
                        <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-6 h-auto rounded-full shadow-lg hover:shadow-xl transition-all">
                            {t('cta')}
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}
