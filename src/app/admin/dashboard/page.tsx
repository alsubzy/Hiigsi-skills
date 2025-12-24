'use client';

import * as React from 'react';
import Dashboard from '../../dashboard/page';

export default function AdminDashboard() {
    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Admin Superuser Dashboard</h1>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-muted-foreground">Admin Mode Active</span>
                </div>
            </div>
            <Dashboard />
        </div>
    );
}
