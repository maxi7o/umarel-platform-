'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CheckCircle2, DollarSign, Search, ShieldCheck, Shovel, Glasses } from 'lucide-react';
import { motion } from 'framer-motion';

export function RoleJourneys() {
    // Hardcoded for speed/demo, ideally useTranslations

    return (
        <section id="roles" className="py-24 bg-white">
            <div className="container mx-auto px-6">

                {/* BUSCADOR SECTION */}
                <div id="seeker" className="grid lg:grid-cols-2 gap-16 items-center mb-32 group">
                    <div className="order-2 lg:order-1 relative h-[500px] bg-blue-50 rounded-[40px] overflow-hidden border border-blue-100 shadow-xl transition-transform hover:scale-[1.02] duration-500">
                        {/* Abstract Representation of a messy project becoming clean */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
                        <div className="absolute top-10 left-10 bg-white p-4 rounded-2xl shadow-sm max-w-xs animate-pulse">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500"><Search size={20} /></div>
                                <div>
                                    <p className="text-xs text-slate-500">Problema</p>
                                    <p className="font-bold text-slate-800">"Tengo humedad y no sé de dónde viene"</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-10 right-10 bg-white p-4 rounded-2xl shadow-lg border-l-4 border-green-500 max-w-xs">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle2 size={20} /></div>
                                <div>
                                    <p className="text-xs text-slate-500">Claridad</p>
                                    <p className="font-bold text-slate-800">Diagnóstico claro + 3 presupuestos verificados.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                            <Search size={14} /> ¿Tenés un problema?
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold font-outfit text-slate-900">
                            No hace falta que <br />
                            <span className="text-blue-600">lo tengas claro hoy.</span>
                        </h2>
                        <p className="text-lg text-stone-600 leading-relaxed">
                            La mayoría llega sin saber por dónde empezar. Y está bien.
                            Describí lo que te pasa como te salga. Nosotros te ayudamos a ordenarlo
                            para que nadie se aproveche.
                        </p>

                        <ul className="space-y-3">
                            {[
                                "El primer objetivo es entender, no gastar.",
                                "Te armamos el pedido para que se entienda bien.",
                                "Salís con más claridad y un próximo paso."
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-stone-700 font-medium">
                                    <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="pt-4">
                            <Link href="/requests/create">
                                <Button size="lg" className="rounded-full h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-900/10">
                                    Contar mi Problema (Sin cargo)
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* CREADOR SECTION */}
                <div id="creator" className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-bold">
                            <Shovel size={14} /> El Solucionador
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold font-outfit text-slate-900">
                            Solo ocupate de trabajar. <br />
                            <span className="text-orange-600">La plata está segura.</span>
                        </h2>
                        <p className="text-lg text-stone-600 leading-relaxed">
                            Si sabés arreglar cosas, este es tu lugar.
                            Se terminó el perseguir pagos. Acá el cliente deposita antes.
                            Vos trabajás tranquilo sabiendo que el dinero está esperando.
                        </p>

                        <ul className="space-y-3">
                            {[
                                "Pagos asegurados antes de arrancar.",
                                "Clientes con el problema ya digerido y ordenado.",
                                "Sin vueltas: terminás, mostrás y cobrás."
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-stone-700 font-medium">
                                    <CheckCircle2 className="text-orange-500 shrink-0" size={20} />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="pt-4">
                            <Link href="/create-offering">
                                <Button size="lg" className="rounded-full h-12 px-8 bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg shadow-orange-900/10">
                                    Ofrecer Soluciones
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="relative h-[500px] bg-orange-50 rounded-[40px] overflow-hidden border border-orange-100 shadow-xl transition-transform hover:scale-[1.02] duration-500">
                        {/* Abstract Wallet Visual */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent"></div>

                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-3xl shadow-2xl border border-stone-100 w-64 text-center">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <DollarSign size={32} />
                            </div>
                            <p className="text-sm text-stone-500 uppercase tracking-widest font-bold mb-1">Asegurado</p>
                            <p className="text-4xl font-bold text-slate-900 font-mono">$150.000</p>
                            <div className="mt-4 flex gap-2 justify-center">
                                <div className="w-full h-2 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-xs text-stone-400 mt-2">Esperando tu trabajo</p>
                        </div>
                    </div>
                </div>

                {/* UMAREL SECTION */}
                <div id="umarel" className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 relative h-[500px] bg-slate-900 rounded-[40px] overflow-hidden border border-slate-800 shadow-xl transition-transform hover:scale-[1.02] duration-500">
                        {/* The "Eye" */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-purple-500/20 blur-xl rounded-full animate-pulse"></div>
                                <Glasses className="text-white w-32 h-32 relative z-10 opacity-90" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-sm font-bold">
                            <ShieldCheck size={14} /> El Entendido
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold font-outfit text-slate-900">
                            No venimos a juzgar. <br />
                            <span className="text-purple-600">Venimos a pensar con vos.</span>
                        </h2>
                        <p className="text-lg text-stone-600 leading-relaxed">
                            Un Entendido no es un inspector que te busca el pelo al huevo.
                            Es alguien con experiencia que te ayuda a que no se te escape nada.
                            Pensamos juntos para que el trabajo salga bien de una.
                        </p>

                        <ul className="space-y-3">
                            {[
                                "Tu experiencia ayuda a vecinos que no saben.",
                                "Sin horarios fijos: ayudás cuando podés.",
                                "Convertí tu sabiduría de años en ingresos."
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-stone-700 font-medium">
                                    <CheckCircle2 className="text-purple-500 shrink-0" size={20} />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="pt-4">
                            <Link href="/browse">
                                <Button size="lg" className="rounded-full h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-900/20">
                                    Quiero Ayudar
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
