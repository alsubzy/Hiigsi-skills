import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// Helper function to check if user has Super Admin role
async function isSuperAdmin(userId: string): Promise<boolean> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true }
  });
  return userRoles.some(ur => ur.role.name === 'SUPER_ADMIN');
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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
        { error: 'Forbidden: Only Super Admins can view user details' },
        { status: 403 }
      );
    }

    const userId = params.id;

    // Get user with their roles
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

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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
        { error: 'Forbidden: Only Super Admins can update users' },
        { status: 403 }
      );
    }

    const userId = params.id;
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      status,
      roleId
    } = body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(status && { status: status as any }),
      }
    });

    // Update role if provided
    if (roleId) {
      // Remove existing roles (assuming one role per user for simplicity)
      await prisma.userRole.deleteMany({
        where: { userId }
      });

      // Add new role
      await prisma.userRole.create({
        data: {
          userId,
          roleId
        }
      });
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'USER_UPDATED',
        entityType: 'USER',
        entityId: userId,
        performedById: session.user.id,
        metadata: {
          updatedFields: Object.keys(body)
        }
      }
    });

    // Return the updated user without sensitive data
    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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
        { error: 'Forbidden: Only Super Admins can delete users' },
        { status: 403 }
      );
    }

    const userId = params.id;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Soft delete the user
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'INACTIVE',
        deletedAt: new Date()
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'USER_DELETED',
        entityType: 'USER',
        entityId: userId,
        performedById: session.user.id,
        metadata: {
          email: existingUser.email
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'User deactivated successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
