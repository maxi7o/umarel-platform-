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

function LoginForm() {
    const t = useTranslations()
    const [showPassword, setShowPassword] = useState(false)
    const searchParams = useSearchParams()

    const error = searchParams.get('error')
    const message = searchParams.get('message')

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">{t("login.title")}</CardTitle>
                    <CardDescription className="text-center">
                        {t("login.subtitle")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Error / Success Messages */}
                    {error && (
                        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            <p>{error}</p>
                        </div>
                    )}
                    {message && (
                        <div className="bg-emerald-500/15 text-emerald-600 text-sm p-3 rounded-md flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            <p>{message}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-3 mb-4">
                        <form action={signInWithGoogle}>
                            <Button variant="outline" className="w-full" type="submit">
                                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                </svg>
                                Google
                            </Button>
                        </form>
                        <div className="grid grid-cols-2 gap-3">
                            <form action={signInWithFacebook}>
                                <Button variant="outline" className="w-full" type="submit">
                                    <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                                    Facebook
                                </Button>
                            </form>
                            <form action={signInWithMercadoPago}>
                                <Button variant="outline" className="w-full" type="submit">
                                    <Handshake className="mr-2 h-4 w-4 text-blue-400" />
                                    Mercado Pago
                                </Button>
                            </form>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Separator className="flex-1" />
                        <span className="text-xs text-muted-foreground">{t("login.or")}</span>
                        <Separator className="flex-1" />
                    </div>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">{t("login.email")}</Label>
                            <Input id="email" name="email" type="email" placeholder="mario.rossi@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{t("login.password")}</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span className="sr-only">
                                        {showPassword ? "Hide password" : "Show password"}
                                    </span>
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="terms" name="terms" required />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {t.rich('login.agreeToTerms', {
                                    terms: (chunks) => <a href="/legal/terms" className="underline hover:text-blue-600 transition-colors">{chunks}</a>,
                                    privacy: (chunks) => <a href="/legal/privacy" className="underline hover:text-blue-600 transition-colors">{chunks}</a>
                                })}
                            </label>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button formAction={login} className="w-full bg-blue-600 hover:bg-blue-700">{t("login.signIn")}</Button>
                            <Button formAction={signup} variant="outline" className="w-full">{t("login.signUp")}</Button>
                        </div>
                    </form>
                </CardContent>
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
