'use client';

import * as React from 'react';
import { MoreHorizontal, PlusCircle, Search, FileDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { students, academicClasses } from '@/lib/placeholder-data';
import { format } from 'date-fns';

const invoices = [
  { id: 'INV-001', studentId: 'st1', studentName: 'Olivia Martinez', classId: 'c3', amount: 550, status: 'Paid', dueDate: new Date(2024, 7, 15), paidDate: new Date(2024, 7, 10) },
  { id: 'INV-002', studentId: 'st2', studentName: 'Liam Wilson', classId: 'c3', amount: 550, status: 'Pending', dueDate: new Date(2024, 7, 15), paidDate: null },
  { id: 'INV-003', studentId: 'st3', studentName: 'Emma Garcia', classId: 'c1', amount: 400, status: 'Overdue', dueDate: new Date(2024, 6, 20), paidDate: null },
  { id: 'INV-004', studentId: 'st5', studentName: 'Ava Smith', classId: 'c1', amount: 400, status: 'Paid', dueDate: new Date(2024, 7, 15), paidDate: new Date(2024, 7, 12) },
  { id: 'INV-005', studentId: 'st1', studentName: 'Olivia Martinez', classId: 'c3', amount: 50, status: 'Paid', dueDate: new Date(2024, 6, 30), paidDate: new Date(2024, 6, 28) },
];

export default function InvoicesPage() {
    const [currentPage, setCurrentPage] = React.useState(1);
    const invoicesPerPage = 5;

    const totalPages = Math.ceil(invoices.length / invoicesPerPage);
    const paginatedInvoices = invoices.slice(
        (currentPage - 1) * invoicesPerPage,
        currentPage * invoicesPerPage
    );

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Paid': return 'default';
            case 'Pending': return 'secondary';
            case 'Overdue': return 'destructive';
            default: return 'outline';
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Invoices</CardTitle>
                        <CardDescription>Manage all student fee invoices.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                         <Button variant="outline"><FileDown className="mr-2 h-4 w-4" /> Export</Button>
                         <Button><PlusCircle className="mr-2 h-4 w-4" /> Create Invoice</Button>
                    </div>
                </div>
                 <div className="flex items-center justify-between pt-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search by invoice ID or student..." className="pl-8" />
                    </div>
                     <div className="flex items-center gap-2">
                        <Select>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Class" /></SelectTrigger>
                            <SelectContent>{academicClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Paid Date</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedInvoices.map(invoice => (
                            <TableRow key={invoice.id}>
                                <TableCell className="font-medium">{invoice.id}</TableCell>
                                <TableCell>{invoice.studentName}</TableCell>
                                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                                <TableCell><Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge></TableCell>
                                <TableCell>{format(invoice.dueDate, 'PPP')}</TableCell>
                                <TableCell>{invoice.paidDate ? format(invoice.paidDate, 'PPP') : 'N/A'}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                    <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                    <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
                </div>
            </CardContent>
        </Card>
    );
}
