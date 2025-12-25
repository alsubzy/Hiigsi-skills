import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define public routes that don't require authentication
const publicRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/api/auth/login', '/api/auth/register', '/api/auth/forgot-password', '/api/auth/reset-password', '/api/auth/admin-register'];

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    console.log(`[MIDDLEWARE] Processing request for: ${pathname}`);

    // Allow public routes
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        // Check if user is already authenticated on a public route
        const token = request.cookies.get('auth-token')?.value;
        if (token) {
            console.log(`[MIDDLEWARE] Token found on public route ${pathname}. Attempting redirect to dashboard.`);
            // We can't verify here cleanly without duplicating logic, but we can assume if token exists, we try dashboard
            // The dashboard route will verify it fully. If invalid, it will bump back to sign-in.
            // This simple check prevents the "stuck on sign-in" loop.
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }

    // Allow static files and Next.js internals
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot)$/)
    ) {
        return NextResponse.next();
    }

    // Get auth token from cookie
    const token = request.cookies.get('auth-token')?.value;

    // If no token
    if (!token) {
        console.warn(`[MIDDLEWARE] No token found for ${pathname}. Redirecting to sign-in.`);

        // For API routes, return JSON error instead of redirect
        if (pathname.startsWith('/api/')) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // For pages, redirect to sign-in
        const url = request.nextUrl.clone();
        url.pathname = '/sign-in';
        return NextResponse.redirect(url);
    }

    // Verify token using jose (Edge compatible)
    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        // Check if user is trying to access admin routes
        if (pathname.startsWith('/dashboard/admin') || pathname.startsWith('/api/admin')) {
            const roles = (payload.roles as string[]) || [];
            const isAdmin = roles.some((role: string) => {
                const roleLower = role.toLowerCase();
                return roleLower === 'admin' || roleLower === 'super_admin';
            });

            if (!isAdmin) {
                console.warn(`[MIDDLEWARE] Access Denied for ${pathname}. User roles: ${roles.join(', ')}`);

                // Non-admin trying to access admin routes
                if (pathname.startsWith('/api/')) {
                    return NextResponse.json(
                        { error: 'Forbidden: Admin access required' },
                        { status: 403 }
                    );
                }

                // Redirect to regular dashboard
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        }

        console.log(`[MIDDLEWARE] Access Granted for ${pathname}`);
        return NextResponse.next();

    } catch (error) {
        console.error(`[MIDDLEWARE] Token verification failed for ${pathname}:`, error);

        // Invalid token
        if (pathname.startsWith('/api/')) {
            const response = NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
            response.cookies.delete('auth-token');
            return response;
        }

        // For pages, clear cookie and redirect to sign-in
        const response = NextResponse.redirect(new URL('/sign-in', request.url));
        response.cookies.delete('auth-token');
        return response;
    }
}

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};
