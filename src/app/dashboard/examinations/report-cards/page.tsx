'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer, Search, FileDown } from 'lucide-react';
import { academicClasses, students, sections } from '@/lib/placeholder-data';
import type { Student } from '@/lib/types';

export default function ReportCardsPage() {
    const [selectedClass, setSelectedClass] = React.useState('c3');
    const [selectedSection, setSelectedSection] = React.useState('s3');
    
    const filteredStudents = students.filter(s => s.classId === selectedClass && s.sectionId === selectedSection);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Results & Report Cards</CardTitle>
                <CardDescription>Generate and view report cards for students.</CardDescription>
                <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select Class" /></SelectTrigger>
                            <SelectContent>{academicClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={selectedSection} onValueChange={setSelectedSection}>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select Section" /></SelectTrigger>
                            <SelectContent>{sections.filter(s => s.classId === selectedClass).map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                        </Select>
                         <Select defaultValue="mid-term">
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select Exam" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mid-term">Mid-Term Exam</SelectItem>
                                <SelectItem value="final-exam">Final Exam</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">
                            <Search className="mr-2 h-4 w-4" />
                            View Results
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student ID</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Overall Marks</TableHead>
                            <TableHead>Grade</TableHead>
                             <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map(student => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.studentId}</TableCell>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>450/500</TableCell>
                                    <TableCell>A+</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button variant="outline" size="sm"><FileDown className="mr-2 h-4 w-4" /> Download</Button>
                                        <Button variant="outline" size="sm"><Printer className="mr-2 h-4 w-4" /> Print</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                             <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No students found for this class and section.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
