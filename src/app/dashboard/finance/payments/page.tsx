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
import { format } from 'date-fns';

const payments = [
  { id: 'PAY-001', invoiceId: 'INV-001', studentName: 'Olivia Martinez', amount: 550, paymentDate: new Date(2024, 7, 10), method: 'Credit Card' },
  { id: 'PAY-002', invoiceId: 'INV-004', studentName: 'Ava Smith', amount: 400, paymentDate: new Date(2024, 7, 12), method: 'Bank Transfer' },
  { id: 'PAY-003', invoiceId: 'INV-005', studentName: 'Olivia Martinez', amount: 50, paymentDate: new Date(2024, 6, 28), method: 'Cash' },
  { id: 'PAY-004', studentId: 'st4', studentName: 'Noah Rodriguez', amount: 200, paymentDate: new Date(2024, 8, 1), method: 'Credit Card' },
  { id: 'PAY-005', studentId: 'st3', studentName: 'Emma Garcia', amount: 150, paymentDate: new Date(2024, 8, 2), method: 'Bank Transfer' },
];

export default function PaymentsPage() {
    const [currentPage, setCurrentPage] = React.useState(1);
    const paymentsPerPage = 5;

    const totalPages = Math.ceil(payments.length / paymentsPerPage);
    const paginatedPayments = payments.slice(
        (currentPage - 1) * paymentsPerPage,
        currentPage * paymentsPerPage
    );
    
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Payments</CardTitle>
                        <CardDescription>Track all received payments from students.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                         <Button variant="outline"><FileDown className="mr-2 h-4 w-4" /> Export</Button>
                         <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Payment</Button>
                    </div>
                </div>
                 <div className="flex items-center justify-between pt-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search by payment ID or student..." className="pl-8" />
                    </div>
                     <div className="flex items-center gap-2">
                        <Select>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Method" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="credit_card">Credit Card</SelectItem>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Payment ID</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Payment Date</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedPayments.map(payment => (
                            <TableRow key={payment.id}>
                                <TableCell className="font-medium">{payment.id}</TableCell>
                                <TableCell>{payment.studentName}</TableCell>
                                <TableCell>{payment.invoiceId || 'N/A'}</TableCell>
                                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                                <TableCell>{format(payment.paymentDate, 'PPP')}</TableCell>
                                <TableCell><Badge variant="secondary">{payment.method}</Badge></TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem>Generate Receipt</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Refund</DropdownMenuItem>
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
