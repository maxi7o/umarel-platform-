
'use client';

import { DollarSign, ShieldCheck, Trophy, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ManifestoPage() {
    return (
        <div className="min-h-screen bg-[#fffdf5] font-sans">

            {/* Hero */}
            <section className="py-24 container mx-auto px-6 max-w-4xl text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-full text-sm font-bold tracking-wide shadow-md mb-8">
                    <Heart className="w-4 h-4 text-orange-500 fill-orange-500" />
                    The Transparent Economy
                </div>
                <h1 className="text-5xl md:text-7xl font-heading font-bold text-stone-900 mb-6">
                    A Marketplace Owned by <span className="text-orange-600">Truth</span>.
                </h1>
                <p className="text-xl md:text-2xl text-stone-600 leading-relaxed">
                    Most platforms take fees to fund corporate profits. <br />
                    We take fees to fund <strong>quality, safety, and community</strong>.
                </p>
            </section>

            {/* The Breakdown */}
            <section className="py-16 bg-white border-y border-stone-100">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold font-heading">The Breakdown</h2>

                            {/* Item 1 */}
                            <div className="flex gap-6">
                                <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-stone-400 shrink-0">12%</div>
                                <div>
                                    <h3 className="text-xl font-bold text-stone-900 mb-2">Platform Operations</h3>
                                    <p className="text-stone-500 leading-relaxed">
                                        Server costs, AI development, payment processing, and insurance. This keeps the lights on and the tools sharp.
                                    </p>
                                </div>
                            </div>

                            {/* Item 2 */}
                            <div className="flex gap-6 relative">
                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-transparent rounded-full opacity-50" />
                                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-orange-600 shrink-0 border border-orange-200">3%</div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-stone-900">The Community Share</h3>
                                        <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold uppercase rounded">Dividend</span>
                                    </div>
                                    <p className="text-stone-500 leading-relaxed">
                                        This doesn't go to us. It goes to <strong>you</strong>.
                                        <br />
                                        It funds the "Umarel Pool", distributed weekly to members who perform audits, resolve disputes, and maintain high Aura scores.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Visual */}
                        <div className="bg-stone-50 p-8 rounded-3xl border border-stone-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-orange-100 rounded-full blur-3xl opacity-50 -mr-16 -mt-16" />
                            <h3 className="text-lg font-bold text-stone-400 uppercase tracking-widest mb-6 text-center">Weekly Distribution Example</h3>

                            <div className="space-y-3">
                                {[
                                    { user: 'Maria (Guide)', score: 98, pay: '$45,000' },
                                    { user: 'Carlos (Inspector)', score: 85, pay: '$32,500' },
                                    { user: 'Ana (Translator)', score: 72, pay: '$18,000' },
                                ].map((u, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-stone-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-stone-200" />
                                            <span className="font-semibold text-stone-900">{u.user}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-stone-400">Score: {u.score}</div>
                                            <div className="font-bold text-green-600">{u.pay}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-center text-xs text-stone-400 mt-6">Based on last week's active pool</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 container mx-auto px-6 max-w-4xl text-center">
                <h2 className="text-3xl font-bold font-heading mb-6">Ready to earn Trust?</h2>
                <div className="flex justify-center gap-4">
                    <Link href="/browse">
                        <Button size="lg" className="bg-stone-900 text-white rounded-xl px-8 h-12">Browse Opportunities</Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
