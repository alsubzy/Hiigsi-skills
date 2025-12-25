import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';
import { createUserWithRole, UserType } from '@/lib/services/userRoleService';

// Helper function to check if user has Super Admin role
async function isSuperAdmin(userId: string): Promise<boolean> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true }
  });
  return userRoles.some(ur => ur.role.name === 'SUPER_ADMIN' || ur.role.name === 'Admin');
}

export async function POST(request: Request) {
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
      temporaryPassword,
      userType, // New: userType (TEACHER, ADMIN, ACCOUNTANT, STAFF)
      roleId, // Legacy: still support direct roleId for backward compatibility
      status = 'ACTIVE',
      employeeId,
      qualification,
      specialization,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, and email are required' },
        { status: 400 }
      );
    }

    // Password is required for new users
    const finalPassword = password || temporaryPassword;
    if (!finalPassword) {
      return NextResponse.json(
        { error: 'Password or temporary password is required' },
        { status: 400 }
      );
    }

    // Determine user type
    let finalUserType: UserType | null = null;
    
    if (userType) {
      // Use provided userType
      if (!['TEACHER', 'ADMIN', 'ACCOUNTANT', 'STAFF'].includes(userType)) {
        return NextResponse.json(
          { error: 'Invalid userType. Must be one of: TEACHER, ADMIN, ACCOUNTANT, STAFF' },
          { status: 400 }
        );
      }
      finalUserType = userType as UserType;
    } else if (roleId) {
      // Legacy: Map roleId to userType
      const role = await prisma.role.findUnique({
        where: { id: roleId },
        select: { name: true }
      });
      
      if (!role) {
        return NextResponse.json(
          { error: 'Role not found' },
          { status: 400 }
        );
      }

      const roleNameToUserType: Record<string, UserType> = {
        'Teacher': 'TEACHER',
        'Admin': 'ADMIN',
        'Accountant': 'ACCOUNTANT',
        'Staff': 'STAFF',
      };

      finalUserType = roleNameToUserType[role.name] || null;
      
      if (!finalUserType) {
        return NextResponse.json(
          { error: `Cannot automatically determine userType for role: ${role.name}. Please provide userType.` },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Either userType or roleId must be provided' },
        { status: 400 }
      );
    }

    // Create user with automatic role assignment
    const user = await createUserWithRole({
      firstName,
      lastName,
      email,
      phone,
      password: finalPassword,
      userType: finalUserType,
      status: status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
      createdBy: currentUser.userId,
      employeeId,
      qualification,
      specialization,
    });

    // Return the user without sensitive data
    const { passwordHash, ...userWithoutPassword } = user!;
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: userWithoutPassword
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating user:', error);
    
    // Handle known errors
    if (error.message && error.message.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    if (error.message && error.message.includes('Role not found')) {
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
