'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Search, PlusCircle, FileDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { academicClasses, sections, students } from '@/lib/placeholder-data';
import { Input } from '@/components/ui/input';

const studentFeeData = [
  { studentId: 'st1', name: 'Olivia Martinez', classId: 'c3', totalFees: 1650, paid: 1600, balance: 50, status: 'Partially Paid' },
  { studentId: 'st2', name: 'Liam Wilson', classId: 'c3', totalFees: 1650, paid: 1100, balance: 550, status: 'Pending' },
  { studentId: 'st3', name: 'Emma Garcia', classId: 'c1', totalFees: 1200, paid: 0, balance: 1200, status: 'Unpaid' },
  { studentId: 'st4', name: 'Noah Rodriguez', classId: 'c5', totalFees: 2000, paid: 2000, balance: 0, status: 'Paid' },
  { studentId: 'st5', name: 'Ava Smith', classId: 'c1', totalFees: 1200, paid: 1200, balance: 0, status: 'Paid' },
];

export default function StudentFeesPage() {
    const [selectedClass, setSelectedClass] = React.useState('all');
    const [selectedSection, setSelectedSection] = React.useState('all');

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Paid': return 'default';
            case 'Partially Paid': return 'secondary';
            case 'Unpaid': return 'destructive';
            case 'Pending': return 'outline';
            default: return 'secondary';
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Student Fees</CardTitle>
                        <CardDescription>Manage and track fee payments for all students.</CardDescription>
                    </div>
                     <div className="flex items-center gap-2">
                        <Button variant="outline"><FileDown className="mr-2 h-4 w-4" /> Export</Button>
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> Collect Fee</Button>
                    </div>
                </div>
                 <div className="flex items-center justify-between pt-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search by student name or ID..." className="pl-8" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Class" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                {academicClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={selectedSection} onValueChange={setSelectedSection}>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Section" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sections</SelectItem>
                                {sections.filter(s => selectedClass === 'all' || s.classId === selectedClass).map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student ID</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Total Fees</TableHead>
                            <TableHead>Amount Paid</TableHead>
                            <TableHead>Balance</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {studentFeeData.map(fee => (
                            <TableRow key={fee.studentId}>
                                <TableCell>{fee.studentId}</TableCell>
                                <TableCell className="font-medium">{fee.name}</TableCell>
                                <TableCell>${fee.totalFees.toFixed(2)}</TableCell>
                                <TableCell>${fee.paid.toFixed(2)}</TableCell>
                                <TableCell>${fee.balance.toFixed(2)}</TableCell>
                                <TableCell><Badge variant={getStatusVariant(fee.status)}>{fee.status}</Badge></TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem>Add Payment</DropdownMenuItem>
                                            <DropdownMenuItem>View Invoices</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
