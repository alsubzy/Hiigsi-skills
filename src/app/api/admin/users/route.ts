import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper function to check if user has Super Admin role
async function isSuperAdmin(userId: string): Promise<boolean> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true }
  });
  return userRoles.some(ur => ur.role.name === 'SUPER_ADMIN');
}

export async function POST(request: Request) {
  try {
    // Get the current user's session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if the current user is a Super Admin
    if (!(await isSuperAdmin(session.user.id))) {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Admins can create users' },
        { status: 403 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      password, 
      roleId,
      status = 'ACTIVE'
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !roleId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        passwordHash: hashedPassword,
        status: status as any, // Cast to any to match the enum type
        createdBy: session.user.id,
      }
    });

    // Assign role to the user
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId,
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'USER_CREATED',
        entityType: 'USER',
        entityId: user.id,
        performedById: session.user.id,
        metadata: {
          email: user.email,
          roleId
        }
      }
    });

    // Return the user without sensitive data
    const { passwordHash, ...userWithoutPassword } = user;
    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
