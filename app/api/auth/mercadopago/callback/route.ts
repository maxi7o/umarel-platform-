
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { exchangeCodeForToken } from '@/lib/payments/mercadopago-oauth';
import { db } from '@/lib/db';
import { userWallets } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // In prod, verify this matches the cookie

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    try {
        const tokenData = await exchangeCodeForToken(code);

        // Update user_wallets with the token data
        await db.update(userWallets)
            .set({
                mercadoPagoUserId: tokenData.user_id?.toString(),
                mercadoPagoAccessToken: tokenData.access_token,
                mercadoPagoRefreshToken: tokenData.refresh_token,
                mercadoPagoTokenExpiresAt: new Date(Date.now() + (tokenData.expires_in * 1000)),
                mercadoPagoPublicKey: tokenData.public_key,
                updatedAt: new Date(),
            })
            .where(eq(userWallets.userId, user.id));

        // Redirect back to wallet with success param
        return NextResponse.redirect(new URL('/wallet?connected=true', req.url));

    } catch (error) {
        console.error('MercadoPago Auth Error:', error);
        return NextResponse.redirect(new URL('/wallet?error=mercadopago_connection_failed', req.url));
    }
}
