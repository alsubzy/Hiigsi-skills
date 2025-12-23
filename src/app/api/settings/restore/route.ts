// src/app/api/settings/restore/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { performRestore } from '@/lib/services/settingsService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function POST(request: NextRequest) {
  try {
    // In a real app, get userId from session and handle file uploads properly
    const userId = 'admin-id';
    const backupData = await request.json();

    await performRestore(userId, backupData);
    
    return NextResponse.json({ message: 'System restored successfully from backup.' });

  } catch (error) {
    return handleApiError(error);
  }
}
