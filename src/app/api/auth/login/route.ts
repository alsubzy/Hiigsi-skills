import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth-utils';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
    console.log('[LOGIN] Starting new login request');

    try {
        // 1. Validations of Environment
        if (!process.env.JWT_SECRET) {
            console.error('[LOGIN CRITICAL] JWT_SECRET is not defined in environment variables');
            return NextResponse.json(
                { error: 'System configuration error: Missing JWT_SECRET' },
                { status: 500 }
            );
        }

        // 2. Body Parsing
        let body;
        try {
            body = await request.json();
        } catch (parseError) {
            console.error('[LOGIN] Failed to parse request body:', parseError);
            return NextResponse.json(
                { error: 'Invalid JSON request body' },
                { status: 400 }
            );
        }

        const validation = loginSchema.safeParse(body);

        if (!validation.success) {
            console.warn('[LOGIN] Validation failed:', validation.error.errors[0].message);
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { email, password } = validation.data;
        console.log(`[LOGIN] Attempting login for email: ${email}`);

        // 3. Database Lookup
        let user;
        try {
            user = await prisma.user.findUnique({
                where: { email },
                include: {
                    roles: {
                        include: {
                            role: true,
                        },
                    },
                },
            });
        } catch (dbError) {
            console.error('[LOGIN] Database error during user lookup:', dbError);
            return NextResponse.json(
                { error: 'Database connection failed' },
                { status: 500 }
            );
        }

        if (!user) {
            console.warn(`[LOGIN] User not found: ${email}`);
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // 4. Status Checks
        if (!user.isActive || user.status !== 'ACTIVE') {
            console.warn(`[LOGIN] User inactive: ${email}, Status: ${user.status}, Active: ${user.isActive}`);
            return NextResponse.json(
                { error: 'Your account is inactive. Please contact administrator.' },
                { status: 403 }
            );
        }

        if (!user.passwordHash) {
            console.warn(`[LOGIN] Missing password hash for user: ${email}`);
            return NextResponse.json(
                { error: 'Account setup incomplete (no password). Contact admin.' },
                { status: 401 }
            );
        }

        // 5. Password Verification
        let isValidPassword = false;
        try {
            isValidPassword = await verifyPassword(password, user.passwordHash);
        } catch (bcryptError) {
            console.error('[LOGIN] Bcrypt verification failed:', bcryptError);
            return NextResponse.json(
                { error: 'Password verification error' },
                { status: 500 }
            );
        }

        if (!isValidPassword) {
            console.warn(`[LOGIN] Invalid password for user: ${email}`);
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // 6. Post-Login Updates (Non-blocking)
        try {
            await prisma.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date() },
            });
        } catch (updateError) {
            console.error('[LOGIN] Failed to update lastLogin:', updateError);
            // Continue login even if this fails
        }

        // 7. Role Processing
        const roleNames = user.roles.map(ur => ur.role.name);
        const isAdmin = roleNames.some(role => role.toLowerCase() === 'admin');

        console.log(`[LOGIN] Success for ${email}. Roles: [${roleNames.join(', ')}]. Admin: ${isAdmin}`);

        // 8. Token Generation
        let token;
        try {
            token = generateToken({
                userId: user.id,
                email: user.email,
                roles: roleNames,
            });

            if (!token) throw new Error('Token generation returned empty string');
        } catch (tokenError) {
            console.error('[LOGIN] Token generation failed:', tokenError);
            return NextResponse.json(
                { error: 'Authentication token generation failed' },
                { status: 500 }
            );
        }

        // 9. Cookie Setting
        try {
            await setAuthCookie(token);
        } catch (cookieError) {
            console.error('[LOGIN] Failed to set auth cookie:', cookieError);
            return NextResponse.json(
                { error: 'Failed to establish session cookie' },
                { status: 500 }
            );
        }

        const redirectUrl = isAdmin ? '/dashboard/admin' : '/dashboard';

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: roleNames,
                isAdmin: isAdmin,
            },
            redirectUrl: redirectUrl,
        });

    } catch (unexpectedError: any) {
        // 10. Ultimate Safety Net
        console.error('[LOGIN] UNEXPECTED CRITICAL ERROR:', unexpectedError);
        return NextResponse.json(
            { error: unexpectedError?.message || 'An unexpected system error occurred' },
            { status: 500 }
        );
    }
}
