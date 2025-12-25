import prisma from "@/lib/prisma";

// Cache for user permissions (simple in-memory cache)
const permissionCache = new Map<string, { permissions: any[], timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getUserPermissions(userId: string) {
    // Check cache first
    const cached = permissionCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.permissions;
    }

    // Fetch user with roles and permissions
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            roles: {
                include: {
                    role: {
                        include: {
                            permissions: {
                                include: {
                                    permission: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!user) {
        return [];
    }

    // Check if user has Admin or SUPER_ADMIN role - they get all permissions
    const isAdmin = user.roles.some(ur => {
      const roleName = ur.role.name.toLowerCase();
      return roleName === 'admin' || roleName === 'super_admin';
    });

    let permissions;
    if (isAdmin) {
        // Admin gets all permissions
        const allPermissions = await prisma.permission.findMany();
        permissions = allPermissions.map((p: any) => ({
            action: p.action,
            subject: p.subject
        }));
    } else {
        // Regular users get their assigned permissions
        const permissionSet = new Set<string>();
        user.roles.forEach(userRole => {
            userRole.role.permissions.forEach(rolePermission => {
                const key = `${rolePermission.permission.action}:${rolePermission.permission.subject}`;
                permissionSet.add(key);
            });
        });

        permissions = Array.from(permissionSet).map(key => {
            const [action, subject] = key.split(':');
            return { action, subject };
        });
    }

    // Cache the result
    permissionCache.set(userId, { permissions, timestamp: Date.now() });

    return permissions;
}

export async function hasPermission(
    userId: string,
    action: string,
    subject: string
) {
    const permissions = await getUserPermissions(userId);

    const hasAccess = permissions.some(
        (p: any) => p.action === action && p.subject === subject
    );

    console.log(`[AUTH] Permission check: ${action} on ${subject} for user ${userId} - ${hasAccess ? 'GRANTED' : 'DENIED'}`);

    return hasAccess;
}

// Helper to check if user is admin
export async function isUserAdmin(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            roles: {
                include: {
                    role: true
                }
            }
        }
    });

    return user?.roles.some(ur => {
      const roleName = ur.role.name.toLowerCase();
      return roleName === 'admin' || roleName === 'super_admin';
    }) || false;
}
