'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const academicYears = [
    { id: 'ay1', name: 'Academic Year 2024-2025', startDate: 'Sep 1, 2024', endDate: 'Jun 30, 2025', status: 'Current' },
    { id: 'ay2', name: 'Academic Year 2023-2024', startDate: 'Sep 1, 2023', endDate: 'Jun 30, 2024', status: 'Past' },
    { id: 'ay3', name: 'Academic Year 2022-2023', startDate: 'Sep 1, 2022', endDate: 'Jun 30, 2023', status: 'Past' },
];

export default function AcademicYearPage() {

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Academic Years</CardTitle>
                        <CardDescription>Manage academic sessions and set the current year.</CardDescription>
                    </div>
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> Create New Year</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Academic Year</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {academicYears.map(year => (
                            <TableRow key={year.id}>
                                <TableCell className="font-medium">{year.name}</TableCell>
                                <TableCell>{year.startDate}</TableCell>
                                <TableCell>{year.endDate}</TableCell>
                                <TableCell>
                                    <Badge variant={year.status === 'Current' ? 'default' : 'secondary'}>{year.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {year.status !== 'Current' && <DropdownMenuItem>Set as Current</DropdownMenuItem>}
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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

    