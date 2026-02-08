
/**
 * Verifik Service
 * Handles identity verification for Argentina using Verifik.co API
 */

export interface VerifikDniResponse {
    data: {
        fullname: string;
        firstname: string;
        lastname: string;
        documentNumber: string;
        documentType: string;
        gender?: string;
        birthDate?: string;
        [key: string]: any;
    };
    signature: string;
}

export async function verifyArgentinaDni(dni: string) {
    const apiToken = process.env.VERIFIK_API_TOKEN;

    if (!apiToken) {
        console.warn('VERIFIK_API_TOKEN is not set. Identity verification will be skipped or mocked.');
        // Return a mock success in development if needed, or throw error
        if (process.env.NODE_ENV === 'development') {
            return {
                data: {
                    fullname: "MOCK USER VERIFIK",
                    firstname: "MOCK",
                    lastname: "USER",
                    documentNumber: dni,
                    documentType: "DNIAR"
                },
                signature: "mock_signature"
            };
        }
        throw new Error('Verification service unavailable');
    }

    try {
        const url = `https://api.verifik.co/v2/ar/cedula?documentNumber=${dni}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Verifik API error: ${response.statusText}`);
        }

        const result: VerifikDniResponse = await response.json();
        return result;
    } catch (error) {
        console.error('Verifik DNI Verification Error:', error);
        throw error;
    }
}
