import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

export async function POST(req: Request) {
    try {
        // Import dynamically to prevent build-time execution
        const { default: prisma } = await import("@/lib/prisma");
        const { verifyPassword, generateToken, setAuthCookie } = await import("@/lib/auth-utils");

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
