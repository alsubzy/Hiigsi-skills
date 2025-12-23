// src/lib/services/staffService.ts
import { z } from 'zod';
import { staffData } from '@/lib/data/staffData';
import { userData } from '@/lib/data/userData';
import { createLog } from './logService';
import { ApiError } from '@/lib/utils/ApiError';
import type { Staff } from '@/lib/types';

const staffSchema = z.object({
  userId: z.string().min(1, "User ID is required."),
  name: z.string().min(2, "Staff name is required."),
  position: z.string().min(2, "Position is required."),
  department: z.string().min(2, "Department is required."),
  status: z.enum(['Active', 'On Leave']).optional(),
});

/**
 * Get all staff members.
 * @param filters - Optional filters for querying staff.
 */
export async function getAllStaff(filters: { department?: string | null }): Promise<Staff[]> {
  return staffData.findAll(filters);
}

/**
 * Create a new staff member.
 * This links to an existing user account.
 * @param data - The data for the new staff member.
 * @returns The newly created staff member record.
 */
export async function createStaff(data: unknown): Promise<Staff> {
  const validation = staffSchema.safeParse(data);
  if (!validation.success) {
    throw new ApiError(400, 'Invalid staff data.', validation.error.flatten().fieldErrors);
  }

  const { userId, name, position, department } = validation.data;

  // Check if the user exists
  const user = await userData.findById(userId);
  if (!user) {
    throw new ApiError(404, `User with ID "${userId}" not found.`);
  }

  // Check if user is already a staff member
  const allStaff = await staffData.findAll({});
  if (allStaff.some(s => s.userId === userId)) {
    throw new ApiError(409, 'This user is already registered as a staff member.');
  }

  const newStaff = await staffData.create({
    userId,
    name,
    position,
    department,
    status: 'Active',
  });

  await createLog({ userId: 'admin-user-id', action: 'create_staff', module: 'Staff', details: `Created staff: ${name}` });

  return newStaff;
}

/**
 * Update an existing staff member's details.
 * @param staffId - The ID of the staff member to update.
 * @param data - The data to update.
 * @returns The updated staff member record.
 */
export async function updateStaff(staffId: string, data: unknown): Promise<Staff> {
  const validation = staffSchema.partial().safeParse(data);
  if (!validation.success) {
    throw new ApiError(400, 'Invalid update data.', validation.error.flatten().fieldErrors);
  }

  const updatedStaff = await staffData.update(staffId, validation.data);
  if (!updatedStaff) {
    throw new ApiError(404, 'Staff member not found.');
  }

  await createLog({ userId: 'admin-user-id', action: 'update_staff', module: 'Staff', details: `Updated staff ID: ${staffId}` });

  return updatedStaff;
}

/**
 * Activate a staff member.
 * @param staffId - The ID of the staff member to activate.
 * @returns The updated staff member record.
 */
export async function activateStaff(staffId: string): Promise<Staff> {
  const staff = await staffData.findById(staffId);
  if (!staff) {
    throw new ApiError(404, 'Staff not found.');
  }

  const updatedStaff = await staffData.update(staffId, { status: 'Active' });
  if (!updatedStaff) {
    throw new ApiError(500, 'Failed to activate staff.');
  }
  
  await createLog({ userId: 'admin-user-id', action: 'activate_staff', module: 'Staff', details: `Activated staff: ${staff.name}` });

  return updatedStaff;
}

/**
 * Deactivate a staff member (e.g., On Leave, Resigned).
 * @param staffId - The ID of the staff member to deactivate.
 * @param status - The new status.
 * @returns The updated staff member record.
 */
export async function deactivateStaff(staffId: string, status: 'On Leave' | 'Resigned' = 'On Leave'): Promise<Staff> {
    const staff = await staffData.findById(staffId);
    if (!staff) {
        throw new ApiError(404, 'Staff not found.');
    }

    const updatedStaff = await staffData.update(staffId, { status });
    if (!updatedStaff) {
        throw new ApiError(500, 'Failed to deactivate staff.');
    }

    await createLog({ userId: 'admin-user-id', action: 'deactivate_staff', module: 'Staff', details: `Deactivated staff: ${staff.name}` });

    return updatedStaff;
}
