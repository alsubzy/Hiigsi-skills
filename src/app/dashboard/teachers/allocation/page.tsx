'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { subjects as allSubjects, users as allUsers, academicClasses } from '@/lib/placeholder-data';
import type { Subject, User } from '@/lib/types';

export default function SubjectAllocationPage() {
    const { toast } = useToast();
    const [selectedClass, setSelectedClass] = React.useState<string>(academicClasses[0].id);
    const [subjects, setSubjects] = React.useState<Subject[]>(allSubjects);

    const teachers = allUsers.filter(u => u.role === 'Teacher');

    const handleTeacherChange = (subjectId: string, teacherName: string) => {
        setSubjects(currentSubjects => 
            currentSubjects.map(s => s.id === subjectId ? { ...s, teacher: teacherName === 'unassigned' ? undefined : teacherName } : s)
        );
    };

    const handleSaveChanges = () => {
        toast({
            title: 'Allocations Saved',
            description: 'Subject allocations have been updated successfully.',
        });
        // Here you would typically make an API call to save the changes
        console.log('Saving allocations:', subjects);
    };
    
    const classSubjects = subjects.filter(s => s.classId === selectedClass);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Subject Allocation</CardTitle>
                        <CardDescription>Assign subjects to teachers for each class.</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {academicClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleSaveChanges}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead className="w-1/2">Assigned Teacher</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {classSubjects.length > 0 ? (
                            classSubjects.map(subject => (
                                <TableRow key={subject.id}>
                                    <TableCell className="font-medium">{subject.name}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={subject.teacher || 'unassigned'}
                                            onValueChange={(teacherName) => handleTeacherChange(subject.id, teacherName)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Assign a teacher" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="unassigned">Unassigned</SelectItem>
                                                {teachers.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>{subject.teacher ? 'Assigned' : 'Unassigned'}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    No subjects found for this class.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

    