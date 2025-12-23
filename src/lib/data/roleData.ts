// src/lib/data/roleData.ts
import { Role } from '@/lib/types';

let roles: Role[] = [
  { id: 'admin', name: 'Admin', isSystem: true, permissions: ['all'] },
  { id: 'teacher', name: 'Teacher', isSystem: false, permissions: ['read:students', 'write:grades'] },
  { id: 'parent', name: 'Parent', isSystem: false, permissions: ['read:own_child_grades'] },
  { id: 'accountant', name: 'Accountant', isSystem: false, permissions: ['read:finance', 'write:finance'] },
];

export const roleData = {
  async findAll(): Promise<Role[]> {
    return [...roles];
  },

  async findById(id: string): Promise<Role | undefined> {
    return roles.find((role) => role.id === id);
  },

  async create(role: Omit<Role, 'id' | 'isSystem'>): Promise<Role> {
    const newRole: Role = {
      id: role.name.toLowerCase().replace(/\s+/g, '-'),
      ...role,
      isSystem: false, // User-created roles are never system roles
    };
    roles.push(newRole);
    return newRole;
  },

  async update(id: string, updates: Partial<Omit<Role, 'id' | 'isSystem'>>): Promise<Role | undefined> {
    const index = roles.findIndex((role) => role.id === id);
    if (index === -1 || roles[index].isSystem) {
      return undefined; // Cannot update system roles
    }
    roles[index] = { ...roles[index], ...updates };
    return roles[index];
  },

  async remove(id: string): Promise<boolean> {
    const index = roles.findIndex((role) => role.id === id);
    if (index === -1 || roles[index].isSystem) {
      return false; // Cannot delete system roles
    }
    roles.splice(index, 1);
    return true;
  },
};
