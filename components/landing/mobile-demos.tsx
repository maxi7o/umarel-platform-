'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { User, Hammer, Glasses, Send, Camera, CheckCircle2, MapPin, DollarSign, Loader2 } from 'lucide-react';

const DEMOS = [
    {
        id: 'client',
        label: 'Gestión de Activos',
        icon: User,
        color: 'blue',
        title: 'Reportá incidentes',
        description: 'Estructurá el problema técnico con asistencia de IA.'
    },
    {
        id: 'provider',
        label: 'Ejecución Certificada',
        icon: Hammer,
        color: 'slate',
        title: 'Trabajá con solvencia',
        description: 'Tomá tickets con fondos en custodia y reglas claras.'
    },
    {
        id: 'umarel',
        label: 'Auditoría Técnica',
        icon: Glasses,
        color: 'indigo',
        title: 'Capitalizá tu expertis',
        description: 'Validá la calidad de terceros y generá honorarios.'
    }
];

export function MobileDemos() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="py-24 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-slate-900 mb-6">
                        Sistema Operativo de Obra.
                    </h2>
                    <p className="text-lg text-slate-600">
                        La fricción de la construcción, eliminada por software.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-24 items-center justify-center">

                    {/* LEFT: CONTROLS */}
                    <div className="flex flex-col gap-4 w-full max-w-md">
                        {DEMOS.map((demo, index) => (
                            <button
                                key={demo.id}
                                onClick={() => setActiveTab(index)}
                                className={`text-left p-6 rounded-2xl transition-all duration-300 border ${activeTab === index
                                    ? 'bg-white border-slate-200 shadow-xl scale-105'
                                    : 'bg-transparent border-transparent hover:bg-white/50 opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <div className="flex items-center gap-4 mb-2">
                                    <div className={`p-3 rounded-full ${activeTab === index
                                        ? `bg-${demo.color}-100 text-${demo.color}-600`
                                        : 'bg-slate-200 text-slate-500'
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
                        <div className="relative w-[320px] h-[640px] bg-slate-900 rounded-[3rem] border-8 border-slate-900 shadow-2xl overflow-hidden ring-1 ring-white/20">
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

                        {/* Background Decor */}
                        <div className={`absolute -inset-10 -z-10 rounded-full blur-3xl opacity-20 transition-colors duration-1000 ${activeTab === 0 ? 'bg-blue-500' :
                            activeTab === 1 ? 'bg-orange-500' : 'bg-purple-500'
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
        }, step === 1 ? 2500 : 1500); // Wait longer on "typing/loading"
        return () => clearTimeout(timer);
    }, [step]);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full bg-white relative"
        >
            {/* Header */}
            <div className="px-6 py-4 border-b bg-white z-10 flex justify-between items-center">
                <div>
                    <h4 className="font-bold text-slate-900">Activo: Casa Central</h4>
                    <p className="text-xs text-slate-500">Estado: Mantenimiento</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-hidden relative">
                {/* Step 0: Initial Chat */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-100 p-3 rounded-2xl rounded-tl-none max-w-[85%] text-xs"
                >
                    <strong>Sistema:</strong> Describa la incidencia técnica.
                </motion.div>

                {step >= 1 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="self-end bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] text-xs ml-auto"
                    >
                        Filtración activa en cielorraso de mampostería, sector Living.
                    </motion.div>
                )}

                {step >= 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-100 p-3 rounded-2xl rounded-tl-none max-w-[85%] text-xs"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                            <span className="font-bold text-blue-600 text-[10px]">GENERANDO PLIEGO</span>
                        </div>
                        <p>Ticket Creado: Reparación de patología hidrófuga.</p>
                        <div className="mt-3 bg-white p-3 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2 mb-1">
                                <DollarSign size={12} className="text-slate-700" />
                                <span className="font-bold text-slate-900 text-[10px]">VALUACIÓN MERCADO: $45k</span>
                            </div>
                            <p className="text-[10px] text-slate-500">Requiere picado, hidrófugo y enduido.</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-slate-50">
                {step < 3 ? (
                    <div className="h-10 bg-white border rounded-full px-4 flex items-center justify-between text-slate-400 text-sm">
                        <span>Procesando...</span>
                    </div>
                ) : (
                    <motion.button
                        initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                        className="w-full h-10 bg-slate-900 text-white rounded-md font-bold shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wide"
                    >
                        Lanzar Licitación
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}

function ProviderDemo() {
    const [swiped, setSwiped] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setSwiped(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full bg-slate-50 relative"
        >
            {/* Map Header */}
            <div className="h-32 bg-slate-200 relative w-full overflow-hidden grayscale">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-400 to-transparent"></div>
                <div className="absolute bottom-4 left-6 flex items-center gap-2 text-slate-800 font-bold bg-white/90 backdrop-blur px-3 py-1 rounded-sm text-[10px] uppercase border border-slate-300">
                    <MapPin size={10} /> Zona Norte: Olivos
                </div>
            </div>

            <div className="flex-1 p-4 -mt-6">
                <AnimatePresence>
                    {!swiped ? (
                        <motion.div
                            exit={{ x: 300, opacity: 0, rotate: 10 }}
                            className="bg-white p-5 rounded-sm shadow-xl border border-slate-200"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Instalaciones</span>
                                    <h3 className="text-sm font-bold text-slate-900 mt-1">Ticket #8821: Fuga Gas</h3>
                                </div>
                                <span className="bg-slate-100 text-slate-900 px-2 py-1 rounded-sm text-xs font-bold border border-slate-200">$85k</span>
                            </div>
                            <p className="text-xs text-slate-500 mb-4">Pérdida en llave de paso cocina. Requiere matriculado.</p>

                            <Button className="w-full bg-blue-600 text-white rounded-sm h-10 text-xs font-bold uppercase">Tomar Asignación</Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="bg-white p-6 rounded-sm shadow-xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-4 h-64"
                        >
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-2 border border-blue-100">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Orden Confirmada</h3>
                            <p className="text-xs text-slate-500">Los fondos ($85.000) están en custodia (Escrow).</p>
                            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-sm text-xs uppercase font-bold">Iniciar Bitácora</Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

function UmarelDemo() {
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVerified(true), 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full bg-slate-950 relative text-white"
        >
            <div className="p-6 border-b border-white/10">
                <h4 className="font-mono text-sm text-blue-400 mb-1">AUDIT_PROTOCOL_V2</h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">ID: 4921 // ALBAÑILERÍA</p>
            </div>

            <div className="flex-1 px-4 py-6">
                <div className="relative rounded-sm overflow-hidden aspect-[4/3] bg-slate-900 mb-6 border border-white/10 group">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="text-slate-700" size={48} />
                    </div>
                    {/* Scanning Overlay */}
                    {!verified && (
                        <motion.div
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            className="absolute left-0 right-0 h-[1px] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)] z-10"
                        />
                    )}

                    {verified && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-blue-500/10 flex items-center justify-center backdrop-blur-[2px]"
                        >
                            <CheckCircle2 size={48} className="text-blue-400 drop-shadow-lg" />
                        </motion.div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">PLOMADA_VERTICAL</span>
                        {verified ? <span className="text-green-400">[OK]</span> : <span className="text-yellow-500">[PEND]</span>}
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">ESCUADRA_90_DEG</span>
                        {verified ? <span className="text-green-400">[OK]</span> : <span className="text-yellow-500">[PEND]</span>}
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">DENSIDAD_MATERIAL</span>
                        {verified ? <span className="text-green-400">[OK]</span> : <span className="text-yellow-500">[PEND]</span>}
                    </div>
                </div>
            </div>

            <div className="p-4 bg-slate-900 border-t border-white/10">
                <Button
                    className={`w-full h-10 rounded-sm font-bold transition-all text-xs uppercase tracking-widest ${verified ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                >
                    {verified ? 'Certificación Digital' : 'Ejecutando Análisis...'}
                </Button>
            </div>
        </motion.div>
    );
}
