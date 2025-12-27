import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
    const user = await getCurrentUser();
    return NextResponse.json({ user });
}
