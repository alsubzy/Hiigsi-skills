'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { academicClasses, subjects, students } from '@/lib/placeholder-data';
import { useToast } from '@/hooks/use-toast';

const initialMarks = students
  .filter(s => s.classId === 'c3')
  .map(s => ({ studentId: s.studentId, name: s.name, marks: '' }));

export default function MarksEntryPage() {
    const { toast } = useToast();
    const [selectedClass, setSelectedClass] = React.useState('c3');
    const [selectedSubject, setSelectedSubject] = React.useState('sub2');
    const [marks, setMarks] = React.useState(initialMarks);

    const handleMarksChange = (studentId: string, value: string) => {
        setMarks(currentMarks => 
            currentMarks.map(m => m.studentId === studentId ? { ...m, marks: value } : m)
        );
    };

    const handleSaveChanges = () => {
        toast({
            title: 'Marks Saved',
            description: 'Student marks have been saved successfully.',
        });
        console.log('Saving marks:', marks);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Marks Entry</CardTitle>
                <CardDescription>Enter student marks for a specific exam and subject.</CardDescription>
                <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select Class" /></SelectTrigger>
                            <SelectContent>{academicClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                            <SelectContent>{subjects.filter(s => s.classId === selectedClass).map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                        </Select>
                         <Select defaultValue="mid-term">
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select Exam" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mid-term">Mid-Term Exam</SelectItem>
                                <SelectItem value="final-exam">Final Exam</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleSaveChanges}>
                        <Save className="mr-2 h-4 w-4" /> Save Marks
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student ID</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead className="w-1/4">Marks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {marks.map(record => (
                             <TableRow key={record.studentId}>
                                <TableCell>{record.studentId}</TableCell>
                                <TableCell className="font-medium">{record.name}</TableCell>
                                <TableCell>
                                    <Input 
                                        type="number" 
                                        placeholder="Enter marks"
                                        value={record.marks}
                                        onChange={(e) => handleMarksChange(record.studentId, e.target.value)}
                                        max={100}
                                        min={0}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
