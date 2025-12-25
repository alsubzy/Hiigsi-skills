'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserCheck, Settings, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Dashboard from '../../dashboard/page';

export default function AdminDashboard() {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-muted-foreground">Super Admin Mode Active</span>
                </div>
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/users')}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">User Management</CardTitle>
                            <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <CardDescription>Manage all system users</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full">
                            Manage Users
                        </Button>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/teachers')}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Teacher Management</CardTitle>
                            <UserCheck className="h-5 w-5 text-green-600" />
                        </div>
                        <CardDescription>Manage teachers and their profiles</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full">
                            Manage Teachers
                        </Button>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/dashboard/users/roles')}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Roles & Permissions</CardTitle>
                            <Shield className="h-5 w-5 text-purple-600" />
                        </div>
                        <CardDescription>Configure roles and permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full">
                            Manage Roles
                        </Button>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/dashboard/settings')}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">System Settings</CardTitle>
                            <Settings className="h-5 w-5 text-gray-600" />
                        </div>
                        <CardDescription>Configure system settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full">
                            Open Settings
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Main Dashboard */}
            <Dashboard />
        </div>
    );
}
