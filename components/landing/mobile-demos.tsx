'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { User, Hammer, Glasses, Send, Camera, CheckCircle2, MapPin, DollarSign, Loader2 } from 'lucide-react';

const DEMOS = [
    {
        id: 'client',
        label: 'Tengo un Problema',
        icon: User,
        color: 'blue',
        title: 'Pedí ayuda en segundos',
        description: 'Decinos qué pasa, no hace falta que sepas el nombre técnico.'
    },
    {
        id: 'provider',
        label: 'Soy Profesional',
        icon: Hammer,
        color: 'orange',
        title: 'Trabajá con garantía',
        description: 'Elegí trabajos cerca y cobrá seguro al terminar.'
    },
    {
        id: 'umarel',
        label: 'Soy Umarel',
        icon: Glasses,
        color: 'purple',
        title: 'Verificá y ganá',
        description: 'Usá tu ojo clínico para validar trabajos y ganar dinero.'
    }
];

export function MobileDemos() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="py-24 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit text-slate-900 mb-6">
                        Así de fácil funciona.
                    </h2>
                    <p className="text-lg text-slate-600">
                        Sin vueltas. Elegí tu rol y mirá cómo Umarel te soluciona la vida.
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
            <div className="px-6 py-4 border-b bg-white z-10">
                <h4 className="font-bold text-slate-900">Hola, Maxi</h4>
                <p className="text-xs text-slate-500">¿Qué rompimos hoy?</p>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-hidden relative">
                {/* Step 0: Initial Chat */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-100 p-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm"
                >
                    Contame qué problema tenés.
                </motion.div>

                {step >= 1 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="self-end bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] text-sm ml-auto"
                    >
                        Tengo una mancha de humedad en la pared del living, arriba del zócalo.
                    </motion.div>
                )}

                {step >= 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-100 p-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                            <span className="font-bold text-blue-600 text-xs">ANALIZANDO</span>
                        </div>
                        <p>Entendido. Parece ser humedad de cimientos.</p>
                        <div className="mt-3 bg-white p-3 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2 mb-1">
                                <DollarSign size={14} className="text-green-600" />
                                <span className="font-bold text-slate-900 text-xs">ESTIMADO: $40k - $60k</span>
                            </div>
                            <p className="text-xs text-slate-500">Incluye picado y reparación.</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-slate-50">
                {step < 3 ? (
                    <div className="h-10 bg-white border rounded-full px-4 flex items-center justify-between text-slate-400 text-sm">
                        <span>Escribiendo...</span>
                        <Send size={16} />
                    </div>
                ) : (
                    <motion.button
                        initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                        className="w-full h-12 bg-blue-600 text-white rounded-full font-bold shadow-lg flex items-center justify-center gap-2"
                    >
                        Publicar Pedido
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
            <div className="h-32 bg-orange-100 relative w-full overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-400 to-transparent"></div>
                <div className="absolute bottom-4 left-6 flex items-center gap-2 text-orange-800 font-bold bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs">
                    <MapPin size={12} /> Belgrano, CABA
                </div>
            </div>

            <div className="flex-1 p-4 -mt-6">
                <AnimatePresence>
                    {!swiped ? (
                        <motion.div
                            exit={{ x: 300, opacity: 0, rotate: 10 }}
                            className="bg-white p-5 rounded-3xl shadow-xl border border-slate-100"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-xs font-bold text-blue-600 uppercase">Plomería</span>
                                    <h3 className="text-lg font-bold text-slate-900 mt-1">Pérdida en Baño</h3>
                                </div>
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold">$25k</span>
                            </div>
                            <p className="text-sm text-slate-500 mb-4">Gotea la canilla del lavatorio, parece ser el cuerito o vástago.</p>

                            <Button className="w-full bg-slate-900 text-white rounded-xl h-10">Aceptar Trabajo</Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-4 h-64"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">¡Trabajo Aceptado!</h3>
                            <p className="text-sm text-slate-500">El pago de $25.000 ya está reservado en Mercado Pago.</p>
                            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-full">Empezar</Button>
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
            className="flex flex-col h-full bg-slate-900 relative text-white"
        >
            <div className="p-6">
                <h4 className="font-outfit font-bold text-lg mb-1">Verificación #4921</h4>
                <p className="text-xs text-slate-400">Pintura Pared Cocina 4x3m</p>
            </div>

            <div className="flex-1 px-4">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-800 mb-4 border border-white/10 group">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="text-white/20" size={48} />
                    </div>
                    {/* Scanning Overlay */}
                    {!verified && (
                        <motion.div
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="absolute left-0 right-0 h-1 bg-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.5)] z-10"
                        />
                    )}

                    {verified && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-sm"
                        >
                            <CheckCircle2 size={48} className="text-green-400 drop-shadow-lg" />
                        </motion.div>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">Bordes prolijos</span>
                        {verified ? <CheckCircle2 size={16} className="text-green-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">Cobertura uniforme</span>
                        {verified ? <CheckCircle2 size={16} className="text-green-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">Limpieza final</span>
                        {verified ? <CheckCircle2 size={16} className="text-green-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
                    </div>
                </div>
            </div>

            <div className="p-4">
                <Button
                    className={`w-full h-12 rounded-full font-bold transition-all ${verified ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-slate-800 text-slate-500'
                        }`}
                >
                    {verified ? 'Verificación Aprobada' : 'Analizando...'}
                </Button>
            </div>
        </motion.div>
    );
}
