'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    isAdmin: boolean;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch current user session
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(data => {
                console.log('Admin Dashboard: Session data received', data);
                if (data.user) {
                    setUser(data.user);
                    // Verify user is admin
                    if (!data.user.isAdmin) {
                        console.error('Admin Dashboard: User is not admin, redirecting...');
                        router.push('/dashboard');
                    }
                } else {
                    console.error('Admin Dashboard: No user in session');
                    router.push('/sign-in');
                }
            })
            .catch(error => {
                console.error('Error fetching session:', error);
                router.push('/sign-in');
            })
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600 mt-2">
                                Welcome back, {user.firstName} {user.lastName}
                            </p>
                        </div>
                        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                            Admin Access
                        </div>
                    </div>
                </div>

                {/* User Info Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium text-gray-900">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">User ID</p>
                            <p className="font-medium text-gray-900">{user.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Roles</p>
                            <div className="flex gap-2 mt-1">
                                {user.roles.map(role => (
                                    <span
                                        key={role}
                                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                                    >
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">Manage all system users, roles, and permissions</p>
                        <button
                            onClick={() => router.push('/dashboard/users')}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Manage Users
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">Configure system-wide settings and preferences</p>
                        <button
                            onClick={() => router.push('/dashboard/settings')}
                            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                        >
                            View Settings
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Audit Logs</h3>
                            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">View system activity and audit trails</p>
                        <button
                            onClick={() => router.push('/dashboard/reports')}
                            className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                        >
                            View Logs
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md p-6 text-white">
                    <h2 className="text-2xl font-bold mb-4">Admin Privileges Active</h2>
                    <p className="text-blue-100">
                        You have full system access. All features and administrative functions are available to you.
                    </p>
                </div>
            </div>
        </div>
    );
}
