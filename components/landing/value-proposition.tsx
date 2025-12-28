
'use client';

import { DollarSign, ShieldCheck, Trophy, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ValueProposition() {
    return (
        <section className="py-24 bg-[#fffdf5] border-y border-stone-100">
            <div className="container mx-auto px-6 max-w-6xl">

                <div className="text-center mb-16 space-y-4">
                    <span className="text-orange-600 font-bold uppercase tracking-widest text-xs">The Transparent Economy</span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-stone-900">
                        Where does the money go?
                    </h2>
                    <p className="text-xl text-stone-500 max-w-2xl mx-auto">
                        We don't hide our fees. We share our success.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* 1. Platform Fee */}
                    <Card className="bg-white rounded-3xl border-none shadow-xl shadow-stone-200/50 overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-stone-200" />
                        <CardContent className="p-8 space-y-6">
                            <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                🏗️
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-stone-900 mb-2">12% Platform</h3>
                                <p className="text-stone-500 leading-relaxed">
                                    Invested into building the safest toolset in the market. Secure payments, AI dispute resolution, and 24/7 support.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. Community Dividend (The Hero) */}
                    <Card className="bg-white rounded-3xl border-2 border-orange-400 shadow-2xl shadow-orange-100 overflow-hidden relative transform md:-translate-y-4">
                        <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                            Community Owned
                        </div>
                        <CardContent className="p-8 space-y-6">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center text-4xl mb-4 text-orange-600">
                                🍯
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-stone-900 mb-2 flex items-center gap-2">
                                    3% <span className="text-orange-500">Dividend</span>
                                </h3>
                                <p className="text-stone-600 leading-relaxed text-lg">
                                    Every time a project succeeds, **3% of the value goes back to the community**. Helpful reviewers and experts earn cash, not just points.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. Provider Pay */}
                    <Card className="bg-white rounded-3xl border-none shadow-xl shadow-stone-200/50 overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
                        <CardContent className="p-8 space-y-6">
                            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                🤝
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-stone-900 mb-2">85% Provider</h3>
                                <p className="text-stone-500 leading-relaxed">
                                    Creators and experts keep the lion's share. Fair market rates, guaranteed. No Race-to-the-Bottom bidding wars.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-16 text-center">
                    <Link href="/brand/manifesto">
                        <Button variant="ghost" className="text-stone-400 hover:text-orange-600 gap-2 font-medium">
                            Read the Transparency Manifesto <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>

            </div>
        </section>
    );
}
