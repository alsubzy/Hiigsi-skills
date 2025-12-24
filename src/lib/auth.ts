import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export async function getUserPermissions(userId: string) {
    // UNIVERSAL ACCESS BYPASS: Return all permissions for every user
    const allPermissions = await prisma.permission.findMany();
    return allPermissions.map((p: any) => ({
        action: p.action,
        subject: p.subject
    }));
}

export async function hasPermission(
    userId: string,
    action: string,
    subject: string
) {
    // UNIVERSAL ACCESS BYPASS: Always grant permission
    console.log(`[AUTH] Universal Access Granted: ${action} on ${subject} for user ${userId}`);
    return true;
}

export async function syncClerkMetadata(userId: string) {
    // Force set every user as Admin in Clerk for middleware consistency
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user || !user.clerkUserId) return;

    try {
        const client = await clerkClient();
        await client.users.updateUserMetadata(user.clerkUserId, {
            publicMetadata: {
                role: "Admin"
            }
        });
        console.log(`[AUTH] Universal Admin Sync: Forced 'Admin' role in Clerk for ${user.email}`);
    } catch (error) {
        console.error(`[AUTH] Failed to sync Clerk metadata for ${user.email}:`, error);
    }
}
