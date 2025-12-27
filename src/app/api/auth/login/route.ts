import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, generateToken, setAuthCookie } from "@/lib/auth-utils";
import { z } from "zod";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = loginSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Invalid input", details: validation.error.format() }, { status: 400 });
        }

        const { email, password } = validation.data;

        const user = await prisma.user.findUnique({
            where: { email },
            include: { roles: { include: { role: true } } }
        });

        if (!user || !user.passwordHash) {
            // Use generic error message for security
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const isValid = await verifyPassword(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // Generate Token
        // Assuming getUserRoles from auth-utils expected slightly different payload, 
        // but generateToken expects { userId, email, roles }
        // roles in payload defined as string[] in auth-utils.ts
        const roleNames = user.roles.map(ur => ur.role.name);

        const token = generateToken({
            userId: user.id,
            email: user.email,
            roles: roleNames
        });

        await setAuthCookie(token);

        return NextResponse.json({
            success: true,
            redirectUrl: '/dashboard',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: roleNames
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
