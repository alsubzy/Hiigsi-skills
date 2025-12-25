import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateRandomToken, getTokenExpiry } from '@/lib/auth-utils';
import { sendPasswordResetEmail } from '@/lib/email';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = forgotPasswordSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { email } = validation.data;

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                success: true,
                message: 'If an account exists with this email, you will receive a password reset link.',
            });
        }

        // Check if user is active
        if (!user.isActive || user.status !== 'ACTIVE') {
            return NextResponse.json({
                success: true,
                message: 'If an account exists with this email, you will receive a password reset link.',
            });
        }

        // Generate reset token
        const resetToken = generateRandomToken();
        const resetExpiry = getTokenExpiry(1); // 1 hour

        // Save token to database
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpiry: resetExpiry,
            },
        });

        // Send reset email
        await sendPasswordResetEmail(user.email, resetToken);

        return NextResponse.json({
            success: true,
            message: 'If an account exists with this email, you will receive a password reset link.',
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'An error occurred while processing your request' },
            { status: 500 }
        );
    }
}
