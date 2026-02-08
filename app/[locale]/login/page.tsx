'use client'

import { useState, Suspense } from 'react'
import { Eye, EyeOff, AlertCircle, CheckCircle2, Facebook } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

import { login, signup, signInWithGoogle, signInWithFacebook, signInWithMercadoPago } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function LoginForm() {
    const t = useTranslations()
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const searchParams = useSearchParams()

    const error = searchParams.get('error')
    const message = searchParams.get('message')

    // SVG Logos for better branding
    const GoogleLogo = () => (
        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" role="img" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            <path fill="none" d="M0 0h48v48H0z" />
        </svg>
    )

    const MercadoPagoLogo = () => (
        <svg className="mr-2 h-5 w-5" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="256" cy="256" r="256" fill="#009ee3" />
            <path d="M366.5 321.4l-68.5-35.9-4.8 4.8 68.5 35.9 4.8-4.8zm-221 0l68.5-35.9 4.8 4.8-68.5 35.9-4.8-4.8zm110.5-26.6l-47.5-66.4-7.9 7.9 47.5 66.4 7.9-7.9zm0 0l47.5-66.4 7.9 7.9-47.5 66.4-7.9 7.9zm0-56.1c-16.1 0-29.2-13.1-29.2-29.2s13.1-29.2 29.2-29.2 29.2 13.1 29.2 29.2-13.1 29.2-29.2 29.2z" fill="white" />
        </svg>
    )

    const FacebookLogo = () => (
        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    )

    const SSOButtons = () => (
        <div className="grid gap-3">
            <form action={signInWithGoogle} className="w-full">
                <Button variant="outline" className="w-full h-11 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-bold relative group shadow-sm transition-all hover:border-slate-300 rounded-xl" type="submit">
                    <div className="absolute left-4">
                        <GoogleLogo />
                    </div>
                    <span>Google</span>
                </Button>
            </form>
            <div className="grid grid-cols-2 gap-3">
                <form action={signInWithFacebook} className="w-full">
                    <Button variant="outline" className="w-full h-11 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-bold rounded-xl" type="submit">
                        <FacebookLogo />
                        Facebook
                    </Button>
                </form>
                <form action={signInWithMercadoPago} className="w-full">
                    <Button variant="outline" className="w-full h-11 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-bold rounded-xl" type="submit">
                        <MercadoPagoLogo />
                        Mercado Pago
                    </Button>
                </form>
            </div>
        </div>
    )

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-slate-50 py-12 px-4 font-outfit">
            <Card className="w-full max-w-[440px] shadow-2xl border-white/40 bg-white/80 backdrop-blur-xl overflow-hidden ring-1 ring-slate-100 rounded-3xl">
                <div className="p-8 text-center pb-4">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
                        {t("login.title")}
                    </h2>
                    <p className="text-slate-500 font-medium mt-1.5">{t("login.subtitle")}</p>
                </div>

                <Tabs defaultValue="login" className="w-full">
                    <div className="px-8 mb-2">
                        <TabsList className="grid w-full grid-cols-2 h-12 bg-slate-100/50 p-1 rounded-xl border border-slate-100">
                            <TabsTrigger
                                value="login"
                                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-bold transition-all text-slate-500"
                            >
                                {t("login.signIn")}
                            </TabsTrigger>
                            <TabsTrigger
                                value="register"
                                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-bold transition-all text-slate-500"
                            >
                                {t("login.signUp")}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <CardContent className="px-8 pb-8 pt-4 space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl flex items-start gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                                <p className="leading-snug font-medium">{error}</p>
                            </div>
                        )}
                        {message && (
                            <div className="bg-emerald-50 text-emerald-600 text-sm p-4 rounded-xl flex items-start gap-3 border border-emerald-100 animate-in fade-in slide-in-from-top-2">
                                <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
                                <p className="leading-snug font-medium">{message}</p>
                            </div>
                        )}

                        <TabsContent value="login" className="space-y-6 mt-0">
                            <SSOButtons />

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-100" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-3 text-slate-400 font-bold tracking-widest">{t("login.or")}</span>
                                </div>
                            </div>

                            <form action={login} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-700 font-bold ml-1">{t("login.email")}</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="ej. mhamu@umarel.org"
                                        className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <Label htmlFor="password" className="text-slate-700 font-bold">{t("login.password")}</Label>
                                        <a href="/forgot-password" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">Olvidé mi clave</a>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="h-12 pr-11 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl transition-all"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-slate-400 hover:text-slate-600"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 ml-1">
                                    <Checkbox
                                        id="remember"
                                        checked={rememberMe}
                                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                        className="rounded border-slate-300 data-[state=checked]:bg-blue-600"
                                    />
                                    <label htmlFor="remember" className="text-sm font-medium text-slate-500 cursor-pointer select-none">Recordar mi cuenta</label>
                                </div>

                                <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                    {t("login.signIn")}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="register" className="space-y-6 mt-0">
                            <SSOButtons />

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-100" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-3 text-slate-400 font-bold tracking-widest">{t("login.or")}</span>
                                </div>
                            </div>

                            <form action={signup} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="reg-email" className="text-slate-700 font-bold ml-1">{t("login.email")}</Label>
                                    <Input
                                        id="reg-email"
                                        name="email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-password" className="text-slate-700 font-bold ml-1">{t("login.password")}</Label>
                                    <div className="relative">
                                        <Input
                                            id="reg-password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="h-12 pr-11 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl transition-all"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-slate-400 hover:text-slate-600"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-4 bg-slate-50/50 rounded-xl border border-slate-100 focus-within:border-blue-100 transition-colors">
                                    <Checkbox id="terms" name="terms" required className="mt-1 border-slate-300 data-[state=checked]:bg-blue-600" />
                                    <label
                                        htmlFor="terms"
                                        className="text-xs text-slate-500 leading-relaxed font-medium"
                                    >
                                        {t.rich('login.agreeToTerms', {
                                            terms: (chunks) => <a href="/legal/terms" className="font-bold text-blue-600 hover:underline">{chunks}</a>,
                                            privacy: (chunks) => <a href="/legal/privacy" className="font-bold text-blue-600 hover:underline">{chunks}</a>
                                        })}
                                    </label>
                                </div>
                                <Button className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                    {t("login.signUp")} (Crear Cuenta)
                                </Button>
                            </form>
                        </TabsContent>
                    </CardContent>
                </Tabs>
            </Card>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}
