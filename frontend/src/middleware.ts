import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    // Refresh session if expired - required for Server Components
    const {
        data: { session },
    } = await supabase.auth.getSession();

    const pathname = req.nextUrl.pathname;

    // Protected routes
    const protectedRoutes = ['/dashboard', '/perfil', '/quiz'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Admin routes
    const isAdminRoute = pathname.startsWith('/admin');

    // Verify auth for protected routes
    if (isProtectedRoute && !session) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/login';
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
    }

    // Basic admin protection (idealmente usar roles reales)
    if (isAdminRoute) {
        // For now allow access but ideally check user metadata role
        // if (!session || session.user.email !== 'admin@inea.mx') ...
        if (!session) {
            const redirectUrl = req.nextUrl.clone();
            redirectUrl.pathname = '/login';
            return NextResponse.redirect(redirectUrl);
        }
    }

    return res;
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/perfil/:path*',
        '/quiz/:path*',
        '/admin/:path*'
    ],
};
