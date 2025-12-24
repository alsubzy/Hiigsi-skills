import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/with-auth";
import { getSubjects, createSubject } from "@/lib/services/subjects";

async function GET_Handler(req: Request) {
  try {
    const url = new URL(req.url);
    const classId = url.searchParams.get("classId");
    const subjects = await getSubjects(classId || undefined);
    return NextResponse.json(subjects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}

async function POST_Handler(req: Request) {
  try {
    const body = await req.json();
    const newSubject = await createSubject(body);
    return NextResponse.json(newSubject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 });
  }
}

export const GET = withAuth("READ", "SUBJECT", GET_Handler);
export const POST = withAuth("CREATE", "SUBJECT", POST_Handler);
