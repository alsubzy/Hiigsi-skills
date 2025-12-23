// src/lib/data/userData.ts
import { User, BackendUser } from '@/lib/types';
import { users as initialUsers } from './placeholder-data'; // Using placeholder for initial mock

// In a real DB, you'd store the hashed password, not the plain text one.
// The `password` field is for demonstration purposes.
let users: BackendUser[] = initialUsers.map(u => ({
    ...u,
    password: 'password123', // Mock password
    deletedAt: null,
}));

export const userData = {
  async findAll(): Promise<BackendUser[]> {
    // Return only non-deleted users
    return users.filter(u => !u.deletedAt);
  },

  async findById(id: string): Promise<BackendUser | undefined> {
    const user = users.find((user) => user.id === id);
    return user && !user.deletedAt ? user : undefined;
  },

  async findByEmail(email: string): Promise<BackendUser | undefined> {
    const user = users.find((user) => user.email === email);
    return user && !user.deletedAt ? user : undefined;
  },
  
  async create(user: Omit<BackendUser, 'id' | 'status' | 'createdDate' | 'deletedAt'>): Promise<BackendUser> {
    const newUser: BackendUser = {
      id: `${Date.now()}`,
      ...user,
      status: 'Active',
      createdDate: new Date().toISOString(),
      deletedAt: null,
      avatar: `https://picsum.photos/seed/${user.name}/100`,
    };
    users.push(newUser);
    return newUser;
  },

  async update(id: string, updates: Partial<Omit<BackendUser, 'id'>>): Promise<BackendUser | undefined> {
    const index = users.findIndex((user) => user.id === id);
    if (index === -1 || users[index].deletedAt) {
      return undefined;
    }
    users[index] = { ...users[index], ...updates };
    return users[index];
  },

  async remove(id: string): Promise<boolean> {
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
      return false;
    }
    // Soft delete
    users[index].deletedAt = new Date();
    users[index].status = 'Deactivated';
    return true;
  },
};
