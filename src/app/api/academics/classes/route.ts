import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/with-auth";
import { getClasses, createClass } from "@/lib/services/classes";

async function GET_Handler(req: Request) {
  try {
    const classes = await getClasses();
    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}

async function POST_Handler(req: Request) {
  try {
    const body = await req.json();
    const newClass = await createClass(body); // Assuming body has name and level
    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
  }
}

export const GET = withAuth("READ", "CLASS_LEVEL", GET_Handler);
export const POST = withAuth("CREATE", "CLASS_LEVEL", POST_Handler);
