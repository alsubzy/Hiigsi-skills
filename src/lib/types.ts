export type Student = {
  id: string;
  name: string;
  avatar: string;
  studentId: string;
  grade: string;
  parentName: string;
  status: 'Active' | 'Inactive';
};

export type User = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: 'Admin' | 'Teacher' | 'Parent' | 'Student';
  status: 'Active' | 'Deactivated';
  lastLogin: string;
};

export type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
};
