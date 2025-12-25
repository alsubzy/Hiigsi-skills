import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
    try {
        const email = process.argv[2] || 'admin@hiigsi.com';
        const password = process.argv[3] || 'admin123456';
        const firstName = process.argv[4] || 'Admin';
        const lastName = process.argv[5] || 'User';

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.log(`❌ User with email ${email} already exists`);
            process.exit(1);
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Get or create Admin role
        let adminRole = await prisma.role.findFirst({
            where: { name: 'Admin' },
        });

        if (!adminRole) {
            console.log('Creating Admin role...');
            adminRole = await prisma.role.create({
                data: {
                    name: 'Admin',
                    description: 'Administrator with full access',
                },
            });
        }

        // Create admin user
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                passwordHash,
                status: 'ACTIVE',
                isActive: true,
                emailVerified: true,
                roles: {
                    create: {
                        roleId: adminRole.id,
                    },
                },
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });

        console.log('✅ Admin user created successfully!');
        console.log('-----------------------------------');
        console.log(`Email: ${user.email}`);
        console.log(`Password: ${password}`);
        console.log(`Name: ${user.firstName} ${user.lastName}`);
        console.log(`Role: ${user.roles[0]?.role.name}`);
        console.log('-----------------------------------');
        console.log('You can now log in with these credentials.');
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser();
