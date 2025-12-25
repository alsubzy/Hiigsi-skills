import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export type UserType = 'TEACHER' | 'ADMIN' | 'ACCOUNTANT' | 'STAFF';

/**
 * Maps user types to role names
 */
const USER_TYPE_TO_ROLE: Record<UserType, string> = {
  TEACHER: 'Teacher',
  ADMIN: 'Admin',
  ACCOUNTANT: 'Accountant',
  STAFF: 'Staff',
};

/**
 * Get role ID by role name
 */
export async function getRoleIdByName(roleName: string): Promise<string | null> {
  const role = await prisma.role.findUnique({
    where: { name: roleName },
    select: { id: true },
  });
  return role?.id || null;
}

/**
 * Get role ID by user type
 */
export async function getRoleIdByUserType(userType: UserType): Promise<string | null> {
  const roleName = USER_TYPE_TO_ROLE[userType];
  return getRoleIdByName(roleName);
}

/**
 * Create a user with automatic role assignment based on user type
 */
export interface CreateUserWithRoleParams {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  userType: UserType;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdBy?: string;
  // Additional fields for Teacher
  employeeId?: string;
  qualification?: string;
  specialization?: string;
}

export async function createUserWithRole(params: CreateUserWithRoleParams) {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    userType,
    status = 'ACTIVE',
    createdBy,
    employeeId,
    qualification,
    specialization,
  } = params;

  // Validate email uniqueness
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Get role ID
  const roleId = await getRoleIdByUserType(userType);
  if (!roleId) {
    throw new Error(`Role not found for user type: ${userType}`);
  }

  // Create user in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create user
    const user = await tx.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        status: status as any,
        isActive: status === 'ACTIVE',
        emailVerified: false,
        createdBy,
      },
    });

    // Assign role
    await tx.userRole.create({
      data: {
        userId: user.id,
        roleId,
      },
    });

    // If user is a Teacher, create Teacher record
    if (userType === 'TEACHER') {
      // Generate employee ID if not provided
      const finalEmployeeId = employeeId || `TCH-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      await tx.teacher.create({
        data: {
          userId: user.id,
          employeeId: finalEmployeeId,
          qualification: qualification || null,
          specialization: specialization || null,
        },
      });
    }

    // Create audit log
    await tx.auditLog.create({
      data: {
        userId: createdBy || null,
        action: 'CREATE',
        resource: 'USER',
        resourceId: user.id,
        payload: {
          email: user.email,
          userType,
          roleId,
        } as any,
      },
    });

    return user;
  });

  // Fetch user with roles
  const userWithRoles = await prisma.user.findUnique({
    where: { id: result.id },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
      teacher: true,
    },
  });

  return userWithRoles;
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, newUserType: UserType, updatedBy?: string) {
  const roleId = await getRoleIdByUserType(newUserType);
  if (!roleId) {
    throw new Error(`Role not found for user type: ${newUserType}`);
  }

  return await prisma.$transaction(async (tx) => {
    // Remove existing roles
    await tx.userRole.deleteMany({
      where: { userId },
    });

    // Assign new role
    await tx.userRole.create({
      data: {
        userId,
        roleId,
      },
    });

    // Handle Teacher record
    const existingTeacher = await tx.teacher.findUnique({
      where: { userId },
    });

    if (newUserType === 'TEACHER' && !existingTeacher) {
      // Create Teacher record if it doesn't exist
      const employeeId = `TCH-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      await tx.teacher.create({
        data: {
          userId,
          employeeId,
        },
      });
    } else if (newUserType !== 'TEACHER' && existingTeacher) {
      // Remove Teacher record if user is no longer a teacher
      await tx.teacher.delete({
        where: { userId },
      });
    }

    // Create audit log
    await tx.auditLog.create({
      data: {
        userId: updatedBy || null,
        action: 'UPDATE',
        resource: 'USER_ROLE',
        resourceId: userId,
        payload: {
          newUserType,
          roleId,
        } as any,
      },
    });

    return true;
  });
}

