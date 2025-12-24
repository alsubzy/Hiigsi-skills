import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function syncClerkUsers() {
    console.log("Starting Clerk user synchronization...");

    const client = await clerkClient();
    const response = await client.users.getUserList();
    const clerkUsers = response.data;

    for (const clerkUser of clerkUsers) {
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const firstName = clerkUser.firstName || "";
        const lastName = clerkUser.lastName || "";
        const phone = clerkUser.phoneNumbers[0]?.phoneNumber || null;
        const roleName = (clerkUser.publicMetadata?.role as string) || "Staff";

        console.log(`Syncing user: ${email} (${roleName})`);

        const user = await prisma.user.upsert({
            where: { clerkUserId: clerkUser.id },
            update: {
                email,
                firstName,
                lastName,
                phone,
            },
            create: {
                clerkUserId: clerkUser.id,
                email,
                firstName,
                lastName,
                phone,
                status: "ACTIVE",
            },
        });

        if (roleName) {
            const dbRole = await prisma.role.findFirst({
                where: { name: { equals: roleName, mode: "insensitive" } },
            });

            if (dbRole) {
                await prisma.userRole.upsert({
                    where: { userId_roleId: { userId: user.id, roleId: dbRole.id } },
                    update: {},
                    create: { userId: user.id, roleId: dbRole.id },
                });
            }
        }
    }

    console.log("Synchronization completed.");
}
