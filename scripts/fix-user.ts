import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function auditUser() {
    const email = "zapdirzak@gmail.com";
    console.log(`--- AUDITING USER: ${email} ---`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: { roles: { include: { role: true } } }
    });

    if (!user) {
        console.error("❌ User NOT FOUND in database!");
        return;
    }

    console.log(`✅ User found. ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Clerk ID: ${user.clerkUserId}`);

    const roles = user.roles.map(r => r.role.name);
    console.log(`Roles: [${roles.join(", ")}]`);

    const isAdmin = roles.includes("Admin");
    if (!isAdmin) {
        console.log("⚠️ User is NOT an Admin. Attempting to fix...");

        const adminRole = await prisma.role.findUnique({ where: { name: "Admin" } });
        if (!adminRole) {
            console.error("❌ Admin role itself is MISSING in DB!");
            return;
        }

        await prisma.userRole.upsert({
            where: { userId_roleId: { userId: user.id, roleId: adminRole.id } },
            update: {},
            create: { userId: user.id, roleId: adminRole.id }
        });

        console.log("✅ Admin role assigned successfully.");
    } else {
        console.log("✅ User already has Admin role.");
    }

    console.log("--- AUDIT COMPLETE ---");
}

auditUser()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
