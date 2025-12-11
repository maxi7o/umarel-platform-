"use client"

import { useState, useEffect } from "react"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileAbout } from "@/components/profile/profile-about"
import { UnifiedCard } from "@/components/browse/unified-card"
import { PromoteButton } from "@/components/payment/promote-button"
import { Loader2 } from "lucide-react"

// Mock user ID for now
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

export default function ProfilePage({ params }: { params: { id: string } }) {
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`/api/profiles/${params.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setUser(data)
                }
            } catch (error) {
                console.error('Failed to fetch profile', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [params.id])

    if (isLoading) {
        return (
            <div className="flex justify-center p-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="text-center p-20 text-muted-foreground">
                User not found
            </div>
        )
    }

    const isOwnProfile = user.id === MOCK_USER_ID

    return (
        <div className="container mx-auto max-w-5xl py-8 px-4">
            <ProfileHeader user={user} isOwnProfile={isOwnProfile} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <ProfileAbout bio={user.profile?.bio} />

                    <h2 className="text-xl font-bold mb-4">Service Offerings</h2>
                    <div className="space-y-4">
                        {user.offerings?.length > 0 ? (
                            user.offerings.map((offering: any) => (
                                <div key={offering.id} className="relative group">
                                    <UnifiedCard
                                        item={offering}
                                        type="offering"
                                    />
                                    {isOwnProfile && !offering.featured && (
                                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <PromoteButton offeringId={offering.id} />
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground">No active service offerings.</p>
                        )}
                    </div>
                </div>

                <div className="md:col-span-1">
                    {/* Sidebar content like stats, reviews, etc. */}
                </div>
            </div>
        </div>
    )
}
