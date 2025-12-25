# User Management System with RBAC

## Overview

This document describes the comprehensive user management system that allows Super Admins to create and manage all types of users (Teacher, Admin, Accountant, and Staff) with automatic role and permission assignment.

## Features

### 1. User Types Supported
- **TEACHER**: Academic staff with access to academic modules, students, and grading
- **ADMIN**: Full system access (excluding user management)
- **ACCOUNTANT**: Financial management with access to finance modules and student billing information
- **STAFF**: General administrative tasks with access to staff management and academic read access

### 2. Super Admin Capabilities
- Create users of any type (Teacher, Admin, Accountant, Staff)
- Automatic role and permission assignment based on user type
- Update user information and roles
- Deactivate users (soft delete)
- View all users with filtering and pagination

### 3. Automatic Role Assignment
When a user is created, the system automatically:
- Assigns the correct role based on user type
- Grants appropriate permissions for that role
- Creates Teacher record if user type is TEACHER
- Sets up user status and authentication

### 4. Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Permission-based feature access
- Automatic login redirection based on role

## Database Schema

### Key Models

#### User Model
- Stores user information (name, email, phone, password)
- Tracks user status (ACTIVE, INACTIVE, SUSPENDED)
- Links to roles through UserRole junction table
- Optional Teacher relationship for teacher users

#### Role Model
- Defines system roles: SUPER_ADMIN, Admin, Teacher, Accountant, Staff
- Each role has a description
- Linked to permissions through RolePermission

#### Permission Model
- Defines actions (CREATE, READ, UPDATE, DELETE)
- Defines subjects (modules like FINANCE, STUDENT, etc.)
- Unique combination of action + subject

#### UserRole Model
- Junction table linking users to roles
- Enables many-to-many relationship

#### Teacher Model
- Additional information for teacher users
- Employee ID, qualification, specialization
- Linked to User model

## API Endpoints

### Create User
**POST** `/api/admin/users`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "password": "SecurePassword123!",
  "userType": "TEACHER", // TEACHER, ADMIN, ACCOUNTANT, or STAFF
  "status": "ACTIVE",
  "employeeId": "TCH-001", // Optional, auto-generated if not provided
  "qualification": "B.Ed", // Optional, for teachers
  "specialization": "Mathematics" // Optional, for teachers
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "roles": [{
      "role": {
        "id": "role_id",
        "name": "Teacher"
      }
    }],
    "teacher": {
      "employeeId": "TCH-001",
      "qualification": "B.Ed",
      "specialization": "Mathematics"
    }
  }
}
```

### List Users
**GET** `/api/admin/users/list?page=1&limit=10&search=&status=&roleId=`

Returns paginated list of users with filtering options.

### Update User
**PUT** `/api/admin/users/[id]`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe Updated",
  "userType": "ADMIN", // Can change user type
  "status": "ACTIVE",
  "employeeId": "TCH-001", // For teachers
  "qualification": "M.Ed",
  "specialization": "Science"
}
```

### Deactivate User
**DELETE** `/api/admin/users/[id]`

Soft deletes the user by setting status to INACTIVE and deletedAt timestamp.

## Frontend Components

### UserForm Component
Located at `src/components/admin/users/UserForm.tsx`

Features:
- User type selection (Teacher, Admin, Accountant, Staff)
- Automatic password generation
- Teacher-specific fields (employee ID, qualification, specialization)
- Form validation
- Welcome email option

### Users Management Page
Located at `src/app/admin/users/page.tsx`

Features:
- User list with pagination
- Search and filter functionality
- Create, edit, and deactivate users
- Role badges display
- Status indicators

## Services

### userRoleService
Located at `src/lib/services/userRoleService.ts`

Key Functions:
- `createUserWithRole()`: Creates user with automatic role assignment
- `updateUserRole()`: Updates user role and handles Teacher record creation/deletion
- `getRoleIdByUserType()`: Maps user type to role ID

## Role Permissions

### SUPER_ADMIN
- All permissions (full system access)
- User management capabilities

### Admin
- All permissions except user management
- Full system administration

### Teacher
- CREATE, READ, UPDATE on: ACADEMIC_YEAR, CLASS_LEVEL, SECTION, SUBJECT, STUDENT
- Academic and student management

### Accountant
- CREATE, READ, UPDATE, DELETE on: FINANCE
- READ on: STUDENT (for billing purposes)
- Financial management

### Staff
- CREATE, READ, UPDATE on: STAFF, SECTION, SUBJECT, STUDENT, ACADEMIC_YEAR, CLASS_LEVEL
- Administrative tasks

## Authentication Flow

1. User logs in with email and password
2. System validates credentials
3. System checks user status (must be ACTIVE)
4. System retrieves user roles and permissions
5. JWT token generated with user info and roles
6. Token stored in HTTP-only cookie
7. User redirected based on role:
   - Admin/SUPER_ADMIN → `/dashboard/admin`
   - Others → `/dashboard`

## Middleware Protection

The middleware (`src/middleware.ts`) protects routes by:
- Verifying JWT token
- Checking user roles for admin routes
- Redirecting unauthorized users
- Handling token expiration

## Setup Instructions

### 1. Database Migration
Run Prisma migrations to update the schema:
```bash
npx prisma migrate dev --name add_user_management
```

### 2. Seed Database
Run the seed script to create roles and permissions:
```bash
npx prisma db seed
```

This will:
- Create all required roles (SUPER_ADMIN, Admin, Teacher, Accountant, Staff)
- Assign permissions to each role
- Create a default Super Admin user

### 3. Environment Variables
Ensure these are set:
```
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@hiigsi.com
ADMIN_PASSWORD=Admin@123456
```

### 4. Access the System
1. Login with the Super Admin credentials
2. Navigate to `/admin/users`
3. Create users of any type
4. Users can immediately log in with their credentials

## Usage Examples

### Creating a Teacher
```typescript
const response = await fetch('/api/admin/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@school.com',
    password: 'TempPass123!',
    userType: 'TEACHER',
    qualification: 'M.Ed',
    specialization: 'English Literature'
  })
});
```

### Creating an Accountant
```typescript
const response = await fetch('/api/admin/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@school.com',
    password: 'TempPass123!',
    userType: 'ACCOUNTANT'
  })
});
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt (12 rounds)
2. **JWT Tokens**: Secure token-based authentication
3. **HTTP-Only Cookies**: Tokens stored in secure, HTTP-only cookies
4. **Role-Based Access**: All routes protected by role checks
5. **Audit Logging**: All user management actions are logged
6. **Soft Deletes**: Users are deactivated, not permanently deleted

## Troubleshooting

### User Cannot Login
- Check user status is ACTIVE
- Verify password is set (passwordHash exists)
- Check user has at least one role assigned

### Permission Denied Errors
- Verify user has the correct role
- Check role has required permissions
- Ensure SUPER_ADMIN role exists for admin operations

### Teacher Record Not Created
- Verify userType is 'TEACHER'
- Check Teacher model relationship exists
- Review transaction logs for errors

## Future Enhancements

Potential improvements:
- Bulk user import from CSV
- Role templates for custom permissions
- User activity tracking
- Password expiration policies
- Two-factor authentication
- Email notifications for user creation

