'use client';

import { Heart, Search, Scale, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ManifestoPage() {
    return (
        <div className="min-h-screen bg-[#fffdf5] font-sans selection:bg-orange-100 selection:text-orange-900">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 container mx-auto px-6 max-w-5xl text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-200/20 rounded-full blur-[120px] -z-10" />

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur border border-stone-200 text-stone-600 rounded-full text-sm font-semibold tracking-wide shadow-sm mb-8 hover:bg-white/80 transition-colors">
                    <Heart className="w-4 h-4 text-orange-500 fill-orange-500" />
                    <span>The Economy of Observation</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-heading font-bold text-stone-900 mb-8 tracking-tight">
                    We are all <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Umarel</span>.
                </h1>

                <p className="text-xl md:text-2xl text-stone-600 leading-relaxed max-w-3xl mx-auto">
                    In Italy, retired men stand with hands behind their backs, watching construction sites. They are the <strong>"Umarel"</strong>. <br /><br />
                    They don't build. <span className="text-stone-900 font-medium">They observe.</span> <br />
                    And in our economy, <span className="italic">observation is value</span>.
                </p>
            </section>

            {/* The Philosophy Grid */}
            <section className="py-20 bg-white border-y border-stone-100">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Search,
                                title: "The Audit",
                                desc: "Work isn't done when it's finished. It's done when it's seen. Our community verifies every slice of work, ensuring quality before funds move."
                            },
                            {
                                icon: Scale,
                                title: "The Justice",
                                desc: "Disputes aren't handled by support tickets. They are judged by a jury of peers with high Aura, who are rewarded for fair rulings."
                            },
                            {
                                icon: TrendingUp,
                                title: "The Dividend",
                                desc: "We tax transactions, not to line our pockets, but to fill the Community Pool. A share of every transaction goes back to those who watch."
                            }
                        ].map((item, i) => (
                            <div key={i} className="group p-8 rounded-3xl bg-stone-50 border border-stone-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-300">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    <item.icon className="w-7 h-7 text-stone-900 group-hover:text-orange-600 transition-colors" />
                                </div>
                                <h3 className="text-2xl font-bold font-heading text-stone-900 mb-4">{item.title}</h3>
                                <p className="text-stone-500 leading-relaxed font-medium">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The Breakdown Section */}
            <section className="py-24 container mx-auto px-6 max-w-5xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-4xl font-bold font-heading text-stone-900 mb-4">Where the value flows.</h2>
                            <p className="text-lg text-stone-600">
                                We believe in radical transparency. Not all fees go to the platform. A major portion returns to the community.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Platform Fee */}
                            <div className="flex gap-6 p-4 rounded-2xl hover:bg-white/50 transition-colors">
                                <div className="w-20 h-20 bg-stone-100 rounded-3xl flex flex-col items-center justify-center text-stone-900 shrink-0 border border-stone-200">
                                    <ShieldCheck className="w-8 h-8 text-stone-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-stone-900 mb-1">Platform Operations</h3>
                                    <p className="text-stone-500 text-sm leading-relaxed">
                                        A sustainable fee covers servers, development, and insurance. This keeps the machinery running safely for everyone.
                                    </p>
                                </div>
                            </div>

                            {/* Community Fee */}
                            <div className="flex gap-6 p-4 rounded-2xl bg-orange-50/50 border border-orange-100 hover:bg-orange-50 transition-colors relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-orange-500/10 transition-colors" />

                                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex flex-col items-center justify-center text-white shrink-0 shadow-lg shadow-orange-500/20">
                                    <Users className="w-8 h-8 text-orange-100" />
                                </div>
                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold text-stone-900">The Umarel Pool</h3>
                                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold uppercase rounded-full tracking-wide">
                                            Profit Share
                                        </span>
                                    </div>
                                    <p className="text-stone-600 text-sm leading-relaxed font-medium">
                                        A portion of every transaction is routed directly to the Community Pool. It rewards those who resolve disputes, audit work, and maintain high <span className="text-orange-600 font-bold">Aura</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aura Visual */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-transparent rounded-full blur-3xl opacity-60" />
                        <div className="relative bg-white p-8 rounded-[2rem] shadow-xl border border-stone-100/50 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Last Week's Payouts</h3>
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
                                    <TrendingUp className="w-3 h-3" />
                                    +12% vs prev week
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { name: 'Elena R.', role: 'Senior Judge', aura: 960, share: '$485.20' },
                                    { name: 'Marcus T.', role: 'Site Auditor', aura: 820, share: '$312.50' },
                                    { name: 'Sarah K.', role: 'Mediator', aura: 740, share: '$195.00' },
                                    { name: 'David L.', role: 'Observer', aura: 650, share: '$84.30' },
                                ].map((u, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl hover:bg-orange-50/50 transition-colors cursor-default group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                                                ${i === 0 ? 'bg-orange-100 text-orange-700' : 'bg-stone-200 text-stone-600'}
                                            `}>
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-stone-900 text-sm">{u.name}</div>
                                                <div className="text-xs text-stone-500 font-medium">{u.role}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono font-bold text-stone-900 group-hover:text-orange-600 transition-colors">{u.share}</div>
                                            <div className="text-[10px] text-stone-400 font-medium flex items-center justify-end gap-1">
                                                <ShieldCheck className="w-3 h-3" />
                                                {u.aura} Aura
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-stone-100 text-center">
                                <p className="text-xs text-stone-400">
                                    Higher Aura = Higher Share of the Pool.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 container mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-stone-900 mb-8">
                    Stop watching for free.
                </h2>
                <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                    <Link href="/browse">
                        <Button size="lg" className="bg-stone-900 text-white hover:bg-stone-800 rounded-xl px-10 h-14 text-lg shadow-xl shadow-stone-900/10">
                            Start Observing
                        </Button>
                    </Link>
                    <span className="text-stone-400 font-medium">or</span>
                    <Link href="/create-request">
                        <Button variant="outline" size="lg" className="border-stone-200 text-stone-600 hover:bg-stone-50 rounded-xl px-10 h-14 text-lg">
                            Post a Job
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
