import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
    try {
        const payload = await getCurrentUser();

        if (!payload) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        // Return payload directly to avoid DB connection issues during build
        return NextResponse.json({
            user: {
                id: payload.userId,
                email: payload.email,
                roles: payload.roles
            }
        });

    } catch (error) {
        console.error("Auth/me error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
