import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/with-auth";
import { getFeeStructures, createFeeStructure } from "@/lib/services/finance";

async function GET_Handler(req: Request) {
    try {
        const url = new URL(req.url);
        const classId = url.searchParams.get("classId");
        const structures = await getFeeStructures(classId || undefined);
        return NextResponse.json(structures);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch fee structures" }, { status: 500 });
    }
}

async function POST_Handler(req: Request) {
    try {
        const body = await req.json();
        const structure = await createFeeStructure(body);
        return NextResponse.json(structure, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create fee structure" }, { status: 500 });
    }
}

export const GET = withAuth("READ", "FINANCE", GET_Handler);
export const POST = withAuth("CREATE", "FINANCE", POST_Handler);
