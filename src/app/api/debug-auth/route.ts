import { NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const user = await currentUser();
        if (!user) return NextResponse.json({ error: "No Clerk user" });

        const dbUser = await prisma.user.findUnique({
            where: { clerkUserId: user.id },
            include: { roles: { include: { role: true } } }
        });

        const clerkMetadata = {
            public: user.publicMetadata,
            unsafe: user.unsafeMetadata,
        };

        return NextResponse.json({
            clerkUser: {
                id: user.id,
                email: user.emailAddresses[0].emailAddress,
                metadata: clerkMetadata,
            },
            dbUser: dbUser ? {
                id: dbUser.id,
                email: dbUser.email,
                roles: dbUser.roles.map(r => r.role.name),
            } : null,
            match: clerkMetadata.publicMetadata?.role === dbUser?.roles[0]?.role?.name
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
