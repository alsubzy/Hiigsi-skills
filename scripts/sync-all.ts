import prisma from "@/lib/prisma";
import { syncClerkMetadata } from "./src/lib/auth";
import * as dotenv from "dotenv";

dotenv.config();

async function syncAll() {
    console.log("--- SYNCING ALL USERS TO CLERK ---");
    const users = await prisma.user.findMany({
        where: { clerkUserId: { not: null } },
        include: { roles: { include: { role: true } } }
    });

    for (const user of users) {
        console.log(`Syncing ${user.email}...`);
        await syncClerkMetadata(user.id);
    }

    console.log("--- SYNC COMPLETE ---");
}

syncAll()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
