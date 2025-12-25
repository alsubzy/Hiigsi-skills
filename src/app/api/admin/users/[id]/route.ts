import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';
import { updateUserRole, UserType } from '@/lib/services/userRoleService';
import { updateUserWithTeacherSync } from '@/lib/services/userTeacherSyncService';
import bcrypt from 'bcryptjs';

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
    // Get the current user from JWT token
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if the current user is a Super Admin or Admin
    if (!(await isSuperAdmin(currentUser.userId))) {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Admins can view user details' },
        { status: 403 }
      );
    }

    const userId = params.id;

    // Get user with their roles and teacher info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true
          }
        },
        teacher: true,
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
    // Get the current user from JWT token
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if the current user is a Super Admin or Admin
    if (!(await isSuperAdmin(currentUser.userId))) {
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
      userType, // New: userType for role updates
      roleId, // Legacy: still support for backward compatibility
      password, // Optional: for password updates
      employeeId,
      qualification,
      specialization,
    } = body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        teacher: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Determine userType - if not provided and user is a teacher, maintain TEACHER type
    let finalUserType: UserType | undefined = userType as UserType | undefined;
    if (!finalUserType && existingUser.roles.some(ur => ur.role.name === 'Teacher')) {
      finalUserType = 'TEACHER';
    }

    // Use the synchronization service to ensure all updates are atomic and synchronized
    const userWithRelations = await updateUserWithTeacherSync(
      userId,
      {
        firstName,
        lastName,
        email,
        phone,
        status: status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | undefined,
        userType: finalUserType,
        password,
        employeeId,
        qualification,
        specialization,
      },
      currentUser.userId
    );

    // Return the updated user without sensitive data
    const { passwordHash, ...userWithoutPassword } = userWithRelations!;
    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: userWithoutPassword,
    });

  } catch (error: any) {
    console.error('Error updating user:', error);
    
    if (error.message && error.message.includes('Invalid userType')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the current user from JWT token
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if the current user is a Super Admin or Admin
    if (!(await isSuperAdmin(currentUser.userId))) {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Admins can delete users' },
        { status: 403 }
      );
    }

    const userId = params.id;

    // Use the synchronization service to ensure all related records are handled
    const { deleteUserWithSync } = await import('@/lib/services/userTeacherSyncService');
    await deleteUserWithSync(userId, currentUser.userId);

    return NextResponse.json({
      success: true,
      message: 'User and all associated records deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting user:', error);
    
    if (error.message === 'User not found') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
