import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/with-auth";
import { getSchoolProfile, updateSchoolProfile } from "@/lib/services/system-settings";

async function GET_Handler(req: Request) {
  try {
    const profile = await getSchoolProfile();
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch school profile" }, { status: 500 });
  }
}

async function PUT_Handler(req: Request) {
  try {
    const body = await req.json();
    const updatedProfile = await updateSchoolProfile(body);
    return NextResponse.json(updatedProfile);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update school profile" }, { status: 500 });
  }
}

export const GET = withAuth("READ", "SCHOOL_PROFILE", GET_Handler);
export const PUT = withAuth("UPDATE", "SCHOOL_PROFILE", PUT_Handler);
