import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  return NextResponse.json({
    users: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
}
