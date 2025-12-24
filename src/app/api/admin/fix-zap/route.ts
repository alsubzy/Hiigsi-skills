import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const email = "zapdirzak@gmail.com";
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { roles: { include: { role: true } } }
        });

        if (!user) {
            return NextResponse.json({ error: "User zapdirzak@gmail.com not found" }, { status: 404 });
        }

        const isAdmin = user.roles.some(r => r.role.name === "Admin");

        if (!isAdmin) {
            const adminRole = await prisma.role.findUnique({ where: { name: "Admin" } });
            if (!adminRole) {
                return NextResponse.json({ error: "Admin role not found in DB" }, { status: 500 });
            }
            await prisma.userRole.upsert({
                where: { userId_roleId: { userId: user.id, roleId: adminRole.id } },
                update: {},
                create: { userId: user.id, roleId: adminRole.id }
            });
            return NextResponse.json({ message: "Admin role assigned to zapdirzak@gmail.com", user: { email: user.email, roles: ["Admin"] } });
        }

        return NextResponse.json({ message: "User zapdirzak@gmail.com is already Admin", user: { email: user.email, roles: user.roles.map(r => r.role.name) } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
