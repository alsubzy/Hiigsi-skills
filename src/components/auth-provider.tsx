'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface AuthContextType {
    user: any;
    permissions: any[];
    isLoading: boolean;
    hasPermission: (action: string, subject: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
    const [dbUser, setDbUser] = useState<any>(null);
    const [permissions, setPermissions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            if (isClerkLoaded && clerkUser) {
                try {
                    const res = await fetch('/api/auth/me');
                    if (res.ok) {
                        const data = await res.json();
                        setDbUser(data.user);
                        setPermissions(data.permissions);
                    }
                } catch (error) {
                    console.error('Failed to fetch user permissions:', error);
                } finally {
                    setIsLoading(false);
                }
            } else if (isClerkLoaded && !clerkUser) {
                setIsLoading(false);
            }
        }

        fetchUser();
    }, [clerkUser, isClerkLoaded]);

    const hasPermission = (action: string, subject: string) => {
        // UNIVERSAL ADMIN ACCESS BYPASS: Every authenticated user is treated as an Admin
        // This grants 100% access to all frontend features and guards.
        console.log(`[RBAC] Universal Bypass Granted: ${action} on ${subject}`);
        return true;
    };

    return (
        <AuthContext.Provider value={{ user: dbUser, permissions, isLoading, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
