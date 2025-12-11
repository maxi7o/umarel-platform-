'use client'

import { login, signup, signInWithGoogle } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useTranslations } from 'next-intl'

export default function LoginPage() {
    const t = useTranslations()

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
                    <form action={signInWithGoogle}>
                        <Button variant="outline" className="w-full" type="submit">
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                            {t("login.googleButton")}
                        </Button>
                    </form>
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
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button formAction={login} className="w-full bg-orange-600 hover:bg-orange-700">{t("login.signIn")}</Button>
                            <Button formAction={signup} variant="outline" className="w-full">{t("login.signUp")}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
