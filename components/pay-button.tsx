'use client'

import { createCheckoutSession } from '@/app/actions/stripe'
import { Button } from '@/components/ui/button'
import { CreditCard } from 'lucide-react'

export function PayButton({ quoteId, amount, title }: { quoteId: string, amount: number, title: string }) {
    return (
        <form action={() => createCheckoutSession(quoteId, amount, title)}>
            <Button className="gap-2 bg-green-600 hover:bg-green-700">
                <CreditCard className="h-4 w-4" />
                Pay €{(amount / 100).toFixed(2)}
            </Button>
        </form>
    )
}
