import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookOpen, Calendar, ClipboardList, Book, Users, GraduationCap, ArrowRight } from "lucide-react";

const academicFeatures = [
    { title: 'Classes / Grades', icon: GraduationCap, href: '/dashboard/academics/classes', description: 'Manage all grade levels.' },
    { title: 'Sections', icon: Users, href: '/dashboard/academics/sections', description: 'Organize students into sections.' },
    { title: 'Subjects', icon: Book, href: '/dashboard/academics/subjects', description: 'Define and assign subjects.' },
    { title: 'Academic Calendar', icon: Calendar, href: '/dashboard/academics/calendar', description: 'Schedule important school events.' },
    { title: 'Class Timetable', icon: ClipboardList, href: '/dashboard/academics/timetable', description: 'Create and view class schedules.' },
    { title: 'Syllabus Management', icon: BookOpen, href: '/dashboard/academics/syllabus', description: 'Track syllabus progress.' },
];

export default function AcademicsPage() {
  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Academic Management</h1>
            <p className="text-muted-foreground">Oversee all academic activities and configurations from one place.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {academicFeatures.map(feature => (
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
