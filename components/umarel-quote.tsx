'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

export function UmarelQuote() {
    const t = useTranslations()
    const [quote, setQuote] = useState<string | null>(null)

    useEffect(() => {
        const quotes = t.raw('quotes') as string[]
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setQuote(quotes[Math.floor(Math.random() * quotes.length)])
    }, [t])

    if (!quote) return null

    return (
        <div className="text-center py-4 text-muted-foreground italic font-outfit">
            &quot;{quote}&quot; 👴🏻
        </div>
    )
}
