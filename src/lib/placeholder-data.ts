
import {
  Home,
  Users,
  BookOpen,
  GraduationCap,
  Wallet,
  Library,
  BarChart3,
  Settings,
  ClipboardCheck,
  UserCheck,
  FileText,
  CalendarCheck,
  ArrowUp,
  Megaphone,
  MessageSquare,
  Bell,
  Rss,
} from 'lucide-react';
import type { NavItem } from './types';


export const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: Home,
    href: '/dashboard',
  },
  {
    label: 'User Management',
    icon: Users,
    href: '/dashboard/users',
    permission: { action: 'READ', subject: 'USER_MANAGEMENT' },
    children: [
      { label: 'Users', href: '/dashboard/users', permission: { action: 'READ', subject: 'USER_MANAGEMENT' } },
      { label: 'Roles & Permissions', href: '/dashboard/users/roles', permission: { action: 'READ', subject: 'USER_MANAGEMENT' } },
      { label: 'Staff Management', href: '/dashboard/users/staff', permission: { action: 'READ', subject: 'STAFF' } },
      { label: 'User Activity Logs', href: '/dashboard/users/logs', permission: { action: 'READ', subject: 'AUDIT_LOG' } },
    ],
  },
  {
    label: 'Academic Management',
    icon: BookOpen,
    href: '/dashboard/academics',
    permission: { action: 'READ', subject: 'CLASS_LEVEL' },
    children: [
      { label: 'Classes / Grades', href: '/dashboard/academics/classes', permission: { action: 'READ', subject: 'CLASS_LEVEL' } },
      { label: 'Sections', href: '/dashboard/academics/sections', permission: { action: 'READ', subject: 'SECTION' } },
      { label: 'Subjects', href: '/dashboard/academics/subjects', permission: { action: 'READ', subject: 'SUBJECT' } },
      { label: 'Academic Calendar', href: '/dashboard/academics/calendar', permission: { action: 'READ', subject: 'ACADEMIC_YEAR' } },
      { label: 'Class Timetable', href: '/dashboard/academics/timetable', permission: { action: 'READ', subject: 'CLASS_LEVEL' } },
      { label: 'Syllabus Management', href: '/dashboard/academics/syllabus', permission: { action: 'READ', subject: 'SUBJECT' } },
    ],
  },
  {
    label: 'Student Management',
    icon: GraduationCap,
    href: '/dashboard/students',
    permission: { action: 'READ', subject: 'STUDENT' }, // Note: STUDENT subject might need to be added to seed/schema if not present
    children: [
      { label: 'Students', href: '/dashboard/students', permission: { action: 'READ', subject: 'STUDENT' } },
      { label: 'Admissions', href: '/dashboard/students/admissions', permission: { action: 'READ', subject: 'STUDENT' } },
      { label: 'Student Profiles', href: '/dashboard/students/profiles', permission: { action: 'READ', subject: 'STUDENT' } },
      { label: 'Attendance', href: '/dashboard/students/attendance', permission: { action: 'READ', subject: 'STUDENT' } },
      { label: 'Promotions', href: '/dashboard/students/promotions', permission: { action: 'READ', subject: 'STUDENT' } },
    ],
  },
  {
    label: 'Teacher Management',
    icon: UserCheck,
    href: '/dashboard/teachers',
    permission: { action: 'READ', subject: 'STAFF' },
    children: [
      { label: 'Teachers', href: '/dashboard/teachers', permission: { action: 'READ', subject: 'STAFF' } },
      { label: 'Subject Allocation', href: '/dashboard/teachers/allocation', permission: { action: 'READ', subject: 'SUBJECT' } },
      { label: 'Teacher Timetable', href: '/dashboard/teachers/timetable', permission: { action: 'READ', subject: 'SUBJECT' } },
      { label: 'Performance Evaluation', href: '/dashboard/teachers/performance', permission: { action: 'READ', subject: 'STAFF' } },
    ],
  },
  {
    label: 'Examination & Results',
    icon: FileText,
    href: '/dashboard/examinations',
    permission: { action: 'READ', subject: 'SUBJECT' }, // Using SUBJECT as a proxy for academics for now
    children: [
      { label: 'Exams', href: '/dashboard/examinations/exams', permission: { action: 'READ', subject: 'SUBJECT' } },
      { label: 'Exam Schedule', href: '/dashboard/examinations/schedule', permission: { action: 'READ', subject: 'SUBJECT' } },
      { label: 'Marks Entry', href: '/dashboard/examinations/marks-entry', permission: { action: 'UPDATE', subject: 'SUBJECT' } },
      { label: 'Results & Report Cards', href: '/dashboard/examinations/report-cards', permission: { action: 'READ', subject: 'SUBJECT' } },
    ],
  },
  {
    label: 'Finance & Fees',
    icon: Wallet,
    href: '/dashboard/finance',
    permission: { action: 'READ', subject: 'FINANCE' },
    children: [
      { label: 'Fee Management', href: '/dashboard/finance/fee-management', permission: { action: 'READ', subject: 'FINANCE' } },
      { label: 'AI Fee Suggester', href: '/dashboard/finance/fee-structure', permission: { action: 'READ', subject: 'FINANCE' } },
      { label: 'Student Fees', href: '/dashboard/finance/student-fees', permission: { action: 'READ', subject: 'FINANCE' } },
      { label: 'Payments', href: '/dashboard/finance/payments', permission: { action: 'READ', subject: 'FINANCE' } },
      { label: 'Invoices', href: '/dashboard/finance/invoices', permission: { action: 'READ', subject: 'FINANCE' } },
      { label: 'Financial Reports', href: '/dashboard/finance/financial-reports', permission: { action: 'READ', subject: 'FINANCE' } },
    ],
  },
  {
    label: 'Communication',
    icon: Megaphone,
    href: '/dashboard/communication',
    permission: { action: 'READ', subject: 'STAFF' },
    children: [
      { label: 'Announcements', href: '/dashboard/communication/announcements', permission: { action: 'READ', subject: 'STAFF' } },
      { label: 'Messaging', href: '/dashboard/communication/messaging', permission: { action: 'READ', subject: 'STAFF' } },
      { label: 'Notifications', href: '/dashboard/communication/notifications', permission: { action: 'READ', subject: 'STAFF' } },
    ],
  },
  {
    label: 'Reports & Analytics',
    icon: BarChart3,
    href: '/dashboard/reports',
    permission: { action: 'READ', subject: 'AUDIT_LOG' },
  },
  {
    label: 'System Settings',
    icon: Settings,
    href: '/dashboard/settings',
    permission: { action: 'READ', subject: 'SCHOOL_PROFILE' },
    children: [
      { label: 'School Profile', href: '/dashboard/settings/school-profile', permission: { action: 'READ', subject: 'SCHOOL_PROFILE' } },
      { label: 'Academic Year', href: '/dashboard/settings/academic-year', permission: { action: 'READ', subject: 'ACADEMIC_YEAR' } },
      { label: 'User Settings', href: '/dashboard/settings/user-settings', permission: { action: 'READ', subject: 'USER_MANAGEMENT' } },
      { label: 'Backup & Restore', href: '/dashboard/settings/backup', permission: { action: 'DELETE', subject: 'SCHOOL_PROFILE' } },
      { label: 'Audit Logs', href: '/dashboard/settings/audit-logs', permission: { action: 'READ', subject: 'AUDIT_LOG' } },
    ],
  },
];
