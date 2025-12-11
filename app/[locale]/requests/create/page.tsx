'use client'

import { createRequest } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LocationInput } from '@/components/forms/location-input'

export default function CreateRequestPage() {
    const t = useTranslations()

    return (
        <div className="container py-10 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">{t("createRequest.title")}</CardTitle>
                    <CardDescription>
                        {t("createRequest.subtitle")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={createRequest} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">{t("createRequest.form.title")}</Label>
                            <Input id="title" name="title" placeholder={t("createRequest.form.titlePlaceholder")} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">{t("createRequest.form.description")}</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder={t("createRequest.form.descPlaceholder")}
                                className="min-h-[150px]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">{t("createRequest.form.location")}</Label>
                            <LocationInput
                                name="location"
                                placeholder={t("createRequest.form.locationPlaceholder")}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{t("createRequest.form.photos")}</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                                <Upload className="h-8 w-8 mb-2" />
                                <span className="text-sm">{t("createRequest.form.uploadText")}</span>
                                <input type="file" name="photos" multiple className="hidden" />
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6">
                            {t("createRequest.form.submit")}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
