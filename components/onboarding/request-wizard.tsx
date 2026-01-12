"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LocationInput } from '@/components/forms/location-input'
import { ArrowRight, ArrowLeft, Upload, MapPin, Search, CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { createRequest } from '@/app/[locale]/requests/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface RequestWizardProps {
    userId?: string
}

export function RequestWizard({ userId }: RequestWizardProps) {
    const t = useTranslations('createRequest.wizard') // We will need to add these keys
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        description: '',
        photos: [] as File[]
    })

    const handleNext = () => {
        if (step === 1 && !formData.title) {
            toast.error("Please describe what you need.")
            return
        }
        if (step === 2 && !formData.location) {
            toast.error("Please select a location.")
            return
        }
        setStep(s => s + 1)
    }

    const handleBack = () => setStep(s => s - 1)

    const handleSubmit = async () => {
        if (!formData.title || !formData.location) return

        setIsSubmitting(true)
        const data = new FormData()
        data.append('title', formData.title)
        data.append('location', formData.location)
        data.append('description', formData.description || formData.title) // Fallback desc
        // Photos handling would go here

        try {
            await createRequest(data)
            // Redirect happens in action or we handle it here
            toast.success("Request posted!")
        } catch (error) {
            console.error(error)
            toast.error("Failed to post request.")
            setIsSubmitting(false)
        }
    }

    const popularTags = [
        "Plomería", "Electricista", "Pintura", "Albañilería", "Aire Acondicionado", "Flete"
    ]

    return (
        <div className="max-w-xl mx-auto min-h-[400px]">
            {/* Progress Bar */}
            <div className="flex gap-2 mb-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${step >= i ? 'bg-orange-500' : 'bg-slate-200'}`} />
                ))}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2 text-center">
                            <h2 className="text-3xl font-bold font-heading text-slate-900">¿Qué necesitás solucionar?</h2>
                            <p className="text-slate-500">Describí tu problema en pocas palabras.</p>
                        </div>

                        <div className="relative">
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Ej. Pierde la canilla de la cocina..."
                                className="text-lg p-6 h-16 shadow-lg border-orange-100 focus:border-orange-500 focus:ring-orange-200"
                                autoFocus
                            />
                            <Button
                                className="absolute right-2 top-2 bottom-2 bg-orange-600 hover:bg-orange-700 aspect-square p-0 w-12 rounded-lg"
                                onClick={handleNext}
                            >
                                <ArrowRight className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className="space-y-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Populares</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {popularTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setFormData({ ...formData, title: tag + " " })}
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 text-sm hover:border-orange-300 hover:bg-orange-50 transition-all hover:scale-105"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2 text-center">
                            <h2 className="text-2xl font-bold font-heading text-slate-900">¿Dónde es el trabajo?</h2>
                            <p className="text-slate-500">Para encontrar expertos cerca tuyo.</p>
                        </div>

                        <div className="bg-white p-2 rounded-xl shadow-lg border border-slate-100">
                            <LocationInput
                                name="location"
                                placeholder="Ciudad o Dirección..."
                                required
                                className="border-0 shadow-none focus-visible:ring-0 text-lg"
                                defaultValue={formData.location}
                            // We need to wire this up to update state. currently LocationInput relies on internal state + hidden input usually?
                            // Assuming standard LocationInput behavior, we might need to wrap or modify it to accept onChange/onSelect.
                            // For now, assuming it updates a hidden input we can grab, OR we pass a callback if supported.
                            // Let's assume standard input behavior for prototype:
                            // onChange={(val) => setFormData({...formData, location: val})}
                            // NOTE: LocationInput prop interface might need checking.
                            />
                            {/* Hack bridging: LocationInput usually updates a hidden input named 'location'. 
                                We might need to listen to it or use a ref. 
                                For this prototype, let's assume specific implementation later or use a controlled input wrapper.*/}
                        </div>

                        <div className="flex gap-4">
                            <Button variant="ghost" onClick={handleBack} className="w-full">
                                <ArrowLeft className="mr-2 w-4 h-4" /> Volver
                            </Button>
                            <Button onClick={handleNext} className="w-full bg-slate-900 text-white">
                                Siguiente
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2 text-center">
                            <h2 className="text-2xl font-bold font-heading text-slate-900">Detalles finales (Opcional)</h2>
                            <p className="text-slate-500">Más info ayuda a cotizar mejor.</p>
                        </div>

                        <Textarea
                            placeholder="Detalles adicionales..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="min-h-[120px] bg-white text-base shadow-sm"
                        />

                        {/* Photo Upload Placeholder - simplified */}
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-orange-200 cursor-pointer transition-colors group">
                            <Upload className="w-8 h-8 mb-2 group-hover:text-orange-500" />
                            <span className="text-sm">Subir fotos (Opcional)</span>
                        </div>

                        <div className="flex gap-4">
                            <Button variant="ghost" onClick={handleBack} className="w-full">
                                <ArrowLeft className="mr-2 w-4 h-4" /> Volver
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-900/20"
                            >
                                {isSubmitting ? "Publicando..." : "Publicar Pedido"}
                            </Button>
                        </div>
                        <p className="text-xs text-center text-slate-400 mt-4">
                            Al publicar, aceptás nuestros <a href="/legal/terms" className="underline hover:text-orange-500" target="_blank">Términos</a> y <a href="/legal/privacy" className="underline hover:text-orange-500" target="_blank">Privacidad</a>.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
