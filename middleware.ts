import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';
import { type NextRequest, NextResponse } from 'next/server';

// Create the intl middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    const host = request.headers.get('host');

    // Domain-based routing: Force umarel.org to "Under Construction"
    if (host && host.includes('umarel.org')) {
        const { pathname } = request.nextUrl;
        if (!pathname.startsWith('/construction') && !pathname.includes('/_next/') && !pathname.includes('/api/')) {
            return NextResponse.rewrite(new URL('/construction', request.url));
        }
    }

    // First, handle internationalization
    const response = intlMiddleware(request);

    // Then, update the Supabase session
    return await updateSession(request, response);
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
