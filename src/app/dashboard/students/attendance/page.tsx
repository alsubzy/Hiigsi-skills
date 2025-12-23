'use client';

import * as React from 'react';
import { Calendar as CalendarIcon, Check, X, Clock, HelpCircle, Save } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { academicClasses, sections, initialAttendance } from '@/lib/placeholder-data';
import { useToast } from '@/hooks/use-toast';
import type { Attendance } from '@/lib/types';

export default function StudentAttendancePage() {
    const { toast } = useToast();
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const [attendanceRecords, setAttendanceRecords] = React.useState<Attendance[]>(initialAttendance);
    
    const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
        setAttendanceRecords(records => 
            records.map(rec => rec.studentId === studentId ? { ...rec, status } : rec)
        );
    };

    const handleMarkAll = (status: 'present' | 'absent') => {
        setAttendanceRecords(records => records.map(rec => ({ ...rec, status })));
    };

    const handleSaveAttendance = () => {
        toast({
            title: 'Attendance Saved',
            description: `Attendance for ${format(date || new Date(), 'PPP')} has been saved.`,
        });
    };
    
    const getStatusIcon = (status: 'present' | 'absent' | 'late' | 'excused') => {
        switch(status) {
            case 'present': return <Check className="h-5 w-5 text-green-500" />;
            case 'absent': return <X className="h-5 w-5 text-red-500" />;
            case 'late': return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'excused': return <HelpCircle className="h-5 w-5 text-blue-500" />;
        }
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Student Attendance</CardTitle>
                <CardDescription>Mark and view attendance for students.</CardDescription>
                <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                        <Select defaultValue="c3">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {academicClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select defaultValue="s3">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Section" />
                            </SelectTrigger>
                            <SelectContent>
                                {sections.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleSaveAttendance}>
                        <Save className="mr-2 h-4 w-4" /> Save Attendance
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleMarkAll('present')}>Mark All Present</Button>
                    <Button variant="outline" size="sm" onClick={() => handleMarkAll('absent')}>Mark All Absent</Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student ID</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {attendanceRecords.map(record => (
                             <TableRow key={record.studentId}>
                                <TableCell>{record.studentId}</TableCell>
                                <TableCell className="font-medium">{record.name}</TableCell>
                                <TableCell>
                                    <RadioGroup
                                        defaultValue={record.status}
                                        onValueChange={(value: 'present' | 'absent' | 'late' | 'excused') => handleStatusChange(record.studentId, value)}
                                        className="flex gap-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="present" id={`present-${record.studentId}`} />
                                            <Label htmlFor={`present-${record.studentId}`} className="flex items-center gap-2 cursor-pointer"><Check className="h-4 w-4 text-green-600"/> Present</Label>
                                        </div>
                                         <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="absent" id={`absent-${record.studentId}`} />
                                            <Label htmlFor={`absent-${record.studentId}`} className="flex items-center gap-2 cursor-pointer"><X className="h-4 w-4 text-red-600"/> Absent</Label>
                                        </div>
                                         <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="late" id={`late-${record.studentId}`} />
                                            <Label htmlFor={`late-${record.studentId}`} className="flex items-center gap-2 cursor-pointer"><Clock className="h-4 w-4 text-yellow-600"/> Late</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="excused" id={`excused-${record.studentId}`} />
                                            <Label htmlFor={`excused-${record.studentId}`} className="flex items-center gap-2 cursor-pointer"><HelpCircle className="h-4 w-4 text-blue-600"/> Excused</Label>
                                        </div>
                                    </RadioGroup>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
