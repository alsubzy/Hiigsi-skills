import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });
}

export async function PUT(req: Request) {
  return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });
}

export async function DELETE(req: Request) {
  return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });
}
