"use client"

import { useState, useEffect } from "react"
import { UnifiedCard } from "@/components/browse/unified-card"
import { Loader2 } from "lucide-react"

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchFavorites()
    }, [])

    const fetchFavorites = async () => {
        try {
            const res = await fetch('/api/favorites')
            if (res.ok) {
                const data = await res.json()
                // In a real app, we'd need to fetch the actual item details (request/offering)
                // For this MVP, we'll assume the API returns enriched data or we fetch it here
                // For now, let's just mock the enrichment or assume the API does it.
                // actually the current API just returns the relation. 
                // Let's update the API to return enriched data first.
                setFavorites(data)
            }
        } catch (error) {
            console.error('Failed to fetch favorites', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center p-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-5xl py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">My Favorites</h1>

            {favorites.length === 0 ? (
                <div className="text-center p-20 text-muted-foreground bg-muted/30 rounded-lg">
                    <p>No favorites saved yet.</p>
                    <p className="text-sm mt-2">Browse listings and click the heart icon to save them.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((fav) => (
                        <UnifiedCard
                            key={fav.id}
                            item={fav.item} // Assuming API returns 'item'
                            type={fav.type}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
