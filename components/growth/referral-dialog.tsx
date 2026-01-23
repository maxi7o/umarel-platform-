"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Gift, Copy, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import Image from 'next/image'

export function ReferralDialog({ trigger }: { trigger?: React.ReactNode }) {
    const t = useTranslations('referral')
    const [copied, setCopied] = useState(false)
    const shareLink = "https://elentendido.ar"

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink)
        setCopied(true)
        toast.success(t('linkCopied'))
        setTimeout(() => setCopied(false), 2000)
    }

    const handleWhatsApp = () => {
        const text = encodeURIComponent(t('whatsappMessage'))
        window.open(`https://wa.me/?text=${text}`, '_blank')
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-orange-400 hover:bg-orange-400/10 transition-colors">
                        <Gift className="w-5 h-5" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
                <div className="bg-orange-500 p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                            <Gift className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white font-heading mb-2">{t('title')}</h2>
                        <p className="text-orange-100 text-sm max-w-[250px] mx-auto">
                            {t('subtitle')}
                        </p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('shareLink')}</label>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 font-mono truncate">
                                {shareLink}
                            </div>
                            <Button size="icon" variant="outline" onClick={handleCopy} className={copied ? "text-green-600 border-green-200 bg-green-50" : ""}>
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>

                    <Button onClick={handleWhatsApp} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
                        <div className="relative w-5 h-5 mr-2 shrink-0">
                            <Image
                                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                                alt="WhatsApp"
                                fill
                                className="object-contain brightness-0 invert"
                            />
                        </div>
                        {t('shareWhatsApp')}
                    </Button>

                    <div className="text-center">
                        <p className="text-xs text-slate-400">
                            {t('disclaimer')}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
