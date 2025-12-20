import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Create an unmodified response first to handle cookie setting on
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const {
        data: { session },
    } = await supabase.auth.getSession()

    const requestUrl = new URL(request.url);
    const path = requestUrl.pathname;

    // Protected routes pattern
    const protectedPaths = ['/dashboard', '/perfil', '/quiz', '/clase', '/chat', '/admin', '/comunidad'];
    const isProtected = protectedPaths.some((p) => path.startsWith(p));

    // Auth routes (redirect if already logged in)
    const authPaths = ['/login', '/register'];
    const isAuthPage = authPaths.some((p) => path.startsWith(p));

    if (isProtected && !session) {
        // Redirect to login if accessing protected route without session
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('redirect', path); // Remember where they wanted to go
        return NextResponse.redirect(redirectUrl);
    }

    if (isAuthPage && session) {
        // Redirect to dashboard if accessing login/register while logged in
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
