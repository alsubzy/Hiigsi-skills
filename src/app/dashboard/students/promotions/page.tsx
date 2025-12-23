'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { academicClasses, sections, students as initialStudents } from '@/lib/placeholder-data';
import { useToast } from '@/hooks/use-toast';
import { Student } from '@/lib/types';

export default function StudentPromotionsPage() {
    const { toast } = useToast();
    const [fromClass, setFromClass] = React.useState<string>('c3');
    const [toClass, setToClass] = React.useState<string>('c5');
    const [fromSection, setFromSection] = React.useState<string>('s3');
    const [toSection, setToSection] = React.useState<string>('s4');
    const [students, setStudents] = React.useState<Student[]>([]);
    const [selectedStudents, setSelectedStudents] = React.useState<Set<string>>(new Set());

    React.useEffect(() => {
        // Filter students based on the selected 'from' class and section
        const filtered = initialStudents.filter(s => s.classId === fromClass && s.sectionId === fromSection);
        setStudents(filtered);
        setSelectedStudents(new Set()); // Reset selection when filters change
    }, [fromClass, fromSection]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedStudents(new Set(students.map(s => s.id)));
        } else {
            setSelectedStudents(new Set());
        }
    };

    const handleSelectSingle = (studentId: string, checked: boolean) => {
        const newSelection = new Set(selectedStudents);
        if (checked) {
            newSelection.add(studentId);
        } else {
            newSelection.delete(studentId);
        }
        setSelectedStudents(newSelection);
    };

    const handlePromote = () => {
        if (selectedStudents.size === 0) {
            toast({ title: 'No students selected', description: 'Please select students to promote.', variant: 'destructive'});
            return;
        }
        toast({
            title: 'Promotion Successful',
            description: `${selectedStudents.size} student(s) have been promoted.`,
        });
        // Here you would typically make an API call to update student records
        // For now, we'll just log and clear selection
        console.log(`Promoting students:`, Array.from(selectedStudents));
        console.log(`From: ${fromClass}/${fromSection} To: ${toClass}/${toSection}`);
        setSelectedStudents(new Set());
    };
    
    const getClassName = (classId: string) => academicClasses.find(c => c.id === classId)?.name;
    const getSectionName = (sectionId: string) => sections.find(s => s.id === sectionId)?.name;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Promote Students</CardTitle>
                    <CardDescription>Select students from a class and promote them to the next level.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2">
                            <h4 className="font-semibold">From Class</h4>
                             <div className="flex gap-2">
                                <Select value={fromClass} onValueChange={setFromClass}>
                                    <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                                    <SelectContent>{academicClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                                </Select>
                                 <Select value={fromSection} onValueChange={setFromSection}>
                                    <SelectTrigger><SelectValue placeholder="Select Section" /></SelectTrigger>
                                    <SelectContent>{sections.filter(s => s.classId === fromClass).map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <h4 className="font-semibold">To Class</h4>
                            <div className="flex gap-2">
                                <Select value={toClass} onValueChange={setToClass}>
                                    <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                                    <SelectContent>{academicClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                                </Select>
                                 <Select value={toSection} onValueChange={setToSection}>
                                    <SelectTrigger><SelectValue placeholder="Select Section" /></SelectTrigger>
                                    <SelectContent>{sections.filter(s => s.classId === toClass).map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={selectedStudents.size === students.length && students.length > 0}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Current Class</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.length > 0 ? (
                                students.map(student => (
                                    <TableRow key={student.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedStudents.has(student.id)}
                                                onCheckedChange={(checked) => handleSelectSingle(student.id, !!checked)}
                                            />
                                        </TableCell>
                                        <TableCell>{student.studentId}</TableCell>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell>{getClassName(student.classId)} - {getSectionName(student.sectionId)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">No students found in this class/section.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <div className="lg:col-span-1">
                <Card className="sticky top-6">
                    <CardHeader>
                        <CardTitle>Promotion Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <div className="text-sm">
                                <p className="text-muted-foreground">From</p>
                                <p className="font-semibold">{getClassName(fromClass)} - {getSectionName(fromSection)}</p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground"/>
                             <div className="text-sm text-right">
                                <p className="text-muted-foreground">To</p>
                                <p className="font-semibold">{getClassName(toClass)} - {getSectionName(toSection)}</p>
                            </div>
                        </div>
                        <div className="text-center py-4">
                            <p className="text-muted-foreground">Selected Students</p>
                            <p className="text-4xl font-bold">{selectedStudents.size}</p>
                        </div>
                        <Button className="w-full" onClick={handlePromote} disabled={selectedStudents.size === 0}>
                            <GraduationCap className="mr-2 h-4 w-4"/>
                            Promote {selectedStudents.size > 0 ? selectedStudents.size : ''} Student(s)
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
