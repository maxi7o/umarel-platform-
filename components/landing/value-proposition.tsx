
'use client';

import { Shield, Users, Zap, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ValueProposition() {
    return (
        <section className="py-24 bg-[#fffdf5] border-y border-stone-100">
            <div className="container mx-auto px-6 max-w-6xl">

                <div className="text-center mb-16 space-y-4">
                    <span className="text-orange-600 font-bold uppercase tracking-widest text-xs">Why Umarel?</span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-stone-900">
                        Built for trust, powered by community
                    </h2>
                    <p className="text-xl text-stone-500 max-w-2xl mx-auto">
                        Every project is protected. Every expert is verified. Every outcome is transparent.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* 1. Escrow Protection */}
                    <Card className="bg-white rounded-3xl border-none shadow-xl shadow-stone-200/50 overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
                        <CardContent className="p-8 space-y-6">
                            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Shield className="h-8 w-8 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-stone-900 mb-2">Escrow Protected</h3>
                                <p className="text-stone-500 leading-relaxed">
                                    Your money is held safely until work is verified. Auto-release after 24 hours or instant approval—you're always in control.
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
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center mb-4">
                                <Users className="h-10 w-10 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-stone-900 mb-2 flex items-center gap-2">
                                    <span className="text-orange-500">Daily Dividends</span>
                                </h3>
                                <p className="text-stone-600 leading-relaxed text-lg">
                                    Helpful community members earn real cash, not just points. Share wisdom, save money, get rewarded.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. AI-Powered Matching */}
                    <Card className="bg-white rounded-3xl border-none shadow-xl shadow-stone-200/50 overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-blue-500" />
                        <CardContent className="p-8 space-y-6">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Zap className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-stone-900 mb-2">Smart Matching</h3>
                                <p className="text-stone-500 leading-relaxed">
                                    AI breaks down your project into clear tasks, suggests fair pricing, and connects you with the right experts.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-16 text-center">
                    <Link href="/brand/manifesto">
                        <Button variant="ghost" className="text-stone-400 hover:text-orange-600 gap-2 font-medium">
                            Read Our Manifesto <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>

            </div>
        </section>
    );
}
