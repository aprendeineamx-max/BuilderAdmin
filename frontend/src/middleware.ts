
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#middleware
    const {
        data: { session },
    } = await supabase.auth.getSession();

    const requestUrl = new URL(req.url);
    const path = requestUrl.pathname;

    // Protected routes pattern
    const protectedPaths = ['/dashboard', '/perfil', '/quiz', '/clase', '/chat', '/admin'];
    const isProtected = protectedPaths.some((p) => path.startsWith(p));

    // Auth routes (redirect if already logged in)
    const authPaths = ['/login', '/register'];
    const isAuthPage = authPaths.some((p) => path.startsWith(p));

    if (isProtected && !session) {
        // Redirect to login if accessing protected route without session
        const redirectUrl = new URL('/login', req.url);
        redirectUrl.searchParams.set('redirect', path); // Remember where they wanted to go
        return NextResponse.redirect(redirectUrl);
    }

    if (isAuthPage && session) {
        // Redirect to dashboard if accessing login/register while logged in
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Special Admin Check (can be enhanced later with role check)
    if (path.startsWith('/admin')) {
        // Ideally check for specific admin role/email here
        // For now, assuming any logged in user can see it as per current state, 
        // or we could restrict to specific emails. 
        // Leaving open for now as user just asked for general middleware.
    }

    return res;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - manifest.json (PWA manifest)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)',
    ],
};
