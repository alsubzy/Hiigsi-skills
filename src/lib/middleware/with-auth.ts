import { NextResponse } from "next/server";
import { hasPermission } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server";

export type ActionHandler = (req: Request, ...args: any[]) => Promise<Response>;

export function withAuth(action: string, subject: string, handler: ActionHandler) {
    return async (req: Request, ...args: any[]) => {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Map Clerk user to our DB user
        // Assuming clerkUserId is stored in our User model
        const dbUser = await import("@/lib/prisma").then((m) =>
            m.default.user.findUnique({
                where: { clerkUserId: user.id },
            })
        );

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const allowed = await hasPermission(dbUser.id, action, subject);

        if (!allowed) {
            return NextResponse.json(
                { error: "Forbidden: You do not have permission to perform this action" },
                { status: 403 }
            );
        }

        return handler(req, ...args);
    };
}
