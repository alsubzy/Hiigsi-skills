// src/lib/services/roleService.ts
import { z } from 'zod';
import { roleData } from '@/lib/data/roleData';
import { createLog } from './logService';
import { ApiError } from '@/lib/utils/ApiError';
import type { Role } from '@/lib/types';

const roleSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters.'),
  permissions: z.array(z.string()).optional(),
});

/**
 * Get all roles.
 */
export async function getAllRoles(): Promise<Role[]> {
  return roleData.findAll();
}

/**
 * Create a new role.
 * @param data - The data for the new role.
 * @returns The newly created role.
 */
export async function createRole(data: unknown): Promise<Role> {
  const validation = roleSchema.safeParse(data);
  if (!validation.success) {
    throw new ApiError(400, 'Invalid role data.', validation.error.flatten().fieldErrors);
  }

  const { name, permissions = [] } = validation.data;

  const existingRole = (await roleData.findAll()).find(
    (role) => role.name.toLowerCase() === name.toLowerCase()
  );

  if (existingRole) {
    throw new ApiError(409, `A role with the name "${name}" already exists.`);
  }

  const newRole = await roleData.create({ name, permissions });

  // Log this action (userId would come from session in a real app)
  await createLog({ userId: 'admin-user-id', action: 'create_role', module: 'Roles', details: `Created role: ${name}` });

  return newRole;
}

/**
 * Update an existing role.
 * @param roleId - The ID of the role to update.
 * @param data - The data to update.
 * @returns The updated role.
 */
export async function updateRole(roleId: string, data: unknown): Promise<Role> {
  const validation = roleSchema.partial().safeParse(data);
  if (!validation.success) {
    throw new ApiError(400, 'Invalid update data.', validation.error.flatten().fieldErrors);
  }
  
  const role = await roleData.findById(roleId);
  if(!role) {
    throw new ApiError(404, 'Role not found.');
  }

  if(role.isSystem) {
    throw new ApiError(403, 'System roles cannot be modified.');
  }

  const updatedRole = await roleData.update(roleId, validation.data);
  if (!updatedRole) {
    throw new ApiError(404, 'Role not found or could not be updated.');
  }

  await createLog({ userId: 'admin-user-id', action: 'update_role', module: 'Roles', details: `Updated role: ${updatedRole.name}` });

  return updatedRole;
}

/**
 * Delete a role.
 * @param roleId - The ID of the role to delete.
 */
export async function deleteRole(roleId: string): Promise<void> {
    const role = await roleData.findById(roleId);
    if(!role) {
        throw new ApiError(404, 'Role not found.');
    }

    if(role.isSystem) {
        throw new ApiError(403, 'System roles cannot be deleted.');
    }

    const success = await roleData.remove(roleId);
    if (!success) {
        throw new ApiError(404, 'Role not found or could not be deleted.');
    }

    await createLog({ userId: 'admin-user-id', action: 'delete_role', module: 'Roles', details: `Deleted role ID: ${roleId}` });
}

/**
 * Assign a permission to a role.
 * @param roleId - The ID of the role.
 * @param permission - The permission string to assign.
 * @returns The updated role.
 */
export async function assignPermissionToRole(roleId: string, permission: string): Promise<Role> {
    const role = await roleData.findById(roleId);
    if (!role) {
        throw new ApiError(404, 'Role not found.');
    }
     if(role.isSystem) {
        throw new ApiError(403, 'Permissions for system roles cannot be modified.');
    }

    if (!role.permissions.includes(permission)) {
        role.permissions.push(permission);
    }
    
    const updatedRole = await roleData.update(roleId, { permissions: role.permissions });
    if (!updatedRole) {
        throw new ApiError(500, 'Failed to assign permission.');
    }

    await createLog({ userId: 'admin-user-id', action: 'assign_permission', module: 'Roles', details: `Assigned permission "${permission}" to role "${role.name}"` });

    return updatedRole;
}
