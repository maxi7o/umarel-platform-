'use server'

import { redirect } from 'next/navigation'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
    apiVersion: '2025-12-15.clover', // Use version matching installed types
})

export async function createCheckoutSession(quoteId: string, amount: number, title: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // In a real app, verify quote ownership and status

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `Umarel Service: ${title}`,
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/customer?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/customer?canceled=true`,
            metadata: {
                quoteId,
                userId: user.id,
            },
        })

        if (session.url) {
            redirect(session.url)
        }
    } catch (error) {
        console.error('Stripe Error:', error)
        // For MVP/Demo without real keys, we might want to simulate success
        if (process.env.STRIPE_SECRET_KEY === 'sk_test_...') {
            redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/customer?success=true&mock=true`)
        }
        throw error
    }
}
