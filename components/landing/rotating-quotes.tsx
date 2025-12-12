"use client"

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface ItalianQuote {
    italian: string;
    key: string;
}

const ITALIAN_QUOTES: ItalianQuote[] = [
    {
        italian: "Umarel: chi guarda il cantiere con le mani dietro la schiena",
        key: "q1"
    },
    {
        italian: "L'umarel sa sempre come fare meglio",
        key: "q2"
    },
    {
        italian: "Se non fosse per l'umarel, il lavoro non finirebbe mai",
        key: "q3"
    },
    {
        italian: "Ogni umarel ha la soluzione che nessuno ha chiesto",
        key: "q4"
    },
    {
        italian: "L'umarel: l'esperto che non serve... ma serve sempre",
        key: "q5"
    }
];

export function RotatingQuotes() {
    const t = useTranslations('landing.italianQuotes');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);

            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % ITALIAN_QUOTES.length);
                setIsVisible(true);
            }, 500);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const currentQuote = ITALIAN_QUOTES[currentIndex];

    return (
        <div className="max-w-2xl mx-auto text-center">
            <div
                className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                <p className="text-lg italic text-gray-600 dark:text-gray-400 mb-2 font-hand">
                    "{currentQuote.italian}"
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                    → {t(currentQuote.key)}
                </p>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-4">
                {ITALIAN_QUOTES.map((_, index) => (
                    <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all ${index === currentIndex
                            ? 'w-8 bg-orange-600'
                            : 'w-1.5 bg-gray-300 dark:bg-gray-600'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
