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
  teacherId?: string;
  teacher?: string; // This can be deprecated if teacherId is used
  status: 'Active' | 'Inactive';
};

export type AcademicYear = {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    isCurrent: boolean;
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  type: 'event' | 'exam' | 'holiday';
  description: string;
  academicYearId?: string;
};

export type TimetableEntry = {
    day: string;
    [time: string]: { subjectId: string; teacherId: string; subject: string; teacher: string; } | string;
};

export type Timetable = {
    id: string;
    classId: string;
    sectionId: string;
    entries: TimetableEntry[];
};


export type Syllabus = {
    id: string;
    title: string;
    description: string;
    classId: string;
    subjectId: string;
    term: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
    chapters?: { title: string; topics: string[] }[];
}

export type Student = {
    id: string;
    studentId: string; // User-facing ID e.g., ST-001
    admissionNumber: string;
    userId?: string; // Link to a user account if applicable
    name: string;
    avatar: string;
    classId: string;
    sectionId: string;
    status: 'Active' | 'Inactive' | 'Graduated';
    admissionDate: string;
    dob: string;
    gender: 'Male' | 'Female' | 'Other';
    email: string;
    phone: string;
    address: string;
    parentName?: string; // Simplified for now
    // More complex parent/guardian info can be a separate type
};

export type Guardian = {
    id: string;
    studentId: string;
    name: string;
    relation: string;
    phone: string;
    email?: string;
};


export type Admission = {
    id: string;
    studentName: string;
    appliedClassId: string;
    admissionDate: Date;
    status: 'Pending' | 'Approved' | 'Rejected';
    studentId?: string; // Filled when approved and student record is created
    // Include other applicant details
};

export type Attendance = {
    id: string;
    studentId: string;
    date: Date;
    status: 'Present' | 'Absent' | 'Late' | 'Excused';
    markedBy: string; // userId of teacher/admin
};

export type Promotion = {
    id: string;
    studentId: string;
    fromClassId: string;
    toClassId: string;
    academicYearId: string;
    promotionDate: Date;
};
