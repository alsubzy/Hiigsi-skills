import { NextResponse } from "next/server";
import { hasPermission } from "@/lib/auth";

export type ActionHandler = (req: Request, ...args: any[]) => Promise<Response>;

export function withAuth(action: string, subject: string, handler: ActionHandler) {
    return async (req: Request, ...args: any[]) => {
        // MOCK AUTH: In a real system, you'd check session/token here.
        // For now, we'll bypass and use a mock admin user.
        const dbUser = await import("@/lib/prisma").then((m) =>
            m.default.user.findFirst({
                where: { email: { contains: "admin" } },
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
