'use client'

import { useState, Suspense } from 'react'
import { Eye, EyeOff, AlertCircle, CheckCircle2, Facebook, Handshake } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

import { login, signup, signInWithGoogle, signInWithFacebook, signInWithMercadoPago } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useTranslations } from 'next-intl'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function LoginForm() {
    const t = useTranslations()
    const [showPassword, setShowPassword] = useState(false)
    const searchParams = useSearchParams()

    const error = searchParams.get('error')
    const message = searchParams.get('message')

    // SVG Logos for better branding
    const GoogleLogo = () => (
        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" role="img" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
        </svg>
    )

    const MercadoLibreLogo = () => (
        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 11C4 11 4.5 9 6.5 8C8.5 7 12 7 12 7" stroke="#2D3277" strokeWidth="2" strokeLinecap="round" />
            <path d="M20 11C20 11 19.5 9 17.5 8C15.5 7 12 7 12 7" stroke="#2D3277" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 11V15C7 15 7 17 12 17C17 17 17 15 17 15V11" stroke="#2D3277" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="9" stroke="#FFE600" strokeWidth="2" />
            <path d="M12 7V17" stroke="#2D3277" strokeWidth="2" />
        </svg>
    )

    const SSOButtons = () => (
        <div className="grid gap-3">
            <form action={signInWithGoogle} className="w-full">
                <Button variant="outline" className="w-full h-11 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium relative group" type="submit">
                    <div className="absolute left-4">
                        <GoogleLogo />
                    </div>
                    <span>Google</span>
                </Button>
            </form>
            <div className="grid grid-cols-2 gap-3">
                <form action={signInWithFacebook} className="w-full">
                    <Button variant="outline" className="w-full h-11 bg-[#1877F2]/5 hover:bg-[#1877F2]/10 border-blue-100 text-[#1877F2] font-medium" type="submit">
                        <Facebook className="mr-2 h-5 w-5" />
                        Facebook
                    </Button>
                </form>
                <form action={signInWithMercadoPago} className="w-full">
                    <Button variant="outline" className="w-full h-11 bg-[#FFE600]/10 hover:bg-[#FFE600]/20 border-yellow-200 text-[#2D3277] font-medium" type="submit">
                        <MercadoLibreLogo />
                        Mercado Libre
                    </Button>
                </form>
            </div>
        </div>
    )

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50 py-10 px-4">
            <Card className="w-full max-w-md shadow-xl border-slate-100 overflow-hidden">
                <div className="bg-slate-900 p-6 text-center">
                    <h2 className="text-2xl font-bold text-white tracking-tight">{t("login.title")}</h2>
                    <p className="text-slate-400 text-sm mt-1">{t("login.subtitle")}</p>
                </div>

                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 rounded-none h-14 bg-slate-100 p-1">
                        <TabsTrigger
                            value="login"
                            className="h-12 rounded-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-medium transition-all"
                        >
                            {t("login.signIn")}
                        </TabsTrigger>
                        <TabsTrigger
                            value="register"
                            className="h-12 rounded-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-medium transition-all"
                        >
                            {t("login.signUp")}
                        </TabsTrigger>
                    </TabsList>

                    <CardContent className="p-6 space-y-6">
                        {/* Error / Success Messages */}
                        {error && (
                            <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg flex items-start gap-3 border border-destructive/20">
                                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                                <p className="leading-snug">{error}</p>
                            </div>
                        )}
                        {message && (
                            <div className="bg-emerald-50/50 text-emerald-600 text-sm p-4 rounded-lg flex items-start gap-3 border border-emerald-100">
                                <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
                                <p className="leading-snug">{message}</p>
                            </div>
                        )}

                        <TabsContent value="login" className="space-y-6 mt-0">
                            <SSOButtons />

                            <div className="flex items-center gap-4">
                                <Separator className="flex-1" />
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t("login.or")}</span>
                                <Separator className="flex-1" />
                            </div>

                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">{t("login.email")}</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="mario@ejemplo.com"
                                        className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="password">{t("login.password")}</Label>
                                        <a href="/forgot-password" className="text-xs text-blue-600 hover:underline">Olvidé mi clave</a>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="h-11 pr-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
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
                                <Button formAction={login} className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-lg shadow-blue-200/50 hover:shadow-blue-200/80 transition-all">
                                    {t("login.signIn")}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="register" className="space-y-6 mt-0">
                            <SSOButtons />

                            <div className="flex items-center gap-4">
                                <Separator className="flex-1" />
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t("login.or")}</span>
                                <Separator className="flex-1" />
                            </div>

                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="reg-email">{t("login.email")}</Label>
                                    <Input
                                        id="reg-email"
                                        name="email"
                                        type="email"
                                        className="h-10"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-password">{t("login.password")}</Label>
                                    <Input
                                        id="reg-password"
                                        name="password"
                                        type="password"
                                        className="h-10"
                                        required
                                    />
                                </div>
                                <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-md border border-slate-100">
                                    <Checkbox id="terms" name="terms" required className="mt-1" />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm text-slate-600 leading-snug"
                                    >
                                        {t.rich('login.agreeToTerms', {
                                            terms: (chunks) => <a href="/legal/terms" className="font-medium text-blue-600 hover:underline">{chunks}</a>,
                                            privacy: (chunks) => <a href="/legal/privacy" className="font-medium text-blue-600 hover:underline">{chunks}</a>
                                        })}
                                    </label>
                                </div>
                                <Button formAction={signup} className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium">
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
