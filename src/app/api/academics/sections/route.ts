import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/with-auth";
import { getSections, createSection } from "@/lib/services/classes";

async function GET_Handler(req: Request) {
  try {
    const url = new URL(req.url);
    const classId = url.searchParams.get("classId");
    const sections = await getSections(classId || undefined);
    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sections" }, { status: 500 });
  }
}

async function POST_Handler(req: Request) {
  try {
    const body = await req.json();
    const newSection = await createSection(body);
    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create section" }, { status: 500 });
  }
}

export const GET = withAuth("READ", "SECTION", GET_Handler);
export const POST = withAuth("CREATE", "SECTION", POST_Handler);
