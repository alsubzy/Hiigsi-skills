import { NextResponse } from "next/server";
import { getRolesWithPermissions } from "@/lib/services/users";

export async function GET() {
    try {
        const roles = await getRolesWithPermissions();
        return NextResponse.json(roles);
    } catch (error) {
        console.error("Failed to fetch roles:", error);
        return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
    }
}
