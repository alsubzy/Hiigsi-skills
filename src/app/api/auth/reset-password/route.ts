import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, isTokenExpired } from '@/lib/auth-utils';
import { z } from 'zod';

const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = resetPasswordSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { token, password } = validation.data;

        // Find user by reset token
        const user = await prisma.user.findUnique({
            where: { resetPasswordToken: token },
        });

        if (!user || !user.resetPasswordExpiry) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        // Check if token is expired
        if (isTokenExpired(user.resetPasswordExpiry)) {
            return NextResponse.json(
                { error: 'Reset token has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await hashPassword(password);

        // Update user password and clear reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpiry: null,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Password reset successfully. You can now log in with your new password.',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'An error occurred while resetting your password' },
            { status: 500 }
        );
    }
}
