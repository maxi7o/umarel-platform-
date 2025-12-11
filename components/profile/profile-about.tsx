"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProfileAboutProps {
    bio?: string
}

export function ProfileAbout({ bio }: ProfileAboutProps) {
    if (!bio) return null

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {bio}
                </p>
            </CardContent>
        </Card>
    )
}
