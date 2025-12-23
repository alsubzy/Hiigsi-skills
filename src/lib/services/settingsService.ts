// src/lib/services/settingsService.ts
import { z } from 'zod';
import { settingsData } from '@/lib/data/settingsData';
import { ApiError } from '@/lib/utils/ApiError';
import { createLog } from './logService';
import type { SchoolProfile } from '@/lib/types';

// --- Validation Schema ---
const schoolProfileSchema = z.object({
  schoolName: z.string().min(3, 'School name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(5, 'ZIP code is required'),
  mission: z.string().optional(),
  logoUrl: z.string().url().optional(),
});


// --- School Profile Service Functions ---

export async function getSchoolProfile(): Promise<SchoolProfile> {
  return settingsData.schoolProfile.get();
}

export async function updateSchoolProfile(data: unknown): Promise<SchoolProfile> {
  const validation = schoolProfileSchema.partial().safeParse(data);
  if (!validation.success) {
    throw new ApiError(400, 'Invalid school profile data.', validation.error.flatten().fieldErrors);
  }

  const updatedProfile = await settingsData.schoolProfile.update(validation.data);
  
  await createLog({
    userId: 'admin-id', // This would be the current user's ID
    action: 'update_school_profile',
    module: 'Settings',
    details: 'Updated school profile information.',
  });
  
  return updatedProfile;
}

// --- Backup & Restore Service Functions ---

export async function performBackup(userId: string) {
    const backupData = await settingsData.backup.createBackup();
    await createLog({
        userId,
        action: 'create_backup',
        module: 'Settings',
        details: 'Created a system data backup.',
    });
    return backupData;
}

export async function performRestore(userId: string, backupData: any) {
    await settingsData.backup.restoreFromBackup(backupData);
    await createLog({
        userId,
        action: 'restore_from_backup',
        module: 'Settings',
        details: 'Restored system data from a backup.',
    });
}
