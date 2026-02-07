'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { User, Shovel, CheckCircle2, MessageCircle, Mic, Image as ImageIcon, Star } from 'lucide-react';

const DEMOS = [
    {
        id: 'client',
        label: 'Tengo un Problema',
        icon: User,
        color: 'blue',
        title: 'Pedí ayuda fácil',
        description: 'Decinos qué pasa, no hace falta que sepas palabras técnicas.'
    },
    {
        id: 'provider',
        label: 'Soy Profesional',
        icon: Shovel,
        color: 'orange',
        title: 'Trabajá seguro',
        description: 'Encontrá clientes serios y cobrá siempre.'
    },
    {
        id: 'umarel',
        label: 'Soy Entendido',
        icon: CheckCircle2,
        color: 'green',
        title: 'Ayudá y ganá',
        description: 'Revisá trabajos para que todo salga bien.'
    }
];

export function MobileDemos() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-slate-900 mb-6">
                        Más simple imposible.
                    </h2>
                    <p className="text-lg text-slate-600">
                        Olvidate de los problemas de obra. Todo desde el celular.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-24 items-center justify-center">

                    {/* LEFT: CONTROLS */}
                    <div className="flex flex-col gap-4 w-full max-w-md">
                        {DEMOS.map((demo, index) => (
                            <button
                                key={demo.id}
                                onClick={() => setActiveTab(index)}
                                className={`text-left p-6 rounded-3xl transition-all duration-300 border ${activeTab === index
                                    ? 'bg-white border-slate-200 shadow-xl scale-105'
                                    : 'bg-transparent border-transparent hover:bg-slate-50 opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <div className="flex items-center gap-4 mb-2">
                                    <div className={`p-3 rounded-full ${activeTab === index
                                        ? `bg-${demo.color}-100 text-${demo.color}-600`
                                        : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        <demo.icon size={24} />
                                    </div>
                                    <h3 className={`text-xl font-bold ${activeTab === index ? 'text-slate-900' : 'text-slate-600'}`}>
                                        {demo.label}
                                    </h3>
                                </div>
                                <p className="text-slate-500 pl-[60px]">{demo.description}</p>
                            </button>
                        ))}
                    </div>

                    {/* RIGHT: PHONE SIMULATOR */}
                    <div className="relative">
                        {/* Phone Frame */}
                        <div className="relative w-[320px] h-[640px] bg-white rounded-[3rem] border-8 border-slate-900 shadow-2xl overflow-hidden ring-1 ring-slate-900/10">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20"></div>

                            {/* Screen Content */}
                            <div className="relative w-full h-full bg-slate-50 font-sans flex flex-col pt-12">
                                <AnimatePresence mode="wait">
                                    {activeTab === 0 && <ClientDemo key="client" />}
                                    {activeTab === 1 && <ProviderDemo key="provider" />}
                                    {activeTab === 2 && <UmarelDemo key="umarel" />}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Background Decor - simple soft blur */}
                        <div className={`absolute -inset-10 -z-10 rounded-full blur-3xl opacity-20 transition-colors duration-1000 ${activeTab === 0 ? 'bg-blue-300' :
                            activeTab === 1 ? 'bg-orange-300' : 'bg-green-300'
                            }`}></div>
                    </div>

                </div>
            </div>
        </section>
    );
}

// --- DEMO SCENES ---

function ClientDemo() {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (step < 3) setStep(s => s + 1);
        }, 1500);
        return () => clearTimeout(timer);
    }, [step]);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full bg-slate-50 relative"
        >
            <div className="bg-white p-4 pb-2 border-b">
                <h4 className="font-bold text-slate-800 text-lg">Nuevo Pedido</h4>
                <p className="text-sm text-slate-500">Asistente IA</p>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm max-w-[85%]"
                >
                    <p className="text-sm text-slate-700">Hola 👋 Contame qué necesitás arreglar. podés mandar audio o foto.</p>
                </motion.div>

                {step >= 1 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="self-end bg-blue-500 text-white p-4 rounded-2xl rounded-tr-sm shadow-sm max-w-[85%] ml-auto"
                    >
                        <p className="text-sm">Tengo una mancha de humedad en el techo del living, cada vez que llueve gotea.</p>
                    </motion.div>
                )}

                {step >= 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm max-w-[85%]"
                    >
                        <p className="text-sm text-slate-700 mb-2">Entendido. Lo publicamos así para que los techistas entiendan:</p>
                        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                            <h5 className="font-bold text-blue-900 text-sm">Reparación Filtración Techo</h5>
                            <p className="text-xs text-blue-700 mt-1">Incluye: Impermeabilización externa y pintura de cielorraso.</p>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="p-4 bg-white border-t flex gap-2 items-center">
                <Button size="icon" variant="ghost" className="rounded-full text-slate-400"><ImageIcon size={20} /></Button>
                <div className="flex-1 h-10 bg-slate-100 rounded-full px-4 flex items-center text-slate-400 text-sm">Escribí acá...</div>
                <Button size="icon" className="rounded-full bg-blue-500 hover:bg-blue-600"><Mic size={20} /></Button>
            </div>
        </motion.div>
    );
}

function ProviderDemo() {
    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full bg-slate-50 p-4"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h4 className="font-bold text-slate-900 text-xl">Hola, Juan</h4>
                    <p className="text-sm text-slate-500">Tenés 3 trabajos cerca.</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">JD</div>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-4"
            >
                <div className="flex justify-between items-start mb-3">
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">Nuevo</span>
                    <span className="text-lg font-bold text-slate-900">$85.000</span>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">Fuga de Gas - Cocina</h3>
                <p className="text-slate-500 text-sm mb-4">Barrio: Olivos (a 5 cuadras)</p>

                <div className="p-3 bg-slate-50 rounded-xl mb-4">
                    <p className="text-slate-600 text-xs flex gap-2 items-center">
                        <CheckCircle2 size={14} className="text-green-500" />
                        Dinero ya reservado por el cliente
                    </p>
                </div>

                <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold shadow-lg">
                    Aceptar Trabajo
                </Button>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 opacity-60 scale-95"
            >
                <h3 className="font-bold text-slate-800 text-lg mb-1">Instalación Grifería</h3>
                <p className="text-slate-500 text-sm">Barrio: Florida</p>
            </motion.div>
        </motion.div>
    );
}

function UmarelDemo() {
    const [approved, setApproved] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setApproved(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full bg-white relative"
        >
            <div className="p-4 border-b">
                <h4 className="font-bold text-slate-900">Revisión de Trabajo</h4>
                <p className="text-xs text-slate-500">Techo - Paso 2: Impermeabilización</p>
            </div>

            <div className="p-4 flex-1">
                <div className="aspect-[4/5] bg-slate-100 rounded-2xl relative overflow-hidden mb-4 group">
                    {/* Simulated Image */}
                    <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                        <span className="text-slate-400 text-sm">Foto del trabajo...</span>
                    </div>

                    <AnimatePresence>
                        {approved && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex flex-col items-center justify-center text-green-700"
                            >
                                <div className="bg-white p-4 rounded-full shadow-lg mb-2">
                                    <CheckCircle2 size={40} className="text-white fill-green-600" />
                                </div>
                                <span className="font-bold bg-white px-3 py-1 rounded-full text-xs shadow-sm text-green-700">Aprobado</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-3">
                    <p className="text-sm font-bold text-slate-700">Tu opinión:</p>
                    <div className="flex gap-2">
                        <Button variant="outline" className={`rounded-full border-slate-200 ${approved ? 'opacity-50' : 'hover:bg-red-50 hover:text-red-500'}`}>
                            Rechazar
                        </Button>
                        <Button className={`flex-1 rounded-full bg-green-600 hover:bg-green-700 text-white ${approved ? 'ring-2 ring-offset-2 ring-green-500' : ''}`} onClick={() => setApproved(true)}>
                            Aprobar Trabajo
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
