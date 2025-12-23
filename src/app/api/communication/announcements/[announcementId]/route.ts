// src/app/api/communication/announcements/[announcementId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAnnouncementById, updateAnnouncement, deleteAnnouncement } from '@/lib/services/communicationService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(
  request: NextRequest,
  { params }: { params: { announcementId: string } }
) {
  try {
    const announcement = await getAnnouncementById(params.announcementId);
    return NextResponse.json(announcement);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { announcementId: string } }
) {
  try {
    const body = await request.json();
    // In a real app, authorId would come from the user's session/token
    const authorId = '1'; // Mocking admin user ID
    const updated = await updateAnnouncement(params.announcementId, body, authorId);
    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { announcementId: string } }
) {
  try {
    // In a real app, authorId would come from the user's session/token
    const authorId = '1'; // Mocking admin user ID
    await deleteAnnouncement(params.announcementId, authorId);
    return NextResponse.json({ message: 'Announcement deleted successfully' }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
