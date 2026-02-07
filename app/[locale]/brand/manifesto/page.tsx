'use client';

import { Heart, Search, Scale, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ManifestoPage() {
    return (
        <div className="min-h-screen bg-[#fffdf5] font-sans selection:bg-orange-100 selection:text-orange-900">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 container mx-auto px-6 max-w-5xl text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-200/20 rounded-full blur-[120px] -z-10" />

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur border border-slate-200 text-slate-600 rounded-full text-sm font-semibold tracking-wide shadow-sm mb-8 hover:bg-white/80 transition-colors">
                    <ShieldCheck className="w-4 h-4 text-slate-900 fill-slate-900" />
                    <span>Ingeniería de Confianza</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-heading font-bold text-slate-900 mb-8 tracking-tight">
                    Tu visión. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">Validada.</span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                    En el mundo real, la confianza es un lujo. Nosotros la convertimos en un sistema. <br /><br />
                    No dependemos de la buena fe. <span className="text-slate-900 font-medium">Dependemos de la evidencia.</span> <br />
                    Y en nuestra economía, <span className="italic">la calidad verificada es la única moneda</span>.
                </p>
            </section>

            {/* The Philosophy Grid */}
            <section className="py-20 bg-white border-y border-slate-100">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Search,
                                title: "La Auditoría",
                                desc: "El trabajo no termina cuando se dice 'listo'. Termina cuando se valida. Nuestra red de expertos verifica cada hito antes de liberar fondos."
                            },
                            {
                                icon: Scale,
                                title: "La Justicia",
                                desc: "Las disputas se resuelven con criterios técnicos, no con gritos. Un jurado de pares calificados decide basado en evidencia."
                            },
                            {
                                icon: TrendingUp,
                                title: "El Dividendo",
                                desc: "Premiamos la participación. Parte de cada transacción vuelve a quienes aportan valor validando y asegurando la calidad del ecosistema."
                            }
                        ].map((item, i) => (
                            <div key={i} className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-slate-300 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    <item.icon className="w-7 h-7 text-slate-900 group-hover:text-blue-600 transition-colors" />
                                </div>
                                <h3 className="text-2xl font-bold font-heading text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed font-medium">
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
                            <h2 className="text-4xl font-bold font-heading text-slate-900 mb-4">A dónde va el valor.</h2>
                            <p className="text-lg text-slate-600">
                                Transparencia radical. No todo es comisión de plataforma. Una gran parte retorna a la comunidad que sostiene la confianza.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Platform Fee */}
                            <div className="flex gap-6 p-4 rounded-2xl hover:bg-white/50 transition-colors">
                                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex flex-col items-center justify-center text-slate-900 shrink-0 border border-slate-200">
                                    <ShieldCheck className="w-8 h-8 text-slate-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">Operaciones</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        Una tarifa sostenible para servidores, desarrollo y seguros. Mantiene la maquinaria segura para todos.
                                    </p>
                                </div>
                            </div>

                            {/* Community Fee */}
                            <div className="flex gap-6 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 hover:bg-blue-50 transition-colors relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/10 transition-colors" />

                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex flex-col items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
                                    <Users className="w-8 h-8 text-blue-100" />
                                </div>
                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold text-slate-900">Fondo de Expertos</h3>
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-full tracking-wide">
                                            Participación
                                        </span>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed font-medium">
                                        Una porción de cada transacción va al Fondo Comunitario. Premia a quienes auditan, resuelven disputas y mantienen un alto <span className="text-blue-600 font-bold">Aura</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aura Visual */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent rounded-full blur-3xl opacity-60" />
                        <div className="relative bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100/50 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pagos Semanales</h3>
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
                                    <TrendingUp className="w-3 h-3" />
                                    +12% vs sem. ant.
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { name: 'Elena R.', role: 'Juez Senior', aura: 960, share: '$485.20' },
                                    { name: 'Marcos T.', role: 'Auditor de Obra', aura: 820, share: '$312.50' },
                                    { name: 'Sara K.', role: 'Mediadora', aura: 740, share: '$195.00' },
                                    { name: 'David L.', role: 'Observador', aura: 650, share: '$84.30' },
                                ].map((u, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-blue-50/50 transition-colors cursor-default group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                                                ${i === 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}
                                            `}>
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 text-sm">{u.name}</div>
                                                <div className="text-xs text-slate-500 font-medium">{u.role}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{u.share}</div>
                                            <div className="text-[10px] text-slate-400 font-medium flex items-center justify-end gap-1">
                                                <ShieldCheck className="w-3 h-3" />
                                                {u.aura} Aura
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                                <p className="text-xs text-slate-400">
                                    Mayor Aura = Mayor participación en el Fondo.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 container mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-8">
                    Dejá de trabajar gratis.
                </h2>
                <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                    <Link href="/browse">
                        <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-10 h-14 text-lg shadow-xl shadow-slate-900/10">
                            Empezar a Validar
                        </Button>
                    </Link>
                    <span className="text-slate-400 font-medium">o</span>
                    <Link href="/create-request">
                        <Button variant="outline" size="lg" className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl px-10 h-14 text-lg">
                            Publicar Proyecto
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
