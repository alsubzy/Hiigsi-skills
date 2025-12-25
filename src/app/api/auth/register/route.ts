import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-utils';
import { z } from 'zod';

const registerSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = registerSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { firstName, lastName, email, password, role } = validation.data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Get or create default role
        let userRole = await prisma.role.findFirst({
            where: { name: role || 'Student' },
        });

        // If role doesn't exist, create it or use default
        if (!userRole) {
            userRole = await prisma.role.findFirst({
                where: { name: 'Student' },
            });

            // If no Student role exists, create it
            if (!userRole) {
                userRole = await prisma.role.create({
                    data: {
                        name: 'Student',
                        description: 'Default student role',
                    },
                });
            }
        }

        // Create user in database
        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                passwordHash,
                status: 'ACTIVE',
                isActive: true,
                emailVerified: true, // Auto-verify for now, can add email verification later
                roles: {
                    create: {
                        roleId: userRole.id,
                    },
                },
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Account created successfully. You can now log in.',
            user: {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.roles[0]?.role.name || 'Student',
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'An error occurred during registration' },
            { status: 500 }
        );
    }
}
