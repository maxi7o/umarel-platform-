'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSearch, UserCheck, FileText, ArrowRight } from 'lucide-react';

export default function AuditHubPage() {
    const t = useTranslations('audit');

    return (
        <div className="container mx-auto max-w-5xl px-4 py-16 flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-amber-100/50 text-amber-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-amber-200">
                    <span className="text-lg">🧐</span> Solo para Entendidos
                </div>
                <h1 className="text-4xl md:text-5xl font-bold font-outfit text-stone-900 mb-4 tracking-tight">
                    {t('title')}
                </h1>
                <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                    {t('subtitle')}
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 w-full">
                {/* Audit Requests */}
                <Link href="/browse?type=requests" className="group">
                    <Card className="h-full hover:shadow-lg hover:border-amber-400 transition-all cursor-pointer border-2 border-stone-200 bg-white">
                        <CardContent className="p-6 flex flex-col items-center text-center h-full">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FileText className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 mb-2">{t('requests')}</h3>
                            <p className="text-stone-500 text-sm mb-6 flex-grow">
                                Revisá si los pedidos están bien explicados y sugerí mejoras.
                            </p>
                            <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 w-full group-hover:bg-blue-600 group-hover:text-white transition-all">
                                Auditar <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>

                {/* Audit Quotes (Via Requests) */}
                <Link href="/browse?type=requests" className="group">
                    <Card className="h-full hover:shadow-lg hover:border-amber-400 transition-all cursor-pointer border-2 border-stone-200 bg-white">
                        <CardContent className="p-6 flex flex-col items-center text-center h-full">
                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FileSearch className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 mb-2">{t('quotes')}</h3>
                            <p className="text-stone-500 text-sm mb-6 flex-grow">
                                Entrá a los pedidos y opiná sobre los presupuestos recibidos.
                            </p>
                            <Button variant="ghost" className="text-emerald-600 hover:bg-emerald-50 w-full group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                Auditar <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>

                {/* Audit Profiles */}
                <Link href="/browse?type=offerings" className="group">
                    <Card className="h-full hover:shadow-lg hover:border-amber-400 transition-all cursor-pointer border-2 border-stone-200 bg-white">
                        <CardContent className="p-6 flex flex-col items-center text-center h-full">
                            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <UserCheck className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 mb-2">{t('offerings')}</h3>
                            <p className="text-stone-500 text-sm mb-6 flex-grow">
                                Validá perfiles profesionales y su reputación.
                            </p>
                            <Button variant="ghost" className="text-purple-600 hover:bg-purple-50 w-full group-hover:bg-purple-600 group-hover:text-white transition-all">
                                Auditar <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
