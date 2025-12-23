import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Settings, Building, Calendar, User, Database, History, ArrowRight } from "lucide-react";

const settingsFeatures = [
    { title: 'School Profile', icon: Building, href: '/dashboard/settings/school-profile', description: 'Manage your school\'s general information.' },
    { title: 'Academic Year', icon: Calendar, href: '/dashboard/settings/academic-year', description: 'Define and manage academic sessions.' },
    { title: 'My Settings', icon: User, href: '/dashboard/settings/user-settings', description: 'Update your personal profile and preferences.' },
    { title: 'Backup & Restore', icon: Database, href: '/dashboard/settings/backup', description: 'Manage data backups and recovery points.' },
    { title: 'Audit Logs', icon: History, href: '/dashboard/settings/audit-logs', description: 'Review system and user activity logs.' },
];

export default function SettingsPage() {
  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
            <p className="text-muted-foreground">Configure and customize the school management system.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {settingsFeatures.map(feature => (
                 <Link href={feature.href} key={feature.title}>
                    <Card className="hover:bg-muted/50 transition-colors h-full">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base font-medium">{feature.title}</CardTitle>
                            <feature.icon className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                             <div className="flex items-center pt-4 text-sm font-medium text-primary">
                                Go to {feature.title} <ArrowRight className="h-4 w-4 ml-2" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    </div>
  );
}

    