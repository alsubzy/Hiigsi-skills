// src/lib/services/communicationService.ts
import { z } from 'zod';
import { communicationData } from '@/lib/data/communicationData';
import { userData } from '@/lib/data/userData';
import { ApiError } from '@/lib/utils/ApiError';
import { createLog } from './logService';
import type { Announcement } from '@/lib/types';

// --- Validation Schemas ---
const announcementSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  content: z.string().min(20, 'Content must be at least 20 characters long.'),
  isPublished: z.boolean().optional(),
});


// --- Announcement Service Functions ---

export async function getAllAnnouncements(): Promise<Announcement[]> {
  // In a real app, you might filter by published status for non-admins
  return communicationData.announcements.findAll();
}

export async function getAnnouncementById(id: string): Promise<Announcement> {
    const announcement = await communicationData.announcements.findById(id);
    if (!announcement) {
        throw new ApiError(404, 'Announcement not found.');
    }
    return announcement;
}

export async function createAnnouncement(data: unknown, authorId: string): Promise<Announcement> {
  const validation = announcementSchema.safeParse(data);
  if (!validation.success) {
    throw new ApiError(400, 'Invalid announcement data.', validation.error.flatten().fieldErrors);
  }

  const author = await userData.findById(authorId);
  if (!author) {
    throw new ApiError(404, 'Author not found.');
  }

  const newAnnouncement = await communicationData.announcements.create({
    ...validation.data,
    isPublished: validation.data.isPublished ?? false,
    authorId,
    authorName: author.name,
  });

  await createLog({ userId: authorId, action: 'create_announcement', module: 'Communication', details: `Created announcement: ${newAnnouncement.title}` });

  return newAnnouncement;
}

export async function updateAnnouncement(id: string, data: unknown, authorId: string): Promise<Announcement> {
    const validation = announcementSchema.partial().safeParse(data);
    if (!validation.success) {
      throw new ApiError(400, 'Invalid announcement update data.', validation.error.flatten().fieldErrors);
    }

    const existing = await communicationData.announcements.findById(id);
    if (!existing) {
        throw new ApiError(404, 'Announcement not found.');
    }
    
    // In a real app, you'd check if the authorId has permission to edit.
    // For now, we'll allow it.

    const updatedAnnouncement = await communicationData.announcements.update(id, validation.data);
    if (!updatedAnnouncement) {
      throw new ApiError(500, 'Failed to update announcement.');
    }

    await createLog({ userId: authorId, action: 'update_announcement', module: 'Communication', details: `Updated announcement: ${updatedAnnouncement.title}` });
    
    return updatedAnnouncement;
}

export async function deleteAnnouncement(id: string, authorId: string): Promise<void> {
    const success = await communicationData.announcements.remove(id);
    if (!success) {
        throw new ApiError(404, 'Announcement not found.');
    }
    await createLog({ userId: authorId, action: 'delete_announcement', module: 'Communication', details: `Deleted announcement ID: ${id}` });
}

// --- Messaging & Notification services will be added later ---
