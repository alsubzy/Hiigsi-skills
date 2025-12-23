// src/lib/middleware/rbac.ts
import { userData } from '@/lib/data/userData';
import { roleData } from '@/lib/data/roleData';
import { ApiError } from '@/lib/utils/ApiError';

/**
 * Checks if a user has the required permission.
 * This is a simplified RBAC check. In a real app, you'd get the user from a session.
 * @param userId The ID of the user to check.
 * @param requiredPermission The permission required for the action.
 */
export async function checkPermission(userId: string, requiredPermission: string): Promise<boolean> {
  const user = await userData.findById(userId);
  if (!user || !user.roleId) {
    return false; // No user or no role assigned
  }

  const role = await roleData.findById(user.roleId);
  if (!role) {
    return false; // Role not found
  }

  if (role.permissions.includes('all')) {
    return true; // Admin role has all permissions
  }

  return role.permissions.includes(requiredPermission);
}

/**
 * A mock middleware function to protect an API route.
 * In a real Next.js app, this logic would be in `middleware.ts` or a higher-order function wrapping API handlers.
 * @param userId The user ID from the request context (e.g., session).
 * @param requiredPermission The permission to check for.
 */
export async function protectRoute(userId: string | undefined, requiredPermission: string) {
  if (!userId) {
    throw new ApiError(401, 'Unauthorized: User not authenticated.');
  }

  const hasAccess = await checkPermission(userId, requiredPermission);
  if (!hasAccess) {
    throw new ApiError(403, 'Forbidden: You do not have permission to perform this action.');
  }
}
