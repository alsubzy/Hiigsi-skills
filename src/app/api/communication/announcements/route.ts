// src/app/api/communication/announcements/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllAnnouncements, createAnnouncement } from '@/lib/services/communicationService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(request: NextRequest) {
  try {
    const announcements = await getAllAnnouncements();
    return NextResponse.json(announcements);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // In a real app, authorId would come from the user's session/token
    const authorId = '1'; // Mocking admin user ID
    const newAnnouncement = await createAnnouncement(body, authorId);
    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
