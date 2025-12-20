"use client"

import { useEffect, useState } from "react"

const PROPS = [
    { src: "/images/props/plate.png", type: "plate", width: 180 },
    { src: "/images/props/wine-glass.png", type: "glass", width: 80 },
    { src: "/images/props/cutlery.png", type: "cutlery", width: 60 },
    { src: "/images/props/napkin.png", type: "napkin", width: 100 },
]

const FOOD = [
    { src: "/images/falling-food/cannoli.png", width: 100 },
    { src: "/images/falling-food/tiramisu.png", width: 120 },
    { src: "/images/falling-food/meatball.png", width: 90 },
]

interface TableItem {
    id: number
    src: string
    top: number // px
    left: string // css value (e.g. "5%", "85%")
    rotation: number
    scale: number
    zIndex: number
    width: number
}

export function InteractiveTable() {
    const [items, setItems] = useState<TableItem[]>([])

    const MAX_HEIGHT = 4000;
    const SECTION_GAP = 500;

    useEffect(() => {
        // Generate a "Messy Family Dinner" setting
        const newItems: TableItem[] = []
        let idCount = 0

        // ULTRA GENEROUS LEFT TABLE (Alfredo's)
        // 1. Valid Alfredo Pasta Platter
        newItems.push({
            id: idCount++,
            src: "/images/props/alfredo_pasta.png",
            top: 150,
            left: "-5%", // Hanging off the left slightly
            rotation: 12,
            scale: 1.2,
            zIndex: 50,
            width: 350 // Large!
        });

        // 2. Antipasto Board overlapping
        newItems.push({
            id: idCount++,
            src: "/images/props/antipasto_board.png",
            top: 450,
            left: "2%",
            rotation: -5,
            scale: 1.1,
            zIndex: 45,
            width: 300
        });

        for (let y = 100; y < MAX_HEIGHT; y += SECTION_GAP) {
            const side = Math.random() > 0.5 ? 'left' : 'right'; // Dominant side per section or both?

            // Left Side Group (Background items behind the heroes)
            if (Math.random() > 0.2) {
                const baseX = 2 + Math.random() * 5; // 2-7%
                const baseY = y + Math.random() * 50;

                // Skip placement if it interferes with our heroes at top
                if (y < 800) continue;

                // Napkin (Messy)
                newItems.push({
                    id: idCount++,
                    src: "/images/props/napkin.png",
                    top: baseY + Math.random() * 20,
                    left: `${baseX}%`,
                    rotation: Math.random() * 40 - 20,
                    scale: 1,
                    zIndex: 10,
                    width: 140
                })
                // Plate (Off-center)
                const plateX = baseX + 2 + Math.random() * 2;
                newItems.push({
                    id: idCount++,
                    src: "/images/props/plate.png",
                    top: baseY + 20,
                    left: `${plateX}%`,
                    rotation: Math.random() * 360,
                    scale: 1,
                    zIndex: 20,
                    width: 180
                })
                // Cutlery (Scattered)
                newItems.push({
                    id: idCount++,
                    src: "/images/props/cutlery.png",
                    top: baseY + 40 + Math.random() * 30,
                    left: `${plateX + 12}%`,
                    rotation: -10 + Math.random() * 30,
                    scale: 0.9,
                    zIndex: 25,
                    width: 60
                })
                // Wine (Half drunk, random placement)
                newItems.push({
                    id: idCount++,
                    src: "/images/props/wine-glass.png",
                    top: baseY - 60 + Math.random() * 40,
                    left: `${plateX + 8}%`,
                    rotation: Math.random() * 20 - 10,
                    scale: 1,
                    zIndex: 30,
                    width: 70
                })

                // Leftovers / Food
                if (Math.random() > 0.3) {
                    const food = FOOD[Math.floor(Math.random() * FOOD.length)]
                    newItems.push({
                        id: idCount++,
                        src: food.src,
                        top: baseY + 50 + Math.random() * 20,
                        left: `${plateX + 2}%`,
                        rotation: Math.random() * 360,
                        scale: 0.9,
                        zIndex: 40,
                        width: food.width
                    })
                }
            }

            // Right Side Group (Staggered y)
            if (Math.random() > 0.2) {
                const baseX = 80 + Math.random() * 5; // 80-85%
                const baseY = y + 250 + Math.random() * 50;

                // Napkin
                newItems.push({
                    id: idCount++,
                    src: "/images/props/napkin.png",
                    top: baseY,
                    left: `${baseX}%`,
                    rotation: Math.random() * 40 - 20,
                    scale: 1,
                    zIndex: 10,
                    width: 140
                })
                // Plate
                const plateX = baseX - 2 + Math.random() * 2;
                newItems.push({
                    id: idCount++,
                    src: "/images/props/plate.png",
                    top: baseY + 20,
                    left: `${plateX}%`,
                    rotation: Math.random() * 360,
                    scale: 1,
                    zIndex: 20,
                    width: 180
                })
                // Wine
                newItems.push({
                    id: idCount++,
                    src: "/images/props/wine-glass.png",
                    top: baseY - 50 + Math.random() * 40,
                    left: `${plateX - 5}%`,
                    rotation: Math.random() * 20 - 10,
                    scale: 1,
                    zIndex: 30,
                    width: 70
                })
                // Food
                if (Math.random() > 0.3) {
                    const food = FOOD[Math.floor(Math.random() * FOOD.length)]
                    newItems.push({
                        id: idCount++,
                        src: food.src,
                        top: baseY + 50 + Math.random() * 20,
                        left: `${plateX}%`,
                        rotation: Math.random() * 360,
                        scale: 0.9,
                        zIndex: 40,
                        width: food.width
                    })
                }
            }
        }

        setItems(newItems)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden isolate">
            {/* The Wooden Table Background */}
            <div
                className="absolute inset-0 z-0 opacity-100"
                style={{
                    backgroundImage: `url('/images/table-texture.png')`,
                    backgroundSize: '120%', // Zoomed in to avoid repeat
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'brightness(0.95)'
                }}
            />

            {/* The Tableware & Food */}
            <div className="absolute inset-0 z-10 w-full h-full overflow-hidden">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="absolute drop-shadow-2xl transition-transform duration-700 hover:scale-105 hover:rotate-2"
                        style={{
                            top: `${item.top}px`,
                            left: item.left, // Now supports negative values or px if string
                            width: `${item.width}px`,
                            transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
                            zIndex: item.zIndex,
                        }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={item.src}
                            alt="table item"
                            className="w-full h-auto"
                        />
                    </div>
                ))}
            </div>

            {/* Gradient Overlay to ensure text readability in center */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/90 via-white/85 to-white/90 w-full h-full pointer-events-none backdrop-blur-[2px]" />
        </div>
    )
}

