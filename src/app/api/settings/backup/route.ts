// src/app/api/settings/backup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { performBackup } from '@/lib/services/settingsService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function POST(request: NextRequest) {
  try {
    // In a real app, get userId from session
    const userId = 'admin-id'; 
    const backupData = await performBackup(userId);
    
    // In a real implementation, this would return a file stream or a link to a downloadable file.
    // For now, we return the JSON data.
    return NextResponse.json(backupData, {
        headers: {
            'Content-Disposition': 'attachment; filename="backup.json"',
            'Content-Type': 'application/json',
        }
    });

  } catch (error) {
    return handleApiError(error);
  }
}
