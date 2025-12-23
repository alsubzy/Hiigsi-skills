// src/lib/services/userService.ts
import { z } from 'zod';
import { userData } from '@/lib/data/userData';
import { roleData } from '@/lib/data/roleData';
import { createLog } from './logService';
import { ApiError } from '@/lib/utils/ApiError';
import type { BackendUser } from '@/lib/types';

// Schema for creating a user
const userCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  roleId: z.string().min(1, "Role is required."),
});

// Schema for updating a user
const userUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.').optional(),
  email: z.string().email('Invalid email address.').optional(),
  roleId: z.string().optional(),
});


/**
 * Get all non-deleted users.
 */
export async function getAllUsers(): Promise<BackendUser[]> {
  return userData.findAll();
}

/**
 * Get a single user by their ID.
 * @param id - The ID of the user.
 * @returns The user object or undefined if not found.
 */
export async function getUserById(id: string): Promise<BackendUser | undefined> {
  const user = await userData.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }
  return user;
}


/**
 * Create a new user.
 * @param data - The data for the new user.
 * @returns The newly created user.
 */
export async function createUser(data: unknown): Promise<BackendUser> {
  const validation = userCreateSchema.safeParse(data);
  if (!validation.success) {
    throw new ApiError(400, 'Invalid user data.', validation.error.flatten().fieldErrors);
  }

  const { name, email, password, roleId } = validation.data;

  // Check if user already exists
  const existingUser = await userData.findByEmail(email);
  if (existingUser) {
    throw new ApiError(409, `User with email ${email} already exists.`);
  }

  // Check if role exists
  const role = await roleData.findById(roleId);
  if (!role) {
    throw new ApiError(400, `Role with ID ${roleId} does not exist.`);
  }
  
  // In a real app, you would hash the password here before saving
  // const hashedPassword = await hash(password, 10);
  const newUser = await userData.create({ 
      name, 
      email, 
      password, // Storing plain text for mock purposes ONLY
      roleId, 
      role: role.name as any // Cast because role name matches type
    });

  // Log this action. In a real app, the creating user's ID would be passed here.
  await createLog({ userId: 'admin-user-id', action: 'create_user', module: 'Users', details: `Created user: ${name} (${email})` });

  return newUser;
}

/**
 * Update an existing user.
 * @param id - The ID of the user to update.
 * @param data - The data to update.
 * @returns The updated user.
 */
export async function updateUser(id: string, data: unknown): Promise<BackendUser> {
  const validation = userUpdateSchema.safeParse(data);
  if (!validation.success) {
    throw new ApiError(400, 'Invalid update data.', validation.error.flatten().fieldErrors);
  }

  const user = await userData.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }
  
  const updates = validation.data;
  
  // If roleId is being updated, verify it exists
  if(updates.roleId) {
    const role = await roleData.findById(updates.roleId);
    if (!role) {
        throw new ApiError(400, `Role with ID ${updates.roleId} does not exist.`);
    }
    (updates as Partial<BackendUser>).role = role.name as any;
  }

  const updatedUser = await userData.update(id, updates);
  if (!updatedUser) {
    throw new ApiError(404, 'User not found or could not be updated.');
  }

  await createLog({ userId: 'admin-user-id', action: 'update_user', module: 'Users', details: `Updated user ID: ${id}` });
  
  return updatedUser;
}

/**
 * Soft delete a user.
 * @param id - The ID of the user to delete.
 */
export async function deleteUser(id: string): Promise<void> {
  const success = await userData.remove(id);
  if (!success) {
    throw new ApiError(404, 'User not found.');
  }
  await createLog({ userId: 'admin-user-id', action: 'delete_user', module: 'Users', details: `Soft-deleted user ID: ${id}` });
}

/**
 * Activate a user's account.
 * @param id - The ID of the user to activate.
 * @returns The activated user.
 */
export async function activateUser(id: string): Promise<BackendUser> {
  const updatedUser = await userData.update(id, { status: 'Active' });
  if (!updatedUser) {
    throw new ApiError(404, 'User not found.');
  }
  await createLog({ userId: 'admin-user-id', action: 'activate_user', module: 'Users', details: `Activated user ID: ${id}` });
  return updatedUser;
}

/**
 * Deactivate a user's account.
 * @param id - The ID of the user to deactivate.
 * @returns The deactivated user.
 */
export async function deactivateUser(id: string): Promise<BackendUser> {
  const updatedUser = await userData.update(id, { status: 'Deactivated' });
  if (!updatedUser) {
    throw new ApiError(404, 'User not found.');
  }
  await createLog({ userId: 'admin-user-id', action: 'deactivate_user', module: 'Users', details: `Deactivated user ID: ${id}` });
  return updatedUser;
}

/**
 * Assign a role to a user.
 * @param userId - The ID of the user.
 * @param roleId - The ID of the role to assign.
 * @returns The updated user.
 */
export async function assignRoleToUser(userId: string, roleId: string): Promise<BackendUser> {
  const user = await userData.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }
  const role = await roleData.findById(roleId);
  if (!role) {
    throw new ApiError(404, 'Role not found.');
  }
  const updatedUser = await userData.update(userId, { roleId, role: role.name as any });
  if (!updatedUser) {
    throw new ApiError(500, 'Failed to assign role to user.');
  }
  await createLog({ userId: 'admin-user-id', action: 'assign_role', module: 'Users', details: `Assigned role "${role.name}" to user "${user.name}"` });
  return updatedUser;
}
