import type { Student, User, NavItem } from './types';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  DollarSign,
  Megaphone,
  Book,
  BarChart,
  UserCog,
  Settings,
  Shield,
  LifeBuoy,
  LogOut,
  FileOutput,
} from 'lucide-react';

export const students: Student[] = [
  {
    id: '1',
    name: 'Aisha Ahmed',
    avatar: 'https://picsum.photos/seed/101/100/100',
    studentId: 'HS-001',
    grade: 'Grade 10',
    parentName: 'Fatima Ahmed',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Yusuf Ali',
    avatar: 'https://picsum.photos/seed/102/100/100',
    studentId: 'HS-002',
    grade: 'Grade 9',
    parentName: 'Ibrahim Ali',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Zainab Omar',
    avatar: 'https://picsum.photos/seed/103/100/100',
    studentId: 'HS-003',
    grade: 'Grade 11',
    parentName: 'Khadija Omar',
    status: 'Inactive',
  },
  {
    id: '4',
    name: 'Mustafa Hassan',
    avatar: 'https://picsum.photos/seed/104/100/100',
    studentId: 'HS-004',
    grade: 'Grade 10',
    parentName: 'Amina Hassan',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Maryam Hussein',
    avatar: 'https://picsum.photos/seed/105/100/100',
    studentId: 'HS-005',
    grade: 'Grade 12',
    parentName: 'Said Hussein',
    status: 'Active',
  },
];

export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    avatar: 'https://picsum.photos/seed/201/100/100',
    email: 'admin@hiigsi.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2024-05-20 10:00 AM',
  },
  {
    id: '2',
    name: 'John Teacher',
    avatar: 'https://picsum.photos/seed/202/100/100',
    email: 'john.t@hiigsi.com',
    role: 'Teacher',
    status: 'Active',
    lastLogin: '2024-05-20 09:30 AM',
  },
  {
    id: '3',
    name: 'Jane Parent',
    avatar: 'https://picsum.photos/seed/203/100/100',
    email: 'jane.p@email.com',
    role: 'Parent',
    status: 'Deactivated',
    lastLogin: '2024-05-19 08:00 PM',
  },
  {
    id: '4',
    name: 'Aisha Ahmed',
    avatar: 'https://picsum.photos/seed/101/100/100',
    email: 'aisha.a@hiigsi.com',
    role: 'Student',
    status: 'Active',
    lastLogin: '2024-05-20 11:00 AM',
  },
];

export const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/students', label: 'Students', icon: GraduationCap },
  { href: '/dashboard/academics', label: 'Academics', icon: Book },
  { href: '/dashboard/finance', label: 'Finance', icon: DollarSign },
  { href: '/dashboard/communication', label: 'Communication', icon: Megaphone },
  { href: '/dashboard/reports', label: 'Reports', icon: FileOutput },
  { href: '/dashboard/users', label: 'User Management', icon: UserCog },
];

export const userNavItems = [
    { label: 'Profile', icon: UserCog, href: '#' },
    { label: 'Billing', icon: DollarSign, href: '#' },
    { label: 'Settings', icon: Settings, href: '#' },
]

export const enrollmentData = [
    { year: '2020', "Total Students": 450 },
    { year: '2021', "Total Students": 520 },
    { year: '2022', "Total Students": 610 },
    { year: '2023', "Total Students": 730 },
    { year: '2024', "Total Students": 850 },
];
