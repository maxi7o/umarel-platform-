'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, CheckCircle2, ChevronRight, ShieldCheck, User, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Step = 'intro' | 'dni_number' | 'id_front' | 'id_back' | 'selfie' | 'success';

export function VerificationWizard() {
    const t = useTranslations('verification');
    const [step, setStep] = useState<Step>('intro');
    const [dniNumber, setDniNumber] = useState('');
    const [images, setImages] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Refs for file inputs
    const frontInputRef = useRef<HTMLInputElement>(null);
    const backInputRef = useRef<HTMLInputElement>(null);
    const selfieInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => ({ ...prev, [type]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerInput = (ref: React.RefObject<HTMLInputElement | null>) => {
        ref.current?.click();
    };

    const handleSubmit = async () => {
        if (!dniNumber) {
            toast.error('Número de DNI requerido');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/verify/dni', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dniNumber, images }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.details || error.error || 'Error en la verificación');
            }

            const result = await response.json();

            // Success
            setIsSubmitting(false);
            setStep('success');
            toast.success(t('successTitle'));

        } catch (error) {
            console.error('Submit Error:', error);
            setIsSubmitting(false);
            toast.error((error as Error).message);
        }
    };

    const nextStep = (next: Step) => setStep(next);

    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
            if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };
        checkMobile();
    }, []);

    const StepIndicator = ({ current, total }: { current: number, total: number }) => (
        <div className="flex gap-2 mb-8 justify-center">
            {[1, 2, 3].map((num) => (
                <div
                    key={num}
                    className={`h-2 rounded-full transition-all duration-300 ${num <= current ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'
                        }`}
                />
            ))}
        </div>
    );

    if (isMobile === false) {
        return (
            <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden text-center p-8">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
                    <ShieldCheck size={40} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Dispositivo no permitido</h2>
                <p className="text-slate-500 mb-6 text-sm">
                    Para garantizar la seguridad de la identidad, este proceso solo puede realizarse desde un celular con cámara.
                </p>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6 inline-block">
                    {/* Placeholder for QR Code - In a real app we'd generate a specific URL */}
                    <div className="w-48 h-48 bg-white p-2 mx-auto">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${typeof window !== 'undefined' ? window.location.href : ''}`} alt="Scan to continue on mobile" className="w-full h-full" />
                    </div>
                </div>

                <p className="text-xs text-slate-400">
                    Escaneá el código QR con tu celular para continuar.
                </p>
            </div>
        );
    }

    if (isMobile === null) return null; // Loading state

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-8">

                <AnimatePresence mode="wait">

                    {/* INTRO STEP */}
                    {step === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="text-center py-8"
                        >
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                                <ShieldCheck size={40} />
                            </div>
                            <h2 className="text-2xl font-bold font-outfit text-slate-900 mb-4">{t('title')}</h2>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                {t('subtitle')}
                            </p>
                            <Button className="w-full h-12 text-lg rounded-xl bg-blue-600 hover:bg-blue-700" onClick={() => nextStep('dni_number')}>
                                Empezar
                                <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                        </motion.div>
                    )}

                    {/* DNI NUMBER STEP */}
                    {step === 'dni_number' && (
                        <motion.div
                            key="dni_number"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="flex gap-2 mb-8 justify-center">
                                {[1, 2, 3, 4].map((num) => (
                                    <div
                                        key={num}
                                        className={`h-2 rounded-full transition-all duration-300 ${num <= 1 ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`}
                                    />
                                ))}
                            </div>
                            <h3 className="text-xl font-bold text-center mb-2">{t('steps.dni')}</h3>
                            <p className="text-sm text-slate-500 text-center mb-6">{t('instructions.dni')}</p>

                            <div className="mb-8">
                                <input
                                    type="number"
                                    value={dniNumber}
                                    onChange={(e) => setDniNumber(e.target.value)}
                                    placeholder="ej. 30123456"
                                    className="w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 text-xl font-bold text-center tracking-widest focus:border-blue-500 focus:outline-none transition-colors"
                                    autoFocus
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button variant="ghost" onClick={() => setStep('intro')}>Volver</Button>
                                <Button
                                    disabled={dniNumber.length < 7}
                                    onClick={() => nextStep('id_front')}
                                    className="flex-1"
                                >
                                    Siguiente <ChevronRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* ID FRONT STEP */}
                    {step === 'id_front' && (
                        <motion.div
                            key="id_front"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="flex gap-2 mb-8 justify-center">
                                {[1, 2, 3, 4].map((num) => (
                                    <div
                                        key={num}
                                        className={`h-2 rounded-full transition-all duration-300 ${num <= 2 ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`}
                                    />
                                ))}
                            </div>
                            <h3 className="text-xl font-bold text-center mb-2">{t('steps.idFront')}</h3>
                            <p className="text-sm text-slate-500 text-center mb-6">{t('instructions.id')}</p>

                            <div
                                onClick={() => triggerInput(frontInputRef)}
                                className="aspect-video bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors relative overflow-hidden group"
                            >
                                <input ref={frontInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileChange(e, 'front')} />

                                {images.front ? (
                                    <Image src={images.front} alt="ID Front" fill className="object-cover" />
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <CreditCard className="text-blue-500" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-600">{t('upload')}</span>
                                    </>
                                )}
                            </div>

                            <div className="mt-8 flex justify-end">
                                <Button
                                    disabled={!images.front}
                                    onClick={() => nextStep('id_back')}
                                    className="w-full"
                                >
                                    Siguiente <ChevronRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* ID BACK STEP */}
                    {step === 'id_back' && (
                        <motion.div
                            key="id_back"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="flex gap-2 mb-8 justify-center">
                                {[1, 2, 3, 4].map((num) => (
                                    <div
                                        key={num}
                                        className={`h-2 rounded-full transition-all duration-300 ${num <= 3 ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`}
                                    />
                                ))}
                            </div>
                            <h3 className="text-xl font-bold text-center mb-2">{t('steps.idBack')}</h3>
                            <p className="text-sm text-slate-500 text-center mb-6">{t('instructions.id')}</p>

                            <div
                                onClick={() => triggerInput(backInputRef)}
                                className="aspect-video bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors relative overflow-hidden group"
                            >
                                <input ref={backInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileChange(e, 'back')} />

                                {images.back ? (
                                    <Image src={images.back} alt="ID Back" fill className="object-cover" />
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <CreditCard className="text-blue-500" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-600">{t('upload')}</span>
                                    </>
                                )}
                            </div>

                            <div className="mt-8 flex justify-between gap-4">
                                <Button variant="ghost" onClick={() => setStep('id_front')}>Volver</Button>
                                <Button
                                    disabled={!images.back}
                                    onClick={() => nextStep('selfie')}
                                    className="flex-1"
                                >
                                    Siguiente <ChevronRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* SELFIE STEP */}
                    {step === 'selfie' && (
                        <motion.div
                            key="selfie"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="flex gap-2 mb-8 justify-center">
                                {[1, 2, 3, 4].map((num) => (
                                    <div
                                        key={num}
                                        className={`h-2 rounded-full transition-all duration-300 ${num <= 4 ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`}
                                    />
                                ))}
                            </div>
                            <h3 className="text-xl font-bold text-center mb-2">{t('steps.selfie')}</h3>
                            <p className="text-sm text-slate-500 text-center mb-6">{t('instructions.selfie')}</p>

                            <div
                                onClick={() => triggerInput(selfieInputRef)}
                                className="aspect-[3/4] max-w-[240px] mx-auto bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors relative overflow-hidden group"
                            >
                                <input ref={selfieInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => handleFileChange(e, 'selfie')} />

                                {images.selfie ? (
                                    <Image src={images.selfie} alt="Selfie" fill className="object-cover" />
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <User className="text-blue-500 w-8 h-8" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-600">{t('camera')}</span>
                                    </>
                                )}
                            </div>

                            <div className="mt-8 flex justify-between gap-4">
                                <Button variant="ghost" onClick={() => setStep('id_back')}>Volver</Button>
                                <Button
                                    disabled={!images.selfie || isSubmitting}
                                    onClick={handleSubmit}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                    {isSubmitting ? t('submitting') : t('submit')}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* SUCCESS STEP */}
                    {step === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12"
                        >
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
                                <CheckCircle2 className="w-12 h-12 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('successTitle')}</h2>
                            <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                                {t('successDesc')}
                            </p>
                            <Button variant="outline" className="w-full" asChild>
                                <a href="/profile/me">{t('backToProfile')}</a>
                            </Button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}
