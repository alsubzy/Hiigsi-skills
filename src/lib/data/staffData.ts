// src/lib/data/staffData.ts
import { Staff } from '@/lib/types';

let staff: Staff[] = [
    { id: 'S001', userId: '1', name: 'Dr. Evelyn Reed', position: 'Principal', department: 'Administration', status: 'Active' },
    { id: 'S002', userId: '2', name: 'Mr. David Chen', position: 'Math Teacher', department: 'Academics', status: 'Active' },
];

export const staffData = {
    async findAll(filters: { department?: string | null }): Promise<Staff[]> {
        if (filters.department) {
            return staff.filter(s => s.department === filters.department);
        }
        return [...staff];
    },

    async findById(id: string): Promise<Staff | undefined> {
        return staff.find(s => s.id === id);
    },

    async create(staffMember: Omit<Staff, 'id'>): Promise<Staff> {
        const newStaff: Staff = {
            id: `S${(staff.length + 1).toString().padStart(3, '0')}`,
            ...staffMember,
        };
        staff.push(newStaff);
        return newStaff;
    },

    async update(id: string, updates: Partial<Omit<Staff, 'id'>>): Promise<Staff | undefined> {
        const index = staff.findIndex(s => s.id === id);
        if (index === -1) {
            return undefined;
        }
        staff[index] = { ...staff[index], ...updates };
        return staff[index];
    },
};
