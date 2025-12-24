import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // MOCK AUTH: In a real system, you would check session/token here.
        // For now, we'll return a bypass admin user if it exists.

        const dbUser = await prisma.user.findFirst({
            where: { email: { contains: "admin" } }, // Simple heuristic for mock
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });

        if (!dbUser) {
            return NextResponse.json({ error: "No mock admin user found" }, { status: 404 });
        }

        const roles = ["Admin"];
        const permissions = ["ALL_ACCESS"]; // Mock permissions

        return NextResponse.json({
            user: {
                id: dbUser.id,
                firstName: dbUser.firstName,
                lastName: dbUser.lastName,
                email: dbUser.email,
                roles,
            },
            permissions,
        });
    } catch (error) {
        console.error("Auth Me API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
