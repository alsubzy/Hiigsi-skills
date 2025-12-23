// src/app/api/settings/school-profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSchoolProfile, updateSchoolProfile } from '@/lib/services/settingsService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(request: NextRequest) {
  try {
    const profile = await getSchoolProfile();
    return NextResponse.json(profile);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updatedProfile = await updateSchoolProfile(body);
    return NextResponse.json(updatedProfile);
  } catch (error) {
    return handleApiError(error);
  }
}
