import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth-utils";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
    await clearAuthCookie();
    return NextResponse.json({ success: true, message: "Logged out successfully" });
}
