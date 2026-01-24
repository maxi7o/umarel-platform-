
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
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none sm:max-h-[80vh]">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-full">

                    {/* Role 1: CLIENT */}
                    <motion.div
                        whileHover={{ flex: 2 }}
                        className="flex-1 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-900 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 transition-all duration-300 group cursor-pointer"
                        onClick={() => handleSelectRole('client')}
                    >
                        <div>
                            <div className="bg-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-6">🏗️</div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Cliente</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                                Tenés una idea o una necesidad.
                            </p>
                            <ul className="space-y-3">
                                <ThinkingPoint text="Definí con IA" color="bg-blue-500" />
                                <ThinkingPoint text="Pagá al aprobar" color="bg-blue-500" />
                                <ThinkingPoint text="Ahorrá 30%" color="bg-blue-500" />
                            </ul>
                        </div>
                        <Button variant="ghost" className="mt-8 justify-start p-0 hover:bg-transparent group-hover:text-blue-600 transition-colors">
                            Soy Cliente <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </motion.div>

                    {/* Role 2: PROVIDER */}
                    <motion.div
                        whileHover={{ flex: 2 }}
                        className="flex-1 bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-slate-900 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 transition-all duration-300 group cursor-pointer"
                        onClick={() => handleSelectRole('provider')}
                    >
                        <div>
                            <div className="bg-orange-100 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-6">🛠️</div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Profesional</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                                Querés trabajar y cobrar seguro.
                            </p>
                            <ul className="space-y-3">
                                <ThinkingPoint text="Sin burocracia" color="bg-orange-500" />
                                <ThinkingPoint text="Cobro inmediato" color="bg-orange-500" />
                                <ThinkingPoint text="Portfolio Real" color="bg-orange-500" />
                            </ul>
                        </div>
                        <Button variant="ghost" className="mt-8 justify-start p-0 hover:bg-transparent group-hover:text-orange-600 transition-colors">
                            Soy Profesional <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </motion.div>

                    {/* Role 3: ENENDIDO */}
                    <motion.div
                        whileHover={{ flex: 2 }}
                        className="flex-1 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/20 dark:to-slate-900 p-8 flex flex-col justify-between transition-all duration-300 group cursor-pointer relative overflow-hidden"
                        onClick={() => handleSelectRole('entendido')}
                    >
                        <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl z-20">
                            Nuevo
                        </div>
                        <div>
                            <div className="bg-yellow-100 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-6">🧐</div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Entendido</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                                Sabés del tema y querés opinar.
                            </p>
                            <ul className="space-y-3">
                                <ThinkingPoint text="Ganás por saber" color="bg-yellow-500" />
                                <ThinkingPoint text="Ayudás a otros" color="bg-yellow-500" />
                                <ThinkingPoint text="Sin compromiso" color="bg-yellow-500" />
                            </ul>
                        </div>
                        <Button variant="ghost" className="mt-8 justify-start p-0 hover:bg-transparent group-hover:text-yellow-600 transition-colors">
                            Solo quiero opinar <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </motion.div>

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
