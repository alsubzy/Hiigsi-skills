import type { LucideIcon } from "lucide-react";

export type User = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: 'Admin' | 'Teacher' | 'Parent' | 'Student';
  status: 'Active' | 'Deactivated';
  createdDate: string;
};

// Extended user type for backend with sensitive info
export type BackendUser = User & {
    password?: string; // Should be hashed in a real DB
    deletedAt?: Date | null;
    roleId?: string;
}

export type Role = {
    id: string;
    name: string;
    isSystem: boolean; // System roles cannot be deleted
    permissions: string[];
};

export type Staff = {
    id: string;
    userId: string;
    name: string;
    position: string;
    department: string;
    status: 'Active' | 'On Leave' | 'Resigned';
};

export type ActivityLog = {
    id: string;
    userId: string;
    action: string;
    module: string;
    details?: string;
    timestamp: Date;
};


export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  children?: {
    href: string;
    label: string;
  }[];
};

export type AcademicClass = {
  id: string;
  name: string;
  level: string;
  status: 'Active' | 'Inactive';
};

export type Section = {
  id: string;
  name: string;
  classId: string;
  capacity: number;
  status: 'Active' | 'Inactive';
};

export type Subject = {
  id: string;
  name: string;
  classId: string;
  teacher?: string;
  status: 'Active' | 'Inactive';
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  type: 'event' | 'exam' | 'holiday';
  description: string;
};

export type TimetableEntry = {
  day: string;
  [time: string]: { subject: string, teacher: string } | string;
};

export type Syllabus = {
    id: string;
    title: string;
    description: string;
    classId: string;
    subjectId: string;
    term: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
}

export type Student = {
    id: string;
    studentId: string;
    name: string;
    avatar: string;
    classId: string;
    sectionId: string;
    parentName: string;
    status: 'Active' | 'Inactive' | 'Graduated';
    admissionDate: string;
    dob: string;
    gender: 'Male' | 'Female';
    email: string;
    phone: string;
    address: string;
};

export type Attendance = {
    studentId: string;
    name: string;
    status: 'present' | 'absent' | 'late' | 'excused';
};
