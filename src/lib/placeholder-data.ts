
import {
  Home,
  Users,
  BookOpen,
  Wallet,
  CalendarCheck,
  BarChart3,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import type { NavItem, Student, User } from './types';


export const navItems: NavItem[] = [
  {
    label: 'Home',
    icon: Home,
    href: '/dashboard',
  },
  {
    label: 'Academics',
    icon: BookOpen,
    href: '/dashboard/academics',
    children: [
      {
        label: 'Class Schedule',
        href: '/dashboard/academics/schedule',
      },
      {
        label: 'Subjects',
        href: '/dashboard/academics/subjects',
      },
      {
        label: 'Timetable',
        href: '/dashboard/academics/timetable',
      },
      {
        label: 'Exam Results',
        href: '/dashboard/academics/results',
      },
    ]
  },
  {
    label: 'Students',
    icon: Users,
    href: '/dashboard/students',
  },
  {
    label: 'Teachers',
    icon: GraduationCap,
    href: '/dashboard/teachers',
  },
  {
    label: 'Attendance',
    icon: CalendarCheck,
    href: '/dashboard/attendance',
  },
  {
    label: 'Fees & Finance',
    icon: Wallet,
    href: '/dashboard/finance',
  },
  {
    label: 'Library',
    icon: BookOpen,
    href: '/dashboard/library',
  },
  {
    label: 'Reports',
    icon: BarChart3,
    href: '/dashboard/reports',
  },
  {
    label: 'Staff & Roles',
    icon: ShieldCheck,
    href: '/dashboard/staff',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
];


export const students: Student[] = [
  {
    id: '1',
    name: 'Liam Smith',
    avatar: 'https://picsum.photos/seed/liam/100',
    studentId: 'ST-2024-001',
    grade: '10',
    parentName: 'John Smith',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Lily Thompson',
    avatar: 'https://picsum.photos/seed/lily/100',
    studentId: 'ST-2024-002',
    grade: '11',
    parentName: 'Sarah Thompson',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Lucas Young',
    avatar: 'https://picsum.photos/seed/lucas/100',
    studentId: 'ST-2024-003',
    grade: '9',
    parentName: 'David Young',
    status: 'Inactive',
  },
  {
    id: '4',
    name: 'Isabella Garcia',
    avatar: 'https://picsum.photos/seed/isabella/100',
    studentId: 'ST-2024-004',
    grade: '12',
    parentName: 'Maria Garcia',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Amelia Davis',
    avatar: 'https://picsum.photos/seed/amelia/100',
    studentId: 'ST-2024-005',
    grade: '10',
    parentName: 'James Davis',
    status: 'Active',
  },
   {
    id: '6',
    name: 'Caleb Turner',
    avatar: 'https://picsum.photos/seed/caleb/100',
    studentId: 'ST-2024-006',
    grade: '11',
    parentName: 'Robert Turner',
    status: 'Inactive',
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
        lastLogin: '2 hours ago'
    },
    {
        id: '2',
        name: 'Jane Doe',
        avatar: 'https://picsum.photos/seed/jane/100',
        email: 'jane.doe@example.com',
        role: 'Teacher',
        status: 'Active',
        lastLogin: '1 day ago'
    },
    {
        id: '3',
        name: 'John Smith',
        avatar: 'https://picsum.photos/seed/john/100',
        email: 'john.smith@example.com',
        role: 'Parent',
        status: 'Active',
        lastLogin: '30 minutes ago'
    },
    {
        id: '4',
        name: 'Emily White',
        avatar: 'https://picsum.photos/seed/emily/100',
        email: 'emily.white@example.com',
        role: 'Student',
        status: 'Deactivated',
        lastLogin: '5 days ago'
    },
     {
        id: '5',
        name: 'Michael Brown',
        avatar: 'https://picsum.photos/seed/michael/100',
        email: 'michael.brown@example.com',
        role: 'Teacher',
        status: 'Active',
        lastLogin: '1 hour ago'
    }
];


export const kpis = [
    {
      title: 'Nominal Balance',
      value: '$2,450,900',
      change: '+15.06%',
      chartData: [{ value: 10 }, { value: 20 }, { value: 15 }, { value: 30 }, { value: 25 }, { value: 40 }],
    },
    {
      title: 'Total Stock Product',
      value: '821,900',
      change: '-3.12%',
      chartData: [{ value: 40 }, { value: 35 }, { value: 30 }, { value: 25 }, { value: 20 }, { value: 15 }],
    },
    {
      title: 'Nominal Revenue',
      value: '$1,250,000',
      change: '+8.75%',
      chartData: [{ value: 5 }, { value: 15 }, { value: 10 }, { value: 25 }, { value: 20 }, { value: 35 }],
    },
    {
      title: 'Nominal Expense',
      value: '$750,900',
      change: '+12.45%',
      chartData: [{ value: 12 }, { value: 18 }, { value: 15 }, { value: 22 }, { value: 20 }, { value: 28 }],
    },
  ];
  
  export const productActivityData = [
    { name: 'To Be Packed', value: 400 },
    { name: 'Process Delivery', value: 300 },
    { name: 'Delivery Done', value: 300 },
    { name: 'Returned', value: 200 },
  ];
  
  export const customerActivityData = [
    { month: 'Apr 2025', paid: 2400, checkout: 4400 },
    { month: 'May 2025', paid: 1398, checkout: 4210 },
    { month: 'Jun 2025', paid: 9800, checkout: 4290 },
    { month: 'Jul 2025', paid: 3908, checkout: 4000 },
    { month: 'Aug 2025', paid: 4800, checkout: 4181 },
    { month: 'Sep 2025', paid: 3800, checkout: 4500 },
    { month: 'Oct 2025', paid: 4300, checkout: 4100 },
  ];
  
  export const recentTransactions = [
    {
      orderId: '#273640',
      product: { name: 'Nike Sport', desc: 'Running Shoes', image: 'https://picsum.photos/seed/nike/40' },
      price: '$120.50',
      customer: { name: 'John Smith', avatar: 'https://picsum.photos/seed/john-smith/40' },
      date: '12-10-2025',
      payment: { method: 'visa', last4: '4242' },
      email: 'johnsmith@example.com',
    },
    {
      orderId: '#273641',
      product: { name: 'Adidas Ultraboost', desc: 'Lifestyle Shoes', image: 'https://picsum.photos/seed/adidas/40' },
      price: '$180.00',
      customer: { name: 'Jane Doe', avatar: 'https://picsum.photos/seed/jane-doe/40' },
      date: '12-10-2025',
      payment: { method: 'mastercard', last4: '5555' },
      email: 'janedoe@example.com',
    },
    {
      orderId: '#273642',
      product: { name: 'Puma Suede', desc: 'Classic Sneakers', image: 'https://picsum.photos/seed/puma/40' },
      price: '$75.00',
      customer: { name: 'Mike Johnson', avatar: 'https://picsum.photos/seed/mike-j/40' },
      date: '11-10-2025',
      payment: { method: 'stripe', last4: '9876' },
      email: 'mike.j@example.com',
    },
  ];

import {
  GraduationCap
} from 'lucide-react';

