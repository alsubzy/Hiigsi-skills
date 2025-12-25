import { NextResponse } from "next/server";
import { hasPermission } from "@/lib/auth";
import { getCurrentUser } from "@/lib/auth-utils";

export type ActionHandler = (req: Request, ...args: any[]) => Promise<Response>;

export function withAuth(action: string, subject: string, handler: ActionHandler) {
    return async (req: Request, ...args: any[]) => {
        // Get current user from JWT token
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { error: "Unauthorized: Please login to continue" },
                { status: 401 }
            );
        }

        // Check if user has permission
        const allowed = await hasPermission(currentUser.userId, action, subject);

        if (!allowed) {
            return NextResponse.json(
                {
                    error: "Forbidden: You do not have permission to perform this action",
                    required: { action, subject }
                },
                { status: 403 }
            );
        }

        return handler(req, ...args);
    };
}
