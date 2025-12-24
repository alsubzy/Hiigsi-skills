import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getUserPermissions } from "@/lib/auth";

export async function GET() {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { clerkUserId: user.id },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found in database" }, { status: 404 });
        }

        const roles = ["Admin"]; // UNIVERSAL ADMIN ACCESS
        const primaryRole = "Admin";

        // --- UNIVERSAL ADMIN SYNC (Self-Healing) ---
        const clerkRole = (user.unsafeMetadata?.role as string) || (user.publicMetadata?.role as string);

        if (clerkRole !== primaryRole) {
            console.log(`[AUTH] Universal Admin Sync triggered for ${dbUser.email}.`);
            const { syncClerkMetadata } = await import("@/lib/auth");
            await syncClerkMetadata(dbUser.id);
        }
        // ------------------------------------------

        const permissions = await getUserPermissions(dbUser.id);

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
