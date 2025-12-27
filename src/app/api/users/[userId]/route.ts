import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  return NextResponse.json({ error: "Service unavailable" });
}

export async function PUT(req: Request) {
  return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
}
