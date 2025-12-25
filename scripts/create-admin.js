// Quick script to create admin user
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@hiigsi.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

        console.log(`Creating admin user: ${adminEmail}`);

        // Check if admin exists
        const existing = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existing) {
            console.log('✅ Admin user already exists!');
            process.exit(0);
        }

        // Hash password
        const passwordHash = await bcrypt.hash(adminPassword, 12);

        // Create admin user
        const adminUser = await prisma.user.create({
            data: {
                firstName: 'Super',
                lastName: 'Admin',
                email: adminEmail,
                passwordHash: passwordHash,
                status: 'ACTIVE',
                isActive: true,
            }
        });

        console.log('Admin user created:', adminUser.id);

        // Find Admin role
        const adminRole = await prisma.role.findUnique({
            where: { name: 'Admin' }
        });

        if (!adminRole) {
            console.error('❌ Admin role not found! Please run seed script first.');
            process.exit(1);
        }

        // Assign Admin role
        await prisma.userRole.create({
            data: {
                userId: adminUser.id,
                roleId: adminRole.id
            }
        });

        console.log('✅ Super Admin created successfully!');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);

    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
