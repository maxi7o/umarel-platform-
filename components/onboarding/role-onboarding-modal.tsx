
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RoleOnboardingModal() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('onboarding'); // Logic to be added to messages

    useEffect(() => {
        // Check local storage to show only once
        const hasSeen = localStorage.getItem('umarel-role-onboarding-seen');
        if (!hasSeen) {
            // Small delay for effect
            setTimeout(() => setIsOpen(true), 1000);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('umarel-role-onboarding-seen', 'true');
    };

    const handleSelectRole = (role: string) => {
        // Here we could save preference or redirect
        // For now, just close as "Chosen"
        handleClose();
        // Optional: Trigger confetti or specific redirect
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="w-[90%] max-w-[400px] p-0 overflow-hidden bg-transparent border-none shadow-none focus:outline-none">
                <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-auto max-h-[85vh] overflow-y-auto">

                    {/* Role 1: CLIENT */}
                    <div
                        className="flex-1 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-stone-900 p-6 flex flex-col justify-between border-b border-stone-100 dark:border-stone-800 cursor-pointer hover:bg-blue-50/50 transition-colors"
                        onClick={() => handleSelectRole('client')}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                                    <span className="text-2xl">🏗️</span> Cliente
                                </h3>
                                <p className="text-stone-500 dark:text-stone-400 text-xs mt-1 mb-3">
                                    Tenés un proyecto o reparación para realizar.
                                </p>
                                <ul className="space-y-2">
                                    <ThinkingPoint text="Pagá contra avance de obra" color="bg-blue-500" />
                                    <ThinkingPoint text="Definición técnica con IA" color="bg-blue-500" />
                                    <ThinkingPoint text="Dinero protegido en garantía" color="bg-blue-500" />
                                </ul>
                            </div>
                            <Button variant="ghost" size="sm" className="text-blue-600">
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Role 2: PROVIDER */}
                    <div
                        className="flex-1 bg-gradient-to-r from-orange-50 to-white dark:from-orange-900/20 dark:to-stone-900 p-6 flex flex-col justify-between border-b border-stone-100 dark:border-stone-800 cursor-pointer hover:bg-orange-50/50 transition-colors"
                        onClick={() => handleSelectRole('provider')}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                                    <span className="text-2xl">🛠️</span> Profesional
                                </h3>
                                <p className="text-stone-500 dark:text-stone-400 text-xs mt-1 mb-3">
                                    Ofrecés servicios de construcción o mantenimiento.
                                </p>
                                <ul className="space-y-2">
                                    <ThinkingPoint text="Cobro liberado al cumplir" color="bg-orange-500" />
                                    <ThinkingPoint text="Sin visitas en vano" color="bg-orange-500" />
                                    <ThinkingPoint text="Tu reputación es tu activo" color="bg-orange-500" />
                                </ul>
                            </div>
                            <Button variant="ghost" size="sm" className="text-orange-600">
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Role 3: ENENDIDO */}
                    <div
                        className="flex-1 bg-gradient-to-r from-yellow-50 to-white dark:from-yellow-900/20 dark:to-stone-900 p-6 flex flex-col justify-between cursor-pointer hover:bg-yellow-50/50 transition-colors relative"
                        onClick={() => handleSelectRole('entendido')}
                    >
                        <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[9px] uppercase font-bold px-2 py-0.5 rounded-bl-lg">
                            Nuevo
                        </div>
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                                    <span className="text-2xl">🧐</span> Entendido
                                </h3>
                                <p className="text-stone-500 dark:text-stone-400 text-xs mt-1 mb-3">
                                    Tenés experiencia técnica y querés opinar.
                                </p>
                                <ul className="space-y-2">
                                    <ThinkingPoint text="Monetizá tu experiencia" color="bg-yellow-500" />
                                    <ThinkingPoint text="Validación por pares" color="bg-yellow-500" />
                                    <ThinkingPoint text="Participación flexible" color="bg-yellow-500" />
                                </ul>
                            </div>
                            <Button variant="ghost" size="sm" className="text-yellow-600">
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}

function ThinkingPoint({ text, color }: { text: string, color: string }) {
    return (
        <li className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
            {text}
        </li>
    )
}
