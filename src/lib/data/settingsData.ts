// src/lib/data/settingsData.ts
import { SchoolProfile } from '@/lib/types';

// In-memory store for settings
let schoolProfile: SchoolProfile = {
    schoolName: 'Hiigsi International School',
    email: 'contact@hiigsi.edu.so',
    phone: '+252 61 123 4567',
    address: 'KM4, Wadajir District',
    city: 'Mogadishu',
    state: 'Banaadir',
    zip: 'MG010',
    mission: 'To provide a world-class education that empowers students with knowledge, skills, and values to thrive in a global society.',
    logoUrl: 'https://picsum.photos/seed/school-logo/200'
};

export const settingsData = {
    schoolProfile: {
        async get(): Promise<SchoolProfile> {
            return { ...schoolProfile };
        },
        async update(updates: Partial<SchoolProfile>): Promise<SchoolProfile> {
            schoolProfile = { ...schoolProfile, ...updates };
            return { ...schoolProfile };
        },
    },
    // Backup and other settings would go here
    backup: {
        async createBackup(): Promise<any> {
            // In a real app, this would query all data and create a file
            // For mock, we'll just return a success message
            const snapshot = {
                profile: schoolProfile,
                // ...other data snapshots
                timestamp: new Date(),
            }
            return snapshot;
        },
        async restoreFromBackup(data: any): Promise<void> {
            // In a real app, this would parse the file and overwrite data
            if (data.profile) {
                schoolProfile = data.profile;
            }
            // ...restore other data
        }
    }
};
