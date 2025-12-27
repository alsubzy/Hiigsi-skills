import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
    return NextResponse.json({
        message: "Fix-zap endpoint is operational",
        timestamp: new Date().toISOString()
    });
}
