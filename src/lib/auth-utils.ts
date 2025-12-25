import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

// Password hashing
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

// JWT token management
export interface JWTPayload {
    userId: string;
    email: string;
    roles: string[]; // Changed from single role to roles array
}

export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

// Helper function to check if user is admin
export function isAdmin(payload: JWTPayload | null): boolean {
    if (!payload || !payload.roles) return false;
    return payload.roles.some(role => role.toLowerCase() === 'admin');
}

// Helper function to get user roles
export function getUserRoles(payload: JWTPayload | null): string[] {
    return payload?.roles || [];
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        // console.log('Token verified successfully:', { userId: decoded.userId, roles: decoded.roles });
        return decoded;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

// Cookie management
export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    const headersList = await import('next/headers').then(mod => mod.headers());
    // Try to determine if we are on HTTPS
    // const protocol = headersList.get('x-forwarded-proto') || 'http';
    const isProduction = process.env.NODE_ENV === 'production';

    console.log('[AUTH] Setting auth cookie. Production:', isProduction);

    cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: isProduction, // Only use secure in production
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

export async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    return token?.value || null;
}

export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
}

// Get current user from token
export async function getCurrentUser(): Promise<JWTPayload | null> {
    const token = await getAuthToken();
    if (!token) return null;
    return verifyToken(token);
}

// Generate random tokens
export function generateRandomToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Token expiry helpers
export function getTokenExpiry(hours: number = 1): Date {
    return new Date(Date.now() + hours * 60 * 60 * 1000);
}

export function isTokenExpired(expiry: Date): boolean {
    return new Date() > expiry;
}
