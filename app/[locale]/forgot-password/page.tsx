'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)
        setError(null)

        const supabase = createClient()
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
        })

        if (error) {
            setError(error.message)
        } else {
            setMessage('Se envió un link de recuperación a tu email.')
        }
        setLoading(false)
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4">
            <Card className="w-full max-w-md shadow-2xl border-white/40 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden ring-1 ring-slate-100">
                <CardHeader className="p-8 pb-4 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-stone-900" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">¿Olvidaste tu clave?</CardTitle>
                    <CardDescription className="text-slate-500 font-medium">
                        No hay problema. Ingresá tu email y te mandamos un link para que elijas una nueva.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-6">
                    {error && (
                        <div className="bg-stone-50 text-stone-900 text-sm p-4 rounded-xl flex items-start gap-3 border border-stone-200">
                            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                            <p className="leading-snug font-medium">{error}</p>
                        </div>
                    )}
                    {message && (
                        <div className="bg-stone-900 text-stone-900 text-sm p-4 rounded-xl flex items-start gap-3 border border-emerald-100">
                            <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
                            <p className="leading-snug font-medium">{message}</p>
                        </div>
                    )}

                    <form onSubmit={handleReset} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-bold ml-1">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl transition-all"
                                required
                            />
                        </div>
                        <Button
                            className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
                            disabled={loading}
                        >
                            {loading ? 'Enviando...' : 'Enviar Link de Recuperación'}
                        </Button>
                    </form>

                    <div className="text-center pt-2">
                        <Link href="/login" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver al Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
