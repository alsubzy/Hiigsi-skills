import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-utils';
import { z } from 'zod';

// Validation schema for admin registration
const adminRegisterSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    secretKey: z.string().min(1, 'Secret key is required'),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = adminRegisterSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { email, password, firstName, lastName, secretKey } = validation.data;

        // Verify secret key
        const expectedSecretKey = process.env.ADMIN_SECRET_KEY;

        if (!expectedSecretKey) {
            return NextResponse.json(
                { error: 'Admin registration is not configured on this server' },
                { status: 503 }
            );
        }

        if (secretKey !== expectedSecretKey) {
            return NextResponse.json(
                { error: 'Invalid secret key' },
                { status: 403 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Find Admin role
        const adminRole = await prisma.role.findUnique({
            where: { name: 'Admin' },
        });

        if (!adminRole) {
            return NextResponse.json(
                { error: 'Admin role not found in database. Please run seed script first.' },
                { status: 500 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create admin user
        const newAdmin = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                passwordHash,
                status: 'ACTIVE',
                isActive: true,
            },
        });

        // Assign Admin role
        await prisma.userRole.create({
            data: {
                userId: newAdmin.id,
                roleId: adminRole.id,
            },
        });

        // Log the creation
        console.log(`[ADMIN REGISTRATION] New admin created: ${email}`);

        return NextResponse.json({
            success: true,
            message: 'Admin account created successfully. You can now login.',
            user: {
                id: newAdmin.id,
                email: newAdmin.email,
                firstName: newAdmin.firstName,
                lastName: newAdmin.lastName,
            },
        }, { status: 201 });

    } catch (error) {
        console.error('Admin registration error:', error);
        return NextResponse.json(
            { error: 'An error occurred during admin registration' },
            { status: 500 }
        );
    }
}
