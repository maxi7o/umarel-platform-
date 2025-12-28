
const MERCADOPAGO_APP_ID = process.env.MERCADOPAGO_APP_ID!;
const MERCADOPAGO_CLIENT_SECRET = process.env.MERCADOPAGO_CLIENT_SECRET!;
const MERCADOPAGO_REDIRECT_URI = process.env.MERCADOPAGO_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/mercadopago/callback`;

export function getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
        client_id: MERCADOPAGO_APP_ID,
        response_type: 'code',
        platform_id: 'mp',
        state: state,
        redirect_uri: MERCADOPAGO_REDIRECT_URI,
    });
    return `https://auth.mercadopago.com.ar/authorization?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string) {
    const response = await fetch('https://api.mercadopago.com/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            client_secret: MERCADOPAGO_CLIENT_SECRET,
            client_id: MERCADOPAGO_APP_ID,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: MERCADOPAGO_REDIRECT_URI,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to exchange token: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    return response.json();
}
