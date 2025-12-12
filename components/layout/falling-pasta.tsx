"use client"

import { useEffect, useState } from "react"

// The Ingredients of Chaos 🍝
const INGREDIENTS = [
    "/images/falling-food/cannoli.png",
    "/images/falling-food/tiramisu.png",
    "/images/falling-food/meatball.png"
]

interface Pasta {
    id: number
    src: string
    left: number // 0-100%
    delay: number // seconds
    duration: number // seconds
    rotation: number // degrees
    scale: number // 0.5 - 2.5
    blur: number // 0 - 4px
}

export function FallingPasta() {
    const [pastas, setPastas] = useState<Pasta[]>([])

    useEffect(() => {
        // Generate a random messy batch on mount
        const batchSize = 20
        const newPastas = Array.from({ length: batchSize }).map((_, i) => {
            const scale = 0.5 + Math.random() * 2; // Random size
            return {
                id: i,
                src: INGREDIENTS[Math.floor(Math.random() * INGREDIENTS.length)],
                left: Math.random() * 100,
                delay: Math.random() * 10,
                duration: 10 + Math.random() * 15,
                rotation: Math.random() * 360,
                scale: scale,
                blur: scale < 1 ? 2 : 0 // Blur smaller items (background)
            }
        })
        setPastas(newPastas)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
            {pastas.map((pasta) => (
                <div
                    key={pasta.id}
                    className="absolute top-[-200px] opacity-80 hover:opacity-100 transition-opacity duration-300 cursor-help"
                    style={{
                        left: `${pasta.left}%`,
                        width: `${100 * pasta.scale}px`, // Explicit width based on scale
                        filter: `blur(${pasta.blur}px)`,
                        animation: `fall ${pasta.duration}s linear infinite`,
                        animationDelay: `-${pasta.delay}s`,
                        zIndex: pasta.scale > 1.5 ? 60 : 40, // Big items on top
                    }}
                >
                    <div style={{ transform: `rotate(${pasta.rotation}deg)` }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={pasta.src}
                            alt="falling food"
                            className="w-full h-auto drop-shadow-lg"
                        />
                    </div>
                </div>
            ))}
            <style jsx>{`
                @keyframes fall {
                    0% {
                        transform: translateY(-20vh) rotate(0deg);
                    }
                    100% {
                        transform: translateY(120vh) rotate(360deg);
                    }
                }
            `}</style>
        </div>
    )
}
