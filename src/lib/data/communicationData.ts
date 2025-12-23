// src/lib/data/communicationData.ts
import type { Announcement } from '@/lib/types';

let announcements: Announcement[] = [
    { 
        id: 'ann-1',
        title: 'Welcome Back to School!',
        content: 'We are excited to welcome all students and staff back for the new academic year. Let\'s make it a great one!',
        authorId: '1', // Admin user ID
        authorName: 'Principal',
        isPublished: true,
        createdAt: new Date('2024-08-15T09:00:00Z'),
        updatedAt: new Date('2024-08-15T09:00:00Z'),
    }
];

export const communicationData = {
    announcements: {
        async create(data: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Announcement> {
            const now = new Date();
            const newAnnouncement: Announcement = {
                id: `ann-${Date.now()}`,
                ...data,
                createdAt: now,
                updatedAt: now,
            };
            announcements.push(newAnnouncement);
            return newAnnouncement;
        },
        async findById(id: string): Promise<Announcement | undefined> {
            return announcements.find(a => a.id === id);
        },
        async findAll(): Promise<Announcement[]> {
            return [...announcements].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        },
        async update(id: string, updates: Partial<Announcement>): Promise<Announcement | undefined> {
            const index = announcements.findIndex(a => a.id === id);
            if (index === -1) return undefined;
            announcements[index] = { ...announcements[index], ...updates, updatedAt: new Date() };
            return announcements[index];
        },
        async remove(id: string): Promise<boolean> {
            const initialLength = announcements.length;
            announcements = announcements.filter(a => a.id !== id);
            return announcements.length < initialLength;
        }
    },
    // Messaging and Notifications will be added here later
};
