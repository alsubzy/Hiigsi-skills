import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/with-auth";
import { getFeeCategories, createFeeCategory } from "@/lib/services/finance";

async function GET_Handler(req: Request) {
    try {
        const categories = await getFeeCategories();
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch fee categories" }, { status: 500 });
    }
}

async function POST_Handler(req: Request) {
    try {
        const body = await req.json();
        const category = await createFeeCategory(body);
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create fee category" }, { status: 500 });
    }
}

export const GET = withAuth("READ", "FINANCE", GET_Handler);
export const POST = withAuth("CREATE", "FINANCE", POST_Handler);
