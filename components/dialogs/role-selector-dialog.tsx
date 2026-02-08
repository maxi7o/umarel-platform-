"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Shovel, Search, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export function RoleSelectorDialog() {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    // Check if user has visited before
    // Check if user has visited before - DISABLED upon request
    // useEffect(() => {
    //     const hasSeenRoleSelector = localStorage.getItem('hasSeenRoleSelector')
    //     if (!hasSeenRoleSelector) {
    //         // Show after a short delay on first visit
    //         const timer = setTimeout(() => setOpen(true), 1500)
    //         return () => clearTimeout(timer)
    //     }
    // }, [])

    const handleSelect = (role: 'client' | 'provider' | 'umarel') => {
        localStorage.setItem('hasSeenRoleSelector', 'true')
        setOpen(false)

        switch (role) {
            case 'client':
                router.push('/requests/create')
                break
            case 'provider':
                router.push('/create-offering')
                break
            case 'umarel':
                router.push('/browse')
                break
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none sm:max-w-4xl overflow-hidden">
                <div className="bg-white rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2">
                    {/* Visual Side */}
                    <div className="bg-stone-900 p-8 text-white flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold font-heading mb-4">¡Hola, vecino! 👋</h2>
                            <p className="text-orange-100 text-lg">
                                Umarel es la comunidad donde la experiencia tiene valor. ¿Qué te trae por acá hoy?
                            </p>
                        </div>
                    </div>

                    {/* Options Side */}
                    <div className="p-8 space-y-4 bg-white">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelect('client')}
                            className="w-full flex items-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-stone-300 hover:shadow-lg transition-all group text-left"
                        >
                            <div className="h-12 w-12 rounded-full bg-stone-100 text-stone-900 flex items-center justify-center mr-4 group-hover:bg-stone-100 group-hover:text-stone-900">
                                <Search className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 group-hover:text-stone-900">Tengo un problema</h3>
                                <p className="text-sm text-slate-500">Necesito arreglar algo o contratar un servicio.</p>
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelect('provider')}
                            className="w-full flex items-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-stone-300 hover:shadow-lg transition-all group text-left"
                        >
                            <div className="h-12 w-12 rounded-full bg-stone-100 text-stone-900 flex items-center justify-center mr-4 group-hover:bg-stone-100 group-hover:text-stone-900">
                                <Shovel className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 group-hover:text-stone-900">Ofrezco mis servicios</h3>
                                <p className="text-sm text-slate-500">Soy profesional y busco trabajos seguros.</p>
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelect('umarel')}
                            className="w-full flex items-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-stone-300 hover:shadow-lg transition-all group text-left"
                        >
                            <div className="h-12 w-12 rounded-full bg-stone-100 text-stone-900 flex items-center justify-center mr-4 group-hover:bg-stone-100 group-hover:text-stone-900">
                                <Eye className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 group-hover:text-stone-900">Quiero ser Umarel</h3>
                                <p className="text-sm text-slate-500">Tengo experiencia y quiero verificar proyectos.</p>
                            </div>
                        </motion.button>

                        <div className="text-center pt-4">
                            <button onClick={() => setOpen(false)} className="text-sm text-slate-400 hover:text-slate-600 underline">
                                Solo estoy mirando
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
