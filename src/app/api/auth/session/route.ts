import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Get full user data from database
        const user = await prisma.user.findUnique({
            where: { id: currentUser.userId },
            include: {
                roles: {
                    include: {
                        role: {
                            include: {
                                permissions: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if user is still active
        if (!user.isActive || user.status !== 'ACTIVE') {
            return NextResponse.json(
                { error: 'Account is inactive' },
                { status: 403 }
            );
        }

        // Extract permissions
        const permissions = user.roles.flatMap(ur =>
            ur.role.permissions.map(rp => ({
                action: rp.permission.action,
                subject: rp.permission.subject,
            }))
        );

        // Check if user is admin
        const isAdmin = user.roles.some(ur => ur.role.name.toLowerCase() === 'admin');

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles.map(ur => ur.role.name),
                status: user.status,
                isAdmin: isAdmin,
            },
            permissions,
        });
    } catch (error) {
        console.error('Session error:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching session' },
            { status: 500 }
        );
    }
}
