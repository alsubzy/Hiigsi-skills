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
} from 'lucide-react';
import type { NavItem, User, AcademicClass, Section, Subject, CalendarEvent, TimetableEntry, Syllabus, Student, Attendance } from './types';


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
    children: [
      { label: 'Users', href: '/dashboard/users' },
      { label: 'Roles & Permissions', href: '/dashboard/users/roles' },
      { label: 'Staff Management', href: '/dashboard/users/staff' },
      { label: 'User Activity Logs', href: '/dashboard/users/logs' },
    ],
  },
  {
    label: 'Academic Management',
    icon: BookOpen,
    href: '/dashboard/academics',
    children: [
      { label: 'Classes / Grades', href: '/dashboard/academics/classes' },
      { label: 'Sections', href: '/dashboard/academics/sections' },
      { label: 'Subjects', href: '/dashboard/academics/subjects' },
      { label: 'Academic Calendar', href: '/dashboard/academics/calendar' },
      { label: 'Class Timetable', href: '/dashboard/academics/timetable' },
      { label: 'Syllabus Management', href: '/dashboard/academics/syllabus' },
    ],
  },
  {
    label: 'Student Management',
    icon: GraduationCap,
    href: '/dashboard/students',
    children: [
      { label: 'Students', href: '/dashboard/students' },
      { label: 'Admissions', href: '/dashboard/students/admissions' },
      { label: 'Student Profiles', href: '/dashboard/students/profiles' },
      { label: 'Attendance', href: '/dashboard/students/attendance' },
      { label: 'Promotions', href: '/dashboard/students/promotions' },
    ],
  },
  {
    label: 'Teacher Management',
    icon: UserCheck,
    href: '/dashboard/teachers',
    children: [
      { label: 'Teachers', href: '/dashboard/teachers' },
      { label: 'Subject Allocation', href: '/dashboard/teachers/allocation' },
      { label: 'Teacher Timetable', href: '/dashboard/teachers/timetable' },
      { label: 'Performance Evaluation', href: '/dashboard/teachers/performance' },
    ],
  },
  {
    label: 'Examination & Results',
    icon: FileText,
    href: '/dashboard/examinations',
    children: [
      { label: 'Exams', href: '/dashboard/examinations/exams' },
      { label: 'Exam Schedule', href: '/dashboard/examinations/schedule' },
      { label: 'Marks Entry', href: '/dashboard/examinations/marks-entry' },
      { label: 'Results & Report Cards', href: '/dashboard/examinations/report-cards' },
    ],
  },
  {
    label: 'Finance & Fees',
    icon: Wallet,
    href: '/dashboard/finance',
    children: [
      { label: 'Fee Structure', href: '/dashboard/finance/fee-structure' },
      { label: 'Student Fees', href: '/dashboard/finance/student-fees' },
      { label: 'Payments', href: '/dashboard/finance/payments' },
      { label: 'Invoices', href: '/dashboard/finance/invoices' },
      { label: 'Financial Reports', href: '/dashboard/finance/financial-reports' },
    ],
  },
   {
    label: 'Communication',
    icon: Megaphone,
    href: '/dashboard/communication',
  },
  {
    label: 'Reports & Analytics',
    icon: BarChart3,
    href: '/dashboard/reports',
  },
  {
    label: 'System Settings',
    icon: Settings,
    href: '#',
    children: [
      { label: 'School Profile', href: '#' },
      { label: 'Academic Year', href: '#' },
      { label: 'User Settings', href: '#' },
      { label: 'Backup & Restore', href: '#' },
      { label: 'Audit Logs', href: '#' },
    ],
  },
];


export const users: User[] = [
    {
        id: '1',
        name: 'Nathan Scott',
        avatar: 'https://picsum.photos/seed/nathan/100',
        email: 'nathan.scott@example.com',
        role: 'Admin',
        status: 'Active',
        createdDate: '2023-01-15'
    },
    {
        id: '2',
        name: 'Jane Doe',
        avatar: 'https://picsum.photos/seed/jane/100',
        email: 'jane.doe@example.com',
        role: 'Teacher',
        status: 'Active',
        createdDate: '2023-02-20'
    },
    {
        id: '3',
        name: 'John Smith',
        avatar: 'https://picsum.photos/seed/john/100',
        email: 'john.smith@example.com',
        role: 'Parent',
        status: 'Active',
        createdDate: '2023-03-10'
    },
    {
        id: '4',
        name: 'Emily White',
        avatar: 'https://picsum.photos/seed/emily/100',
        email: 'emily.white@example.com',
        role: 'Student',
        status: 'Deactivated',
        createdDate: '2023-04-05'
    },
     {
        id: '5',
        name: 'Michael Brown',
        avatar: 'https://picsum.photos/seed/michael/100',
        email: 'michael.brown@example.com',
        role: 'Teacher',
        status: 'Active',
        createdDate: '2023-05-12'
    },
    {
        id: '6',
        name: 'Sarah Wilson',
        avatar: 'https://picsum.photos/seed/sarah/100',
        email: 'sarah.wilson@example.com',
        role: 'Admin',
        status: 'Active',
        createdDate: '2023-06-18'
    },
    {
        id: '7',
        name: 'David Jones',
        avatar: 'https://picsum.photos/seed/david/100',
        email: 'david.jones@example.com',
        role: 'Parent',
        status: 'Deactivated',
        createdDate: '2023-07-22'
    },
    {
        id: '8',
        name: 'Laura Taylor',
        avatar: 'https://picsum.photos/seed/laura/100',
        email: 'laura.taylor@example.com',
        role: 'Teacher',
        status: 'Active',
        createdDate: '2023-08-30'
    }
];

export const academicClasses: AcademicClass[] = [
    { id: 'c1', name: 'Grade 1', level: 'Primary', status: 'Active' },
    { id: 'c2', name: 'Grade 2', level: 'Primary', status: 'Active' },
    { id: 'c3', name: 'Grade 7', level: 'Secondary', status: 'Active' },
    { id: 'c4', name: 'Grade 10', level: 'High School', status: 'Inactive' },
    { id: 'c5', name: 'Grade 12', level: 'High School', status: 'Active' },
];

export const sections: Section[] = [
    { id: 's1', name: 'Section A', classId: 'c1', capacity: 30, status: 'Active' },
    { id: 's2', name: 'Section B', classId: 'c1', capacity: 30, status: 'Active' },
    { id: 's3', name: 'Section A', classId: 'c3', capacity: 25, status: 'Active' },
    { id: 's4', name: 'Section C', classId: 'c5', capacity: 28, status: 'Inactive' },
];

export const subjects: Subject[] = [
    { id: 'sub1', name: 'Mathematics', classId: 'c1', teacher: 'Jane Doe', status: 'Active' },
    { id: 'sub2', name: 'Science', classId: 'c3', teacher: 'Michael Brown', status: 'Active' },
    { id: 'sub3', name: 'History', classId: 'c3', teacher: 'Laura Taylor', status: 'Active' },
    { id: 'sub4', name: 'English', classId: 'c5', teacher: 'Jane Doe', status: 'Inactive' },
    { id: 'sub5', name: 'Computer Science', classId: 'c5', teacher: 'Michael Brown', status: 'Active' },
];

export const calendarEvents: CalendarEvent[] = [
    { id: 'e1', title: 'First Day of School', date: new Date(2024, 8, 2), type: 'event', description: 'Start of the new academic year.' },
    { id: 'e2', title: 'Mid-term Exams', date: new Date(2024, 10, 15), type: 'exam', description: 'Mid-term examinations for all grades.' },
    { id: 'e3', title: 'Winter Break', date: new Date(2024, 11, 22), type: 'holiday', description: 'School closed for winter holidays.' },
    { id: 'e4', title: 'Parent-Teacher Meeting', date: new Date(2024, 9, 5), type: 'event', description: 'Meeting to discuss student progress.' },
];

export const timetableData: TimetableEntry[] = [
  { day: 'Monday', '09:00': { subject: 'Math', teacher: 'Mr. Smith' }, '10:00': { subject: 'Science', teacher: 'Ms. Jones' }, '11:00': { subject: 'English', teacher: 'Ms. Davis' }, '12:00': 'Lunch', '13:00': { subject: 'History', teacher: 'Mr. Brown' }, '14:00': { subject: 'Art', teacher: 'Ms. White' } },
  { day: 'Tuesday', '09:00': { subject: 'Science', teacher: 'Ms. Jones' }, '10:00': { subject: 'History', teacher: 'Mr. Brown' }, '11:00': { subject: 'Math', teacher: 'Mr. Smith' }, '12:00': 'Lunch', '13:00': { subject: 'PE', teacher: 'Mr. Green' }, '14:00': { subject: 'English', teacher: 'Ms. Davis' } },
  { day: 'Wednesday', '09:00': { subject: 'English', teacher: 'Ms. Davis' }, '10:00': { subject: 'Math', teacher: 'Mr. Smith' }, '11:00': { subject: 'Music', teacher: 'Ms. Melody' }, '12:00': 'Lunch', '13:00': { subject: 'Science', teacher: 'Ms. Jones' }, '14:00': { subject: 'History', teacher: 'Mr. Brown' } },
  { day: 'Thursday', '09:00': { subject: 'History', teacher: 'Mr. Brown' }, '10:00': { subject: 'PE', teacher: 'Mr. Green' }, '11:00': { subject: 'Science', teacher: 'Ms. Jones' }, '12:00': 'Lunch', '13:00': { subject: 'English', teacher: 'Ms. Davis' }, '14:00': { subject: 'Math', teacher: 'Mr. Smith' } },
  { day: 'Friday', '09:00': { subject: 'PE', teacher: 'Mr. Green' }, '10:00': { subject: 'English', teacher: 'Ms. Davis' }, '11:00': { subject: 'Math', teacher: 'Mr. Smith' }, '12:00': 'Lunch', '13:00': { subject: 'Music', teacher: 'Ms. Melody' }, '14:00': { subject: 'Science', teacher: 'Ms. Jones' } },
];
export const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];


export const syllabusData: Syllabus[] = [
    { id: 'syl1', title: 'Algebra Basics', classId: 'c3', subjectId: 'sub2', description: 'Introduction to variables, equations, and functions.', term: 'First Term', status: 'Completed' },
    { id: 'syl2', title: 'Cellular Biology', classId: 'c3', subjectId: 'sub2', description: 'Study of cell structure, function, and reproduction.', term: 'First Term', status: 'In Progress' },
    { id: 'syl3', title: 'World War I', classId: 'c3', subjectId: 'sub3', description: 'Causes, events, and consequences of the Great War.', term: 'Second Term', status: 'Not Started' },
    { id: 'syl4', title: 'Shakespearean Sonnets', classId: 'c5', subjectId: 'sub4', description: 'Analysis of Shakespeare\'s sonnets.', term: 'First Term', status: 'Completed' },
];

export const students: Student[] = [
    { id: 'st1', studentId: 'ST-001', name: 'Olivia Martinez', avatar: 'https://picsum.photos/seed/olivia/100', classId: 'c3', sectionId: 's3', parentName: 'Carlos Martinez', status: 'Active', admissionDate: '2023-04-12', dob: '2010-05-20', gender: 'Female', email: 'olivia.m@example.com', phone: '555-0101', address: '123 Oak Avenue' },
    { id: 'st2', studentId: 'ST-002', name: 'Liam Wilson', avatar: 'https://picsum.photos/seed/liam/100', classId: 'c3', sectionId: 's3', parentName: 'Sophia Wilson', status: 'Active', admissionDate: '2023-04-15', dob: '2010-02-18', gender: 'Male', email: 'liam.w@example.com', phone: '555-0102', address: '456 Pine Street' },
    { id: 'st3', studentId: 'ST-003', name: 'Emma Garcia', avatar: 'https://picsum.photos/seed/emma/100', classId: 'c1', sectionId: 's1', parentName: 'David Garcia', status: 'Active', admissionDate: '2024-01-20', dob: '2016-08-30', gender: 'Female', email: 'emma.g@example.com', phone: '555-0103', address: '789 Maple Drive' },
    { id: 'st4', studentId: 'ST-004', name: 'Noah Rodriguez', avatar: 'https://picsum.photos/seed/noah/100', classId: 'c5', sectionId: 's4', parentName: 'Isabella Rodriguez', status: 'Inactive', admissionDate: '2022-05-10', dob: '2006-11-22', gender: 'Male', email: 'noah.r@example.com', phone: '555-0104', address: '101 Birch Lane' },
    { id: 'st5', studentId: 'ST-005', name: 'Ava Smith', avatar: 'https://picsum.photos/seed/ava/100', classId: 'c1', sectionId: 's2', parentName: 'James Smith', status: 'Active', admissionDate: '2024-02-01', dob: '2016-07-14', gender: 'Female', email: 'ava.s@example.com', phone: '555-0105', address: '212 Cedar Road' },
];

export const initialAttendance: Attendance[] = students
    .filter(s => s.classId === 'c3') // Default to Grade 7 students
    .map(student => ({
        studentId: student.studentId,
        name: student.name,
        status: ['present', 'absent', 'late', 'excused'][Math.floor(Math.random() * 4)] as 'present' | 'absent' | 'late' | 'excused',
    }));

    
